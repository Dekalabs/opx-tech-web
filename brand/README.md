# Marca OPX — tokens derivados

No existe guía de marca oficial. Estos tokens se derivaron de las webs vivas
(opx.tech, venue.opx.tech, flow.opx.tech) el 2026-08-25 y son la referencia del
paquete. Los valores canónicos viven como custom properties en
[`landing/styles.css`](../landing/styles.css); este documento explica el porqué.
Cualquier cambio de marca se aplica en los tokens, nunca valor a valor.

## Identidad

- **Wordmark**: «OPX» tipografiado en Outfit 800 (sin logotipo gráfico público).
- **Favicon / motivo**: anillo de cuatro arcos (el ciclo de la suite) en los
  colores de producto sobre fondo `#0d0f11`, con núcleo violeta. Generado en
  local (`landing/assets/favicon.svg` + `npm run art`).

## Tipografía

| Uso | Familia | Peso | Procedencia |
|---|---|---|---|
| Títulos y display | Outfit (variable 100–900) | 650–800 | Google Fonts v15, subset latin, OFL |
| Cuerpo e interfaz | DM Sans (variable, opsz) | 400–650 | Google Fonts v17, subset latin, OFL |

Autoalojadas en `landing/assets/fonts/` con sus licencias (`OFL-Outfit.txt`,
`OFL-DMSans.txt`). El subset latin cubre el español completo (tildes, ñ, ¿¡).
Regla de auditoría: máximo estas dos familias y ninguna fuente remota.
Nota: la landing de referencia de Optima Response usa PP Object Sans
(comercial); se decidió mantener Outfit/DM Sans por ser la marca visible de
opx.tech y autoalojable con licencia libre (DECISIONS.md · 4).

## Color

| Token | Valor | Uso |
|---|---|---|
| `--bg-0 / --bg-1 / --bg-2` | `#07090b / #0d0f11 / #14171c` | fondos (base: el `#0d0f11` de opx.tech) |
| `--ink-hi / --ink-mid / --ink-low` | `#f4f6f8 / #aab3bd / #77828d` | texto |
| `--accent-300/400/500` | `#a7a9ff / #7d7ff2 / #5356dd` | acento violeta/índigo de marca |
| `--ok` | `#37d3c4` | éxito / confirmación |
| `--warn` | `#f0a63f` | aviso / riesgo medio |
| `--danger` | `#ef5a4e` | riesgo alto / descartado |

### Acentos por producto (definidos en este paquete)

| Producto | Token | Valor |
|---|---|---|
| Optima Venue | `--p-venue` | `#37d3c4` |
| Optima Flow | `--p-flow` | `#a7a9ff` |
| Optima Response | `--p-response` | `#f0a63f` |
| Optima Insight | `--p-insight` | `#5cd58c` |

Se usan en las cuatro preguntas, las tarjetas de la suite, el diagrama del
ciclo y la línea temporal del caso. Reversibles (DECISIONS.md · 4).

## Convenciones es-ES

- Espacio antes de `%` («87 %») y coma decimal, manteniendo los valores
  públicos del mock de Venue.
- Tratamiento de tú; sin exclamaciones; una idea por titular (COPY.md §6–8).

## Imagen para compartir (OG)

`landing/assets/og/og-image.png` (1200×630): claim maestro + los cuatro
productos con sus puntos de color + opx.tech. Se regenera con `npm run art`.
