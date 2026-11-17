import { contact, profile, resumeHref, stats } from "../data/content";
import {
  aboutHTML,
  contactLinksHTML,
  flowHTML,
  formationHTML,
  jobsHTML,
  skillsHTML,
  statsHTML,
} from "./fragments";

export interface ZonePanel {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
}

const panels: Record<string, ZonePanel> = {
  inicio: {
    id: "inicio",
    eyebrow: "Zona 01 · Inicio",
    title: profile.name,
    body: `<p class="panel-lead">${profile.title} · ${profile.roles[2]}</p>
      <p>${profile.lead}</p>
      <p class="meta">${profile.location}</p>
      <div class="stats stats--panel">${statsHTML()}</div>
      <p class="hint">Usa WASD o las flechas para moverte, Espacio para saltar y Enter para abrir las zonas cercanas.</p>
      <a class="btn" href="${resumeHref}" download>Hoja de vida (PDF)</a>`,
  },
  sobre: {
    id: "sobre",
    eyebrow: "Zona 02 · Terminal",
    title: "Sobre mí",
    body: `${aboutHTML()}
      <h3>Cómo trabajan mis agentes</h3>
      <div class="flow">${flowHTML()}</div>`,
  },
  agentes: {
    id: "agentes",
    eyebrow: "Zona 03 · Circuito de IA",
    title: "Cómo trabajan mis agentes",
    body: `<p>Cuatro puntos de control: del requerimiento a la implementación, pasando por MCP y Graphify.</p>
      <div class="flow">${flowHTML()}</div>
      <p class="hint">${stats[2].text}: ${stats[2].label}.</p>`,
  },
  experiencia: {
    id: "experiencia",
    eyebrow: "Zona 04 · Avenida de la trayectoria",
    title: "Experiencia",
    body: jobsHTML(),
  },
  habilidades: {
    id: "habilidades",
    eyebrow: "Zona 05 · Silos de tecnología",
    title: "Habilidades",
    body: skillsHTML(false),
  },
  formacion: {
    id: "formacion",
    eyebrow: "Zona 06 · Biblioteca",
    title: "Formación y certificados",
    body: `<div class="formation-grid formation-grid--panel">${formationHTML()}</div>`,
  },
  contacto: {
    id: "contacto",
    eyebrow: "Zona 07 · Antena",
    title: "Contacto",
    body: `<p>Dale a copiar o escríbeme directamente. Respondo correos y mensajes con gusto.</p>
      <div class="contact-actions">${contactLinksHTML()}</div>
      <p class="contact-alt"><a href="mailto:${contact.email}">${contact.email}</a> · <a href="${contact.phoneHref}">${contact.phone}</a></p>`,
  },
};

export function getZonePanel(id: string): ZonePanel | undefined {
  return panels[id];
}

export function renderPanelHTML(panel: ZonePanel): string {
  return `<div class="zone-panel-inner">
    <div class="zone-panel-head">
      <div>
        <p class="eyebrow">${panel.eyebrow}</p>
        <h2>${panel.title}</h2>
      </div>
      <button class="icon-btn" type="button" data-action="close-panel" aria-label="Cerrar panel">✕</button>
    </div>
    <div class="zone-panel-body">${panel.body}</div>
  </div>`;
}
