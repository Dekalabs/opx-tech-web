#!/usr/bin/env node
/**
 * Genera las regiones marcadas de index.html a partir del JSON canónico
 * (../data/opx-suite-case.json). Las regiones generadas no se editan a mano.
 *
 *   node sync-data.mjs           reescribe index.html
 *   node sync-data.mjs --check   falla (exit 1) si index.html está desfasado
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, "..", "data", "opx-suite-case.json");
const htmlPath = join(here, "index.html");
const CHECK = process.argv.includes("--check");

const data = JSON.parse(readFileSync(dataPath, "utf8"));
const esc = (s) => String(s)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const products = data.products;
const byId = Object.fromEntries(products.map((p) => [p.id, p]));
const actors = Object.fromEntries(data.case.actors.map((a) => [a.id, a]));
const emailOk = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(data.contact.email ?? "");

/* ── payload de runtime (sin NEEDS_INPUT) ──────────────────────────── */
const runtime = {
  principles: data.principles,
  products: products.map(({ id, name, axis, url, status }) => ({ id, name, axis, url, status })),
  case: data.case,
  contact: { email: emailOk ? data.contact.email : null, form_enabled: data.contact.form_enabled === true },
  /* forbidden_hosts se queda fuera del payload: la página no debe contener el dominio prohibido ni siquiera como dato */
  links: { canonical_url: data.links.canonical_url, approved_hosts: data.links.approved_hosts },
};
const json = `<script type="application/json" id="opx-data">${JSON.stringify(runtime).replaceAll("</", "<\\/")}</script>`;

/* ── regiones ──────────────────────────────────────────────────────── */
const painBreakAfter = { "01": "rápido", "02": "actores,", "03": "excepciones:", "04": "tarde" };
const painCopy = (pain) => {
  const marker = painBreakAfter[pain.n];
  const splitAt = marker ? pain.text.indexOf(marker) + marker.length : 0;
  if (!marker || splitAt < marker.length) return esc(pain.text);
  return `<span class="pain-line">${esc(pain.text.slice(0, splitAt))}</span><span class="pain-line">${esc(pain.text.slice(splitAt).trimStart())}</span>`;
};

const pains = data.pains.map((p) => `
        <li class="pain">
          <span class="pain-n" aria-hidden="true">${esc(p.n)}</span>
          <p>${painCopy(p)}</p>
        </li>`).join("");

const questionMedia = {
  venue: {
    src: "assets/media/opx-enfoque-venue-event.jpg",
    alt: "Persona utilizando OPX Venue en un teléfono móvil durante un evento deportivo",
    width: 3508,
    height: 2481,
  },
  flow: {
    src: "assets/media/opx-enfoque-flow.jpg",
    alt: "Aplicación móvil de OPX para registrar y gestionar un incidente operativo",
    width: 3508,
    height: 2481,
  },
  response: {
    src: "assets/media/opx-enfoque-response.jpg",
    alt: "Composición de interfaces de OPX Suite para coordinar la respuesta operativa",
    width: 3508,
    height: 2481,
  },
  insight: {
    src: "assets/media/opx-enfoque-insight.jpg",
    alt: "Interfaces de OPX Flow para gestionar solicitudes y aprendizaje operativo",
    width: 3508,
    height: 2481,
  },
};

const questions = products.map((p) => {
  const media = questionMedia[p.id];
  const mediaMarkup = media ? `
            <figure class="question-media">
              <img src="${media.src}" alt="${esc(media.alt)}" width="${media.width}" height="${media.height}" loading="lazy" decoding="async">
            </figure>` : "";
  return `
          <article class="card question-card" data-p="${p.id}" data-has-media="${Boolean(media)}">${mediaMarkup}
            <div class="question-copy">
              <span class="question-index" aria-hidden="true">0${products.indexOf(p) + 1}</span>
              <h3>${esc(p.question)}</h3>
              <p>${esc(p.question_detail)}</p>
            </div>
          </article>`;
}).join("");

const pillars = data.ia_pillars.map((p) => `
          <article class="card pillar">
            <span class="pillar-n" aria-hidden="true">${esc(p.n)}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.detail)}</p>
          </article>`).join("");

const suiteLogos = {
  venue: { width: 2450, height: 800 },
  flow: { width: 1850, height: 800 },
  response: { width: 1550, height: 800 },
  insight: { width: 1850, height: 800 },
};

