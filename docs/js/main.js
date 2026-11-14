import {
  about,
  contact,
  courses,
  education,
  experience,
  profile,
  skills,
  stats,
} from "../data/content.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/** Crea un elemento con clase y texto opcionales. */
function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function externalLink(href, label, className = "") {
  const link = make("a", className, label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  const arrow = make("span", "ext", " ↗");
  arrow.setAttribute("aria-hidden", "true");
  const hint = make("span", "sr-only", " (se abre en una pestaña nueva)");
  link.append(arrow, hint);
  return link;
}

/* -------------------------------------------------------------------------- */
/* Tema                                                                       */
/* -------------------------------------------------------------------------- */

function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme, persist) {
  document.documentElement.dataset.theme = theme;

  const toggle = $(".theme-toggle");
  if (toggle) {
    const next = theme === "dark" ? "claro" : "oscuro";
    toggle.setAttribute("aria-label", `Cambiar a tema ${next}`);
    toggle.setAttribute("aria-pressed", String(theme === "light"));
  }

  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#0F172A" : "#F1F5F9";

  if (persist) {
    try {
      window.localStorage.setItem("theme", theme);
    } catch (error) {
      /* Si el almacenamiento falla, el tema sigue funcionando en memoria. */
    }
  }
}

function initTheme() {
  applyTheme(currentTheme(), false);

  const toggle = $(".theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
  });
}

/* -------------------------------------------------------------------------- */
/* Menú móvil                                                                 */
/* -------------------------------------------------------------------------- */

function initMenu() {
  const toggle = $("#menu-toggle");
  const nav = $("#nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  window
    .matchMedia("(min-width: 761px)")
    .addEventListener("change", (event) => {
      if (event.matches) close();
    });
}

/* -------------------------------------------------------------------------- */
/* Rol con efecto de escritura                                                */
/* -------------------------------------------------------------------------- */

function initTyping() {
  const target = $("#typed");
  if (!target) return;

  const roles = profile.roles;
  if (!roles.length) return;

  if (reducedMotion) {
    target.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const step = () => {
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = word.slice(0, charIndex);

    let delay = deleting ? 34 : 72;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 320;
    }

    window.setTimeout(step, delay);
  };

  step();
}

/* -------------------------------------------------------------------------- */
/* Cifras                                                                     */
/* -------------------------------------------------------------------------- */

function initCounters() {
  const numbers = $$("[data-count]");
  if (!numbers.length) return;

  const finish = (node) => {
    node.textContent = node.dataset.count;
  };

  if (reducedMotion || !("IntersectionObserver" in window)) {
    numbers.forEach(finish);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const node = entry.target;
        const target = Number(node.dataset.count);
        const duration = 1100;
        const start = window.performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = String(Math.round(target * eased));

          if (progress < 1) {
            window.requestAnimationFrame(tick);
          } else {
            node.textContent = String(target);
          }
        };

        window.requestAnimationFrame(tick);
        obs.unobserve(node);
      });
    },
    { threshold: 0.5 },
  );

  numbers.forEach((node) => observer.observe(node));
}

function renderStats() {
  const host = $("#stats");
  if (!host) return;

  const fragment = document.createDocumentFragment();

  stats.forEach((stat) => {
    const card = make("div", "stat");
    const value = make("b", "stat-value");

    if (typeof stat.value === "number") {
      const number = make("span");
      number.dataset.count = String(stat.value);
      number.textContent = "0";
      value.append(number);
      if (stat.suffix) value.append(document.createTextNode(stat.suffix));
    } else {
      value.textContent = stat.text;
      value.classList.add("stat-value--text");
    }

    card.append(value, make("span", "stat-label", stat.label));
    fragment.append(card);
  });

  host.append(fragment);
  initCounters();
}

/* -------------------------------------------------------------------------- */
/* Sobre mí y agentes                                                         */
/* -------------------------------------------------------------------------- */

