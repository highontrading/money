"""Render a still at the end of every narration line and tile them into contact sheets.

usage: review.py <composition-id> <timeline.json> <out_dir> [L011-L030] [--mid]
The optional range limits it to those lines; --mid also grabs the middle of each line.
Works for 9:16 Reels and 16:9 long-form (tile size follows the frame).
"""
import glob, json, os, re, subprocess, sys
from PIL import Image

comp, tl, out = sys.argv[1:4]
rng = next((a for a in sys.argv[4:] if re.match(r"L\d+-L\d+", a)), None)
os.makedirs(out, exist_ok=True)
for f in glob.glob(os.path.join(out, "*.jpg")): os.remove(f)
lines = json.load(open(tl))["lines"]
if rng:
    a, b = (int(x[1:]) for x in rng.split("-"))
    lines = [l for l in lines if a <= int(l["id"][1:]) <= b]
frames = []
for l in lines:
    if "--mid" in sys.argv: frames.append(str((l["start"] + l["end"]) // 2))
    frames.append(str(l["end"] - 6))
subprocess.run(["node", "tools/stills.mjs", out, *frames], env={**os.environ, "COMP": comp}, check=True, stdout=subprocess.DEVNULL)
fs = sorted(glob.glob(os.path.join(out, "f*.jpg")), key=lambda f: int(re.findall(r"\d+", os.path.basename(f))[0]))
if not fs: sys.exit("no stills")
w0, h0 = Image.open(fs[0]).size
tw, th, cols, per = ((270, 480, 5, 10) if h0 > w0 else (480, 270, 3, 9))
for k in range(0, len(fs), per):
    ims = [Image.open(f).resize((tw, th)) for f in fs[k:k + per]]
    o = Image.new("RGB", (tw * cols, th * ((len(ims) + cols - 1) // cols)), "white")
    for i, im in enumerate(ims): o.paste(im, ((i % cols) * tw, (i // cols) * th))
    o.save(os.path.join(out, f"grid{k // per}.jpg"), quality=85)
print(len(fs), "stills")