const suiteCards = products.map((p) => {
  const isLive = p.status === "live" && p.url;
  const logo = suiteLogos[p.id];
  const productName = logo
    ? `<h3 class="suite-product-title suite-product-title-logo" data-logo-product="${p.id}">
                    <span class="visually-hidden">${esc(p.name)}</span>
                    <span class="suite-product-logo" aria-hidden="true">
                      <img class="suite-product-logo-black" src="assets/brand/products/opx-${p.id}-black.png" alt="" width="${logo.width}" height="${logo.height}">
                      <img class="suite-product-logo-white" src="assets/brand/products/opx-${p.id}-white.png" alt="" width="${logo.width}" height="${logo.height}">
                    </span>
                  </h3>`
    : `<h3>${esc(p.name)}</h3>`;
  const content = `
              <div class="suite-card-head">
                <div>
                  <p class="suite-axis">${esc(p.axis)}</p>
                  ${productName}
                </div>
              </div>
              <div class="suite-card-body">
                <p class="suite-summary">${esc(p.summary)}</p>
                <div class="suite-card-foot">
                  <p class="suite-tagline">«${esc(p.tagline)}»</p>
                  <span class="${isLive ? "suite-link" : "suite-soon"}">${isLive ? `Visitar ${esc(p.name)}` : "Web del producto próximamente"}</span>
                </div>
              </div>`;
  return `
            <article class="card suite-card" data-p="${p.id}">
              ${isLive
                ? `<a class="suite-card-anchor" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="Visitar ${esc(p.name)}">${content}</a>`
                : `<div class="suite-card-anchor">${content}</div>`}
            </article>`;
}).join("");

const caseHeading = `
        <div class="case-heading-copy section-copy-header">
          <h2>El ciclo en acción</h2>
          <p class="lead">${esc(data.case.title)} ${esc(data.case.intro)}</p>
        </div>`;

const stateLabel = { pendiente: "Pendiente", activo: "Activo", completado: "Completado", descartado: "Descartado" };
const steps = data.case.steps.map((s) => {
  const actor = actors[s.actor];
  const product = byId[s.product];
  const decision = s.decision ? `
              <div class="case-decision" role="group" aria-label="Opciones evaluadas en OPX Flow">
                ${s.decision.options.map((o) => `
                <div class="case-option ${o.outcome === "descartada" ? "is-descartada" : "is-aprobada"}">
                  <p class="case-option-head"><span class="case-option-outcome">${o.outcome === "descartada" ? "Descartada" : "Aprobada"}</span> ${esc(o.label)}</p>
                  <p class="case-option-meta">Riesgo: ${esc(o.risk)} · Confianza: ${esc(o.confidence)}</p>
                  <p class="case-option-reason">${esc(o.reason)}</p>
                </div>`).join("")}
                <p class="mock-caption">Recreación del panel de decisión de OPX Flow.</p>
              </div>` : "";
  return `
            <li class="case-step" data-step="${s.id}" data-product="${s.product}" data-state="pendiente">
              <div class="case-step-head">
                <span class="case-time">${esc(s.time)}</span>
                <span class="case-product" data-p="${s.product}">${esc(product.name)}</span>
                <span class="case-state">${stateLabel.pendiente}</span>
              </div>
              <h3>${esc(s.title)}</h3>
              <p>${esc(s.detail)}</p>
              <p class="case-meta">${esc(actor.name)} · ${esc(actor.role)} — Canal: ${esc(s.channel)}</p>${decision}
            </li>`;
}).join("");

const panel = data.mocks.venue_panel;
const toneClass = { riesgo: "tone-riesgo", aviso: "tone-aviso", neutro: "tone-neutro" };
const heroConsole = `
          <div class="hero-console" role="group" aria-label="Recreación de una vista operativa de OPX">
            <div class="console-bar">
              <span><i></i> ${esc(data.case.venue_name)}</span>
              <span class="console-live">Operación en curso</span>
            </div>
            <div class="console-body">
              <div class="console-signal">
                <p>Señal prioritaria</p>
                <strong>${esc(panel.rows[0].value)}</strong>
                <span>${esc(panel.rows[0].label)}</span>
                <div class="signal-meter" aria-hidden="true"><i style="width:${esc(panel.rows[0].value.replace(" ", ""))}"></i></div>
              </div>
              <div class="console-map" aria-hidden="true">
                <span class="map-zone zone-a"></span><span class="map-zone zone-b"></span><span class="map-zone zone-c"></span>
                <span class="map-route route-a"></span><span class="map-route route-b"></span>
                <i class="map-alert"></i>
              </div>
              <div class="console-decision">
                <p><span>OPX sugiere</span><time>${esc(data.case.steps[0].time)}</time></p>
                <strong>Redirigir el flujo a los accesos secundarios</strong>
                <div><span>Riesgo ${esc(panel.risk.value)}</span><span>Confianza ${esc(panel.confidence.value)}</span></div>
                <small>Decisión humana requerida</small>
              </div>
            </div>
            <p class="mock-caption">Recreación visual alimentada por el caso canónico.</p>
          </div>`;
