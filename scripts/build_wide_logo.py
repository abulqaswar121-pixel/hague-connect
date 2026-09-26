#!/usr/bin/env python3
"""Compose horizontal (navbar) lockups from the processed master artwork.

Outputs into public/brand/:
  - logo-wide.png        emblem + original navy typography (for LIGHT surfaces)
  - logo-wide-dark.png   emblem + reversed white typography (for DARK surfaces)

Run AFTER scripts/process_logo.py (depends on logo-full.png / logo-emblem.png).
"""
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from process_logo import split_emblem, trim  # noqa: E402

BRAND = Path("public/brand")


def load_parts():
    full = Image.open(BRAND / "logo-full.png").convert("RGBA")
    emblem = Image.open(BRAND / "logo-emblem.png").convert("RGBA")
    cut = split_emblem(full)
    text = trim(full.crop((0, cut, full.width, full.height)), pad=4)
    return emblem, text


def reverse_letters(text: Image.Image) -> Image.Image:
    """Recolor the dark-navy HAGUE letters to a crisp white ramp, preserving the
    3D bevel shading and leaving the gold rim + orange subtitle untouched.
    Crisp tuning: near-white floor + protected bevel range for dark headers."""
    im = text.copy()
    px = im.load()
    lo = (234, 240, 250)
    hi = (255, 255, 255)
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            # dark navy letter pixel (blue-family, dark); excludes gold rim
            # (high r) and orange subtitle (very high r, low b).
            if r < 110 and g < 130 and b < 185 and b >= r:
                lum = 0.299 * r + 0.587 * g + 0.114 * b
                t = max(0.45, min(1.0, lum / 135.0))
                px[x, y] = (
                    int(lo[0] + (hi[0] - lo[0]) * t),
                    int(lo[1] + (hi[1] - lo[1]) * t),
                    int(lo[2] + (hi[2] - lo[2]) * t),
                    a,
                )
    return im


def compose(emblem: Image.Image, text: Image.Image, out: str):
    target_h = text.height
    ew = int(emblem.width * target_h / emblem.height)
    em2 = emblem.resize((ew, target_h), Image.LANCZOS)
    gap = int(target_h * 0.14)
    W = ew + gap + text.width
    H = target_h
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(em2, (0, (H - target_h) // 2), em2)
    canvas.paste(text, (ew + gap, (H - text.height) // 2), text)
    canvas.save(BRAND / out)
    print(out, canvas.size)


def main():
    emblem, text = load_parts()
    compose(emblem, text, "logo-wide.png")
    compose(emblem, reverse_letters(text), "logo-wide-dark.png")


if __name__ == "__main__":
    main()
