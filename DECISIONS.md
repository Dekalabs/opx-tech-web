# DECISIONS — paquete web OPX

Suposiciones reversibles y entradas pendientes. Fecha de auditoría de fuentes
vivas: 2026-08-25.

## Pendiente (NEEDS_INPUT)

1. **Email de contacto público** (`data/opx-suite-case.json → contact.email`).
   El prompt lo dejó sin rellenar y no existe ningún email publicado en
   opx.tech ni en los subdominios (los bundles solo contienen el placeholder
   `nombre@empresa.com`). Se continuó el encargo amparándose en la constraint
   «Record reversible assumptions in DECISIONS.md and continue»: el email vive
   en un único campo del JSON canónico; mientras valga `NEEDS_INPUT` la web no
   pinta ningún `mailto:` (los CTA llevan a la sección de contacto) y el
   formulario permanece desactivado. Al rellenarlo, `npm run build` regenera el
   CTA automáticamente. **La aceptación del defecto 6 queda parcial hasta
   entonces.**
2. **Endpoint del formulario** (`contact.form_endpoint`). El formulario está
   completo y accesible pero tras `CONTACT_FORM_ENABLED = false` hasta que se
   autorice un endpoint real.

## Suposiciones reversibles

3. **Repositorio no vacío**: la raíz contiene la plantilla Dekalabs
   `template-clean-vite-vue3` (Vue 3 + Tailwind, commit inicial). No es la
   fuente de la web actual (es el scaffold genérico con HelloWorld). El paquete
   del playbook se construyó junto a ella sin modificarla; decidir su retirada
   corresponde al equipo. Los `.env`/`.env.pro` versionados de la plantilla no
   contienen secretos (nombres de template con API URL vacía).
4. **Marca derivada, no oficial**: sin guía de marca, los tokens se derivaron
   de las webs vivas (Outfit títulos, DM Sans cuerpo, fondo #0d0f11, acento
   violeta/índigo). La landing de referencia de Response usa PP Object Sans
   (comercial); se mantuvo Outfit/DM Sans por ser la marca visible de opx.tech
   y por licencia OFL autoalojable. Acentos por producto (Venue cian, Flow
   violeta, Response ámbar, Insight verde) definidos aquí para el diagrama del
   ciclo; reversibles en `landing/styles.css`.
5. **Puntuación 114.5 no reutilizada**: el mock «Review del agente» de
   flow.opx.tech (114.5/99999, subvenciones) pertenece a otro contexto; en el
   caso canónico del recinto la tarjeta de decisión de Flow usa riesgo/confianza
   del propio incidente (Medio / 92 %). El inventario exige coherencia con las
   cifras públicas *si se reutilizan*, no reutilizarlas todas.
6. **Formato es-ES de cifras**: espacio fino antes de % («87 %») y coma decimal
   según convención es-ES, manteniendo los valores públicos (87, Alto, 2,
   Medio, 92 %). Reversible en el JSON canónico.
7. **Escenario ficticio**: recinto «Arena Cierzo», evento, personas y la
   telemetría intermedia (63 % a las 21:52) son ficción privacy-safe del caso
   guiado, marcada como recreación en la propia página; no son claims de
   producto. Las cifras públicas del mock de Venue se conservan tal cual.
8. **SplitText**: disponible en gsap npm (3.13+, licencia estándar gsap tras
   Webflow); si se retira, `js/main.js` degrada a revelado por palabras propio.
9. **Un solo bundle** (`assets/vendor/site.js`) en lugar de los dos de la
   referencia (sin 3D no hay segundo runtime).
10. **Fuentes**: subsets latin variable descargados de Google Fonts
    (gstatic v15/v17) y versionados con sus OFL.txt; procedencia en
    `brand/README.md`. El subset latin cubre todo el español (tildes, ñ, ¿¡).
11. **README raíz**: se antepuso una sección del paquete al README de la
    plantilla sin borrar su contenido original.
12. **Backend como evidencia interna, no como catálogo comercial**: el
    repositorio adjunto `/Users/gattai/Developer/Deka/opx/` confirma la lógica
    de roles, grupos, tareas, protocolos, incidencias, trazabilidad y paneles
    compartidos entre Venue, Flow y Response. Se usó para concretar el lenguaje
    y los mocks, pero no para publicar módulos, integraciones o estados que aún
    no figuren en el inventario aprobado.
13. **Imagen editorial del hero**: se generó una escena arquitectónica original
    de un recinto operativo nocturno, sin texto, logos, personas identificables
    ni pantallas falsas. Funciona como contexto visual; la interfaz superpuesta
    sigue siendo HTML/CSS y está marcada como recreación alimentada por el caso
    canónico. Fuente de trabajo:
    `landing/assets/hero/arena-operational-v1.jpg`.
