import { contact, profile, resumeHref } from "../data/content";
import {
  aboutHTML,
  brandHTML,
  contactLinksHTML,
  flowHTML,
  formationHTML,
  heroActionsHTML,
  jobsHTML,
  profileCodeHTML,
  skillsHTML,
  statsHTML,
} from "./fragments";

/** Genera la hoja de vida clásica, responsive y accesible. */
export function renderClassic(): string {
  return `
  <a class="skip-link" href="#main">Saltar al contenido</a>

  <header class="site-header">
    <div class="wrap header-inner">
      <a class="logo" href="#inicio" aria-label="GatroxM.dev — ir al inicio">${brandHTML()}</a>
      <nav class="nav" id="classic-nav" data-nav aria-label="Secciones del portafolio">
        <a href="#inicio" aria-current="page">Inicio</a>
        <a href="#sobre">Sobre mí</a>
        <a href="#habilidades">Habilidades</a>
        <a href="#experiencia">Experiencia</a>
        <a href="#formacion">Formación</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <div class="header-actions">
        <button class="icon-btn theme-toggle" type="button" data-action="theme" aria-label="Cambiar a tema claro" aria-pressed="false">
          <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"></path></svg>
        </button>
        <button class="icon-btn menu-toggle" type="button" data-action="menu" aria-controls="classic-nav" aria-expanded="false" aria-label="Abrir menú">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"></path></svg>
        </button>
      </div>
    </div>
  </header>

  <main id="main" tabindex="-1">
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="hero-kicker">// Hola, soy</p>
          <h1 class="hero-name" id="hero-title">${profile.name}</h1>
          <p class="role">${profile.title} · ${profile.roles[2]}</p>
          <p class="lead">${profile.lead}</p>
          <p class="meta">${profile.location}</p>
          <div class="hero-actions">${heroActionsHTML()}</div>
        </div>
        <div class="terminal" role="img" aria-label="Resumen del perfil: Full Stack Senior; stack .NET, Angular y Azure; IA con agentes, MCP y Graphify; ubicación Colombia; trabajo remoto.">
          <div class="terminal-bar" aria-hidden="true"><i></i><i></i><i></i></div>
          <pre><code>${profileCodeHTML()}</code></pre>
        </div>
      </div>
    </section>

    <section class="section section-stats" aria-labelledby="stats-title">
      <div class="wrap">
        <h2 class="sr-only" id="stats-title">Cifras</h2>
        <div class="stats">${statsHTML()}</div>
      </div>
    </section>

    <section class="section" id="sobre" aria-labelledby="sobre-title">
      <div class="wrap">
        <p class="eyebrow">Sobre mí</p>
        <h2 class="section-title" id="sobre-title">Código sólido, arquitectura clara y agentes que aceleran al equipo.</h2>
        <div class="about">
          <div class="about-copy">${aboutHTML()}</div>
          <aside class="panel" aria-labelledby="flow-title">
            <h3 class="panel-title" id="flow-title">Cómo trabajan mis agentes</h3>
            <div class="flow">${flowHTML()}</div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section" id="habilidades" aria-labelledby="habilidades-title">
      <div class="wrap">
        <p class="eyebrow">Habilidades</p>
        <h2 class="section-title" id="habilidades-title">Mi caja de herramientas</h2>
        ${skillsHTML()}
      </div>
    </section>

    <section class="section" id="experiencia" aria-labelledby="experiencia-title">
      <div class="wrap">
        <p class="eyebrow">Experiencia</p>
        <h2 class="section-title" id="experiencia-title">Trayectoria profesional</h2>
        ${jobsHTML()}
      </div>
    </section>

    <section class="section" id="formacion" aria-labelledby="formacion-title">
      <div class="wrap">
        <p class="eyebrow">Formación</p>
        <h2 class="section-title" id="formacion-title">Estudios y certificaciones</h2>
        <div class="formation-grid">${formationHTML()}</div>
      </div>
    </section>

    <section class="section section-contact" id="contacto" aria-labelledby="contacto-title">
      <div class="wrap contact">
        <p class="eyebrow">Contacto</p>
        <h2 class="section-title" id="contacto-title">¿Construimos algo juntos?</h2>
        <div class="contact-actions">${contactLinksHTML()}</div>
        <p class="contact-alt">También puedes escribirme a <a href="mailto:${contact.email}">${contact.email}</a> o llamarme al <a href="${contact.phoneHref}">${contact.phone}</a>.</p>
        <p class="contact-alt"><a href="${resumeHref}" download>Descargar hoja de vida (PDF)</a></p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap footer-inner">
      <p>© <span data-year>2026</span> ${profile.name} · <span class="footer-brand">${brandHTML()}</span></p>
      <a class="back-top" href="#inicio">Volver arriba <span aria-hidden="true">↑</span></a>
    </div>
  </footer>
  <div class="toast" data-toast role="status" aria-live="polite"></div>`;
}
