import * as THREE from "three";
import { about } from "../data/content";
import { getZonePanel, renderPanelHTML, type ZonePanel } from "../ui/panels";
import { createAgentCircuit, type CircuitStep } from "./agentCircuit";
import {
  CHECKPOINTS,
  detectQuality,
  PALETTE,
  QUALITY,
  SPAWN,
  ZONES,
  type Quality,
} from "./constants";
import { createControls } from "./controls";
import { buildWorld } from "./createWorld";
import { createMinimap } from "./minimap";
import { Vehicle } from "./vehicle";

export interface WorldController {
  respawn: () => void;
  openZone: (id: string) => void;
  closePanel: () => void;
  dispose: () => void;
}

function readPreferredQuality(): Quality | "auto" {
  try {
    const saved = window.localStorage.getItem("quality");
    if (saved === "alta" || saved === "media" || saved === "baja") return saved;
  } catch {
    /* Sin almacenamiento: se usa la detección automática. */
  }
  return "auto";
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/** Libera geometrías, materiales y texturas al abandonar la experiencia 3D. */
function disposeScene(scene: THREE.Scene): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  scene.traverse((object) => {
    const drawable = object as THREE.Mesh;
    if (drawable.geometry) geometries.add(drawable.geometry);
    const material = drawable.material;
    if (Array.isArray(material)) material.forEach((item) => materials.add(item));
    else if (material) materials.add(material);
  });

  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => {
    const map = (material as THREE.Material & { map?: THREE.Texture | null }).map;
    if (map) textures.add(map);
    material.dispose();
  });
  textures.forEach((texture) => texture.dispose());
}

