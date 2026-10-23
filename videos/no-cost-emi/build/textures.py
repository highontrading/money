# Procedural paper textures, blue backdrop, grain frames and halftone cut-outs.
import numpy as np, os, math
from PIL import Image, ImageFilter, ImageDraw
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
rng = np.random.default_rng(7)

def fbm(h, w, octaves=5, base=4):
    out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0
    for o in range(octaves):
        s = base * 2 ** o
        n = rng.random((s + 1, int(s * w / h) + 1)).astype(np.float32)
        img = Image.fromarray((n * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        out += amp * (np.asarray(img, np.float32) / 255); tot += amp; amp *= 0.55
    return out / tot

def fibers(h, w, n, alpha):
    im = Image.new("L", (w, h), 0); d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y = rng.random() * w, rng.random() * h; a = rng.random() * math.pi; L = rng.uniform(6, 30)
        d.line([(x, y), (x + L * math.cos(a), y + L * math.sin(a))], fill=int(rng.uniform(80, 255)), width=1)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(0.6)), np.float32) / 255 * alpha

def paper(name, rgb, size=1024, mottling=0.07, grain=0.05, fib=0.06):
    h = w = size
    m = fbm(h, w) - 0.5
    g = rng.normal(0, 1, (h, w)).astype(np.float32)
    f = fibers(h, w, 2500, 1)
    base = np.array(rgb, np.float32)[None, None, :] / 255
    lum = 1 + m[..., None] * mottling * 2 + g[..., None] * grain * 0.3 - f[..., None] * fib
    img = np.clip(base * lum, 0, 1)
    Image.fromarray((img * 255).astype(np.uint8)).save(os.path.join(A, name), quality=92)

paper("paper_cream.jpg", (241, 234, 219))
paper("paper_aged.jpg", (228, 216, 192), mottling=0.12)
paper("paper_news.jpg", (222, 216, 200), mottling=0.08, grain=0.08)
paper("paper_white.jpg", (247, 245, 240), mottling=0.04, grain=0.03, fib=0.03)

# Blue backdrop with mottling, slight vignette
H, W = 1920, 1080
m = fbm(H, W, 6, 3) - 0.5
g = rng.normal(0, 1, (H, W)).astype(np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
v = ((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.7)) ** 2
base = np.array([111, 146, 184], np.float32) / 255
lum = 1 + m * 0.16 + g * 0.025 - v * 0.18 - fibers(H, W, 3000, 0.05)
bg = np.clip(base[None, None, :] * lum[..., None], 0, 1)
Image.fromarray((bg * 255).astype(np.uint8)).save(os.path.join(A, "bg_blue.jpg"), quality=93)

# Grain overlay frames (neutral grey, used with overlay blend)
for k in range(4):
    n = rng.normal(128, 26, (H // 2, W // 2)).clip(0, 255).astype(np.uint8)
    Image.fromarray(n).resize((W, H), Image.NEAREST).save(os.path.join(A, f"grain{k}.png"))

# Halftone cut-outs
def halftone(src, out, cell=11, angle=45, border=22, scale=1.0):
    im = Image.open(src).convert("RGBA")
    if scale != 1: im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    pad = border * 2
    big = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0)); big.paste(im, (pad, pad))
    alpha = np.asarray(big.split()[3], np.float32) / 255
    lum = np.asarray(big.convert("L"), np.float32) / 255
    lum = np.where(alpha > 0.01, lum, 1.0)
    # contrast boost like a newspaper print
    lum = np.clip((lum - 0.5) * 1.35 + 0.55, 0, 1)
    h, w = lum.shape
    ss = 3  # supersample
    Hs, Ws = h * ss, w * ss
    yy, xx = np.mgrid[0:Hs, 0:Ws].astype(np.float32) / ss
    a = math.radians(angle); c, s = math.cos(a), math.sin(a)
    u = (xx * c + yy * s) / cell; vv = (-xx * s + yy * c) / cell
    fu, fv = u - np.floor(u) - 0.5, vv - np.floor(vv) - 0.5
    dist = np.sqrt(fu ** 2 + fv ** 2)
    L = np.asarray(Image.fromarray((lum * 255).astype(np.uint8)).resize((Ws, Hs), Image.BILINEAR), np.float32) / 255
    radius = np.sqrt(np.clip(1 - L, 0, 1)) * 0.62
    ink = (dist < radius).astype(np.float32)
    ink = np.asarray(Image.fromarray((ink * 255).astype(np.uint8)).resize((w, h), Image.LANCZOS), np.float32) / 255
    # cut-out silhouette: dilate alpha, roughen edge
    mask = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(border * 2 + 1 if border * 2 + 1 < 60 else 59))
    mk = np.asarray(mask.filter(ImageFilter.GaussianBlur(2)), np.float32) / 255
    noise = (fbm(h, w, 4, 24) - 0.5) * 0.9
    cut = (mk + noise * 0.35 > 0.5).astype(np.float32)
    cut = np.asarray(Image.fromarray((cut * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), np.float32) / 255
    paperc = np.array([243, 239, 230], np.float32) / 255
    pt = 1 + (fbm(h, w, 4, 6) - 0.5) * 0.08
    rgb = paperc[None, None, :] * pt[..., None] * (1 - ink[..., None] * 0.93)
    rgba = np.dstack([np.clip(rgb, 0, 1), cut])
    Image.fromarray((rgba * 255).astype(np.uint8), "RGBA").save(out)

for n in ["phone", "card", "bank", "bag", "person", "calendar"]:
    halftone(os.path.join(A, "svg", n + ".png"), os.path.join(A, "ht_" + n + ".png"), cell=10)
    print("halftone", n)
