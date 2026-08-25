# Web and audiovisual production with AI — OPX suite website

This repository produces the web package for **OPX — Optima X** (first-party
product site, no white-label client). The landing, presentation mode, canonical
data, generated evidence and deployment package must describe the same approved
suite and canonical case. The repository also contains the untouched Dekalabs
Vue 3 starter template (`src/`, root `package.json`, `vite.config.js`); that
template is **out of scope** for this package and must not be modified or
deleted without an explicit request.

## Scope

- Work inside this repository. The web-and-media package lives in: `COPY.md`,
  `DECISIONS.md`, `brand/`, `data/`, `landing/`, `deploy/`, `captures/`
  (generated, ignored) and `finish.sh`.
- Preserve valid existing work and make the smallest coherent change.
- Do not add rules outside this web package; do not edit the Vue template.

## Source order

Read and resolve conflicts in this order:
1. This AGENTS.md and the applicable repository documentation.
2. `./playbook-opx-deka.html` — the Dekalabs working method (structure,
   prompt contract, checks and limits).
3. Product sources: https://opx.tech/, https://venue.opx.tech/,
   https://flow.opx.tech/ and the approved content inventory recorded in
   `prompts/opx-web-oneshot.md` (governs when the live sites are unreachable).
4. Brand tokens derived in `brand/README.md`.
5. Approved copy in `COPY.md`.
6. Canonical case in `data/opx-suite-case.json`.
7. Existing target source files.
8. https://opx-response-landing.dekalabs.workers.dev/ for architecture and
   quality patterns only; never as suite copy, brand or feature evidence.

## Project map

- `COPY.md` — approved narrative, terminology, claims and CTAs (es-ES).
- `DECISIONS.md` — reversible assumptions and open NEEDS_INPUT items.
- `brand/README.md` — derived brand tokens, fonts, licences and rationale.
- `data/opx-suite-case.json` — the single canonical JSON (suite + case).
- `data/validate.mjs` — dependency-free validation of the canonical JSON.
- `landing/` — the site: `index.html` (with `<!-- data:*:start/end -->`
  generated regions), `styles.css`, `js/main.js`, build and audit tooling.
- `landing/assets/vendor/` — generated bundles; read-only, git-ignored.
- `captures/` — generated screenshots (evidence); git-ignored.
- `deploy/dist/` — generated publishable files only; git-ignored.
- `deploy/make-qr.py` — QR generator for the final URL.
- `finish.sh` — final audit plus deployment-package preparation.
- 3D scene and voiced video are **not included** in this package. Any future
  work stays behind `SUITE_SCENE_3D_ENABLED = false`.

## Working rules

- One canonical JSON; the generated regions in `index.html` are written only by
  `landing/sync-data.mjs`. Never edit generated regions or vendor bundles by hand.
- Natural, orthographically correct es-ES (accents included) using the approved
  terminology. Do not invent claims, metrics, integrations, states, clients or
  workflows; mark anything unsupported `NEEDS_INPUT`.
- Local assets only: no CDN, analytics, remote font/image or runtime API call.
  Exactly two font families (Outfit, DM Sans), self-hosted with OFL licences.
- Suite links come from canonical data. Approved hosts: opx.tech,
  venue.opx.tech, flow.opx.tech. The domain opx.com is forbidden.
- Product-UI moments are HTML/CSS mocks fed by canonical data and labelled as
  recreations; never present them as real screenshots.
- Keep unfinished work behind a named boolean flag set to false
  (`SUITE_SCENE_3D_ENABLED`, `CONTACT_FORM_ENABLED`).

## Verification

- Run `node data/validate.mjs` when canonical data changes.
- From `landing/`: `npm run build` (sync + bundles) and `npm run check`
  (build + full audit) after web changes; `npm run shots` for the
  deterministic capture matrix; `npm run art` to regenerate favicon/OG art.
- Run `./finish.sh` only when preparing the publishable package.
- Before Git operations, inspect `git status --short` and verify ignored paths
  with `git check-ignore -v`.
- Report commands, exit codes, evidence paths and a done/not-done verdict.

## Code review rules

- Request an independent review when a feature closes or after three verified
  rounds, whichever happens first; always review before merge or publication.
- The reviewer starts from acceptance criteria, sources, diff and evidence in a
  fresh context. The producing agent's summary is context, not proof.

## Permissions

- Never expose or request secrets; there are none in this package.
- Do not commit, push, publish, deploy, change external services or spend
  money unless the current request explicitly authorizes that exact action.
