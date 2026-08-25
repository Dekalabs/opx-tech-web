#!/usr/bin/env bash
# Auditoría completa + preparación del paquete publicable (deploy/dist).
# No publica: la publicación requiere autorización expresa (ver README).
set -euo pipefail
cd "$(dirname "$0")"

echo "── OPX web · auditoría ──────────────────────────────"
pushd landing >/dev/null
if [ ! -d node_modules ]; then
  npm ci
fi
npm run check
popd >/dev/null

echo "── construyendo deploy/dist ─────────────────────────"
rm -rf deploy/dist
mkdir -p deploy/dist/assets
cp landing/index.html landing/styles.css landing/robots.txt landing/sitemap.xml deploy/dist/
cp -R landing/assets/fonts landing/assets/og landing/assets/vendor deploy/dist/assets/
cp landing/assets/favicon.svg landing/assets/favicon-32.png landing/assets/apple-touch-icon.png deploy/dist/assets/

echo "── guardas del paquete ──────────────────────────────"
if find deploy/dist \( -name "*.mjs" -o -name "README*" -o -name "package*.json" -o -name "*.map" \) | grep -q .; then
  echo "ERROR: deploy/dist contiene ficheros no publicables" >&2; exit 1
fi
if grep -Rl "NEEDS_INPUT" deploy/dist >/dev/null 2>&1; then
  echo "ERROR: NEEDS_INPUT presente en deploy/dist" >&2; exit 1
fi
if grep -Rli "opx\.com" deploy/dist >/dev/null 2>&1; then
  echo "ERROR: dominio prohibido opx.com en deploy/dist" >&2; exit 1
fi

echo "── contenido de deploy/dist ─────────────────────────"
find deploy/dist -type f | sort
TOTAL=$(du -sh deploy/dist | cut -f1)
echo "── paquete listo (${TOTAL}) ─────────────────────────"
echo "Publicación (solo con autorización expresa):"
echo "  npx wrangler deploy --assets deploy/dist --name opx-tech"
