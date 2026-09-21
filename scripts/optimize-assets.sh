#!/usr/bin/env bash
# Downscale the 4K project screenshots to 1920px wide and re-encode as AVIF,
# keeping the original PNGs as the <picture> fallback. Run from repo root:
#   bash scripts/optimize-assets.sh
set -u
cd "$(dirname "$0")/.." || exit 1
D=src/lib/assets/projects
W=1920
Q=60
SPEED=4
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# drop any stale test artifacts
rm -f "$D"/_t_*.avif "$D"/_t_*.png

total_png=0
total_avif=0
for f in "$D"/*.png; do
  base="$(basename "$f" .png)"
  png_bytes=$(wc -c < "$f")
  total_png=$((total_png + png_bytes))

  # 1) resize to 1920px wide (keeps 16:9 -> 1920x1080)
  magick "$f" -resize "${W}x" "$TMP/$base.png" 2>/dev/null
  # 2) encode to AVIF
  avifenc -q "$Q" -s "$SPEED" "$TMP/$base.png" "$D/$base.avif" >/dev/null 2>&1

  if [ -f "$D/$base.avif" ]; then
    avif_bytes=$(wc -c < "$D/$base.avif")
    total_avif=$((total_avif + avif_bytes))
    dims=$(identify -format "%wx%h" "$D/$base.avif" 2>/dev/null)
    echo "OK   $base  ${png_bytes}B -> ${avif_bytes}B  (${dims})"
  else
    echo "FAIL $base"
  fi
done

echo "----------------------------------------"
echo "PNG total:  $total_png bytes"
echo "AVIF total: $total_avif bytes"
