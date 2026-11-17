import * as THREE from "three";
import { getZonePanel, renderPanelHTML, type ZonePanel } from "../ui/panels";
import { detectQuality, QUALITY, SPAWN, ZONES, type Quality } from "./constants";
import { createControls } from "./controls";
import { buildWorld } from "./createWorld";
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
  };

  const controls = createControls({
    onInteract: () => {
      if (activePanel) closePanel();
      else if (nearestZoneId) openZone(nearestZoneId);
    },
    onRespawn: () => vehicle.respawn(),
    onMap: () => {
      /* El minimapa llega en la Fase 2. */
    },
    onJump: () => {
      /* El salto se aplica en vehicle.update. */
    },
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activePanel) closePanel();
  });

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

    forward.set(Math.sin(vehicle.group.rotation.y), 0, Math.cos(vehicle.group.rotation.y));
    desired.copy(vehicle.position).addScaledVector(forward, -12.5);
    desired.y = vehicle.position.y + (reducedMotion ? 8.5 : 7.2);
    camera.position.lerp(desired, reducedMotion ? 0.16 : 0.075);
    lookAt.copy(vehicle.position).addScaledVector(forward, 3);
    lookAt.y = vehicle.position.y + 1.4;
    camera.lookAt(lookAt);

    let nearest = ZONES[0];
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (const zone of ZONES) {
      const distance = Math.hypot(zone.x - vehicle.position.x, zone.z - vehicle.position.z);
      if (distance < nearestDistance) {
        nearest = zone;
        nearestDistance = distance;
      }
    }

    if (nearestDistance <= nearest.radius + 3) {
      nearestZoneId = nearest.id;
      if (!activePanel) {
        hint.textContent = `${nearest.label} · pulsa Enter o «Abrir» para ver el contenido`;
        hint.hidden = false;
      }
    } else {
      nearestZoneId = null;
      hint.hidden = true;
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
      window.removeEventListener("resize", onResize);
      scene.background = null;
      renderer.dispose();
    },
  };
}
