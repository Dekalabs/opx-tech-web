#!/usr/bin/env node
/**
 * Auditoría de aceptación de la landing OPX (npm run check).
 * Bloquea (exit 1) ante: errores de página/consola, cualquier petición
 * externa, SEO incompleto, palabras sin tilde, enlaces muertos o fuera del
 * inventario, imágenes sin alt, desbordamiento horizontal, contenido oculto
 * con reduced-motion o sin JavaScript, fallos de foco/encaje en presentación,
 * transiciones inválidas del caso guiado, más de dos familias tipográficas o
 * fuentes remotas, y deriva de las regiones generadas o del presupuesto.
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const INDEX = join(here, "index.html");
const URL_BASE = pathToFileURL(INDEX).href;
const canonical = JSON.parse(readFileSync(join(here, "..", "data", "opx-suite-case.json"), "utf8"));

const results = [];
const add = (name, pass, info = "") => {
  results.push({ name, pass, info });
  console.log(`${pass ? "  ✓" : "  ✗"} ${name}${info ? ` — ${info}` : ""}`);
};

/* palabras es-ES sin tilde que bloquean (singular; los plurales en -ciones son correctos) */
const STRIPPED = [
  "mas", "informacion", "gestion", "decision", "auditoria", "coordinacion",
  "comunicacion", "analisis", "terminos", "tecnologia", "operacion",
  "saturacion", "senalizacion", "organizacion", "situacion", "evaluacion",
  "proximamente", "ultimo", "ultima", "numero",
];
const strippedRe = new RegExp(`(^|[^a-záéíóúüñ])(${STRIPPED.join("|")})($|[^a-záéíóúüñ])`, "i");

const browser = await chromium.launch();

/* ════ deterministas previas (sin navegador) ═════════════════════════ */
console.log("\n■ Datos y regiones generadas");
try {
  execFileSync("node", [join(here, "..", "data", "validate.mjs")], { stdio: "pipe" });
  add("validate.mjs del JSON canónico", true);
} catch (e) {
  add("validate.mjs del JSON canónico", false, String(e.stdout || e.message).slice(0, 200));
}
try {
  execFileSync("node", [join(here, "sync-data.mjs"), "--check"], { stdio: "pipe" });
  add("sync-data --check (sin deriva de regiones)", true);
} catch (e) {
  add("sync-data --check (sin deriva de regiones)", false, String(e.stderr || e.message).slice(0, 200));
}

/* presupuesto de primera carga */
{
  const files = [
    "index.html", "styles.css", "assets/vendor/site.js", "assets/favicon.svg",
    "assets/fonts/outfit-var-latin.woff2", "assets/fonts/dm-sans-var-latin.woff2",
  ];
  let total = 0;
  const missing = files.filter((f) => !existsSync(join(here, f)));
  for (const f of files) if (existsSync(join(here, f))) total += statSync(join(here, f)).size;
  const kb = Math.round(total / 1024);
  add("presupuesto de primera carga ≤ 1.5 MB", !missing.length && total <= 1.5 * 1024 * 1024,
    missing.length ? `faltan: ${missing.join(", ")}` : `${kb} KB`);
}
for (const f of ["robots.txt", "sitemap.xml", "assets/og/og-image.png", "assets/favicon-32.png", "assets/apple-touch-icon.png"]) {
  add(`existe ${f}`, existsSync(join(here, f)));
}
add("sitemap apunta al canónico", readFileSync(join(here, "sitemap.xml"), "utf8").includes("https://opx.tech/"));

