# Landing OPX — comandos

Web estática de la suite OPX construida con el método del playbook
(`../playbook-opx-deka.html`). Sin framework: HTML semántico, CSS con tokens y
JavaScript vanilla con bundles locales de esbuild (GSAP + Motion). Abre desde
`file://` sin ninguna petición externa.

## Requisitos

Node 20+ (probado con 24). Primera vez: `npm ci` (o `npm install`) y, si no hay
navegadores de Playwright en la máquina, `npx playwright install chromium`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run sync` | Regenera las regiones `<!-- data:*:start/end -->` de `index.html` desde `../data/opx-suite-case.json` |
| `npm run bundle` | Compila `js/main.js` → `assets/vendor/site.js` (IIFE minificado) |
| `npm run build` | `sync` + `bundle` |
| `npm run check` | `build` + auditoría completa (`audit.mjs`, 67 comprobaciones) |
| `npm run shots` | Matriz de capturas deterministas → `../captures/web/` |
| `npm run art` | Regenera favicon PNG e imagen OG desde los tokens de marca |

Cierre y paquete publicable: `../finish.sh` (desde la raíz del repo).

## Qué se edita y qué se genera

- **Se edita**: `js/main.js`, `styles.css`, las partes NO marcadas de
  `index.html`, `sync-data.mjs`, `audit.mjs`, `shots.mjs`, `gen-assets.mjs`.
- **Se genera (no editar a mano)**: las regiones entre marcadores
  `<!-- data:NOMBRE:start/end -->` de `index.html`, `assets/vendor/` y
  `../captures/`. Los textos aprobados viven en `../COPY.md`; los datos, en
  `../data/opx-suite-case.json`.

## Modo presentación

Tecla `P` o `?mode=present`: 8 diapositivas (las secciones reales), flechas /
`Home` / `End` / rueda / gesto táctil, `Esc` para salir. La auditoría exige que
todas quepan en 1280×720 y 1920×1080.

## Caso guiado

La sección «Caso» recorre el escenario canónico con estados
pendiente/activo/completado y una opción descartada. API estable para pruebas:
`window.OPX.caseApi` (`start/next/prev/reset/goto/state`) y
`window.OPX.presentApi`. Flags: `window.OPX.flags`
(`SUITE_SCENE_3D_ENABLED=false`, `CONTACT_FORM_ENABLED=false`).

## Contacto (pendiente de datos)

`contact.email` y `contact.form_endpoint` del JSON canónico están en
`NEEDS_INPUT`: la web no pinta `mailto:` y el formulario queda desactivado.
Al rellenarlos, `npm run build` regenera el CTA automáticamente.
