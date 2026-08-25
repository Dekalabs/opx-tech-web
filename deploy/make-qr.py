#!/usr/bin/env python3
"""Genera códigos QR (SVG y PNG) para la URL final de la web OPX.

Uso:
    python3 -m venv deploy/.venv
    deploy/.venv/bin/pip install segno
    deploy/.venv/bin/python deploy/make-qr.py https://opx.tech/

La URL es un argumento posicional obligatorio: nunca se inventa.
Salida: deploy/qr-opx.svg y deploy/qr-opx.png
"""
import argparse
import sys
from pathlib import Path

try:
    import segno
except ImportError:
    sys.exit("Falta segno. Instala con: deploy/.venv/bin/pip install segno")

parser = argparse.ArgumentParser(description="QR de la web OPX")
parser.add_argument("url", help="URL final publicada (obligatoria)")
args = parser.parse_args()

if not args.url.startswith("https://"):
    sys.exit(f"La URL debe ser https:// — recibido: {args.url}")

out = Path(__file__).resolve().parent
qr = segno.make(args.url, error="q")
svg = out / "qr-opx.svg"
png = out / "qr-opx.png"
qr.save(svg, scale=12, dark="#0d0f11", light=None)
qr.save(png, scale=14, border=3, dark="#0d0f11", light="#ffffff")
print(f"QR generado para {args.url}:\n  {svg}\n  {png}")
