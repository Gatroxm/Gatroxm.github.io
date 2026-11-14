# GatroxM.dev — Portafolio de Gustavo Adolfo Muñoz Reyes

Sitio estático de una sola página con HTML, CSS y JavaScript (módulos ES). No
necesita build, dependencias ni backend. Se publica con GitHub Pages desde
`docs/`, igual que la versión anterior, así que no hay que cambiar la
configuración del repositorio.

## Estructura

```
docs/index.html                  Estructura, SEO, hero y secciones
docs/css/styles.css              Sistema de diseño, temas y responsive
docs/js/main.js                  Render del contenido e interacciones
docs/data/content.js             Todo el contenido editable
docs/assets/favicon.svg          Favicon
docs/assets/og-image.png         Imagen para Open Graph
docs/Hoja_de_Vida_...pdf         Hoja de vida descargable
docs/.nojekyll                   Evita el procesamiento de Jekyll
prototype/index.html             Prototipo original de referencia
```

El proyecto Angular anterior sigue intacto en la raíz del repositorio y en la
rama `legacy-angular`.

## Editar el contenido

- **Datos y textos de secciones:** `docs/data/content.js` (perfil, cifras, sobre
  mí, habilidades, experiencia, formación y contacto).
- **Hero, títulos de sección y metadatos:** `docs/index.html`.
- **Colores, tipografía y espaciados:** variables y reglas en
  `docs/css/styles.css`.

Después de editar, recarga el navegador; no hay compilación.

## Probar en local

Los módulos ES no funcionan abriendo el archivo con `file://`. Usa un servidor
estático apuntando a `docs/`:

```bash
npx serve docs
# o
python -m http.server 8080 --directory docs
```

Luego abre `http://localhost:3000` o `http://localhost:8080`.

## Publicar en GitHub Pages

No hay que tocar la configuración de Pages: el sitio vive en `docs/`, que es la
carpeta que el repositorio ya publica.

1. Integra los cambios de `portfolio-v2` en `main` y haz push.
2. GitHub Pages publica `main /docs` automáticamente.

El archivo `docs/.nojekyll` evita que Jekyll procese el sitio.

## Ramas

- `portfolio-v2`: sitio estático actual, dentro de `docs/`.
- `legacy-angular`: versión anterior del portafolio en Angular 22, conservada
  como referencia.

## Accesibilidad y rendimiento

- HTML semántico, un solo `h1`, jerarquía de encabezados y enlaces de salto.
- Acordeones con `aria-expanded` y `aria-controls`, navegación completa por
  teclado y foco visible.
- Tema claro/oscuro con `prefers-color-scheme`; si `localStorage` falla, la
  página sigue funcionando.
- Animaciones desactivadas con `prefers-reduced-motion`.
- Sin fuentes, scripts ni imágenes externas.
