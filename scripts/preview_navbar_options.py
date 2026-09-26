#!/usr/bin/env python3
"""Render navbar logo treatment options composited on their real header
backgrounds, plus a labeled comparison sheet for user review.

Outputs to /tmp/:
  navbar-v2-crisp.png     brighter reversed-white letters (dark surfaces)
  navbar-halo.png         original letters backlit by a soft white bloom
  navbar-options.png      comparison sheet (A/B/C/D)
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from process_logo import split_emblem, trim  # noqa: E402

BRAND = Path("public/brand")
OUT = Path("/tmp")
NAVY = (10, 25, 47, 255)      # navy-950 header
IVORY = (248, 250, 252, 255)  # ivory header


def load_parts():
    full = Image.open(BRAND / "logo-full.png").convert("RGBA")
    emblem = Image.open(BRAND / "logo-emblem.png").convert("RGBA")
    cut = split_emblem(full)
    text = trim(full.crop((0, cut, full.width, full.height)), pad=4)
    return emblem, text


def compose(emblem: Image.Image, text: Image.Image) -> Image.Image:
    target_h = text.height
    ew = int(emblem.width * target_h / emblem.height)
    em2 = emblem.resize((ew, target_h), Image.LANCZOS)
    gap = int(target_h * 0.14)
    canvas = Image.new("RGBA", (ew + gap + text.width, target_h), (0, 0, 0, 0))
    canvas.paste(em2, (0, 0), em2)
    canvas.paste(text, (ew + gap, 0), text)
    return canvas


def reverse_letters(text: Image.Image, lo=(234, 240, 250), t_floor=0.45) -> Image.Image:
    im = text.copy()
    px = im.load()
    hi = (255, 255, 255)
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if r < 110 and g < 130 and b < 185 and b >= r:
                lum = 0.299 * r + 0.587 * g + 0.114 * b
                t = max(t_floor, min(1.0, lum / 135.0))
                px[x, y] = (
                    int(lo[0] + (hi[0] - lo[0]) * t),
                    int(lo[1] + (hi[1] - lo[1]) * t),
                    int(lo[2] + (hi[2] - lo[2]) * t),
                    a,
                )
    return im


def halo_glow(lockup: Image.Image, radius=16, strength=255) -> Image.Image:
    """Soft white bloom behind the whole mark (backlit signage look)."""
    a = lockup.split()[3].point(lambda v: min(255, v * strength // 255))
    mask = a.filter(ImageFilter.GaussianBlur(radius))
    glow = Image.new("RGBA", lockup.size, (255, 255, 255, 0))
    glow.putalpha(mask.point(lambda v: int(v * 0.9)))
    out = Image.alpha_composite(glow, lockup)
    return out


def strip(bg, lockup: Image.Image, label: str, h=104, w=1240, label_color=(255, 255, 255, 255)):
    canvas = Image.new("RGBA", (w, h), bg)
    lh = int(h * 0.62)
    lw = int(lockup.width * lh / lockup.height)
    l2 = lockup.resize((lw, lh), Image.LANCZOS)
    canvas.alpha_composite(l2, (56, (h - lh) // 2 - 6))
    d = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    except Exception:
        font = ImageFont.load_default()
    d.text((56, h - 30), label, font=font, fill=label_color)
    return canvas


def main():
    emblem, text = load_parts()

    wide_a = Image.open(BRAND / "logo-wide-dark.png").convert("RGBA")      # current
    wide_b = compose(emblem, reverse_letters(text))                        # crisp v2
    wide_c = halo_glow(compose(emblem, text))                              # halo
    wide_d = compose(emblem, text)                                         # original

    wide_b.save(OUT / "navbar-v2-crisp.png")
    wide_c.save(OUT / "navbar-halo.png")

    rows = [
        strip(NAVY, wide_a, "A.  Current — reversed white letters, soft glow (live on site)"),
        strip(NAVY, wide_b, "B.  Crisp white — brighter bevel, higher contrast (RECOMMENDED for dark bar)"),
        strip(NAVY, wide_c, "C.  Backlit original — navy letters over a white light bloom"),
    ]
    d_row = strip(IVORY, wide_d, "D.  Original artwork, untouched — on a light ivory header",
                  label_color=(10, 25, 47, 255))
    rows.append(d_row)

    W = max(r.width for r in rows)
    H = sum(r.height for r in rows) + 12 * (len(rows) - 1)
    sheet = Image.new("RGBA", (W, H), (15, 23, 42, 255))
    y = 0
    for r in rows:
        sheet.alpha_composite(r, (0, y))
        y += r.height + 12
    sheet.save(OUT / "navbar-options.png")
    print("sheet:", sheet.size, "->/tmp/navbar-options.png")


if __name__ == "__main__":
    main()
