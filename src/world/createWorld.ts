import * as THREE from "three";
import { about, skills } from "../data/content";
import {
  CHECKPOINTS,
  ISLAND_RADIUS,
  JOB_LABELS,
  PALETTE,
  QUALITY,
  type Quality,
  ZONES,
  type ZoneDefinition,
} from "./constants";

export interface WorldBuild {
  obstacles: THREE.Box3[];
  markers: Record<string, THREE.Object3D>;
  checkpoints: THREE.Mesh[];
  checkpointHalos: THREE.Mesh[];
  jobMarkers: THREE.Mesh[];
}

function standard(color: number, emissive = 0): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.78,
    metalness: 0.18,
    emissive,
    emissiveIntensity: emissive ? 0.55 : 0,
  });
}

function glow(color: number, opacity = 1): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
  });
}

function addEdges(mesh: THREE.Mesh, color = PALETTE.blue, opacity = 0.7): void {
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, 24),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
  mesh.add(edges);
}

function labelSprite(text: string, width = 8, height = 2): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#2563EB";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
  ctx.fillStyle = "#F1F5F9";
  const fontSize = Math.max(18, Math.min(46, Math.floor(900 / Math.max(1, text.length))));
  ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  sprite.scale.set(width, height, 1);
  return sprite;
}

function brandSign(): THREE.Mesh {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#2563EB";
  ctx.fillRect(40, 40, 8, 176);
  ctx.font = "bold 86px ui-monospace, monospace";
  ctx.fillText("</>", 78, 162);
  ctx.font = "bold 78px system-ui, sans-serif";
  ctx.fillStyle = "#F1F5F9";
  ctx.fillText("Gatrox", 260, 160);
  ctx.fillStyle = "#2563EB";
  ctx.fillText("M", 640, 160);
  ctx.fillStyle = "#F1F5F9";
  ctx.fillText(".dev", 710, 160);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 3.25),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
  );
  sign.position.set(0, 4.6, -5.5);
  return sign;
}

function buildStructure(zone: ZoneDefinition, group: THREE.Group, detailed: boolean): void {
  const dark = standard(PALETTE.dark);
  const blue = glow(PALETTE.blue);

  switch (zone.kind) {
    case "plaza": {
      const platform = new THREE.Mesh(new THREE.CylinderGeometry(6, 6.4, 0.35, 12), dark);
      platform.position.y = 0.18;
      platform.receiveShadow = true;
      group.add(platform);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.08, 8, 64), blue);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.38;
      group.add(ring);
      group.add(brandSign());
      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.2, 0.35), standard(PALETTE.dark, PALETTE.blue));
        pillar.position.set(Math.cos(angle) * 5.3, 1.8, Math.sin(angle) * 5.3);
        group.add(pillar);
      }
      break;
    }
    case "terminal": {
      const body = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 4.5), dark);
      body.position.y = 2.5;
      body.castShadow = true;
      addEdges(body);
      group.add(body);
      for (let i = 0; i < 3; i += 1) {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.16, 0.1), blue);
        strip.position.set(0, 1.3 + i * 1.1, 2.3);
        group.add(strip);
      }
      break;
    }
    case "circuit": {
      CHECKPOINTS.forEach((checkpoint, index) => {
        const localX = checkpoint.x - zone.x;
        const localZ = checkpoint.z - zone.z;
        const beacon = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.8, 2.6, 8),
          standard(PALETTE.dark, PALETTE.blue),
        );
        beacon.name = `checkpoint-${index}`;
        beacon.position.set(localX, 1.3, localZ);
        beacon.castShadow = true;
        group.add(beacon);

        const halo = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.07, 8, 32), blue.clone());
        halo.name = `checkpoint-halo-${index}`;
        halo.rotation.x = -Math.PI / 2;
        halo.position.set(localX, 0.06, localZ);
        group.add(halo);

        if (detailed) {
          const label = labelSprite(about.flow[index].title, 4.6, 1.15);
          label.position.set(localX, 3.2, localZ);
          group.add(label);
        }
      });
      break;
    }
    case "avenue": {
      for (let index = 0; index < JOB_LABELS.length; index += 1) {
        const height = 1.4 + (index % 4) * 0.8;
        const x = -4 + (index % 6) * 1.6;
        const z = -3 + Math.floor(index / 6) * 2.4;
        const marker = new THREE.Mesh(new THREE.BoxGeometry(1.1, height, 1.1), dark);
        marker.name = `job-${index}`;
        marker.position.set(x, height / 2, z);
        addEdges(marker);
        group.add(marker);
        if (detailed) {
          const label = labelSprite(JOB_LABELS[index], 3.8, 0.95);
          label.position.set(x, height + 0.75, z);
          group.add(label);
        }
      }
      break;
    }
    case "silos": {
      const categories = Object.keys(skills);
      for (let index = 0; index < categories.length; index += 1) {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const height = 3 + (index % 3) * 1.2;
        const x = (col - 1) * 2.8;
        const z = (row - 0.5) * 3;
        const silo = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, height, 10), dark);
        silo.position.set(x, height / 2, z);
        addEdges(silo, PALETTE.blue, 0.5);
        group.add(silo);
        const cap = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.07, 8, 24), blue);
        cap.rotation.x = -Math.PI / 2;
        cap.position.set(x, height, z);
        group.add(cap);
        if (detailed) {
          const label = labelSprite(categories[index], 4, 1);
          label.position.set(x, height + 1.1, z);
          group.add(label);
        }
      }
      break;
    }
    case "library": {
      const names = ["SENA", "CEVIDA", "Cursos"];
      for (let index = 0; index < 3; index += 1) {
        const height = 3 + index * 0.6;
        const book = new THREE.Mesh(new THREE.BoxGeometry(1.5, height, 3.4), dark);
        book.position.set((index - 1) * 2, height / 2, 0);
        addEdges(book);
        group.add(book);
        if (detailed) {
          const label = labelSprite(names[index], 3.6, 0.9);
          label.position.set((index - 1) * 2, height + 0.8, 0);
          group.add(label);
        }
      }
      break;
    }
    case "antenna": {
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.7, 9, 8), standard(PALETTE.dark, PALETTE.blue));
      mast.position.y = 4.5;
      group.add(mast);
      for (let i = 0; i < 3; i += 1) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2 - i * 0.4, 0.07, 8, 32), blue);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 3 + i * 2.2;
        group.add(ring);
      }
      const beacon = new THREE.PointLight(PALETTE.blue, 18, 22, 2);
      beacon.position.y = 9.3;
      group.add(beacon);
      break;
    }
  }
}