/* ════ contexto A · normal (errores, SEO, enlaces, fuentes, caso) ════ */
console.log("\n■ Página (contexto normal, 1440x900)");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const external = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  await page.route("**/*", (route) => {
    const u = route.request().url();
    if (u.startsWith("file://") || u.startsWith("data:") || u.startsWith("blob:")) return route.continue();
    external.push(u);
    return route.abort();
  });
  await page.goto(URL_BASE, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  add("sin errores de página", pageErrors.length === 0, pageErrors.slice(0, 2).join(" | "));
  add("sin errores de consola", consoleErrors.length === 0, consoleErrors.slice(0, 2).join(" | "));
  add("cero peticiones externas", external.length === 0, external.slice(0, 3).join(", "));

  /* SEO e i18n */
  const head = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content ?? "",
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    ogTitle: document.querySelector('meta[property="og:title"]')?.content ?? "",
    ogDesc: document.querySelector('meta[property="og:description"]')?.content ?? "",
    ogImage: document.querySelector('meta[property="og:image"]')?.content ?? "",
    ogUrl: document.querySelector('meta[property="og:url"]')?.content ?? "",
    twitter: document.querySelector('meta[name="twitter:card"]')?.content ?? "",
    themeColor: document.querySelector('meta[name="theme-color"]')?.content ?? "",
    iconSvg: !!document.querySelector('link[rel="icon"][type="image/svg+xml"]'),
    iconPng: !!document.querySelector('link[rel="alternate icon"]'),
    appleIcon: !!document.querySelector('link[rel="apple-touch-icon"]'),
  }));
  add('lang="es"', head.lang === "es", head.lang);
  add("title único y ≤ 60 caracteres", head.title.length > 0 && head.title.length <= 60, `${head.title.length} chars`);
  add("meta description 50–160", head.desc.length >= 50 && head.desc.length <= 160, `${head.desc.length} chars`);
  add("canonical correcto", head.canonical === "https://opx.tech/", head.canonical);
  add("Open Graph completo", !!(head.ogTitle && head.ogDesc && head.ogImage && head.ogUrl));
  add("twitter:card", head.twitter === "summary_large_image", head.twitter);
  add("theme-color y favicons declarados", !!(head.themeColor && head.iconSvg && head.iconPng && head.appleIcon));

  /* estructura semántica */
  const semantics = await page.evaluate(() => {
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1]));
    let jumps = 0;
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) jumps++;
    const imgsSinAlt = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length;
    const svgsImg = [...document.querySelectorAll('svg[role="img"]')];
    const svgSinNombre = svgsImg.filter((s) => !s.getAttribute("aria-label") && !s.querySelector("title")).length;
    const controlesSinLabel = [...document.querySelectorAll("input, textarea, select")].filter((el) => {
      const id = el.getAttribute("id");
      return !(id && document.querySelector(`label[for="${id}"]`)) && !el.getAttribute("aria-label");
    }).length;
    return { h1: document.querySelectorAll("h1").length, jumps, imgsSinAlt, svgSinNombre, controlesSinLabel };
  });
  add("exactamente un h1", semantics.h1 === 1, `h1=${semantics.h1}`);
  add("jerarquía de encabezados sin saltos", semantics.jumps === 0, `saltos=${semantics.jumps}`);
  add("imágenes con alt y svg informativos con nombre", semantics.imgsSinAlt === 0 && semantics.svgSinNombre === 0);
  add("controles de formulario etiquetados", semantics.controlesSinLabel === 0);

  /* ortografía es-ES en texto visible y metadatos */
  const visibleText = await page.evaluate(() => document.body.innerText);
  const textPool = `${visibleText}\n${head.title}\n${head.desc}\n${head.ogTitle}\n${head.ogDesc}`;
  const badWord = textPool.match(strippedRe);
  add("sin palabras es-ES despojadas de tilde", !badWord, badWord ? `«${badWord[2]}»` : "");

  /* enlaces */
  const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => {
    const raw = (v) => (v && typeof v === "object" && "baseVal" in v ? v.baseVal : v ?? "");
    return {
      href: a.getAttribute("href"),
      abs: new URL(raw(a.href), location.href).href,
      text: a.textContent.trim().slice(0, 40),
      target: raw(a.target),
      rel: String(a.rel ?? ""),
    };
  }));
  const approved = new Set(canonical.links.approved_hosts);
  const badLinks = [];
  for (const l of links) {
    if (!l.href || l.href === "#") { badLinks.push(`vacío: ${l.text}`); continue; }
    if (l.href.startsWith("#")) {
      const ok = await page.evaluate((id) => !!document.getElementById(id), l.href.slice(1));
      if (!ok) badLinks.push(`ancla rota ${l.href}`);
    } else if (l.href.startsWith("mailto:")) {
      badLinks.push("mailto presente sin email canónico");
    } else if (/^https?:/.test(l.href)) {
      const host = new URL(l.abs).hostname;
      if (!approved.has(host)) badLinks.push(`host fuera de inventario: ${host}`);
      if (!/^https:/.test(l.abs)) badLinks.push(`enlace no https: ${l.abs}`);
      if (l.target === "_blank" && !/noopener/.test(l.rel)) badLinks.push(`_blank sin noopener: ${host}`);
    } else {
      badLinks.push(`esquema no permitido: ${l.href}`);
    }
  }
  const html = await page.content();
  if (/opx\.com/i.test(html)) badLinks.push("aparece el dominio prohibido opx.com");
  add("enlaces válidos y dentro del inventario", badLinks.length === 0, badLinks.slice(0, 3).join(" | "));
  const liveLinks = links.filter((l) => /^https:/.test(l.abs));
  add("Venue y Flow enlazados desde la página", ["venue.opx.tech", "flow.opx.tech"].every(
    (h) => liveLinks.some((l) => new URL(l.abs).hostname === h)));

  /* tipografías */
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    const fams = new Set([...document.fonts].map((f) => f.family.replace(/^"|"$/g, "")));
    return { fams: [...fams], loaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/^"|"$/g, "")) };
  });
  const allowedFams = new Set(["Outfit", "DM Sans"]);
  add("máximo dos familias tipográficas locales", fonts.fams.every((f) => allowedFams.has(f)) && fonts.fams.length <= 2, fonts.fams.join(", "));
  add("Outfit y DM Sans cargadas", ["Outfit", "DM Sans"].every((f) => fonts.loaded.includes(f)));

  /* datos embebidos coherentes con el canónico */
  const runtime = await page.evaluate(() => JSON.parse(document.getElementById("opx-data").textContent));
  const sameCase = JSON.stringify(runtime.case) === JSON.stringify(canonical.case);
  const sameProducts = canonical.products.every((p) => {
    const r = runtime.products.find((x) => x.id === p.id);
    return r && r.name === p.name && r.url === p.url && r.status === p.status;
  });
  add("payload embebido = JSON canónico (caso y productos)", sameCase && sameProducts);
  add("sin NEEDS_INPUT en la página servida", !html.includes("NEEDS_INPUT"));

  /* degradados background-clip:text intactos con la animación activa:
     un transform en un descendiente lo promueve a otra capa y el texto
     dejaría de pintarse (titular invisible aunque opacity sea 1) */
  await page.waitForTimeout(1800);
  const clipText = await page.evaluate(() => {
    const clipped = [...document.querySelectorAll("*")].filter((el) => {
      const cs = getComputedStyle(el);
      return (cs.webkitBackgroundClip === "text" || cs.backgroundClip === "text");
    });
    const broken = [];
    for (const el of clipped) {
      if (!el.textContent.trim()) { broken.push(`${el.tagName} sin texto`); continue; }
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) { broken.push(`${el.tagName} con caja vacía`); continue; }
      for (const d of el.querySelectorAll("*")) {
        const cs = getComputedStyle(d);
        if (cs.transform !== "none" || cs.willChange.includes("transform") || cs.filter !== "none") {
          broken.push(`${el.tagName} > ${d.tagName} con ${cs.transform !== "none" ? "transform" : cs.filter !== "none" ? "filter" : "will-change"}`);
        }
      }
    }
    return { count: clipped.length, broken };
  });
  add("degradados de texto sin capas que los anulen (post-animación)",
    clipText.count > 0 && clipText.broken.length === 0,
    clipText.broken.slice(0, 2).join(" | ") || `${clipText.count} elementos`);

  /* el titular sigue pintando texto real tras la animación */
  const heroPaint = await page.evaluate(() => {
    const h1 = document.querySelector(".hero h1");
    const em = h1?.querySelector("em");
    if (!em) return { ok: false, why: "sin <em> en el titular" };
    const r = em.getBoundingClientRect();
    /* el punto medio del primer glifo debe pertenecer al <em> o a su texto */
    const hit = document.elementFromPoint(r.left + 8, r.top + r.height / 2);
    return {
      ok: em.textContent.trim().length > 0 && r.width > 40 && r.height > 10 && (em === hit || em.contains(hit)),
      why: `caja ${Math.round(r.width)}x${Math.round(r.height)}, hit ${hit?.tagName ?? "null"}`,
    };
  });
  add("titular con degradado presente tras la animación", heroPaint.ok, heroPaint.why);

  /* flags */
  const flags = await page.evaluate(() => window.OPX?.flags);
  add("flags de trabajo incompleto en false", flags && flags.SUITE_SCENE_3D_ENABLED === false && flags.CONTACT_FORM_ENABLED === false,
    JSON.stringify(flags));
  const formDisabled = await page.evaluate(() => !!document.querySelector(".contact-form fieldset[disabled]"));
  add("formulario completo pero desactivado", formDisabled);

  /* caso guiado: API y transiciones */
  const trans = await page.evaluate(() => {
    const api = window.OPX?.caseApi;
    if (!api || api.count < 5) return { fail: "API ausente" };
    const out = [];
    api.reset();
    out.push(["inicio pendiente", api.state("s1") === "pendiente" && api.state("s6") === "pendiente"]);
    out.push(["goto adelantado rechazado", api.goto(3) === false]);
    api.start();
    out.push(["start activa s1", api.state("s1") === "activo"]);
    api.next();
    out.push(["next completa s1 y activa s2", api.state("s1") === "completado" && api.state("s2") === "activo"]);
    api.prev();
    out.push(["prev vuelve a s1", api.state("s1") === "activo" && api.state("s2") === "pendiente"]);
    let guard = 0;
    while (api.index() < api.count && guard++ < 20) api.next();
    out.push(["recorrido completo", api.state("s6") === "completado"]);
    const live = document.querySelector(".case-live")?.textContent ?? "";
    out.push(["aria-live anuncia el estado", live.length > 10]);
    const optOk = document.querySelectorAll(".case-option.is-descartada").length === 1
      && document.querySelectorAll(".case-option.is-aprobada").length === 1;
    out.push(["rama negativa visible (opción descartada)", optOk]);
    api.reset();
    out.push(["reset restaura pendiente", api.state("s1") === "pendiente"]);
    return { out };
  });
  if (trans.fail) add("caso guiado", false, trans.fail);
  else for (const [name, pass] of trans.out) add(`caso guiado: ${name}`, pass);
  const pendingOpacity = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".case-step")).opacity));
  add("pasos pendientes conservan contraste legible", pendingOpacity >= 0.7, `opacity=${pendingOpacity}`);

  await ctx.close();
}

