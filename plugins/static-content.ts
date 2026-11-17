import type { Plugin } from "vite";
import { build } from "esbuild";

/**
 * El modo clásico se genera en tiempo de build desde `src/data/content.ts`.
 * Así el contenido real queda en el HTML servido (SEO, ATS y lectores de
 * pantalla) sin duplicar los textos en el marcado.
 */
export function injectClassicContent(): Plugin {
  return {
    name: "inject-classic-content",
    async transformIndexHtml(html) {
      const result = await build({
        entryPoints: ["src/ui/static-classic.ts"],
        bundle: true,
        platform: "node",
        format: "esm",
        target: "node20",
        write: false,
        logLevel: "silent",
      });

      const output = result.outputFiles?.[0];
      if (!output) throw new Error("No se pudo generar el HTML del modo clásico");

      const moduleUrl = `data:text/javascript;base64,${Buffer.from(output.text).toString("base64")}`;
      const module = (await import(moduleUrl)) as {
        renderClassic: () => string;
      };

      return html.replace("<!-- CLASSIC_CONTENT -->", module.renderClassic());
    },
  };
}