export async function startWorld(): Promise<WorldController> {
  const canvas = document.querySelector<HTMLCanvasElement>("#scene");
  const loading = document.querySelector<HTMLElement>("#loading");
  const loadingBar = document.querySelector<HTMLElement>("[data-loading-bar]");
  const loadingLabel = document.querySelector<HTMLElement>("[data-loading-label]");
  const hud = document.querySelector<HTMLElement>("[data-hud]");
  const hint = document.querySelector<HTMLElement>("[data-zone-hint]");
  const panel = document.querySelector<HTMLElement>("[data-zone-panel]");
  const touch = document.querySelector<HTMLElement>("[data-touch]");
  const qualitySelect = document.querySelector<HTMLSelectElement>("[data-quality]");
  const zoneCount = document.querySelector<HTMLElement>("[data-zone-count]");
  const circuitCard = document.querySelector<HTMLElement>("[data-circuit-card]");
  const circuitStatus = document.querySelector<HTMLElement>("[data-circuit-status]");
  const circuitSteps = document.querySelector<HTMLElement>("[data-circuit-steps]");
  const circuitDetail = document.querySelector<HTMLElement>("[data-circuit-detail]");
  const mapButton = document.querySelector<HTMLButtonElement>('[data-action="map"]');
  const circuitCloseButton = document.querySelector<HTMLElement>('[data-action="circuit-close"]');

  if (!canvas || !loading || !loadingBar || !loadingLabel || !hud || !hint || !panel) {
    throw new Error("Faltan elementos de la interfaz 3D");
  }

  const progress = (value: number, label: string) => {
    loadingBar.style.width = `${value}%`;
    loadingLabel.textContent = label;
  };

  const preference = readPreferredQuality();
  const quality: Quality = preference === "auto" ? detectQuality() : preference;
  if (qualitySelect) qualitySelect.value = preference;
  const settings = QUALITY[quality];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  progress(12, "Preparando el renderizador…");
  await nextFrame();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: settings.antialias,
    powerPreference: "high-performance",
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.pixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = settings.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 220);
  camera.position.set(SPAWN.x, 12, SPAWN.z + 16);

  progress(38, "Levantando la isla y las zonas…");
  await nextFrame();
  const world = buildWorld(scene, quality);

  progress(66, "Ensamblando el vehículo…");
  await nextFrame();
  const vehicle = new Vehicle();
  scene.add(vehicle.group);

  let activePanel: ZonePanel | null = null;
  let lastFocus: HTMLElement | null = null;
  let nearestZoneId: string | null = null;
  let disposed = false;

  const closePanel = () => {
    if (!activePanel) return;
    activePanel = null;
    panel.hidden = true;
    panel.replaceChildren();
    lastFocus?.focus();
  };

  const openZone = (id: string) => {
    const definition = ZONES.find((zone) => zone.id === id);
    const zonePanel = getZonePanel(id);
    if (!definition || !zonePanel) return;

    activePanel = zonePanel;
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.innerHTML = renderPanelHTML(zonePanel);
    panel.hidden = false;
    panel.querySelector<HTMLButtonElement>('[data-action="close-panel"]')?.focus();
    hint.hidden = true;
    if (zonePanel.id === "agentes") syncCircuit();
  };

  const visitedZones = new Set<string>();
  if (zoneCount) zoneCount.textContent = `0 / ${ZONES.length}`;

  about.flow.forEach((step, index) => {
    const item = document.createElement("li");
    item.dataset.done = "false";
    const number = document.createElement("span");
    number.className = "circuit-step-num";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1);
    const name = document.createElement("span");
    name.textContent = step.title;
    item.append(number, name);
    circuitSteps?.append(item);
  });

  function circuitLabel(): string {
    const count = circuit.visited.size;
    return count === CHECKPOINTS.length
      ? `Circuito completo · ${count} de ${CHECKPOINTS.length} pasos`
      : `${count} de ${CHECKPOINTS.length} pasos completados`;
  }

  function syncCircuit(step?: CircuitStep) {
    const label = circuitLabel();
    if (circuitStatus) circuitStatus.textContent = label;
    circuitSteps?.querySelectorAll("li").forEach((item, index) => {
      item.dataset.done = String(circuit.visited.has(index));
    });
    const panelProgress = panel!.querySelector<HTMLElement>("[data-panel-circuit]");
    if (panelProgress) panelProgress.textContent = label;
    if (step && circuitDetail) {
      circuitDetail.hidden = false;
      circuitDetail.textContent = step.completed
        ? `${step.title}: ${step.text} · ¡circuito completo!`
        : `${step.title}: ${step.text}`;
    }
  }

  const circuit = createAgentCircuit((step) => {
    if (circuitCard) circuitCard.hidden = false;
    syncCircuit(step);
    world.checkpoints.forEach((beacon, index) => {
      if (!circuit.visited.has(index)) return;
      const material = beacon.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.4;
      const halo = world.checkpointHalos[index];
      if (halo) (halo.material as THREE.MeshBasicMaterial).color.setHex(PALETTE.cloud);
    });
  });

  const syncMapButton = (open: boolean) => mapButton?.setAttribute("aria-pressed", String(open));
  const minimap = createMinimap(syncMapButton);
  const onMapClick = () => minimap.toggle();
  const onCircuitClose = () => {
    if (circuitCard) circuitCard.hidden = true;
  };
  mapButton?.addEventListener("click", onMapClick);
  circuitCloseButton?.addEventListener("click", onCircuitClose);

  const controls = createControls({
    onInteract: () => {
      if (activePanel) closePanel();
      else if (nearestZoneId) openZone(nearestZoneId);
    },
    onRespawn: () => vehicle.respawn(),
    onMap: onMapClick,
    onJump: () => {
      /* El salto se aplica en vehicle.update. */
    },
  });

  const onEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && activePanel) closePanel();
  };
  document.addEventListener("keydown", onEscape);

  panel.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest('[data-action="close-panel"]')) closePanel();
  });

  document.querySelectorAll<HTMLElement>("[data-action=respawn]").forEach((button) => {
    button.addEventListener("click", () => vehicle.respawn());
  });

  qualitySelect?.addEventListener("change", () => {
    try {
      window.localStorage.setItem("quality", qualitySelect.value);
    } catch {
      /* El cambio sigue aplicando aunque no se pueda guardar. */
    }
    window.location.hash = "world";
    window.location.reload();
  });

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  };
  window.addEventListener("resize", onResize);

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (touch && isTouch) {
    touch.hidden = false;
    touch.setAttribute("aria-hidden", "false");
  }

  progress(92, "Ajustando la cámara…");
  await nextFrame();

  const clock = new THREE.Clock();
  const forward = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const lookAt = new THREE.Vector3();

  const animate = () => {
    if (disposed) return;
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.05);
    const input = controls.read();
    vehicle.update(dt, input, world.obstacles, reducedMotion);

    circuit.update(vehicle.position.x, vehicle.position.z);
    minimap.update({
      x: vehicle.position.x,
      z: vehicle.position.z,
      yaw: vehicle.group.rotation.y,
      visitedZones,
      visitedCheckpoints: circuit.visited,
    });

    forward.set(Math.sin(vehicle.group.rotation.y), 0, Math.cos(vehicle.group.rotation.y));
    desired.copy(vehicle.position).addScaledVector(forward, -12.5);
    desired.y = vehicle.position.y + (reducedMotion ? 8.5 : 7.2);
    camera.position.lerp(desired, reducedMotion ? 0.16 : 0.075);
    lookAt.copy(vehicle.position).addScaledVector(forward, 3);
    lookAt.y = vehicle.position.y + 1.4;
    camera.lookAt(lookAt);

    let nearest = ZONES[0];
    let nearestIndex = 0;
    let nearestDistanceSq = Number.POSITIVE_INFINITY;
    for (let index = 0; index < ZONES.length; index += 1) {
      const zone = ZONES[index];
      const dx = zone.x - vehicle.position.x;
      const dz = zone.z - vehicle.position.z;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq < nearestDistanceSq) {
        nearest = zone;
        nearestIndex = index;
        nearestDistanceSq = distanceSq;
      }
    }

    if (nearestDistanceSq <= (nearest.radius + 3) ** 2) {
      nearestZoneId = nearest.id;
      if (!visitedZones.has(nearest.id)) {
        visitedZones.add(nearest.id);
        const ring = world.zoneRings[nearestIndex];
        if (ring) ring.visible = true;
        if (zoneCount) zoneCount.textContent = `${visitedZones.size} / ${ZONES.length}`;
      }
      if (!activePanel) {
        hint.textContent = `${nearest.label} · pulsa Enter o «Abrir» para ver el contenido`;
        hint.hidden = false;
      }
    } else {
      nearestZoneId = null;
      hint.hidden = true;
    }

    for (let index = 0; index < world.jobMarkers.length; index += 1) {
      const position = world.jobPositions[index];
      if (!position) continue;
      const dx = position.x - vehicle.position.x;
      const dz = position.z - vehicle.position.z;
      const target = dx * dx + dz * dz < 16 ? 1.25 : 1;
      const scale = world.jobMarkers[index].scale.x + (target - world.jobMarkers[index].scale.x) * 0.15;
      world.jobMarkers[index].scale.setScalar(scale);
    }

    if (!reducedMotion) {
      const pulse = 1 + Math.sin(performance.now() / 420) * 0.12;
      world.checkpointHalos.forEach((halo, index) => {
        if (circuit.visited.has(index)) halo.scale.setScalar(pulse);
      });
    }

    renderer.render(scene, camera);
  };

  progress(100, "Listo");
  await nextFrame();
  loading.hidden = true;
  hud.hidden = false;
  animate();

  return {
    respawn: () => vehicle.respawn(),
    openZone,
    closePanel,
    dispose() {
      disposed = true;
      controls.dispose();
      circuit.dispose();
      minimap.dispose();
      mapButton?.removeEventListener("click", onMapClick);
      circuitCloseButton?.removeEventListener("click", onCircuitClose);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", onResize);
      scene.background = null;
      disposeScene(scene);
      renderer.dispose();
    },
  };
}