/* un hash directo no puede competir con una animación y ocultar el caso */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  await page.route("**/*", (route) =>
    route.request().url().startsWith("file://") ? route.continue() : route.abort());
  await page.goto(`${URL_BASE}#caso`, { waitUntil: "load" });
  await page.waitForTimeout(1800);
  const opacity = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".case-step")).opacity));
  add("enlace directo #caso mantiene el primer paso visible", opacity >= 0.7, `opacity=${opacity}`);
  await ctx.close();
}

/* ════ contexto B · reduced motion + desbordamiento por viewport ═════ */
console.log("\n■ Reduced motion y desbordamiento");
for (const [w, h] of [[390, 844], [768, 1024], [1440, 900], [2560, 1440]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.route("**/*", (route) =>
    route.request().url().startsWith("file://") ? route.continue() : route.abort());
  await page.goto(URL_BASE, { waitUntil: "load" });
  await page.waitForTimeout(250);
  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflowX = Math.max(doc.scrollWidth - doc.clientWidth, document.body.scrollWidth - doc.clientWidth);
    const hidden = ["h1", "#contexto h2", ".suite-card", ".case-step", ".mock-panel", ".ia-quote"]
      .flatMap((sel) => [...document.querySelectorAll(sel)])
      .filter((el) => {
        const cs = getComputedStyle(el);
        return Number(cs.opacity) < 0.5 || cs.visibility === "hidden" || cs.display === "none";
      }).length;
    const smallTargets = [...document.querySelectorAll("a[href],button,input,textarea,select")]
      .filter((el) => el.offsetParent !== null)
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width < 24 || r.height < 24;
      }).length;
    return { overflowX, hidden, smallTargets };
  });
  add(`sin desbordamiento horizontal a ${w}x${h}`, metrics.overflowX <= 1, `${metrics.overflowX}px`);
  add(`contenido visible con reduced-motion a ${w}x${h}`, metrics.hidden === 0, `${metrics.hidden} ocultos`);
  add(`blancos táctiles ≥ 24 px a ${w}x${h}`, metrics.smallTargets === 0, `${metrics.smallTargets} pequeños`);
  await ctx.close();
}

