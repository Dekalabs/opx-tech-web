# COPY.md — Web de la suite OPX (opx.tech)

Copy final aprobado para implementación. Fuente de verdad editorial del
paquete; los datos y cifras viven en `data/opx-suite-case.json`. Idioma:
**es-ES con ortografía completa** (tildes, ñ, signos de apertura). Fecha de
extracción de fuentes vivas: 2026-08-25.

## 1. Contexto de producto y límites

OPX — Optima X es una suite operativa de cuatro productos complementarios que
forman un ciclo: **Optima Venue** (qué gestionas), **Optima Flow** (cómo lo
gestionas), **Optima Response** (cómo reaccionas) y **Optima Insight** (cómo
aprendes). La IA es el núcleo que conecta datos, señales y procesos; las
decisiones las toman siempre las personas.

Límites: no existen métricas de resultados, clientes públicos, testimonios,
precios, certificaciones ni integraciones anunciadas. Nada de eso puede
aparecer en la web. Venue y Flow tienen web propia; Response e Insight aún no.

## 2. Audiencias

- **Primaria — dirección de operaciones**: responsables de operaciones,
  seguridad e infraestructura en recintos, sector público y grandes
  corporaciones. Les preocupa perder el control ante la complejidad: aforos,
  incidentes, decisiones auditables. Criterio de compra: control, trazabilidad
  y continuidad operativa. Objeción típica: «otra plataforma más que nadie
  usará».
- **Secundaria — dirección general / transformación**: buscan estructura y
  aprendizaje continuo sin sustituir a sus equipos. Objeción: desconfianza
  hacia la IA que decide sola; la web debe dejar claro el principio de
  decisión humana.

## 3. Objetivo de conversión

Una única conversión: **ver OPX en una demo** (sección de contacto). La CTA
secundaria lleva al caso guiado para hacer tangible el ciclo antes de pedir
datos.

## 4. Promesa y mapa narrativo

Promesa: la complejidad no se elimina; con OPX se gobierna. Arco de la página:

1. Contexto y problema (el mundo operativo actual)
2. Promesa (hero) y enfoque (las cuatro preguntas)
3. Mecanismo (la IA como núcleo, con su principio)
4. La suite (cuatro productos, un ciclo)
5. Caso guiado (una noche de evento, el ciclo completo, con recreaciones de
   producto alimentadas por el caso canónico)
6. Principio irrenunciable (decisiones humanas, siempre)
7. CTA de contacto

## 5. Copy final

### Metadatos (SEO)

- `<title>`: `OPX — Optima X · La complejidad se gobierna`
- Meta descripción: `OPX conecta espacios, procesos, incidentes y aprendizaje
  para que tu equipo decida con contexto. Cuatro productos, un ciclo operativo
  completo.`

### Navegación

Cómo funciona · Productos · Caso en acción · Nuestro principio — CTA:
**Ver una demo**
(el logotipo «OPX» enlaza al inicio de la página).

### Hero

- Kicker: `OPX — OPTIMA X`
- H1: `La complejidad no se elimina. **Se gobierna.**`
- Sub: `Una suite operativa que conecta espacios, procesos, incidentes y
  aprendizaje para que tu equipo decida con contexto y actúe con control.`
- CTA primaria: `Ver OPX en una demo` → #contacto
- CTA secundaria: `Ver el ciclo en acción` → #caso
- Refuerzo: `La IA estructura. Las personas deciden.`
- Secuencia visual: `Señal → Contexto → Decisión humana → Aprendizaje`.

### Contexto (El contexto)

- Kicker: `El reto operativo`
- H2: `Cuando todo está conectado, ninguna decisión ocurre de forma aislada.`
- Intro: `Los entornos operativos cambian, los actores se multiplican y cada
  respuesta deja consecuencias. Sin estructura, el control se fragmenta.`
- Los cuatro dolores (01–04) proceden del JSON canónico (`pains`).
- Cierre: `OPX nace para aportar claridad, coordinación y control en
  operaciones donde fallar no es una opción.`

### Enfoque (las cuatro preguntas)

- Kicker: `El enfoque OPX`
- H2: `Cuatro preguntas. Una sola lógica operativa.`
- Intro: `OPX ordena la complejidad alrededor de lo que gestionas, cómo
  operas, cómo respondes y cómo aprende tu organización.`
- Tarjetas desde el JSON (`products[].question / question_detail`).

### IA (núcleo)

- Kicker: `Núcleo de IA`
- H2: `Menos ruido. Más contexto para decidir.`
- Intro: `La IA en OPX conecta datos, señales y procesos. Detecta patrones y
  riesgos. Resalta lo relevante. Apoya mejores decisiones humanas.`
- Pilares 01 Conecta / 02 Detecta / 03 Apoya desde el JSON (`ia_pillars`).
- Cita: `«La IA nunca sustituye a las personas. La IA estructura la
  complejidad para que las personas mantengan el control.»`

### Suite

- Kicker: `La suite OPX`
- H2: `Cuatro productos. Un ciclo de principio a fin.`
- Intro: `Cada producto resuelve una parte de la operación. Juntos convierten
  señales dispersas en decisiones trazables y aprendizaje continuo.`
- Tarjetas de producto desde el JSON: eje (QUÉ GESTIONAS…), nombre, resumen,
  lema entre comillas y enlace real (`Visitar web →`) o estado honesto
  (`Web del producto próximamente`). Nunca un enlace muerto.
