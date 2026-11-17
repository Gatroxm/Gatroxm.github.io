/** Paleta permitida. No se usan otros colores en la escena. */
export const PALETTE = {
  navy: 0x0f172a,
  blue: 0x2563eb,
  dark: 0x1e293b,
  cloud: 0xf1f5f9,
  white: 0xffffff,
  gray: 0x64748b,
} as const;

export type Quality = "alta" | "media" | "baja";

export interface QualitySettings {
  pixelRatio: number;
  shadows: boolean;
  antialias: boolean;
  fogDensity: number;
  grid: boolean;
  accents: boolean;
}

export const QUALITY: Record<Quality, QualitySettings> = {
  alta: { pixelRatio: 2, shadows: true, antialias: true, fogDensity: 0.011, grid: true, accents: true },
  media: { pixelRatio: 1.5, shadows: false, antialias: true, fogDensity: 0.014, grid: true, accents: true },
  baja: { pixelRatio: 1, shadows: false, antialias: false, fogDensity: 0.017, grid: false, accents: false },
};

export interface ZoneDefinition {
  id: string;
  label: string;
  x: number;
  z: number;
  radius: number;
  height: number;
  kind: "plaza" | "terminal" | "circuit" | "avenue" | "silos" | "library" | "antenna";
}

/** Una plaza central y seis zonas alrededor de un anillo recorrible. */
export const ZONES: ZoneDefinition[] = [
  { id: "inicio", label: "Inicio", x: 0, z: 0, radius: 7, height: 0.4, kind: "plaza" },
  { id: "sobre", label: "Sobre mí", x: -19, z: 2, radius: 4.5, height: 5, kind: "terminal" },
  { id: "agentes", label: "Agentes de IA", x: -4, z: -20, radius: 6, height: 3.4, kind: "circuit" },
  { id: "experiencia", label: "Experiencia", x: 19, z: -8, radius: 5, height: 6, kind: "avenue" },
  { id: "habilidades", label: "Habilidades", x: 18, z: 15, radius: 5.5, height: 7, kind: "silos" },
  { id: "formacion", label: "Formación", x: -3, z: 21, radius: 4.5, height: 4.4, kind: "library" },
  { id: "contacto", label: "Contacto", x: -21, z: 15, radius: 4.5, height: 9, kind: "antenna" },
];

export const ISLAND_RADIUS = 46;
export const SPAWN = { x: 0, z: 10 };

export function zoneById(id: string): ZoneDefinition | undefined {
  return ZONES.find((zone) => zone.id === id);
}

export function detectQuality(): Quality {
  try {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 820;
    if (memory <= 2 || cores <= 2 || (coarse && small)) return "baja";
    if (memory <= 4 || cores <= 4 || coarse) return "media";
    return "alta";
  } catch {
    return "media";
  }
}
