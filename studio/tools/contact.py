"""Contact sheet of stills: contact.py out.jpg cols img1 img2 ... (labels = file names)."""
import sys
from PIL import Image, ImageDraw
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert("RGB") for f in files]
w, h = ims[0].size; s = 0.5
tw, th = int(w * s), int(h * s)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * (th + 24)), "white")
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = (i % cols) * tw, (i // cols) * (th + 24)
    sheet.paste(im.resize((tw, th)), (x, y + 24)); d.text((x + 4, y + 4), f.split("/")[-1], fill="black")
sheet.save(out, quality=85)
