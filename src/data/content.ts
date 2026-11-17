/**
 * Única fuente de contenido del portafolio.
 * Extraído de `prototype/index.html` y de la versión estática anterior.
 * Reglas: no inventar datos, correo único y español con tildes.
 */

export interface Stat {
  value?: number;
  suffix?: string;
  text?: string;
  label: string;
}

export interface FlowStep {
  title: string;
  text: string;
}

export interface Job {
  role: string;
  company: string;
  period: string;
  tags: string[];
  bullets: string[];
}

export interface EducationItem {
  title: string;
  org: string;
  year: string;
}

export interface Course extends EducationItem {
  href?: string;
}

export const profile = {
  name: "Gustavo Adolfo Muñoz Reyes",
  brand: "</> GatroxM.dev",
  roles: [
    "Full Stack Senior",
    ".NET y Angular",
    "especializado en agentes de IA",
    "con foco en Azure y MCP",
  ],
  title: "Desarrollador Full Stack Senior",
  location: "Bello, Antioquia (Colombia) · Trabajo remoto",
  lead: "Más de 12 años construyendo aplicaciones web y móviles con .NET, Angular y Node.js, y hoy llevando los agentes de IA al desarrollo de software.",
};

export const stats: Stat[] = [
  { value: 12, suffix: "+", label: "años de experiencia" },
  { value: 58, label: "desarrolladores capacitados en agentes de IA" },
  { text: "1 semana → 1 día", label: "un requerimiento, con agentes de IA" },
];

export const about: { paragraphs: string[]; flow: FlowStep[] } = {
  paragraphs: [
    "Soy desarrollador Full Stack Senior. Hoy trabajo en consultoría para un cliente corporativo global: levanto requerimientos, defino soluciones, reviso código en GitHub y despliego en Azure.",
    "He liderado arquitecturas de micro-frontends y microservicios, migraciones como Vue 2 a Vue 3 y una aplicación móvil de inversiones para un banco de Chile.",
    "Mi diferencial: diseño agentes de IA que agilizan la creación e implementación de requerimientos, y capacito a otros desarrolladores para usarlos.",
  ],
  flow: [
    {
      title: "Requerimiento",
      text: "El agente lo analiza y detecta lo que falta.",
    },
    {
      title: "MCP",
      text: "Se conecta a las dependencias y a los diseños en Figma.",
    },
    {
      title: "Graphify",
      text: "Un grafo del código evita leer todo el repositorio y ahorra tokens.",
    },
    {
      title: "Implementación",
      text: "Se escala y se revisa por pull request.",
    },
  ],
};

export const skills: Record<string, string[]> = {
  Frontend: [
    "Angular 2–19",
    "RxJS",
    "NgRx",
    "React",
    "Next.js",
    "Vue 2/3",
    "Nuxt",
    "TypeScript",
    "JavaScript",
    "Ionic",
    "Tailwind CSS",
    "Bootstrap",
    "HTML5",
    "CSS3",
    "Sass",
  ],
  Backend: [
    "C# / .NET 8 y 10",
    "Node.js",
    "Express",
    "Java",
    "APIs REST",
    "Entity Framework Core",
    "JWT · OAuth2 · OpenID Connect",
    "OWASP Top 10",
    "Microservicios",
    "DDD",
    "Arquitectura limpia",
  ],
  Datos: [
    "SQL Server",
    "MySQL",
    "PL/SQL",
    "MongoDB",
    "DynamoDB",
    "PostgreSQL + pgvector",
  ],
  "Cloud y DevOps": [
    "Azure App Services",
    "Azure Functions",
    "Azure DevOps",
    "GitHub Actions",
    "CI/CD",
    "AWS",
    "Docker",
    "SonarQube",
    "GitFlow",
  ],
  "IA generativa": [
    "Agentes de IA",
    "MCP",
    "Graphify",
    "LangChain",
    "LangGraph",
    "RAG",
    "Pinecone",
    "pgvector",
    "A2A",
  ],
  Calidad: [
    "Code review",
    "xUnit · NUnit · Moq",
    "Pruebas de integración y E2E",
    "Postman",
    "SOLID",
    "Clean Code",
    "Metodologías ágiles",
  ],
};

