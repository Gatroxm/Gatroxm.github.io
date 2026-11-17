import { CHECKPOINTS, ISLAND_RADIUS, ZONES } from "./constants";

/** Solo colores de la paleta del proyecto. */
const C = {
  navy: "#0F172A",
  blue: "#2563EB",
  dark: "#1E293B",
  cloud: "#F1F5F9",
  white: "#FFFFFF",
  gray: "#64748B",
} as const;

const SHORT_LABELS: Record<string, string> = {
  inicio: "Inicio",
  sobre: "Sobre mí",
  agentes: "IA",
  experiencia: "Experiencia",
  habilidades: "Habilidades",
  formacion: "Formación",
  contacto: "Contacto",
};

export interface MinimapState {
  x: number;
  z: number;
  yaw: number;
  visitedZones: ReadonlySet<string>;
  visitedCheckpoints: ReadonlySet<number>;
}

export interface Minimap {
  readonly open: boolean;
  toggle(force?: boolean): void;
  update(state: MinimapState): void;
  dispose(): void;
}

/** Minimapa 2D superpuesto: zonas, ruta, checkpoints y posición del vehículo. */
export function createMinimap(onToggle?: (open: boolean) => void): Minimap {
  const container = document.querySelector<HTMLElement>("[data-minimap]");
  const canvas = document.querySelector<HTMLCanvasElement>("[data-minimap-canvas]");
  const closeButton = document.querySelector<HTMLElement>('[data-action="map-close"]');

  if (!container || !canvas) {
    return {
      open: false,
      toggle() {},
      update() {},
      dispose() {},
    };
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      open: false,
      toggle() {},
      update() {},
      dispose() {},
    };
  }

  const size = 220;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  let open = false;
  let lastDraw = 0;
  let latest: MinimapState | null = null;
  let disposed = false;

  const onClose = () => toggle(false);
  closeButton?.addEventListener("click", onClose);

  function toggle(force?: boolean) {
    if (disposed) return;
    open = force ?? !open;
    container!.hidden = !open;
    onToggle?.(open);
    if (open) {
      lastDraw = 0;
      if (latest) draw(latest, performance.now());
    }
  }

  function toScreen(x: number, z: number): [number, number] {
    const scale = (size / 2 - 12) / ISLAND_RADIUS;
    return [size / 2 + x * scale, size / 2 + z * scale];
  }

  function draw(state: MinimapState, now: number) {
    ctx!.clearRect(0, 0, size, size);
    ctx!.fillStyle = C.navy;
    ctx!.fillRect(0, 0, size, size);

    const center = size / 2;
    const radius = center - 12;

    // Isla y borde emisivo.
    ctx!.beginPath();
    ctx!.arc(center, center, radius, 0, Math.PI * 2);
    ctx!.fillStyle = C.dark;
    ctx!.fill();
    ctx!.strokeStyle = C.blue;
    ctx!.lineWidth = 2;
    ctx!.stroke();

    // Ruta que conecta las zonas.
    const ring = ZONES.filter((zone) => zone.id !== "inicio");
    ctx!.beginPath();
    ring.forEach((zone, index) => {
      const [px, py] = toScreen(zone.x, zone.z);
      if (index === 0) ctx!.moveTo(px, py);
      else ctx!.lineTo(px, py);
    });
    ctx!.closePath();
    ctx!.globalAlpha = 0.45;
    ctx!.strokeStyle = C.blue;
    ctx!.lineWidth = 1.5;
    ctx!.stroke();
    ctx!.globalAlpha = 1;

    // Checkpoints del circuito de agentes.
    CHECKPOINTS.forEach((checkpoint, index) => {
      const [px, py] = toScreen(checkpoint.x, checkpoint.z);
      const done = state.visitedCheckpoints.has(index);
      ctx!.save();
      ctx!.translate(px, py);
      ctx!.rotate(Math.PI / 4);
      ctx!.fillStyle = done ? C.blue : C.navy;
      ctx!.strokeStyle = done ? C.blue : C.gray;
      ctx!.lineWidth = 1.2;
      ctx!.fillRect(-3, -3, 6, 6);
      ctx!.strokeRect(-3, -3, 6, 6);
      ctx!.restore();
    });

    // Zonas.
    ZONES.forEach((zone) => {
      const [px, py] = toScreen(zone.x, zone.z);
      const visited = state.visitedZones.has(zone.id);
      ctx!.beginPath();
      ctx!.arc(px, py, zone.id === "inicio" ? 6 : 5, 0, Math.PI * 2);
      ctx!.fillStyle = visited ? C.blue : C.navy;
      ctx!.fill();
      ctx!.lineWidth = 1.5;
      ctx!.strokeStyle = visited ? C.blue : C.gray;
      ctx!.stroke();

      ctx!.font = "600 9px system-ui, sans-serif";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "top";
      ctx!.fillStyle = visited ? C.cloud : C.gray;
      ctx!.fillText(SHORT_LABELS[zone.id] ?? zone.label, px, py + 7);
    });

    // Vehículo: triángula apuntando según el rumbo.
    const [vx, vy] = toScreen(state.x, state.z);
    const pulse = 9 + Math.sin(now / 320) * 1.5;
    ctx!.beginPath();
    ctx!.arc(vx, vy, pulse, 0, Math.PI * 2);
    ctx!.globalAlpha = 0.35;
    ctx!.strokeStyle = C.blue;
    ctx!.lineWidth = 1;
    ctx!.stroke();
    ctx!.globalAlpha = 1;

    ctx!.save();
    ctx!.translate(vx, vy);
    ctx!.rotate(Math.PI - state.yaw);
    ctx!.beginPath();
    ctx!.moveTo(0, -7);
    ctx!.lineTo(5, 5);
    ctx!.lineTo(0, 2);
    ctx!.lineTo(-5, 5);
    ctx!.closePath();
    ctx!.fillStyle = C.white;
    ctx!.fill();
    ctx!.strokeStyle = C.blue;
    ctx!.lineWidth = 1.2;
    ctx!.stroke();
    ctx!.restore();
  }

  return {
    get open() {
      return open;
    },
    toggle(force) {
      toggle(force);
    },
    update(state) {
      if (disposed || !open) return;
      latest = state;
      const now = performance.now();
      if (now - lastDraw >= 50) {
        lastDraw = now;
        draw(state, now);
      }
    },
    dispose() {
      disposed = true;
      closeButton?.removeEventListener("click", onClose);
    },
  };
}
