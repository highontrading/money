"""Archival / stock video -> the paper look: B&W, contrast curve, light halftone, grain, 12 fps.

The same treatment as process_images.photo(), frame by frame, so mixed sources
(Commons street video, 1940s Prelinger films) read as one printed style.

usage: process_footage.py key src start_s dur_s [width height] [--dots 0] [--gamma 0.6] [--crop w:h:x:y]
writes public/video/<key>.mp4 (H.264, 12 fps, no audio)
"""
import os, subprocess, sys
import numpy as np

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
FPS = 12
rng = np.random.default_rng(11)


def treat(frame, dots=True, contrast=1.35, gamma=1.0):
    a = frame.astype(np.float32).mean(-1) / 255
    lo, hi = np.percentile(a, 1), np.percentile(a, 99)
    a = np.clip((a - lo) / max(hi - lo, 1e-3), 0, 1)
    a = np.clip(a ** gamma, 0, 1)  # gamma < 1 lifts dark film
    a = np.clip((a - 0.5) * contrast + 0.5, 0, 1) ** 0.95
    if dots:
        h, w = a.shape; p = 6
        yy, xx = np.mgrid[0:h, 0:w]
        ang = np.deg2rad(45)
        u = (xx * np.cos(ang) + yy * np.sin(ang)) % p - p / 2
        v = (-xx * np.sin(ang) + yy * np.cos(ang)) % p - p / 2
        r = np.sqrt(u * u + v * v) / (p * 0.72)
        ht = (r > (1 - a) ** 0.8).astype(np.float32)
        a = a * 0.75 + ht * 0.25
    a = a + rng.normal(0, 0.015, a.shape)  # light; the frame-wide grain overlay does the rest
    paper = np.array([238, 233, 222]) / 255
    ink = np.array([22, 20, 18]) / 255
    rgb = ink[None, None, :] + (paper - ink)[None, None, :] * np.clip(a, 0, 1)[..., None]
    return (rgb * 255).astype(np.uint8)


def main():
    argv = sys.argv[1:]
    args = [a for i, a in enumerate(argv) if not a.startswith("--") and not (i > 0 and argv[i - 1].startswith("--"))]
    key, src, start, dur = args[0], args[1], float(args[2]), float(args[3])
    w, h = (int(args[4]), int(args[5])) if len(args) > 5 else (960, 540)
    opt = lambda k, d: type(d)(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
    dots = opt("--dots", 1) != 0
    gamma = opt("--gamma", 1.0)
    crop = opt("--crop", "")  # ffmpeg crop=w:h:x:y applied to the source first
    os.makedirs(os.path.join(ROOT, "video"), exist_ok=True)
    out = os.path.join(ROOT, "video", key + ".mp4")
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", str(start), "-t", str(dur), "-i", src,
                            "-vf", (f"crop={crop}," if crop else "") + f"fps={FPS},scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}",
                            "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(FPS), "-i", "-",
                            "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    n = 0
    while True:
        buf = dec.stdout.read(w * h * 3)
        if len(buf) < w * h * 3: break
        enc.stdin.write(treat(np.frombuffer(buf, np.uint8).reshape(h, w, 3), dots, gamma=gamma).tobytes()); n += 1
    enc.stdin.close(); enc.wait(); dec.wait()
    print(key, n, "frames", f"{n / FPS:.1f}s")


if __name__ == "__main__":
    main()
