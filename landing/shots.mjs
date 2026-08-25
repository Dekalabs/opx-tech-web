#!/usr/bin/env node
/**
 * Capturas deterministas de evidencia (npm run shots).
 * Web completa a 390/768/1280/1440/2000/2560 de ancho y cada diapositiva
 * de la presentación a 1280x720 y 1920x1080. Salida: ../captures/web/
 * (ignorada por Git). Contexto reduced-motion para eliminar azar visual.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "captures", "web");
mkdirSync(OUT, { recursive: true });
const URL_BASE = pathToFileURL(join(here, "index.html")).href;

const browser = await chromium.launch();

/* página completa por ancho */
const widths = [[390, 844], [768, 1024], [1280, 800], [1440, 900], [2000, 1100], [2560, 1300]];
for (const [w, h] of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(220);
  const file = join(OUT, `web-${w}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`shots: ${file}`);
  await ctx.close();
}

/* presentación por diapositiva y tamaño */
for (const [w, h] of [[1280, 720], [1920, 1080]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${URL_BASE}?mode=present`, { waitUntil: "load" });
  await page.waitForSelector("body.presenting", { state: "attached", timeout: 4000 });
  const total = await page.evaluate(() => window.OPX.presentApi.count);
  await page.evaluate(() => window.OPX.presentApi.goto(0));
  for (let i = 0; i < total; i++) {
    await page.waitForTimeout(120);
    const file = join(OUT, `present-${w}x${h}-${String(i + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: file });
    console.log(`shots: ${file}`);
    if (i < total - 1) await page.keyboard.press("ArrowRight");
  }
  await ctx.close();
}

await browser.close();
console.log("shots: matriz completa.");