- Diagrama del ciclo Venue → Flow → Response → Insight.
- Cierre: `Cada producto refuerza a los demás. Cada ciclo mejora el siguiente.`

### Caso guiado

- Kicker: `El ciclo en acción`
- H2: `Una noche de evento, el ciclo completo.`
- Intro: `Un escenario realista y ficticio —el recinto Arena Cierzo durante un
  concierto con entradas agotadas— recorre los cuatro productos en 48 minutos.`
- Aviso obligatorio bajo el caso: `Escenario ilustrativo con datos ficticios.
  Las pantallas son recreaciones alimentadas por el caso canónico, no capturas
  del producto.`
- Pasos, horas, actores, canales, decisión (con opción descartada) y panel
  operativo desde el JSON canónico. Controles: `Iniciar el recorrido`,
  `Anterior`, `Siguiente`, `Reiniciar`.

### Principio

- Kicker: `Principio irrenunciable`
- H2: `Decisiones humanas, siempre.`
- Texto: `OPX aporta claridad, contexto y apoyo. El agente analiza y sugiere;
  las decisiones siempre las toman las personas.`
- Refuerzo: `La tecnología ordena la complejidad. Tu equipo mantiene el
  control.`

### Contacto

- Kicker: `Tu operación, con contexto`
- H2: `Ve OPX trabajando sobre un escenario como el tuyo.`
- Intro: `Cuéntanos qué gestionas y dónde se concentra hoy la complejidad.
  Prepararemos una demostración centrada en tu operativa.`
- Expectativas: `Un recorrido por el ciclo completo.` · `Un caso adaptado a
  tu contexto operativo.` · `Una conversación centrada en tu equipo y tus
  decisiones.`
- Formulario (accesible, desactivado hasta que exista endpoint): Nombre
  completo · Email profesional · Organización · Mensaje (opcional) · botón
  `Solicitar demo`. Nota mientras esté desactivado: `El envío directo estará
  disponible muy pronto.`
- CTA mailto (solo cuando `contact.email` esté definido): `Escríbenos` →
  `mailto:{contact.email}`.

### Pie

`© 2026 OPX Optima X. Todos los derechos reservados.` + enlaces de la suite
(Venue y Flow con enlace; Response e Insight con «próximamente») + `Hecho con
el método Dekalabs` (opcional, decisión del equipo — de momento **no** se
incluye).

### Modo presentación

Ocho diapositivas (portada, contexto, enfoque, IA, suite, caso, principio,
contacto) con los mismos textos; se entra con la tecla `P` o `?mode=present`.

## 6. Terminología

- «suite operativa», «ciclo operativo», «gobernar» (nunca «eliminar» la
  complejidad), «capa de apoyo», «recinto», «incidencia/incidente»,
  «protocolo», «trazable/auditable», «señales», «patrones».
- Nombres de producto siempre completos la primera vez («Optima Venue») y
  «Venue/Flow/Response/Insight» después. La marca es «OPX» u «OPX — Optima X».
- Tratamiento: **tú** (consistente con las webs actuales: «tu operativa»).

## 7. Voz y tono

Sobrio, declarativo, frases cortas. Una idea por titular. Sin exclamaciones ni
superlativos. La IA se describe como apoyo, nunca como decisora.

## 8. Palabras y usos a evitar

- Cualquier palabra sin su tilde (la auditoría lo bloquea).
- «revolucionario», «disruptivo», «todo en uno», «líder», «solución mágica».
- Promesas de resultados, cifras de mercado, «IA que decide por ti».
- El dominio opx.com (no es de OPX).

## 9. Libro de claims (claim → fuente)

| Claim | Fuente |
|---|---|
| «La complejidad no se elimina. Se gobierna.» | opx.tech hero (2026-08-25) |
| «OPX es una suite operativa…caos.» | opx.tech hero |
| Los 4 dolores del contexto | opx.tech, sección «El contexto» |
| Conecta / Detecta / Apoya + cita de la IA | opx.tech, «Núcleo de IA» |
| Las cuatro preguntas y sus detalles | opx.tech, «El enfoque OPX» |
| Ejes, lemas y resúmenes de los 4 productos | opx.tech, «La Suite OPX» |
| «Cada producto refuerza…mejora el siguiente.» | opx.tech, cierre de suite |
| «Decisiones humanas, siempre» + párrafo | opx.tech + flow/venue |
| «El agente analiza y sugiere. Las personas deciden.» | flow.opx.tech |
| Cifras del panel operativo (87 %, Alto, 2, Medio, 92 %) | venue.opx.tech (mock público) |
| URLs de Venue y Flow; Response/Insight sin web | verificación DNS/HTTP 2026-08-25 |
| Escenario Arena Cierzo, actores, horas, 63 % | Ficción del caso canónico (marcada como recreación) |
| `Espacios → procesos → incidentes → aprendizaje` y `Señal → contexto → decisión humana → aprendizaje` | Síntesis editorial del ciclo aprobado y del caso canónico |
| Referencias visuales a roles, grupos, protocolos, trazabilidad y paneles operativos | Backend adjunto `/Users/gattai/Developer/Deka/opx/`, usado como evidencia interna de vocabulario y arquitectura; no añade claims de resultados |
| Nuevos titulares editoriales (`Cuando todo está conectado…`, `Menos ruido…`, `Un ciclo de principio a fin`) | Reformulación de los dolores, pilares de IA y claim de ciclo ya aprobados; no incorpora una capacidad ni un resultado nuevos |

Todo lo que no esté en esta tabla es `NEEDS_INPUT` y no puede publicarse.