function renderAbout() {
  const copy = $("#about-text");
  if (copy) {
    about.paragraphs.forEach((text) => copy.append(make("p", null, text)));
  }

  const flow = $("#flow-list");
  if (!flow) return;

  about.flow.forEach((step, index) => {
    const item = make("div", "flow-step");
    const number = make("span", "flow-step-num", String(index + 1));
    number.setAttribute("aria-hidden", "true");
    const body = make("div");
    body.append(make("b", null, step.title), make("span", null, step.text));
    item.append(number, body);
    flow.append(item);
  });
}

/* -------------------------------------------------------------------------- */
/* Habilidades                                                                */
/* -------------------------------------------------------------------------- */

let activeSkillCategory = "Todas";

function skillTags() {
  const host = $("#skills");
  const status = $("#skills-status");
  if (!host) return;

  const categories =
    activeSkillCategory === "Todas"
      ? Object.keys(skills)
      : [activeSkillCategory];

  host.replaceChildren();
  let index = 0;
  let total = 0;

  categories.forEach((category) => {
    skills[category].forEach((name) => {
      const tag = make("li", "skill", name);
      tag.style.animationDelay = `${Math.min(index++ * 18, 420)}ms`;
      host.append(tag);
      total += 1;
    });
  });

  if (status) {
    const label =
      activeSkillCategory === "Todas"
        ? "todas las categorías"
        : activeSkillCategory;
    status.textContent = `Mostrando ${total} habilidades de ${label}.`;
  }
}

function renderSkills() {
  const host = $("#filters");
  if (!host) return;

  const categories = ["Todas", ...Object.keys(skills)];

  categories.forEach((category) => {
    const button = make("button", "chip", category);
    button.type = "button";
    button.setAttribute("aria-pressed", String(category === activeSkillCategory));

    button.addEventListener("click", () => {
      if (category === activeSkillCategory) return;
      activeSkillCategory = category;
      $$(".chip", host).forEach((chip) => {
        chip.setAttribute("aria-pressed", String(chip === button));
      });
      skillTags();
    });

    host.append(button);
  });

  skillTags();
}

/* -------------------------------------------------------------------------- */
/* Experiencia                                                                */
/* -------------------------------------------------------------------------- */

function createJob(job, index) {
  const article = make("article", "job reveal");
  const startOpen = index === 0;
  article.dataset.open = String(startOpen);

  if (index >= experience.initialVisible) article.hidden = true;

  const panelId = `job-panel-${index}`;
  const button = make("button", "job-toggle");
  button.type = "button";
  button.setAttribute("aria-expanded", String(startOpen));
  button.setAttribute("aria-controls", panelId);

  const chevron = make("span", "chev", "▾");
  chevron.setAttribute("aria-hidden", "true");

  const head = make("span", "job-head");
  const title = make("span", "job-title");
  title.append(
    make("strong", "job-role", job.role),
    document.createTextNode(" · "),
    make("em", "job-company", job.company),
  );
  head.append(title, make("span", "job-date", job.period));

  const tags = make("span", "job-tags");
  job.tags.forEach((tag) => tags.append(make("span", null, tag)));

  button.append(chevron, head, tags);

  const panel = make("div", "job-panel");
  panel.id = panelId;
  const inner = make("div");
  const list = make("ul");
  job.bullets.forEach((bullet) => list.append(make("li", null, bullet)));
  inner.append(list);
  panel.append(inner);

  button.addEventListener("click", () => {
    const open = article.dataset.open === "true";
    article.dataset.open = String(!open);
    button.setAttribute("aria-expanded", String(!open));
  });

  article.append(button, panel);
  return article;
}

function renderExperience() {
  const host = $("#timeline");
  const note = $("#experience-note");
  if (note) note.textContent = experience.note;
  if (!host) return;

  const fragment = document.createDocumentFragment();
  experience.jobs.forEach((job, index) => {
    fragment.append(createJob(job, index));
  });
  host.append(fragment);
}

