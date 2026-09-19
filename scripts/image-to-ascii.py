#!/usr/bin/env python3
"""Image -> ASCII art (luminance mapped to character density).

Reproduces the reference site's full-bleed ASCII look: bright image regions
become dense glyphs, dark regions become sparse/space. Output is a plain .txt
asset meant to be imported with Vite's `?raw` and shown in a <pre>, exactly
like the existing footer ASCII art.

Usage:
    python scripts/image-to-ascii.py INPUT.png OUTPUT.txt [--cols 160] [--ramp " .:-=+*#%@"]
"""

import argparse
import sys

from PIL import Image, ImageOps

# Dark -> light. Leftmost char = darkest cell, rightmost = brightest.
DEFAULT_RAMP = " .:-=+*#%@"


def image_to_ascii(path: str, cols: int, ramp: str, invert: bool, cell: float) -> str:
    im = Image.open(path)
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        # Composite transparency onto white so cut-outs don't read as black.
        bg = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA")
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert("RGB")

    # `cell` is the monospace glyph height/width ratio (advance width vs line
    # height). ~0.6 for Geist Mono, ~0.5 for a generic 2:1 cell. Scaling rows by
    # it keeps the displayed ASCII aspect true so it fills the frame on both axes.
    aspect = im.height / im.width
    rows = max(1, int(cols * aspect * cell))

    im = im.resize((cols, rows), Image.LANCZOS)
    im = ImageOps.autocontrast(im, cutoff=1)
    gray = im.convert("L")

    # Perceptual luminance (Rec. 601) via the grayscale channel directly.
    pixels = gray.load()
    last = len(ramp) - 1
    out_lines = []
    for y in range(rows):
        line = []
        for x in range(cols):
            idx = int(pixels[x, y] / 255 * last + 0.5)
            if invert:
                idx = last - idx
            line.append(ramp[idx])
        out_lines.append("".join(line).rstrip())
    return "\n".join(out_lines) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--cols", type=int, default=160, help="target character width")
    ap.add_argument("--ramp", default=DEFAULT_RAMP, help="density ramp, dark -> light")
    ap.add_argument(
        "--invert",
        action="store_true",
        help="map bright image regions to sparse glyphs instead of dense",
    )
    ap.add_argument(
        "--cell",
        type=float,
        default=0.5,
        help="glyph height/width ratio (Geist Mono ~0.6); higher = more rows",
    )
    args = ap.parse_args()

    text = image_to_ascii(args.input, args.cols, args.ramp, args.invert, args.cell)
    with open(args.output, "w", encoding="utf-8") as fh:
        fh.write(text)

    width = max((len(l) for l in text.splitlines()), default=0)
    height = len(text.splitlines())
    print(f"wrote {args.output} ({width}x{height} chars)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
