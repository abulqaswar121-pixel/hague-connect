#!/usr/bin/env python3
"""Process the Hague Import & Export logo: key out white bg (edge flood fill),
trim, split emblem from typography, emit favicons + og card."""
import sys
from collections import deque
from PIL import Image

WHITE_TOL = 28
GAP_SCAN_LO = 0.38
GAP_SCAN_HI = 0.78


def flood_remove_white(im):
    """Remove edge-connected white background AND the soft gray drop-shadow halo.

    White key: brightness >= 200, near-white distance <= tol.
    Shadow key: low-saturation grayish pixels (the render's drop shadows) that
    the flood reaches while travelling through white — faded by brightness so
    they dissolve smoothly. Enclosed whites (globe clouds) are never
    edge-connected, so they survive.
    """
    w, h = im.size
    px = im.load()

    def is_white(p):
        return p[0] >= 245 and p[1] >= 240 and p[2] >= 240 and p[3] > 0

    def grayish(p):
        mn = min(p[0], p[1], p[2])
        mx = max(p[0], p[1], p[2])
        return (mx - mn) <= 42 and mn >= 85

    visited = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_white(px[x, y]) and not visited[y * w + x]:
                visited[y * w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_white(px[x, y]) and not visited[y * w + x]:
                visited[y * w + x] = 1
                q.append((x, y))

    while q:
        x, y = q.popleft()
        pr, pg, pb, pa = px[x, y]
        mn = min(255 - pr, 255 - pg, 255 - pb)  # distance from pure white
        if mn <= WHITE_TOL + 12:
            # hard-cut the near-white veil (shadows, floor glow); feather only
            # the last few pixels before saturated art begins
            if mn <= 22:
                alpha = 0
            else:
                alpha = max(0, min(255, int(((mn - 22) / (WHITE_TOL - 10)) * 255)))
        else:
            # gray drop-shadow / floor-haze pixel reached by the flood: drop it
            alpha = 0
        px[x, y] = (pr, pg, pb, alpha)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny * w + nx]:
                p = px[nx, ny]
                if p[3] == 0:
                    visited[ny * w + nx] = 1
                    continue
                if (p[0] >= 200 and p[1] >= 200 and p[2] >= 200
                        and min(255 - p[0], 255 - p[1], 255 - p[2]) <= WHITE_TOL + 12) or grayish(p):
                    visited[ny * w + nx] = 1
                    q.append((nx, ny))
    return im


def trim(im, pad=0, alpha_floor=40):
    """Trim to bbox of pixels with alpha above `alpha_floor` (ignores keyed haze)."""
    a = im.getchannel("A").point(lambda v: 255 if v > alpha_floor else 0)
    bbox = a.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def row_densities(im):
    a = im.getchannel("A")
    w, h = im.size
    data = a.tobytes()
    return [sum(1 for v in data[y * w:(y + 1) * w] if v > 12) / w for y in range(h)]


