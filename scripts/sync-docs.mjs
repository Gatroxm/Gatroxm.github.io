import fs from "node:fs";
import path from "node:path";

/**
 * Copia el build a `docs/` para que GitHub Pages siga funcionando con la
 * configuración actual (main /docs) mientras se migra a GitHub Actions.
 */
const root = process.cwd();
const from = path.join(root, "dist");
const to = path.join(root, "docs");

if (!fs.existsSync(from)) {
  console.error("No existe dist/. Ejecuta npm run build primero.");
  process.exit(1);
}

fs.rmSync(to, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });
fs.cpSync(from, to, { recursive: true });
fs.writeFileSync(path.join(to, ".nojekyll"), "");
console.log(`Build copiado a ${to}`);
