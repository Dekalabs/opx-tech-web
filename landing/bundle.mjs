#!/usr/bin/env node
/** Bundle local con esbuild: js/main.js → assets/vendor/site.js (IIFE). */
import { build } from "esbuild";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, "assets", "vendor"), { recursive: true });

await build({
  entryPoints: [join(here, "js", "main.js")],
  outfile: join(here, "assets", "vendor", "site.js"),
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  sourcemap: false,
  logLevel: "info",
});
