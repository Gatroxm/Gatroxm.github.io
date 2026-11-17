# GatroxM.dev — Portafolio 3D

Portafolio interactivo de Gustavo Adolfo Muñoz Reyes. El visitante puede explorar
un mundo 3D con siete zonas o leer la hoja de vida clásica, sin jugar ni esperar.
Sitio 100 % estático: Vite + TypeScript + Three.js, sin backend ni recursos
externos.

## Requisitos

Node.js 20 o superior.

## Desarrollo

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173/`).
Añade `#world` a la URL para entrar directamente en la experiencia 3D.

## Producción

```bash
npm run build          # genera dist/
npm run preview        # sirve dist/ en local
npm run sync:docs      # copia dist/ a docs/ (Pages rama actual)
```

## Editar el contenido

Todo el contenido está en **`src/data/content.ts`**:

- `profile`: nombre, roles, ubicación y frase del hero.
- `stats`, `about`, `skills`, `experience`, `education`, `courses`, `contact`.
- `resumeHref`: ruta del PDF descargable.

Los textos se inyectan en el HTML durante el build
(`plugins/static-content.ts`), de modo que el modo clásico existe en el DOM
servido y es legible para SEO, ATS y lectores de pantalla. Los paneles de las
zonas 3D usan los mismos datos (`src/ui/fragments.ts` y `src/ui/panels.ts`).

## Controles

| Acción | Teclado | Gamepad | Táctil |
| --- | --- | --- | --- |
| Moverse | WASD / flechas | Stick izquierdo | Joystick |
| Acelerar | Shift | RB / RT | — |
| Saltar | Espacio | X | Botón «Saltar» |
| Interactuar | Enter | A | Botón «Abrir» |
| Reaparecer | R | B | Botón «Atascado» |
| Mapa | M | Y | Fase 2 |

## Publicación en GitHub Pages

Hay dos mecanismos compatibles:

1. **Workflow (recomendado):** `.github/workflows/deploy.yml` construye `dist/`
   y lo despliega en cada push a `main`. Requiere que en
   **Settings → Pages → Source** esté seleccionado **GitHub Actions**.
2. **Rama actual:** mientras Pages apunte a `main /docs`, ejecuta
   `npm run sync:docs` antes de subir para publicar el mismo build en `docs/`.

El archivo `public/404.html` y `docs/.nojekyll` se incluyen en el build.
La URL pública es `https://gatroxm.github.io/`.

## Ramas

- `portfolio-3d`: este proyecto.
- `portfolio-v2`: portafolio estático anterior (sin 3D).
- `legacy-angular`: portafolio original en Angular 22.

## Paleta y accesibilidad

Solo se usan Midnight Navy `#0F172A`, Electric Blue `#2563EB`, Slate Dark
`#1E293B`, Cloud Gray `#F1F5F9`, Pure White `#FFFFFF` y Slate Gray `#64748B`.
El modo clásico es accesible por teclado, con foco visible y contraste AA.
Si no hay WebGL, el dispositivo es limitado o falla la carga, se muestra el
modo clásico automáticamente. Se respeta `prefers-reduced-motion`.

## Créditos

La geometría es procedural y original; no se usan modelos, texturas, fuentes,
música ni imágenes de terceros. Consulta `CREDITS.md` para licencias.
