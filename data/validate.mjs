#!/usr/bin/env node
/**
 * Validación sin dependencias del JSON canónico de la suite OPX.
 * Uso: node data/validate.mjs
 * Sale con código 1 ante cualquier error; las entradas NEEDS_INPUT se
 * listan como avisos (no bloquean la validación, sí la publicación del CTA).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "opx-suite-case.json");
const errors = [];
const warnings = [];
const ok = (cond, msg) => { if (!cond) errors.push(msg); };

let raw, data;
try {
  raw = readFileSync(file, "utf8");
  data = JSON.parse(raw);
} catch (e) {
  console.error(`ERROR: no se pudo leer o parsear ${file}: ${e.message}`);
  process.exit(1);
}

/* ── estructura básica ─────────────────────────────────────────────── */
for (const key of ["meta", "contact", "links", "principles", "pains", "ia_pillars", "products", "case", "mocks"]) {
  ok(key in data, `Falta la clave raíz "${key}"`);
}
ok(data.meta?.locale === "es-ES", "meta.locale debe ser es-ES");
ok(Array.isArray(data.meta?.sources) && data.meta.sources.length >= 3, "meta.sources incompleto");

/* ── enlaces ───────────────────────────────────────────────────────── */
const approved = new Set(data.links?.approved_hosts ?? []);
const forbidden = data.links?.forbidden_hosts ?? [];
ok(approved.has("opx.tech") && approved.has("venue.opx.tech") && approved.has("flow.opx.tech"),
  "links.approved_hosts debe incluir opx.tech, venue.opx.tech y flow.opx.tech");
for (const host of forbidden) {
  const re = new RegExp(`(^|[^a-z0-9.])${host.replace(/\./g, "\\.")}`, "i");
  ok(!re.test(raw.replace(/"forbidden_hosts":\s*\[[^\]]*\]/, "")),
    `El host prohibido ${host} aparece fuera de forbidden_hosts`);
}

/* ── productos ─────────────────────────────────────────────────────── */
const products = data.products ?? [];
ok(products.length === 4, "Deben existir exactamente 4 productos");
const productIds = new Set();
for (const p of products) {
  ok(p.id && !productIds.has(p.id), `Producto con id duplicado o vacío: ${p.id}`);
  productIds.add(p.id);
  for (const f of ["name", "axis", "question", "question_detail", "tagline", "summary", "status"]) {
    ok(typeof p[f] === "string" && p[f].length > 0, `Producto ${p.id}: falta el campo "${f}"`);
  }
  ok(["live", "proximamente"].includes(p.status), `Producto ${p.id}: status inválido "${p.status}"`);
  if (p.status === "live") {
    ok(typeof p.url === "string" && p.url.startsWith("https://"), `Producto ${p.id}: live sin URL https`);
    if (p.url) ok(approved.has(new URL(p.url).hostname), `Producto ${p.id}: host fuera del inventario (${p.url})`);
  } else {
    ok(p.url === null, `Producto ${p.id}: los productos sin web deben llevar url null`);
  }
}
ok(["venue", "flow", "response", "insight"].every((id) => productIds.has(id)),
  "Los productos deben ser venue, flow, response e insight");

/* ── caso canónico ─────────────────────────────────────────────────── */
const c = data.case ?? {};
ok(Array.isArray(c.states) && ["pendiente", "activo", "completado", "descartado"].every((s) => c.states.includes(s)),
  "case.states debe incluir pendiente, activo, completado y descartado");
ok(typeof c.disclaimer === "string" && /recreaci/i.test(c.disclaimer),
  "case.disclaimer debe declarar que las pantallas son recreaciones");
const actorIds = new Set((c.actors ?? []).map((a) => a.id));
ok(actorIds.size === (c.actors ?? []).length && actorIds.size >= 3, "Actores duplicados o insuficientes");

