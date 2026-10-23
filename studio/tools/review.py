"""Render a still at the end of every narration line and tile them into contact sheets.

usage: review.py <composition-id> <timeline.json> <out_dir>
"""
import glob, json, os, re, subprocess, sys
from PIL import Image

comp, tl, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)
for f in glob.glob(os.path.join(out, "*.jpg")): os.remove(f)
frames = [str(l["end"] - 6) for l in json.load(open(tl))["lines"]]
subprocess.run(["node", "tools/stills.mjs", out, *frames], env={**os.environ, "COMP": comp}, check=True, stdout=subprocess.DEVNULL)
fs = sorted(glob.glob(os.path.join(out, "f*.jpg")), key=lambda f: int(re.findall(r"\d+", os.path.basename(f))[0]))
for k in range(0, len(fs), 10):
    ims = [Image.open(f).resize((270, 480)) for f in fs[k:k + 10]]
    o = Image.new("RGB", (270 * 5, 480 * 2), "white")
    for i, im in enumerate(ims): o.paste(im, ((i % 5) * 270, (i // 5) * 480))
    o.save(os.path.join(out, f"grid{k // 10}.jpg"), quality=85)
print(len(fs), "stills")
