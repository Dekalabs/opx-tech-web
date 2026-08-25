# One-shot prompt — rebuild opx.tech (paste everything below into the agent)

Outcome
Rebuild the public website of the OPX suite (today at https://opx.tech/) as a
complete, verifiable web package under the opx-tech-web repository root, in one
continuous run and without intermediate approvals. Deliver: the approved content
layer (COPY.md), the canonical suite case (data/), the branded landing with
presentation mode and guided case (landing/), the agent contracts
(AGENTS.md/CLAUDE.md), deterministic visual evidence, and a publishable static
package (deploy/dist/) — all consistent with the same approved sources and
canonical case, and demonstrably free of the audited defects listed below.

Inputs
- Project: opx-tech-web; product: OPX — Optima X (operational suite: Optima
  Venue, Optima Flow, Optima Response, Optima Insight); root: this repository
  root; slug: opx-tech.
- Working method: ./playbook-opx-deka.html (Dekalabs playbook). Read it first
  and apply its structure, prompt contract, checks and limits.
- Canonical case file: opx-suite-case.json.
- White-label client: NONE (first-party product site).
- Reference package: NONE locally. Use
  https://opx-response-landing.dekalabs.workers.dev/ as the built-with-this-
  method quality reference, for architecture and quality patterns only — never
  as suite copy, brand or feature evidence.
- Product sources (approved copy baseline, in this authority order):
  1. https://opx.tech/ — suite positioning, product descriptions, IA principle.
  2. https://venue.opx.tech/ and https://flow.opx.tech/ — per-product depth.
  3. The content inventory embedded below (verified 2026-08-25), which governs
     if a live site is unreachable during the run.
- Brand sources: no brand guide exists. Derive tokens from the current sites and
  document the rationale in brand/README.md: wordmark "OPX" (text lockup);
  headings Outfit, body DM Sans (both SIL OFL — self-host local subsets);
  near-black background (#0d0f11 family), light text, violet/indigo accent
  family, teal/success and amber/risk semantic states as used by the live
  product mocks. Record every derived decision in DECISIONS.md.
- Approved assets: NONE — do not reuse the current hero nebula PNGs or any
  asset whose licence cannot be verified; build visuals from code (CSS/SVG/
  canvas) and locally generated art.
- Contact email for CTAs: [[CONTACT_EMAIL]].
- Environment URLs: production https://opx.tech/ (Cloudflare). Live product
  subdomains: venue.opx.tech and flow.opx.tech. response.opx.tech and
  insight.opx.tech do not exist yet (verified 2026-08-25).
- Git and protected development deployment: CONFIGURE_DEV_DEPLOYMENT: NO. If
  flipped to YES, first fill [[GIT_PROVIDER]]; [[REPOSITORY_URL]];
  [[CLOUDFLARE_ACCOUNT]]; [[DEV_WORKER_NAME]] (normally opx-tech-dev);
  [[DEV_SUBDOMAIN]]; [[ACCESS_POLICY]]; [[EXACT_EXTERNAL_SETUP_AUTHORIZATION]]
  — then follow playbook prompts 7.14 and 7.15.
- INCLUDE_3D: NO — represent the suite cycle as a canonical-data-driven 2D
  animated diagram (SVG/canvas). Leave any future Three.js work behind
  SUITE_SCENE_3D_ENABLED = false.
- INCLUDE_VIDEO: NO.
- PUBLISH_AUTHORIZED: NO. COMMIT_AUTHORIZED: NO.

Approved content inventory (extracted from the live sites on 2026-08-25)
- Master claim: "La complejidad no se elimina. Se gobierna."
- Positioning: "OPX es una suite operativa para organizaciones que no pueden
  permitirse el caos."
- Context section: four numbered pains — entornos que evolucionan más rápido
  que la capacidad de adaptación; decisiones que arrastran múltiples actores,
  restricciones y efectos en cadena; disrupciones como parte del día a día; sin
  estructura, el aprendizaje llega tarde y las mejoras no se consolidan.
- IA core: Conecta / Detecta / Apoya, plus the principle "La IA nunca sustituye
  a las personas. La IA estructura la complejidad para que las personas
  mantengan el control." Recurring product-site claims: "Decisiones humanas,
  siempre" and "El agente analiza y sugiere. Las personas deciden."
- The four questions: ¿Qué gestionamos? (activos, espacios, infraestructuras) /
  ¿Cómo lo gestionamos? (procesos, flujos, reglas de decisión) / ¿Cómo
  reaccionamos? (incidentes, protocolos, coordinación) / ¿Cómo aprendemos?
  (análisis, patrones, mejora continua).
- Suite (cycle Venue → Flow → Response → Insight; "Cada producto refuerza a los
  demás. Cada ciclo mejora el siguiente."):
  - Optima Venue — QUÉ GESTIONAS — "Claridad sobre lo que gestionas." —
    visibility and control over assets and spaces; live at https://venue.opx.tech/.
  - Optima Flow — CÓMO LO GESTIONAS — "Estructura para decidir mejor." —
    processes and decision flows; live at https://flow.opx.tech/.
  - Optima Response — CÓMO REACCIONAS — "Control cuando más importa." —
    incident preparation and coordinated response; no public URL yet.
  - Optima Insight — CÓMO APRENDES — "Aprender para operar mejor." — learning
    and continuous improvement; no public URL yet.
- Reusable product-mock data already public on the live sites (keep consistent):
  Venue operations panel — "Saturación zona norte 87%", "Flujo accesos
  principales: Alto", "Incidencias activas: 2", "Riesgo: Medio", "Confianza:
  92%". Flow agent review — validation OK, score 114.5, recommendation to
  approve subject to funds.
- Do not invent metrics, clients, testimonials, integrations, pricing or
  certifications beyond this inventory; mark anything new NEEDS_INPUT.

Defects of the current site that the rebuild must fix (audited 2026-08-25)
1. SEO/i18n: empty <title>, no meta description, no Open Graph/Twitter/canonical,
   html lang="en" on Spanish content, client-side-only rendering. New site:
   static semantic HTML, lang="es", unique title of at most 60 characters, meta
   description, OG/Twitter tags with a locally generated share image, canonical
   URL, favicon set, robots.txt and sitemap.xml, exactly one h1 and a valid
   heading outline.
2. Performance: ~25 Google Font families requested while two are used, all
   remote. New site: exactly two self-hosted subset font families with
   font-display: swap and real fallback stacks; zero external requests of any
   kind; keep total first-load transfer at or under 1.5 MB and report it.
3. Orthography: flow and venue copy lacks Spanish accents ("informacion",
   "auditoria", "Terminos"). All new copy is orthographically correct es-ES;
   add an audit check that fails on a curated list of accent-stripped words.
4. Broken suite navigation: the four "SABER MÁS" cards are not links, and
   flow.opx.tech's "Volver a OPX" points to the third-party domain opx.com. New
   site: every product card links from canonical data — Venue and Flow to their
   subdomains, Response and Insight to an honest no-link state — and the audit
   fails on any dead CTA or any URL outside the approved link inventory.
5. JS-gated content: hero copy is invisible until animations run. New site: all
   content readable without JavaScript and under prefers-reduced-motion.
6. Contact: the current form posts nowhere. Implement the complete accessible
   form UI behind CONTACT_FORM_ENABLED = false with the endpoint configuration
   documented but empty (NEEDS_INPUT), and show a working mailto CTA to
   [[CONTACT_EMAIL]] as the primary contact path meanwhile.

Input gate
Before editing, fail fast with a Missing inputs table if [[CONTACT_EMAIL]]
remains unfilled or ./playbook-opx-deka.html cannot be read. Unreachable live
sites are not blockers: fall back to the embedded inventory and record that in
DECISIONS.md. While CONFIGURE_DEV_DEPLOYMENT is NO, the Git/Cloudflare
placeholders are not blockers either.

Source order
1. Applicable AGENTS.md/CLAUDE.md instructions and repository documentation.
2. ./playbook-opx-deka.html as the working method (structure, checks, limits).
3. The live sites plus the embedded inventory for capabilities, terminology and
   claims.
4. Brand tokens derived per the Inputs, then existing files under the root.
5. The Response reference landing, for architecture and quality patterns only.

Work and acceptance
1. Contracts: create AGENTS.md as the canonical agent contract for this package
   (playbook prompt 7.10 scope) and CLAUDE.md as a relative symlink or thin
   adapter to it.
2. Content layer: create COPY.md (product context and limits; audiences —
   direction/operations decision-makers in regulated venues, public sector and
   large corporations; narrative arc; final es-ES copy for navigation, hero,
   sections, captions, CTAs and presentation; terminology; voice and tone;
   words to avoid; claim-to-source ledger) plus data/opx-suite-case.json and
   dependency-free data/validate.mjs. The canonical case is one privacy-safe
   operational scenario — an event night in a managed venue — crossing the full
   cycle: Venue detects north-zone saturation (87%) → Response activates the
   protocol and coordinates roles → Flow records the structured decision →
   Insight turns the incident into a learned pattern. Reuse the public mock
   figures; fictional actors; realistic enums, timestamps, dependencies and
   states; meta.notes for invariants and source references.
3. Landing: build landing/ per the playbook web contract — semantic HTML5,
   modern CSS on brand tokens, vanilla JavaScript, local esbuild bundles (GSAP
   ScrollTrigger/SplitText, Motion), sync-data.mjs embedding the canonical
   JSON, file:// support, zero external requests, mobile-first responsive,
   accessible (visible focus, contrast, useful alt, native controls, logical
   DOM), presentation mode (P and ?mode=present; fits 1280x720 and 1920x1080)
   and the guided suite case driven only by canonical data with a stable window
   test API. Narrative order: context/problem → promise → the four questions →
   IA principle → suite cycle (animated 2D diagram plus product cards with
   honest links) → guided case → human-decisions principle → contact CTA.
   Product-UI moments are HTML/CSS mocks fed by canonical data, visually
   distinct from the page chrome and never presented as real screenshots.
4. Evidence captures: create landing/shots.mjs (Playwright) for deterministic
   screenshots at 390, 768, 1280, 1440, 2000 and 2560 wide plus every
   presentation slide at 1280x720 and 1920x1080; raw outputs stay git-ignored.
5. Package: project-specific .gitignore (playbook template adapted); finish.sh
   that runs the complete audit, aborts on failure and rebuilds deploy/dist
   with only publishable static files (index.html, styles.css, assets/,
   robots.txt, sitemap.xml, favicons — no .mjs, no README); deploy/make-qr.py;
   README.md with every command.
6. Audit: adapt landing/audit.mjs so npm run check fails on: page or console
   errors; any external request; empty or duplicate title, missing meta
   description, OG tags or lang="es"; accent-stripped words from the curated
   list; dead links or URLs outside the approved inventory; missing alt text;
   horizontal overflow at 390x844, 768x1024, 1440x900 and 2560x1440;
   reduced-motion hidden content; presentation focus or fit errors; invalid
   guided-case transitions; more than two font families or any remote font.
7. Verify: run node data/validate.mjs, npm run build, npm run check and the
   full capture matrix; fix in-scope failures and repeat until everything is
   green.

System constraints
- One canonical JSON; generated copies are never edited by hand.
- Natural, orthographically correct es-ES; approved terminology; no invented
  claim, metric or workflow — the embedded inventory is the claim boundary.
- Local assets only; no CDN, analytics, remote font or image, or runtime API
  call.
- Unfinished optional work stays behind a named boolean flag set to false
  (SUITE_SCENE_3D_ENABLED, CONTACT_FORM_ENABLED).
- Never store secrets in Git; document required names in example env files.
- Record reversible assumptions in DECISIONS.md and continue.

Acceptance
- COPY.md, the canonical case, landing, presentation, suite diagram, evidence
  captures, contracts and deploy/dist exist, agree with each other and pass
  their documented checks.
- npm run check exits 0 with every audit rule from step 6 active; the landing
  opens from file:// with zero external requests; each of the six defect
  classes above is demonstrably fixed, with specific evidence per defect.
- Presentation slides fit 1280x720 and 1920x1080; the capture matrix is
  complete; deploy/dist contains no source scripts, README files or secrets.
- Publish nothing (PUBLISH_AUTHORIZED: NO) and commit nothing
  (COMMIT_AUTHORIZED: NO); leave the repository ready for human review.

Return and permissions
Return: status by component; files created/changed; DECISIONS.md summary and
unresolved NEEDS_INPUT items; commands with exit codes; screenshot paths by
viewport and slide; the defect-fix evidence table; and a final done/not-done
verdict tied to the Acceptance section. Report results and evidence, not a work
diary. Do not commit, push, publish, deploy, configure external services or
incur spend.
