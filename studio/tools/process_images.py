"""Turn raw downloads into the episode's paper look.

- textures: neutral, low-contrast paper / kraft / newsprint tiles used with multiply blending
- background: full 1080x1920 desk paper
- photos: B&W "magazine cut-out" treatment (contrast curve, slight halftone, grain)
- grain frames and an ink mask for stamps
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "img")
OUT = os.path.join(ROOT, "proc")
rng = np.random.default_rng(7)


def save(arr, name, q=90):
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    im.save(os.path.join(OUT, name), quality=q) if name.endswith(".jpg") else im.save(os.path.join(OUT, name))


def fbm(h, w, octaves=5, base=64):
    """Fractal value noise in [0,1]."""
    acc = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        s = max(2, base // (2 ** o))
        small = rng.random((h // s + 2, w // s + 2))
        layer = np.array(Image.fromarray((small * 255).astype(np.uint8)).resize((w + 2 * s, h + 2 * s), Image.BICUBIC))[:h, :w] / 255
        acc += layer * amp; tot += amp; amp *= 0.55
    return acc / tot


def fibers(h, w, n=900):
    """Thin random fibres like in uncoated paper."""
    im = Image.new("L", (w, h), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y = rng.random() * w, rng.random() * h
        a = rng.random() * np.pi; L = 8 + rng.random() * 30
        d.line([(x, y), (x + np.cos(a) * L, y + np.sin(a) * L)], fill=int(40 + rng.random() * 60), width=1)
    return np.array(im.filter(ImageFilter.GaussianBlur(0.6))) / 255


def neutral_texture(src, size, name, tint=None, strength=1.0):
    """Paper scan -> mostly-white luminance texture (for multiply)."""
    w, h = size
    if src and os.path.exists(src):
        im = ImageOps.fit(Image.open(src).convert("L"), (w, h), Image.LANCZOS)
        a = np.array(im, dtype=np.float32)
        a = a - a.mean()
        a = a / (a.std() + 1e-6)
    else:
        a = (fbm(h, w) - 0.5) * 4
    a = a * 0.6 + (fbm(h, w, 4, 16) - 0.5) * 1.2 - fibers(h, w, w * h // 1500) * 1.5
    lum = 236 + a * 9 * strength
    rgb = np.stack([lum, lum, lum], -1)
    if tint is not None:
        rgb = rgb * np.array(tint)[None, None, :] / 255
    save(rgb, name)


def background(src):
    w, h = 1080, 1920
    if src and os.path.exists(src):
        im = ImageOps.fit(Image.open(src).convert("L"), (w, h), Image.LANCZOS)
        a = np.array(im, dtype=np.float32); a = (a - a.mean()) / (a.std() + 1e-6)
    else:
        a = (fbm(h, w, 6, 256) - 0.5) * 3
    a = a * 1.15 + (fbm(h, w, 4, 24) - 0.5) * 1.0 - fibers(h, w, 2500) * 1.2
    base = np.array([236, 230, 218], dtype=np.float32)
    rgb = base[None, None, :] + a[..., None] * 6.5
    # soft light falloff from top-left, like a desk lamp
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w * 0.3) / w) ** 2 + ((yy - h * 0.25) / h) ** 2)
    rgb *= (1.03 - 0.16 * d ** 1.6)[..., None]
    save(rgb, "bg_paper.jpg", 92)


def photo(src, name, size=(1400, 1400), contrast=1.35, dots=True):
    if not os.path.exists(src):
        print("missing", src); return
    im = Image.open(src).convert("L")
    im.thumbnail(size, Image.LANCZOS)
    a = np.array(ImageOps.autocontrast(im, cutoff=1), dtype=np.float32) / 255
    a = np.clip((a - 0.5) * contrast + 0.5, 0, 1)
    a = a ** 0.95
    if dots:
        # subtle AM halftone mixed into the photo (newsprint feel without losing detail)
        h, w = a.shape; p = 7
        yy, xx = np.mgrid[0:h, 0:w]
        ang = np.deg2rad(45)
        u = (xx * np.cos(ang) + yy * np.sin(ang)) % p - p / 2
        v = (-xx * np.sin(ang) + yy * np.cos(ang)) % p - p / 2
        r = np.sqrt(u * u + v * v) / (p * 0.72)
        ht = (r > (1 - a) ** 0.8).astype(np.float32)
        ht = np.array(Image.fromarray((ht * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))) / 255
        a = a * 0.72 + ht * 0.28
    a = a + rng.normal(0, 0.035, a.shape)
    paper = np.array([238, 233, 222]) / 255
    ink = np.array([22, 20, 18]) / 255
    rgb = ink[None, None, :] + (paper - ink)[None, None, :] * np.clip(a, 0, 1)[..., None]
    save(rgb * 255, name, 88)


def grain():
    for i in range(6):
        g = rng.normal(128, 38, (960, 540))
        g = np.array(Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).resize((1080, 1920), Image.BILINEAR))
        save(g, f"grain_{i}.png")


def ink_mask():
    h = w = 420
    n = fbm(h, w, 5, 32)
    speck = rng.random((h, w)) > 0.985
    m = np.clip((n - 0.25) * 3.2, 0, 1)
    m[speck] = 0
    m = np.array(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)))
    rgba = np.zeros((h, w, 4), np.uint8); rgba[..., 3] = np.clip(m.astype(np.float32) * 1.25 + 60, 0, 255)
    Image.fromarray(rgba).save(os.path.join(OUT, "ink_mask.png"))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    R = lambda f: os.path.join(ROOT, f)
    what = sys.argv[1:] or ["tex", "bg", "photos", "grain", "ink"]
    if "tex" in what:
        neutral_texture(R("paper_vintage.jpg"), (900, 900), "tex_paper.jpg")
        neutral_texture(R("paper_kraft.jpg"), (900, 900), "tex_kraft.jpg", strength=2.2)
        neutral_texture(None, (900, 900), "tex_news.jpg", tint=(232, 226, 210), strength=0.8)
    if "bg" in what:
        background(R("paper_wrinkled.jpg") if os.path.exists(R("paper_wrinkled.jpg")) else R("paper_kraft.jpg"))
    if "photos" in what:
        photo(R("bse.jpg"), "bse.jpg")
        photo(R("crowd.jpg"), "crowd.jpg")
        photo(R("rickshaw_crowd.jpg"), "rickshaw_crowd.jpg")
        photo(R("phone.jpg"), "phone.jpg", contrast=1.2)
        photo(R("note500.jpg"), "note500.jpg", size=(1600, 800), contrast=1.25, dots=False)
        photo(R("card_terminal.jpg"), "card_terminal.jpg")
        photo(R("gold_jewelry.jpg"), "gold_jewelry.jpg", contrast=1.25)
    if "grain" in what:
        grain()
    if "ink" in what:
        ink_mask()