function initMoreJobs() {
  const button = $("#more-jobs");
  const label = $("#more-label");
  const arrow = $("#more-arrow");
  if (!button || !label || !arrow) return;

  button.addEventListener("click", () => {
    const hidden = $$("#timeline .job[hidden]");

    if (hidden.length) {
      hidden.forEach((job) => {
        job.hidden = false;
        job.classList.add("is-visible");
      });
      label.textContent = "Mostrar menos";
      arrow.textContent = "↑";
      button.setAttribute("aria-expanded", "true");
      return;
    }

    $$("#timeline .job").forEach((job, index) => {
      if (index >= experience.initialVisible) job.hidden = true;
    });
    label.textContent = "Ver trayectoria completa";
    arrow.textContent = "↓";
    button.setAttribute("aria-expanded", "false");

    const section = $("#experiencia");
    if (section) {
      section.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Formación                                                                  */
/* -------------------------------------------------------------------------- */

function renderDetailList(host, items) {
  if (!host) return;

  items.forEach((item) => {
    const row = make("li");
    const label = make("span", "detail-label");

    if (item.href) {
      const link = externalLink(item.href, `${item.title} · ${item.org}`);
      label.append(link);
    } else {
      label.textContent = `${item.title} · ${item.org}`;
    }

    row.append(label);
    if (item.year) row.append(make("small", null, item.year));
    host.append(row);
  });
}

/* -------------------------------------------------------------------------- */
/* Contacto                                                                   */
/* -------------------------------------------------------------------------- */

function renderContact() {
  const host = $("#contact-actions");
  if (!host) return;

  const copy = make("button", "btn btn-primary", contact.email);
  copy.type = "button";
  copy.id = "copy-email";
  copy.setAttribute("aria-label", `Copiar correo ${contact.email} al portapapeles`);

  host.append(
    copy,
    externalLink(contact.whatsapp, "WhatsApp", "btn"),
    externalLink(contact.linkedin, "LinkedIn", "btn"),
    externalLink(contact.github, "GitHub", "btn"),
  );

  const mail = $("#contact-mail");
  if (mail) {
    mail.href = `mailto:${contact.email}`;
    mail.textContent = contact.email;
  }

  copy.addEventListener("click", copyEmail);
}

async function copyEmail() {
  try {
    if (!navigator.clipboard) throw new Error("Clipboard no disponible");
    await navigator.clipboard.writeText(contact.email);
    showToast("Correo copiado");
  } catch (error) {
    window.location.href = `mailto:${contact.email}`;
    showToast("Abriendo tu cliente de correo…");
  }
}

let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* -------------------------------------------------------------------------- */
/* Navegación activa                                                          */
/* -------------------------------------------------------------------------- */

function initScrollSpy() {
  const links = $$("#nav a");
  if (!links.length) return;

  const sections = links
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const offset = window.scrollY + 140;
    let current = sections[0];

    sections.forEach((section) => {
      if (section.offsetTop <= offset) current = section;
    });

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (atBottom) current = sections[sections.length - 1];

    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${current.id}`;
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

/* -------------------------------------------------------------------------- */
/* Aparición al hacer scroll                                                  */
/* -------------------------------------------------------------------------- */

function initReveal() {
  const items = $$(".reveal:not(.is-visible)");
  if (!items.length) return;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  items.forEach((item) => observer.observe(item));
}

/* -------------------------------------------------------------------------- */
/* Arranque                                                                   */
/* -------------------------------------------------------------------------- */

function renderFooter() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

initTheme();
renderStats();
renderAbout();
renderSkills();
renderExperience();
renderDetailList($("#education-list"), education);
renderDetailList($("#courses-list"), courses);
renderContact();
renderFooter();
initTyping();
initMenu();
initMoreJobs();
initScrollSpy();
initReveal();
