# GatroxM.dev — carta de presentación

Sitio estático de una sola página con la carta de presentación de Gustavo Adolfo
Muñoz Reyes. El portafolio completo vive en <https://gatroxm-dev.onrender.com/>.

**Todo el sitio publicable está en `docs/`.** No hay copia en la raíz, ni paso de
compilación, ni scripts de sincronización.

## Ver en local

Elige una opción:

```bash
python -m http.server 4173 --directory docs
# o
npx serve docs -l 4173
```

Abre <http://localhost:4173>.

## Editar el contenido

| Archivo | Qué contiene |
| --- | --- |
| `docs/index.html` | Texto de la carta, metadatos, Open Graph, JSON-LD y botones. |
| `docs/styles.css` | Paleta, cuadrícula, tarjeta, tipografía y animaciones CSS. |
| `docs/app.js` | URL del portafolio, correo y botón «Copiar». |
| `docs/404.html` | Página de error con enlaces a la carta y al portafolio. |
| `docs/favicon.svg` | Icono SVG. |
| `docs/og-image.png` | Imagen social de 1200 × 630 px. |
| `docs/Hoja_de_Vida_Gustavo_Munoz_GatroxM.pdf` | Hoja de vida descargable. |
| `docs/robots.txt` / `docs/sitemap.xml` | SEO. |

### URLs y correo

La URL del portafolio y el correo están **una sola vez**, como constantes al
inicio de `docs/app.js`:

```js
const PORTFOLIO_URL = "https://gatroxm-dev.onrender.com/";
const EMAIL = "tavoxpau@gmail.com";
```

Los botones y enlaces se llenan desde ahí. No hay redirección automática: el
botón principal abre el portafolio en la misma pestaña solo al pulsarlo.

### Hoja de vida

Para actualizar el PDF, reemplaza
`docs/Hoja_de_Vida_Gustavo_Munoz_GatroxM.pdf`. El botón usa el atributo
`download` y apunta a ese archivo.

### Imagen Open Graph

`docs/og-image.png` se generó una sola vez con `sharp` como dependencia de
desarrollo. Publicar el sitio **no requiere npm**. Para regenerarla, instala las
herramientas de desarrollo y rasteriza un SVG de 1200 × 630 con la misma paleta:

```bash
npm install
node -e "require('sharp')('OG.svg').png().toFile('docs/og-image.png')"
```

## Diseño y accesibilidad

Se usan solo los colores de marca: `#0F172A`, `#2563EB`, `#1E293B`, `#F1F5F9`,
`#FFFFFF` y `#64748B`. La tipografía es del sistema; no hay imágenes externas,
CDNs, analíticas, cookies ni almacenamiento. Se respeta
`prefers-reduced-motion`.

## Publicación

La fuente activa de GitHub Pages la define el propietario en Settings → Pages:

- Si es **`main /docs`**, basta con subir `main` con `docs/` actualizado. El
  workflow `deploy.yml` debe eliminarse en ese caso.
- Si es **GitHub Actions**, conservar `.github/workflows/deploy.yml` y cambiar
  el paso de subida para publicar `docs/` sin compilar.

Mientras tanto, el workflow no se modifica. La URL pública es
<https://gatroxm.github.io/>.

## Ramas

- `archive-3d`: versión 3D completa, con Three.js, chatbot y mascota.
- `cover-letter`: carta estática actual.
- `main`: rama de publicación; no se fusiona sin aprobación.
