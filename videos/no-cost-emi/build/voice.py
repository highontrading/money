# Synthesize each script line with Piper, trim silence, lay out on a timeline.
import json, subprocess, os, numpy as np
ROOT = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(ROOT, "..", "script.json")))
MODEL = os.path.join(ROOT, "voices", "hi_IN-pratham-medium.onnx")
SR = 22050
LEAD = 0.35            # silence before first line
GAP, SCENE_GAP = 0.14, 0.38
os.makedirs(os.path.join(ROOT, "lines"), exist_ok=True)

def synth(i, text):
    out = os.path.join(ROOT, "lines", f"{i:02d}.wav")
    subprocess.run(["piper", "-m", MODEL, "--length-scale", "0.9", "--sentence-silence", "0.12", "-f", out],
                   input=text.encode(), capture_output=True, check=True)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", out, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                         capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    env = np.convolve(np.abs(a), np.ones(220) / 220, "same")
    idx = np.where(env > 0.01)[0]
    a = a[max(idx[0] - 300, 0): idx[-1] + 600]
    return a

track, timeline, t = [np.zeros(int(LEAD * SR), np.float32)], [], LEAD
prev = None
for i, ln in enumerate(S["lines"]):
    if prev is not None:
        g = SCENE_GAP if ln["scene"] != prev else GAP
        track.append(np.zeros(int(g * SR), np.float32)); t += g
    a = synth(i, ln["tts"])
    d = len(a) / SR
    timeline.append({"i": i, "scene": ln["scene"], "start": round(t, 3), "end": round(t + d, 3)})
    track.append(a); t += d; prev = ln["scene"]
track.append(np.zeros(int(2.2 * SR), np.float32)); t += 2.2   # end card hold
v = np.concatenate(track)
v = (np.clip(v, -1, 1) * 32767).astype(np.int16)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
                os.path.join(ROOT, "voice_raw.wav")], input=v.tobytes(), check=True)
json.dump({"duration": round(t, 3), "lines": timeline}, open(os.path.join(ROOT, "timeline.json"), "w"), indent=1)
print("duration", round(t, 2))
for x in timeline: print(x)