export function buildWorld(scene: THREE.Scene, quality: Quality): WorldBuild {
  const settings = QUALITY[quality];
  const obstacles: THREE.Box3[] = [];
  const markers: Record<string, THREE.Object3D> = {};

  scene.background = new THREE.Color(PALETTE.navy);
  scene.fog = new THREE.FogExp2(PALETTE.navy, settings.fogDensity);

  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(ISLAND_RADIUS, ISLAND_RADIUS - 2.5, 1.2, 64),
    standard(PALETTE.dark),
  );
  ground.position.y = -0.62;
  ground.receiveShadow = settings.shadows;
  scene.add(ground);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(ISLAND_RADIUS - 0.4, 0.11, 8, 96), glow(PALETTE.blue, 0.85));
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = 0.08;
  scene.add(rim);

  if (settings.grid) {
    const grid = new THREE.GridHelper(84, 21, PALETTE.blue, PALETTE.gray);
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.17;
    grid.position.y = 0.03;
    scene.add(grid);
  }

  const route = new THREE.CatmullRomCurve3(
    ZONES.filter((zone) => zone.id !== "inicio").map((zone) => new THREE.Vector3(zone.x, 0.06, zone.z)),
    true,
    "catmullrom",
    0.35,
  );
  const routeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(route.getPoints(160)),
    new THREE.LineBasicMaterial({ color: PALETTE.blue, transparent: true, opacity: 0.35 }),
  );
  scene.add(routeLine);

  const checkpoints: THREE.Mesh[] = [];
  const checkpointHalos: THREE.Mesh[] = [];
  const jobMarkers: THREE.Mesh[] = [];

  ZONES.forEach((zone) => {
    const group = new THREE.Group();
    group.position.set(zone.x, 0, zone.z);
    buildStructure(zone, group, settings.accents);

    const label = labelSprite(zone.label);
    label.position.set(0, zone.kind === "antenna" ? 11 : zone.height + 2.2, 0);
    group.add(label);

    scene.add(group);
    markers[zone.id] = group;

    if (zone.kind !== "plaza") {
      const half = Math.min(3, zone.radius * 0.45);
      obstacles.push(
        new THREE.Box3(
          new THREE.Vector3(zone.x - half, 0, zone.z - half),
          new THREE.Vector3(zone.x + half, zone.height, zone.z + half),
        ),
      );
    }

    CHECKPOINTS.forEach((_, index) => {
      const beacon = group.getObjectByName(`checkpoint-${index}`);
      const halo = group.getObjectByName(`checkpoint-halo-${index}`);
      if (beacon instanceof THREE.Mesh) checkpoints.push(beacon);
      if (halo instanceof THREE.Mesh) checkpointHalos.push(halo);
    });
    JOB_LABELS.forEach((_, index) => {
      const marker = group.getObjectByName(`job-${index}`);
      if (marker instanceof THREE.Mesh) jobMarkers.push(marker);
    });
  });

  scene.add(new THREE.HemisphereLight(PALETTE.cloud, PALETTE.navy, 1.5));
  const sun = new THREE.DirectionalLight(PALETTE.white, 2.1);
  sun.position.set(20, 38, 18);
  sun.castShadow = settings.shadows;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -48;
  sun.shadow.camera.right = 48;
  sun.shadow.camera.top = 48;
  sun.shadow.camera.bottom = -48;
  scene.add(sun);

  const centerLight = new THREE.PointLight(PALETTE.blue, 12, 30, 2);
  centerLight.position.set(0, 7, 0);
  scene.add(centerLight);

  return { obstacles, markers, checkpoints, checkpointHalos, jobMarkers };
}