export const experience: {
  note: string;
  initialVisible: number;
  jobs: Job[];
} = {
  note: "En algunos periodos (2015–2016 y 2019–2021) combiné contratos a término fijo y proyectos como freelancer, por eso algunas fechas se cruzan.",
  initialVisible: 4,
  jobs: [
    {
      role: "Desarrollador Senior",
      company: "APERCE S.A.S · cliente corporativo global",
      period: "May 2026 – Actualidad · Remoto",
      tags: ["Angular", ".NET 8/10", "Azure", "Agentes de IA", "MCP"],
      bullets: [
        "Desarrollo full stack con Angular y .NET 8 / .NET 10; levanto requerimientos y defino la solución técnica.",
        "Reviso código del equipo mediante pull requests en GitHub y despliego aplicaciones en Azure.",
        "Analizo trazas, doy soporte a producción, planeo cronogramas y documento la arquitectura.",
        "Diseño y construyo agentes de IA que agilizan la creación e implementación de requerimientos, conectados a Graphify para consumir menos tokens.",
        "Capacité a unos 58 desarrolladores. En la demostración, un requerimiento de cerca de una semana se resolvió en un día; al escalarlo solo surgieron unos 3 ajustes de diseño no contemplados.",
      ],
    },
    {
      role: "Desarrollador Full Stack",
      company: "BTW SAS",
      period: "Sep. 2025 – Feb. 2026",
      tags: ["C# / .NET", "Angular 19", "Ionic"],
      bullets: [
        "Aplicaciones web y móviles con C# y .NET, y Angular 19 con Ionic en el frontend.",
        "APIs REST seguras bajo principios de arquitectura limpia y optimización de consultas SQL.",
        "Mantenimiento evolutivo y correctivo en equipos con metodologías ágiles.",
      ],
    },
    {
      role: "Desarrollador Full Stack",
      company: "UX Technology",
      period: "Ene. 2025 – Sep. 2025",
      tags: ["Vue 3", "Nuxt", "Node.js", "LangChain"],
      bullets: [
        "Lideré la migración completa del frontend de Vue 2 a Vue 3 y trabajé con Nuxt.js (SSR).",
        "Diseñé microservicios en Node.js con AWS DynamoDB para alta disponibilidad.",
        "Prototipo de asistente de IA con LangChain; evalué Pinecone y pgvector para búsqueda semántica.",
      ],
    },
    {
      role: "Desarrollador Full Stack",
      company: "Vortex Bridge S.A.S",
      period: "Ago. 2024 – Ene. 2025",
      tags: ["Angular 17/18", "Java", "PL/SQL"],
      bullets: [
        "Lideré la arquitectura y el desarrollo de aplicaciones SPA con Angular 17 y 18 y Vue.js.",
        "Diseñé microservicios con Java, Express.js y Next.js; optimicé consultas en PL/SQL y pipelines en MongoDB.",
      ],
    },
    {
      role: "Desarrollador Full Stack",
      company: "Tuatara",
      period: "Nov. 2023 – Sep. 2024",
      tags: ["Angular 16/18", "Next.js", "WordPress"],
      bullets: [
        "Arquitectura y desarrollo de SPA con Angular 16 y 18 y Vue.js.",
        "Backend con Next.js y Express.js, y temas de WordPress a medida.",
      ],
    },
    {
      role: "Desarrollador Full Stack",
      company: "Imagemaker",
      period: "Oct. 2021 – Feb. 2024",
      tags: ["Angular 15/16", "Micro-frontends", "Next.js"],
      bullets: [
        "Lideré el frontend de una aplicación móvil de inversiones para el Banco Santander de Chile.",
        "Implementé micro-frontends con Next.js para que equipos paralelos desplegaran de forma independiente.",
        "Colaboré en el despliegue en tiendas de aplicaciones bajo estándares de seguridad bancaria.",
      ],
    },
    {
      role: "Desarrollador Web Senior",
      company: "Xpectrum",
      period: "Feb. 2020 – Jul. 2021",
      tags: ["Angular 12", "React", "Vue"],
      bullets: [
        "Frontend con componentes reutilizables y arquitecturas modulares orientadas a la escalabilidad.",
      ],
    },
    {
      role: "Desarrollador Full Stack",
      company: "Grupo FG",
      period: "Jun. 2019 – Sep. 2021",
      tags: ["Angular 12", "Vue", "Node.js", "MongoDB"],
      bullets: [
        "Aplicaciones con Angular 12 y Vue.js, y APIs con Node.js; pipelines de agregación que mejoraron los tiempos de consulta.",
        "Plataforma Plan Elige para Suramericana: cotizar, comparar y seleccionar planes.",
        "Aplicación de toma de muestras químicas y plataformas para procesos de licitaciones en Colombia.",
      ],
    },
    {
      role: "Desarrollador Full Stack",
      company: "SMDigital",
      period: "Feb. 2019 – May 2020",
      tags: ["Angular", "React", "Vue", "WordPress"],
      bullets: [
        "Frontend y APIs en Node.js para clientes corporativos como Grupo Nutresa y Suramericana.",
      ],
    },
    {
      role: "Desarrollador Full Stack",
      company: "Strategee",
      period: "Dic. 2016 – Ene. 2019",
      tags: ["Angular 10", "C#", "CakePHP"],
      bullets: [
        "Aplicaciones web y móviles híbridas, y funcionalidades en C# para el ecosistema interno.",
        "Cotizador digital para Cementos Argos: arquitectura, lógica de negocio y visualización.",
      ],
    },
    {
      role: "Experiencia anterior",
      company: "Kubbox · BKEmpresarial · Exnova · Tensión Creativa",
      period: "2014 – 2016",
      tags: ["Angular", "Vue", "React", "Node.js"],
      bullets: [
        "Desarrollo full stack y web con Angular 2 a 6, Vue.js, React, Node.js, MongoDB, WordPress y Joomla.",
      ],
    },
  ],
};