const venueMock = `
            <div class="mock-panel" role="group" aria-label="Recreación del panel operativo de OPX Venue">
              <div class="mock-head"><span class="mock-title">${esc(panel.title)}</span><span class="mock-badge">${esc(panel.badge)}</span></div>
              <dl class="mock-rows">${panel.rows.map((r) => `
                <div class="mock-row ${toneClass[r.tone] ?? "tone-neutro"}"><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join("")}
              </dl>
              <p class="mock-reco">${esc(panel.recommendation)}</p>
              <p class="mock-foot"><span>${esc(panel.risk.label)}: <b>${esc(panel.risk.value)}</b></span><span>${esc(panel.confidence.label)}: <b>${esc(panel.confidence.value)}</b></span></p>
              <p class="mock-caption">Recreación del panel operativo de OPX Venue.</p>
            </div>`;

const disclaimer = "";

const mailto = emailOk
  ? `<p class="contact-mail">¿Prefieres el correo? <a href="mailto:${esc(data.contact.email)}">Escríbenos</a>.</p>`
  : "";
const contact = `
        <div class="contact-block">
          <form class="contact-form" novalidate>
            <fieldset${data.contact.form_enabled === true ? "" : " disabled"}>
              <legend class="visually-hidden">Solicitar una demostración</legend>
              <div class="form-grid">
                <p class="form-field"><label for="f-nombre">Nombre completo</label><input id="f-nombre" name="nombre" type="text" autocomplete="name" required></p>
                <p class="form-field"><label for="f-email">Email profesional</label><input id="f-email" name="email" type="email" autocomplete="email" required></p>
                <p class="form-field"><label for="f-org">Organización</label><input id="f-org" name="organizacion" type="text" autocomplete="organization" required></p>
                <p class="form-field form-field-full"><label for="f-msg">Mensaje <span class="opt">(opcional)</span></label><textarea id="f-msg" name="mensaje" rows="4"></textarea></p>
              </div>
              <button class="btn btn-primary" type="submit">Solicitar demo</button>
            </fieldset>${data.contact.form_enabled === true ? "" : `
            <p class="form-note">El envío directo estará disponible muy pronto.</p>`}
          </form>
          ${mailto}
        </div>`;

const footerSuite = products.map((p) => p.status === "live" && p.url
  ? `<li><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a></li>`
  : `<li><span>${esc(p.name)} <small>· próximamente</small></span></li>`).join("\n          ");

/* ── sustitución entre marcadores ──────────────────────────────────── */
const regions = {
  "json": `  ${json}`,
  "pains": pains,
  "questions": questions,
  "ia-pillars": pillars,
  "suite-cards": suiteCards,
  "case-heading": caseHeading,
  "case-timeline": steps,
  "venue-mock": venueMock,
  "case-disclaimer": disclaimer,
  "contact": contact,
  "footer-suite": `          ${footerSuite}`,
};

let html = readFileSync(htmlPath, "utf8");
let missing = [];
for (const [name, content] of Object.entries(regions)) {
  const re = new RegExp(`(<!-- data:${name}:start -->)[\\s\\S]*?(<!-- data:${name}:end -->)`);
  if (!re.test(html)) { missing.push(name); continue; }
  html = html.replace(re, (_all, start, end) => `${start}\n${content}\n${end}`);
}
if (missing.length) {
  console.error(`ERROR: faltan marcadores en index.html: ${missing.join(", ")}`);
  process.exit(1);
}

const current = readFileSync(htmlPath, "utf8");
if (CHECK) {
  if (current !== html) {
    console.error("ERROR: index.html está desfasado respecto al JSON canónico. Ejecuta `npm run sync`.");
    process.exit(1);
  }
  console.log("sync-data --check: regiones generadas al día.");
} else {
  if (current !== html) {
    writeFileSync(htmlPath, html);
    console.log("sync-data: regiones generadas actualizadas en index.html.");
  } else {
    console.log("sync-data: sin cambios.");
  }
}
