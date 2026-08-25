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

Una única conversión: **solicitar una demo** (sección de contacto). CTA
secundaria: conocer la suite (ancla a la sección Suite).

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
- Meta descripción: `OPX es una suite operativa para organizaciones que no
  pueden permitirse el caos. Venue, Flow, Response e Insight: cuatro productos,
  un ciclo operativo completo.`

### Navegación

Contexto · Enfoque · IA · Suite · Caso · Contacto — CTA: **Solicitar demo**
(el logotipo «OPX» enlaza al inicio de la página).

### Hero

- Kicker: `OPX — OPTIMA X`
- H1: `La complejidad no se elimina. **Se gobierna.**`
- Sub: `OPX es una suite operativa para organizaciones que no pueden
  permitirse el caos.`
- CTA primaria: `Solicitar demo` → #contacto
- CTA secundaria: `Conocer la suite` → #suite

### Contexto (El contexto)

- H2: `El mundo actual exige operar en entornos interconectados, volátiles y
  permanentemente expuestos al cambio.`
- Los cuatro dolores (01–04) proceden del JSON canónico (`pains`).
- Cierre: `OPX nace para aportar claridad, coordinación y control en
  operaciones donde fallar no es una opción.`

### Enfoque (las cuatro preguntas)

- Kicker: `El enfoque OPX`
- H2: `Toda organización compleja se enfrenta a las mismas cuatro preguntas.`
- Tarjetas desde el JSON (`products[].question / question_detail`).

### IA (núcleo)

- Kicker: `Núcleo de IA`
- H2: `La inteligencia artificial como núcleo`
- Intro: `La IA en OPX conecta datos, señales y procesos. Detecta patrones y
  riesgos. Resalta lo relevante. Apoya mejores decisiones humanas.`
- Pilares 01 Conecta / 02 Detecta / 03 Apoya desde el JSON (`ia_pillars`).
- Cita: `«La IA nunca sustituye a las personas. La IA estructura la
  complejidad para que las personas mantengan el control.»`

### Suite

- Kicker: `La suite OPX`
- H2: `Cuatro productos complementarios. Un ciclo operativo completo.`
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

- H2: `Decisiones humanas, siempre`
- Texto: `OPX aplica inteligencia artificial bajo un principio irrenunciable:
  las decisiones siempre las toman las personas. OPX aporta claridad, contexto
  y apoyo.`
- Refuerzo: `El agente analiza y sugiere. Las personas deciden.`
- Puente al CTA: `Enfrentarse a la complejidad sin estructura es improvisar.
  Conoce cómo OPX puede ayudarte a gobernarla.`

### Contacto

- H2: `Hablemos`
- Intro: `Descubre cómo OPX puede transformar tu operativa. Déjanos tus datos
  y coordinaremos una demostración personalizada.`
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

Todo lo que no esté en esta tabla es `NEEDS_INPUT` y no puede publicarse.
