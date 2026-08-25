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
const pains = data.pains.map((p) => `
        <li class="pain">
          <span class="pain-n" aria-hidden="true">${esc(p.n)}</span>
          <p>${esc(p.text)}</p>
        </li>`).join("");

const questions = products.map((p) => `
          <article class="card question-card" data-p="${p.id}">
            <h3>${esc(p.question)}</h3>
            <p>${esc(p.question_detail)}</p>
          </article>`).join("");

const pillars = data.ia_pillars.map((p) => `
          <article class="card pillar">
            <span class="pillar-n" aria-hidden="true">${esc(p.n)}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.detail)}</p>
          </article>`).join("");

const suiteCards = products.map((p) => {
  const link = p.status === "live" && p.url
    ? `<a class="suite-link" href="${esc(p.url)}" target="_blank" rel="noopener">Visitar web <span aria-hidden="true">→</span></a>`
    : `<span class="suite-soon">Web del producto próximamente</span>`;
  return `
            <article class="card suite-card" data-p="${p.id}">
              <p class="suite-axis">${esc(p.axis)}</p>
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.summary)}</p>
              <p class="suite-tagline">«${esc(p.tagline)}»</p>
              ${link}
            </article>`;
}).join("");

/* Diagrama SVG del ciclo: 4 nodos sobre un anillo */
const R = 210, CX = 320, CY = 320, NODE_R = 64;
const angles = { venue: -90, flow: 0, response: 90, insight: 180 };
const pos = (deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
};
const nodes = products.map((p) => {
  const { x, y } = pos(angles[p.id]);
  const inner = `
      <circle class="cycle-node-dot" cx="${x}" cy="${y}" r="${NODE_R}"></circle>
      <text class="cycle-node-name" x="${x}" y="${y - 4}" text-anchor="middle">${esc(p.name.replace("Optima ", ""))}</text>
      <text class="cycle-node-axis" x="${x}" y="${y + 16}" text-anchor="middle">${esc(p.axis)}</text>`;
  return p.status === "live" && p.url
    ? `<a href="${esc(p.url)}" target="_blank" rel="noopener" class="cycle-node" data-p="${p.id}" aria-label="${esc(p.name)} — ${esc(p.axis)} (abrir web)">${inner}</a>`
    : `<g class="cycle-node" data-p="${p.id}" role="img" aria-label="${esc(p.name)} — ${esc(p.axis)} (web próximamente)">${inner}</g>`;
}).join("\n");

const cycle = `
            <svg class="cycle-svg" viewBox="0 0 640 640" role="img" aria-label="Ciclo de la suite OPX: Venue, Flow, Response e Insight se refuerzan en un ciclo continuo">
              <title>El ciclo operativo de la suite OPX</title>
              <circle class="cycle-ring" cx="${CX}" cy="${CY}" r="${R}"></circle>
              <circle class="cycle-flow" id="cycle-flow" cx="${CX}" cy="${CY}" r="${R}"></circle>
              <text class="cycle-center" x="${CX}" y="${CY + 10}" text-anchor="middle">OPX</text>
              ${nodes}
            </svg>`;

const caseHeading = `
        <h2>${esc(data.case.title)}</h2>
        <p class="lead">${esc(data.case.intro)}</p>`;

const stateLabel = { pendiente: "Pendiente", activo: "Activo", completado: "Completado", descartado: "Descartado" };
const steps = data.case.steps.map((s) => {
  const actor = actors[s.actor];
  const product = byId[s.product];
  const decision = s.decision ? `
              <div class="case-decision" role="group" aria-label="Opciones evaluadas en Optima Flow">
                ${s.decision.options.map((o) => `
                <div class="case-option ${o.outcome === "descartada" ? "is-descartada" : "is-aprobada"}">
                  <p class="case-option-head"><span class="case-option-outcome">${o.outcome === "descartada" ? "Descartada" : "Aprobada"}</span> ${esc(o.label)}</p>
                  <p class="case-option-meta">Riesgo: ${esc(o.risk)} · Confianza: ${esc(o.confidence)}</p>
                  <p class="case-option-reason">${esc(o.reason)}</p>
                </div>`).join("")}
                <p class="mock-caption">Recreación del panel de decisión de Optima Flow.</p>
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
const venueMock = `
            <div class="mock-panel" role="group" aria-label="Recreación del panel operativo de Optima Venue">
              <div class="mock-head"><span class="mock-title">${esc(panel.title)}</span><span class="mock-badge">${esc(panel.badge)}</span></div>
              <dl class="mock-rows">${panel.rows.map((r) => `
                <div class="mock-row ${toneClass[r.tone] ?? "tone-neutro"}"><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join("")}
              </dl>
              <p class="mock-reco">${esc(panel.recommendation)}</p>
              <p class="mock-foot"><span>${esc(panel.risk.label)}: <b>${esc(panel.risk.value)}</b></span><span>${esc(panel.confidence.label)}: <b>${esc(panel.confidence.value)}</b></span></p>
              <p class="mock-caption">Recreación del panel operativo de Optima Venue.</p>
            </div>`;

const disclaimer = `
        <p class="case-disclaimer">${esc(data.case.disclaimer)}</p>`;

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
  "cycle-diagram": cycle,
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