const steps = c.steps ?? [];
ok(steps.length >= 5, "El caso necesita al menos 5 pasos");
const seen = new Set();
let prevMinutes = -1;
let decisionSteps = 0;
const usedProducts = new Set();
for (const s of steps) {
  ok(s.id && !seen.has(s.id), `Paso con id duplicado o vacío: ${s.id}`);
  for (const f of ["time", "product", "actor", "channel", "title", "detail"]) {
    ok(typeof s[f] === "string" && s[f].length > 0, `Paso ${s.id}: falta "${f}"`);
  }
  ok(productIds.has(s.product), `Paso ${s.id}: producto desconocido "${s.product}"`);
  usedProducts.add(s.product);
  ok(actorIds.has(s.actor), `Paso ${s.id}: actor desconocido "${s.actor}"`);
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(s.time ?? "");
  ok(m, `Paso ${s.id}: hora inválida "${s.time}"`);
  if (m) {
    const minutes = Number(m[1]) * 60 + Number(m[2]);
    ok(minutes > prevMinutes, `Paso ${s.id}: la cronología no avanza (${s.time})`);
    prevMinutes = minutes;
  }
  for (const req of s.requires ?? []) {
    ok(seen.has(req), `Paso ${s.id}: depende de "${req}", que no es un paso anterior`);
  }
  if (s.decision) {
    decisionSteps += 1;
    const opts = s.decision.options ?? [];
    ok(opts.length >= 2, `Paso ${s.id}: la decisión necesita al menos 2 opciones`);
    ok(opts.some((o) => o.outcome === "descartada"), `Paso ${s.id}: falta la rama negativa (opción descartada)`);
    const chosen = opts.find((o) => o.id === s.decision.chosen);
    ok(chosen && chosen.outcome === "aprobada", `Paso ${s.id}: la opción elegida debe existir y estar aprobada`);
  }
  seen.add(s.id);
}
ok(decisionSteps === 1, `Debe haber exactamente un paso de decisión (hay ${decisionSteps})`);
ok(["venue", "flow", "response", "insight"].every((p) => usedProducts.has(p)),
  "El caso debe recorrer los cuatro productos del ciclo");

/* ── coherencia del mock público ───────────────────────────────────── */
const panel = data.mocks?.venue_panel;
ok(panel, "Falta mocks.venue_panel");
if (panel) {
  const values = (panel.rows ?? []).map((r) => r.value).join("|");
  ok(values.includes("87") && values.includes("Alto") && values.includes("2"),
    "El panel de Venue debe conservar las cifras públicas 87 %, Alto y 2");
  ok(panel.risk?.value === "Medio" && panel.confidence?.value === "92 %",
    "El panel de Venue debe conservar riesgo Medio y confianza 92 %");
  const s1 = steps.find((s) => s.id === "s1");
  ok(s1 && s1.detail.includes("87"), "El paso s1 debe citar la misma saturación (87) que el panel");
}

/* ── ortografía es-ES (palabras sin tilde) ─────────────────────────── */
const stripped = ["mas", "informacion", "gestion", "decision", "auditoria", "coordinacion",
  "comunicacion", "analisis", "terminos", "tecnologia", "operacion", "saturacion",
  "senalizacion", "organizacion", "situacion", "evaluacion", "señalizacion?".replace("?", "")];
const collect = (node, path, out) => {
  if (typeof node === "string") out.push([path, node]);
  else if (Array.isArray(node)) node.forEach((v, i) => collect(v, `${path}[${i}]`, out));
  else if (node && typeof node === "object") Object.entries(node).forEach(([k, v]) => collect(v, `${path}.${k}`, out));
};
const strings = [];
collect(data, "$", strings);
const exemptPaths = /(\.id|\.status|\.chosen|approved_hosts|forbidden_hosts|canonical_url|\.url|requires)/;
for (const [path, value] of strings) {
  if (exemptPaths.test(path)) continue;
  for (const w of stripped) {
    if (w === "señalizacion") continue;
    const re = new RegExp(`(^|[^a-záéíóúüñ])${w}($|[^a-záéíóúüñ])`, "i");
    if (re.test(value)) errors.push(`Ortografía: "${w}" sin tilde en ${path}: «${value.slice(0, 60)}…»`);
  }
}

/* ── NEEDS_INPUT ───────────────────────────────────────────────────── */
const email = data.contact?.email;
if (email === "NEEDS_INPUT") {
  warnings.push("contact.email = NEEDS_INPUT → la web no pintará mailto hasta rellenarlo");
} else {
  ok(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email ?? ""), `contact.email inválido: "${email}"`);
}
if (data.contact?.form_endpoint === "NEEDS_INPUT") {
  warnings.push("contact.form_endpoint = NEEDS_INPUT → formulario desactivado (CONTACT_FORM_ENABLED=false)");
  ok(data.contact?.form_enabled === false, "form_enabled debe ser false mientras no exista endpoint");
}

/* ── resultado ─────────────────────────────────────────────────────── */
if (warnings.length) {
  console.log("Avisos (NEEDS_INPUT):");
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (errors.length) {
  console.error(`\nValidación FALLIDA — ${errors.length} error(es):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`\nValidación correcta: ${products.length} productos, ${steps.length} pasos, ${strings.length} cadenas revisadas.`);
