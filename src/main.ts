import "./style.css";
import { contact } from "./data/content";
import type { WorldController } from "./world/worldApp";

const $ = <T extends Element = HTMLElement>(selector: string, root: Document = document) =>
  root.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, root: Document = document) =>
  [...root.querySelectorAll<T>(selector)];

const entry = $<HTMLElement>("#entry");
const world = $<HTMLElement>("#world");
const classic = $<HTMLElement>("#classic");
const toast = $<HTMLElement>("[data-global-toast]");

let controller: WorldController | null = null;
let classicReady = false;
let toastTimer = 0;

function showToast(message: string): void {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Tema y modo clásico                                                        */
/* -------------------------------------------------------------------------- */

function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: "light" | "dark", persist: boolean): void {
  document.documentElement.dataset.theme = theme;
  $$<HTMLButtonElement>('[data-action="theme"]').forEach((button) => {
    button.setAttribute("aria-pressed", String(theme === "light"));
    button.setAttribute("aria-label", `Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`);
  });
  const meta = $<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#0F172A" : "#F1F5F9";
  if (persist) {
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      /* El tema sigue funcionando en memoria. */
    }
  }
}

function initTheme(): void {
  let initial: "light" | "dark" = "dark";
  try {
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") initial = saved;
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) initial = "light";
  } catch {
    initial = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  applyTheme(initial, false);
  $$<HTMLButtonElement>('[data-action="theme"]').forEach((button) => {
    button.addEventListener("click", () => applyTheme(currentTheme() === "dark" ? "light" : "dark", true));
  });
}

function initFilters(): void {
  const chips = $$<HTMLButtonElement>(".chip");
  if (!chips.length) return;
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const category = chip.dataset.category ?? "Todas";
      chips.forEach((item) => item.setAttribute("aria-pressed", String(item === chip)));
      $$<HTMLElement>(".skill-group").forEach((group) => {
        group.hidden = category !== "Todas" && group.dataset.group !== category;
      });
    });
  });
}

function initMenu(): void {
  const button = $<HTMLButtonElement>(".menu-toggle");
  const nav = $<HTMLElement>(".nav");
  if (!button || !nav) return;
  button.setAttribute("aria-controls", nav.id || "classic-nav");
  const close = () => {
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menú");
  };
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function initScrollSpy(): void {
  const links = $$<HTMLAnchorElement>(".nav a");
  if (!links.length) return;
  const sections = links
    .map((link) => $<HTMLElement>(link.getAttribute("href") ?? ""))
    .filter((section): section is HTMLElement => Boolean(section));
  if (!sections.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const offset = window.scrollY + 140;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= offset) current = section;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${current.id}`) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };
  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();
}

function initClassic(): void {
  if (classicReady) return;
  classicReady = true;
  initTheme();
  initFilters();
  initMenu();
  initScrollSpy();
  const year = $<HTMLElement>("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

/* -------------------------------------------------------------------------- */
/* Cambio de modo                                                             */
/* -------------------------------------------------------------------------- */

function showClassic(message?: string): void {
  controller?.dispose();
  controller = null;
  if (entry) entry.hidden = true;
  if (world) world.hidden = true;
  if (classic) classic.hidden = false;
  document.body.dataset.mode = "classic";
  window.history.replaceState(null, "", window.location.pathname);
  initClassic();
  window.scrollTo({ top: 0, behavior: "auto" });
  if (message) showToast(message);
}

async function showWorld(): Promise<void> {
  if (!hasWebGL()) {
    showClassic("Tu dispositivo no tiene WebGL: mostramos la hoja de vida clásica.");
    return;
  }

  applyTheme("dark", false);
  if (entry) entry.hidden = true;
  if (classic) classic.hidden = true;
  if (world) world.hidden = false;
  document.body.dataset.mode = "world";
  window.history.replaceState(null, "", "#world");

  try {
    const { startWorld } = await import("./world/worldApp");
    controller = await startWorld();
  } catch (error) {
    console.warn("No se pudo iniciar la experiencia 3D:", error);
    showClassic("No se pudo cargar el mundo 3D: mostramos la hoja de vida clásica.");
  }
}

/* -------------------------------------------------------------------------- */
/* Arranque                                                                   */
/* -------------------------------------------------------------------------- */

$<HTMLElement>("#entry [data-action=explore]")?.addEventListener("click", () => {
  void showWorld();
});

$$<HTMLElement>('[data-action="classic"]').forEach((button) => {
  button.addEventListener("click", () => showClassic());
});

document.addEventListener("click", async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action="copy-email"]');
  if (!button) return;
  try {
    if (!navigator.clipboard) throw new Error("Clipboard no disponible");
    await navigator.clipboard.writeText(contact.email);
    showToast("Correo copiado");
  } catch {
    showToast("Abriendo tu cliente de correo…");
    window.location.href = `mailto:${contact.email}`;
  }
});

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#world" && document.body.dataset.mode !== "world") {
    void showWorld();
  }
});

if (window.location.hash === "#world") {
  void showWorld();
} else if (!hasWebGL()) {
  showClassic();
}