/* ════ contexto C · sin JavaScript ═══════════════════════════════════ */
console.log("\n■ Sin JavaScript");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: "load" });
  const nojs = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.innerText ?? "",
    cards: document.querySelectorAll(".suite-card").length,
    steps: document.querySelectorAll(".case-step").length,
    controlsHidden: document.getElementById("case-controls")?.hidden === true,
    textLen: document.body.innerText.length,
    hidden: ["h1", ".suite-card", ".case-step"].flatMap((sel) => [...document.querySelectorAll(sel)])
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length,
  }));
  add("contenido íntegro sin JavaScript", nojs.h1.includes("complejidad") && nojs.cards === 4 && nojs.steps === 6 && nojs.textLen > 2500,
    `${nojs.cards} tarjetas, ${nojs.steps} pasos, ${nojs.textLen} chars`);
  add("nada oculto sin JavaScript", nojs.hidden === 0, `${nojs.hidden} ocultos`);
  add("controles del caso ocultos sin JavaScript", nojs.controlsHidden);
  await ctx.close();
}

/* ════ contexto D/E · modo presentación ══════════════════════════════ */
console.log("\n■ Modo presentación");
for (const [w, h, full] of [[1280, 720, true], [1920, 1080, false]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.route("**/*", (route) =>
    route.request().url().startsWith("file://") ? route.continue() : route.abort());
  await page.goto(`${URL_BASE}?mode=present`, { waitUntil: "load" });
  try {
    await page.waitForSelector("body.presenting", { timeout: 3000 });
  } catch { /* evaluado abajo */ }
  const opened = await page.evaluate(() => document.body.classList.contains("presenting"));
  add(`presentación se abre con ?mode=present a ${w}x${h}`, opened);
  if (!opened) { await ctx.close(); continue; }

  const total = await page.evaluate(() => window.OPX.presentApi.count);
  add(`presentación con ${total} diapositivas`, total >= 7, `${total}`);

  let fitFails = [];
  let activeFails = [];
  let counterFails = [];
  await page.evaluate(() => window.OPX.presentApi.goto(0));
  for (let i = 0; i < total; i++) {
    await page.waitForTimeout(90);
    const state = await page.evaluate(({ vw, vh }) => {
      const slides = [...document.querySelectorAll("main > section[data-present]")];
      const actives = slides.filter((s) => s.classList.contains("is-active"));
      const wrap = actives[0]?.querySelector(".wrap");
      const r = wrap?.getBoundingClientRect();
      const fits = r && r.top >= -2 && r.left >= -2 && r.bottom <= vh + 2 && r.right <= vw + 2;
      const counter = document.querySelector(".present-current")?.textContent;
      const inertOk = slides.every((s) => s.classList.contains("is-active") ? !s.inert : s.inert === true);
      return { actives: actives.length, fits, counter, idx: window.OPX.presentApi.active(), inertOk };
    }, { vw: w, vh: h });
    if (state.actives !== 1 || !state.inertOk) activeFails.push(i);
    if (!state.fits) fitFails.push(i);
    if (Number(state.counter) !== state.idx + 1) counterFails.push(i);
    if (i < total - 1) await page.keyboard.press("ArrowRight");
  }
  add(`una sola diapositiva activa e inert en el resto (${w}x${h})`, activeFails.length === 0, activeFails.join(","));
  add(`todas las diapositivas caben en ${w}x${h}`, fitFails.length === 0, fitFails.length ? `no caben: ${fitFails.join(",")}` : "");
  add(`contador coherente (${w}x${h})`, counterFails.length === 0);

  if (full) {
    await page.evaluate(() => window.OPX.presentApi.goto(0));
    await page.click('#inicio a[href="#contacto"]');
    const ctaWorks = await page.evaluate(() => document.querySelector("#contacto")?.classList.contains("is-active"));
    add("CTA interna navega entre diapositivas", ctaWorks);

    await page.keyboard.press("Home");
    const atHome = await page.evaluate(() => window.OPX.presentApi.active() === 0);
    await page.keyboard.press("End");
    const atEnd = await page.evaluate(() => window.OPX.presentApi.active() === window.OPX.presentApi.count - 1);
    add("Home y End funcionan", atHome && atEnd);

    await page.keyboard.press("Home");
    await page.waitForTimeout(80);
    const trapOk = await page.evaluate(() => {
      const active = document.querySelector("main > section[data-present].is-active");
      const focusables = [...active.querySelectorAll("a[href], button, input, textarea, select")]
        .filter((el) => !el.matches(":disabled") && el.offsetParent !== null);
      if (!focusables.length) return false;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      /* Tab desde el último focusable debe envolver al primero */
      last.focus();
      const fwd = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
      last.dispatchEvent(fwd);
      const wrapsForward = fwd.defaultPrevented && document.activeElement === first;
      /* Shift+Tab desde el primero debe envolver al último */
      first.focus();
      const back = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
      first.dispatchEvent(back);
      const wrapsBack = back.defaultPrevented && document.activeElement === last;
      return wrapsForward && wrapsBack;
    });
    add("el foco queda atrapado en la diapositiva activa", trapOk);

    await page.keyboard.press("Escape");
    const closed = await page.evaluate(() => !document.body.classList.contains("presenting"));
    add("Escape sale de la presentación", closed);
  }
  await ctx.close();
}

await browser.close();

/* ════ resumen ═══════════════════════════════════════════════════════ */
const failed = results.filter((r) => !r.pass);
console.log(`\n■ Resultado: ${results.length - failed.length}/${results.length} comprobaciones correctas`);
if (failed.length) {
  console.error(`\nAUDITORÍA FALLIDA (${failed.length}):`);
  for (const f of failed) console.error(`  ✗ ${f.name}${f.info ? ` — ${f.info}` : ""}`);
  process.exit(1);
}
console.log("Auditoría superada.");