export const education: EducationItem[] = [
  {
    title: "Tecnólogo en Análisis y Desarrollo de Sistemas de Información",
    org: "SENA",
    year: "2024",
  },
  {
    title: "Bachiller Académico, énfasis en Medio Ambiente",
    org: "CEVIDA",
    year: "2009",
  },
  {
    title: "Idiomas",
    org: "Español nativo · Inglés B1",
    year: "",
  },
];

export const courses: Course[] = [
  { title: "Metodologías Ágiles", org: "Universidad Católica de Oriente", year: "2025" },
  { title: "Principios SOLID y Clean Code", org: "Dev/Talles", year: "2026" },
  { title: "Introducción al Desarrollo de Back-End", org: "Meta", year: "2025" },
  { title: "Universidad Java: de cero a experto", org: "Udemy", year: "2024" },
  {
    title: "React: de cero a experto",
    org: "Udemy",
    year: "2023",
    href: "https://www.udemy.com/certificate/UC-4d0545ba-bfc0-456e-8f51-42064be62193/",
  },
  {
    title: "Angular Avanzado",
    org: "Udemy",
    year: "2023",
    href: "https://www.udemy.com/certificate/UC-85e91ac3-2a4e-4db0-b26c-25d0d98b99c5/",
  },
  {
    title: "Legacy Node: de cero a experto",
    org: "Udemy",
    year: "2019",
    href: "https://www.udemy.com/certificate/UC-YURSS5S0/",
  },
  {
    title: "SQL, curso completo (SQL Server)",
    org: "Udemy",
    year: "",
    href: "https://www.udemy.com/certificate/UC-SA0OCXIM/",
  },
];

export const contact = {
  email: "tavoxpau@gmail.com",
  phone: "+57 313 397 69 99",
  phoneHref: "tel:+573133976999",
  whatsapp: "https://wa.me/573133976999",
  linkedin: "https://www.linkedin.com/in/gustavo-adolfo-mu%C3%B1oz-reyes-a277b587/",
  github: "https://github.com/gatroxm",
};

export const resumeHref = "Hoja_de_Vida_Gustavo_Munoz_GatroxM.pdf";