def clear_subtitle_counters(im, cut):
    """Key out the white fill trapped inside the subtitle's closed letterforms
    (counters of P, O, R, & ...) so underlying surfaces show through like a
    die-cut sign. Operates only inside the detected subtitle band; bevel
    highlights on letter edges are preserved."""
    from collections import deque

    W, H = im.size
    px = im.load()

    def is_orange(r, g, b):
        return r > 160 and (r - g) > 50 and g < 180 and b < 140

    # --- locate subtitle band: rows inside text region with strong orange share
    orange_rows = []
    for y in range(cut, H):
        opaque = orange = 0
        for x in range(W):
            r, g, b, a = px[x, y]
            if a > 40:
                opaque += 1
                if is_orange(r, g, b):
                    orange += 1
        if opaque and orange / opaque > 0.25:
            orange_rows.append(y)
    if not orange_rows:
        return im
    y0 = max(cut, min(orange_rows) - 6)
    y1 = min(H - 1, max(orange_rows) + 6)

    # --- core white mask within band
    def core_white(x, y):
        r, g, b, a = px[x, y]
        return a > 40 and r > 232 and g > 232 and b > 232

    target = [[core_white(x, y) for x in range(W)] for y in range(y0, y1 + 1)]
    hgt = y1 - y0 + 1
    visited = [[False] * W for _ in range(hgt)]

    # flood from band edges: whites connected to the outside are kept
    dq = deque()
    for x in range(W):
        for yy in (0, hgt - 1):
            if target[yy][x]:
                dq.append((x, yy))
    for yy in range(hgt):
        for xx in (0, W - 1):
            if target[yy][xx]:
                dq.append((xx, yy))
    while dq:
        x, yy = dq.popleft()
        if visited[yy][x] or not target[yy][x]:
            continue
        visited[yy][x] = True
        for nx, ny in ((x - 1, yy), (x + 1, yy), (x, yy - 1), (x, yy + 1)):
            if 0 <= nx < W and 0 <= ny < hgt:
                dq.append((nx, ny))

    cleared = []
    for yy in range(hgt):
        for x in range(W):
            if target[yy][x] and not visited[yy][x]:
                r, g, b, _a = px[x, y0 + yy]
                px[x, y0 + yy] = (r, g, b, 0)
                cleared.append((x, y0 + yy))

    # eat the anti-aliased salmon rim around cleared counters
    def rim_like(x, y):
        r, g, b, a = px[x, y]
        if a <= 40:
            return False
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        if lum < 150 or min(r, g, b) < 110:
            return False
        return not is_orange(r, g, b)

    cleared_set = set(cleared)
    for _ in range(4):
        grown = set()
        for (x, y) in cleared_set:
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < W and 0 <= ny < H and (nx, ny) not in cleared_set and rim_like(nx, ny):
                    grown.add((nx, ny))
        if not grown:
            break
        for (x, y) in grown:
            r, g, b, _a = px[x, y]
            px[x, y] = (r, g, b, 0)
        cleared_set |= grown
    return im


def split_emblem(im):
    d = row_densities(im)
    h = im.height
    lo, hi = int(h * GAP_SCAN_LO), int(h * GAP_SCAN_HI)
    best_len, best_mid, run_start = 0, -1, None
    for y in range(lo, hi):
        if d[y] < 0.01:
            if run_start is None:
                run_start = y
        elif run_start is not None:
            length = y - run_start
            if length > best_len:
                best_len, best_mid = length, (run_start + y) // 2
            run_start = None
    if run_start is not None and hi - run_start > best_len:
        best_len, best_mid = hi - run_start, (run_start + hi) // 2
    if best_mid < 0:
        best_mid = int(h * 0.66)
    return best_mid


def main():
    SRC = sys.argv[1]
    OUT = sys.argv[2]
    im = Image.open(SRC).convert("RGBA")
    im = flood_remove_white(im)
    im = trim(im, pad=10)
    cut = split_emblem(im)
    im = clear_subtitle_counters(im, cut)
    emblem = trim(im.crop((0, 0, im.width, cut)), pad=10)
    full = trim(im, pad=10)

    emblem.save(f"{OUT}/logo-emblem.png")
    full.save(f"{OUT}/logo-full.png")

    for size, name, bg in ((32, "favicon-32.png", None), (180, "apple-touch-icon.png", (255, 255, 255, 255)), (512, "emblem-512.png", None)):
        e = emblem.copy()
        e.thumbnail((size - int(size * 0.12), size - int(size * 0.12)), Image.LANCZOS)
        canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
        canvas.paste(e, ((size - e.width) // 2, (size - e.height) // 2), e)
        canvas.save(f"{OUT}/{name}")

    og = Image.new("RGB", (1200, 630), (255, 255, 255))
    f = full.copy()
    f.thumbnail((900, 500), Image.LANCZOS)
    og.paste(f, ((1200 - f.width) // 2, (630 - f.height) // 2), f)
    og.save(f"{OUT}/og-logo.png", quality=92)

    print("full:", full.size, "emblem:", emblem.size, "cut-at:", cut)


if __name__ == "__main__":
    main()
