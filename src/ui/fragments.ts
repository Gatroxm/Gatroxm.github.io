import {
  about,
  contact,
  courses,
  education,
  experience,
  profile,
  resumeHref,
  skills,
  stats,
} from "../data/content";

/** Escapa texto para insertarlo en HTML. */
export function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function brandHTML(): string {
  return `<span class="logo-code" aria-hidden="true">&lt;/&gt;</span> Gatrox<span class="logo-m">M</span><span class="logo-dev">.dev</span>`;
}

export function statsHTML(): string {
  return stats
    .map((stat) => {
      const value =
        typeof stat.value === "number"
          ? `${stat.value}${stat.suffix ?? ""}`
          : esc(stat.text ?? "");
      return `<div class="stat"><b class="stat-value${stat.text ? " stat-value--text" : ""}">${value}</b><span class="stat-label">${esc(stat.label)}</span></div>`;
    })
    .join("");
}

export function aboutHTML(): string {
  return about.paragraphs.map((text) => `<p>${esc(text)}</p>`).join("");
}

export function flowHTML(): string {
  return about.flow
    .map(
      (step, index) => `<div class="flow-step">
        <span class="flow-step-num" aria-hidden="true">${index + 1}</span>
        <div><b>${esc(step.title)}</b><span>${esc(step.text)}</span></div>
      </div>`,
    )
    .join("");
}

export function skillsHTML(withFilters = true): string {
  const filters = withFilters
    ? `<div class="filters" role="group" aria-label="Filtrar habilidades por categoría">
        ${["Todas", ...Object.keys(skills)]
          .map(
            (category, index) =>
              `<button class="chip" type="button" data-category="${esc(category)}" aria-pressed="${index === 0}">${esc(category)}</button>`,
          )
          .join("")}
      </div>`
    : "";

  const groups = Object.entries(skills)
    .map(
      ([category, list]) => `<div class="skill-group" data-group="${esc(category)}">
        ${withFilters ? `<h3>${esc(category)}</h3>` : ""}
        <ul class="skills">${list.map((name) => `<li class="skill">${esc(name)}</li>`).join("")}</ul>
      </div>`,
    )
    .join("");

  return `${filters}<div class="skill-groups">${groups}</div>`;
}

export function jobsHTML(): string {
  const items = experience.jobs
    .map(
      (job, index) => `<details class="job"${index === 0 ? " open" : ""}>
        <summary>
          <span class="job-title"><strong>${esc(job.role)}</strong> · <em>${esc(job.company)}</em></span>
          <span class="job-date">${esc(job.period)}</span>
          <span class="job-tags">${job.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</span>
        </summary>
        <ul>${job.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>
      </details>`,
    )
    .join("");

  return `<p class="note">${esc(experience.note)}</p><div class="timeline">${items}</div>`;
}

export function formationHTML(): string {
  const detailList = (items: typeof education | typeof courses) =>
    items
      .map((item) => {
        const label = `${esc(item.title)} · ${esc(item.org)}`;
        const content = "href" in item && item.href
          ? `<a href="${esc(item.href as string)}" target="_blank" rel="noopener noreferrer">${label}<span class="ext" aria-hidden="true"> ↗</span><span class="sr-only"> (se abre en una pestaña nueva)</span></a>`
          : label;
        return `<li><span class="detail-label">${content}</span>${item.year ? `<small>${esc(item.year)}</small>` : ""}</li>`;
      })
      .join("");

  return `<article class="panel">
      <h3 class="card-title">Educación</h3>
      <ul class="detail-list">${detailList(education)}</ul>
    </article>
    <article class="panel">
      <h3 class="card-title">Cursos y certificaciones</h3>
      <ul class="detail-list">${detailList(courses)}</ul>
    </article>`;
}

export function contactLinksHTML(): string {
  const link = (href: string, label: string) =>
    `<a class="btn" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true"> ↗</span><span class="sr-only"> (se abre en una pestaña nueva)</span></a>`;

  return `<button class="btn btn-primary" type="button" data-action="copy-email" aria-label="Copiar correo ${esc(contact.email)} al portapapeles">${esc(contact.email)}</button>
    ${link(contact.whatsapp, "WhatsApp")}
    ${link(contact.linkedin, "LinkedIn")}
    ${link(contact.github, "GitHub")}`;
}

export function heroActionsHTML(): string {
  return `<a class="btn btn-primary" href="#experiencia">Ver experiencia <span aria-hidden="true">→</span></a>
    <a class="btn" href="${esc(resumeHref)}" download>
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      Hoja de vida (PDF)
    </a>`;
}

export function profileCodeHTML(): string {
  return `<span class="tok-k">const</span> ${esc(profile.name.split(" ")[0].toLowerCase())} = {
  <span class="tok-k">rol</span>: <span class="tok-s">"Full Stack Senior"</span>,
  <span class="tok-k">stack</span>: [<span class="tok-s">".NET"</span>, <span class="tok-s">"Angular"</span>, <span class="tok-s">"Azure"</span>],
  <span class="tok-k">ia</span>: [<span class="tok-s">"Agentes"</span>, <span class="tok-s">"MCP"</span>, <span class="tok-s">"Graphify"</span>],
  <span class="tok-k">ubicacion</span>: <span class="tok-s">"Colombia"</span>,
  <span class="tok-k">remoto</span>: <span class="tok-k">true</span>
};
<span class="tok-c">// abierto a nuevos retos</span>`;
}
