#!/usr/bin/env node
/**
 * Genera el arte local del paquete con Chromium (Playwright), sin servicios
 * externos: favicon-32.png, apple-touch-icon.png y assets/og/og-image.png.
 * Determinista: mismas fuentes locales, mismo viewport, escala 1.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, "assets", "og"), { recursive: true });

const browser = await chromium.launch();

/* ── favicons desde assets/favicon.svg ─────────────────────────────── */
for (const [size, out] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(here, "assets", "favicon.svg")).href);
  await page.screenshot({ path: join(here, "assets", out) });
  await page.close();
  console.log(`gen-assets: assets/${out} (${size}x${size})`);
}

/* ── imagen OG 1200x630 ────────────────────────────────────────────── */
const fontDir = pathToFileURL(join(here, "assets", "fonts")).href;
const og = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
  @font-face { font-family: "Outfit"; src: url("${fontDir}/outfit-var-latin.woff2") format("woff2"); font-weight: 100 900; }
  @font-face { font-family: "DM Sans"; src: url("${fontDir}/dm-sans-var-latin.woff2") format("woff2"); font-weight: 100 1000; }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: #0d0f11; color: #f4f6f8; font-family: "DM Sans", sans-serif;
    display: flex; flex-direction: column; justify-content: center; padding: 0 90px;
  }
  body::before { content: ""; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
    background-size: 54px 54px;
    -webkit-mask-image: radial-gradient(ellipse 75% 70% at 38% 35%, black, transparent 80%); }
  .glow { position: absolute; width: 720px; height: 720px; right: -220px; top: -260px; border-radius: 50%;
    background: radial-gradient(circle, rgba(125,127,242,.22), transparent 65%); filter: blur(18px); }
  .ring { position: absolute; right: -130px; top: 50%; transform: translateY(-50%); opacity: .85; }
  .kicker { position: relative; color: #a7a9ff; font-weight: 700; font-size: 21px; letter-spacing: .18em; margin-bottom: 26px; }
  h1 { position: relative; font-family: "Outfit", sans-serif; font-weight: 750; font-size: 88px; line-height: 1.04; letter-spacing: -0.02em; max-width: 860px; }
  h1 em { font-style: normal; background: linear-gradient(100deg, #a7a9ff, #8fb7f2 55%, #37d3c4); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .sub { position: relative; margin-top: 30px; color: #aab3bd; font-size: 27px; max-width: 780px; line-height: 1.45; }
  .row { position: relative; display: flex; gap: 34px; margin-top: 46px; font-family: "Outfit", sans-serif; font-weight: 600; font-size: 22px; }
  .row span { display: inline-flex; align-items: center; gap: 10px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
  .url { position: absolute; right: 90px; bottom: 48px; color: #77828d; font-size: 22px; font-family: "Outfit", sans-serif; font-weight: 600; }
</style></head><body>
  <span class="glow"></span>
  <svg class="ring" width="560" height="560" viewBox="0 0 64 64" fill="none">
    <g stroke-width="1.6" stroke-linecap="round">
      <circle cx="32" cy="32" r="20" stroke="#37d3c4" stroke-dasharray="25.1 100.5" transform="rotate(-82 32 32)"/>
      <circle cx="32" cy="32" r="20" stroke="#a7a9ff" stroke-dasharray="25.1 100.5" transform="rotate(8 32 32)"/>
      <circle cx="32" cy="32" r="20" stroke="#f0a63f" stroke-dasharray="25.1 100.5" transform="rotate(98 32 32)"/>
      <circle cx="32" cy="32" r="20" stroke="#5cd58c" stroke-dasharray="25.1 100.5" transform="rotate(188 32 32)"/>
    </g>
  </svg>
  <p class="kicker">OPX — OPTIMA X</p>
  <h1>La complejidad no se elimina. <em>Se gobierna.</em></h1>
  <p class="sub">Una suite operativa para organizaciones que no pueden permitirse el caos.</p>
  <div class="row">
    <span><i class="dot" style="background:#37d3c4"></i>Venue</span>
    <span><i class="dot" style="background:#a7a9ff"></i>Flow</span>
    <span><i class="dot" style="background:#f0a63f"></i>Response</span>
    <span><i class="dot" style="background:#5cd58c"></i>Insight</span>
  </div>
  <p class="url">opx.tech</p>
</body></html>`;

/* setContent crea un origen null que bloquea fuentes file://; se navega a un
   fichero temporal para que las fuentes locales carguen de verdad */
const tmp = join(here, "og-tmp.html");
writeFileSync(tmp, og);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const fams = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
if (!fams.includes("Outfit") || !fams.includes("DM Sans")) {
  await browser.close();
  unlinkSync(tmp);
  throw new Error(`Las fuentes de marca no cargaron en la imagen OG: ${fams.join(", ") || "ninguna"}`);
}
await page.screenshot({ path: join(here, "assets", "og", "og-image.png") });
await page.close();
unlinkSync(tmp);
console.log("gen-assets: assets/og/og-image.png (1200x630)");

await browser.close();
