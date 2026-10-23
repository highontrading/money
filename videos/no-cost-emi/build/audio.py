# Synthesize paper/stamp/tape/marker/typewriter SFX from noise and mix them under the voice.
import json, os, subprocess, numpy as np
ROOT = os.path.dirname(os.path.abspath(__file__))
SR = 48000
rng = np.random.default_rng(11)
TL = json.load(open(os.path.join(ROOT, "timeline.json")))
EV = json.load(open(os.path.join(ROOT, "sfx.json")))
N = int((TL["duration"] + 0.5) * SR)

def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.clip((f - lo * 0.7) / (lo * 0.3 + 1), 0, 1) * np.clip((hi * 1.3 - f) / (hi * 0.3), 0, 1)
    return np.fft.irfft(X * m, len(x))

def env(n, att, dec):
    t = np.arange(n) / SR
    return np.minimum(t / max(att, 1e-4), 1) * np.exp(-t / dec)

def norm(x, peak):
    return x / (np.abs(x).max() + 1e-9) * peak

def slap():
    n = int(0.18 * SR)
    hit = band(rng.normal(0, 1, n), 700, 5000) * env(n, 0.002, 0.03)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * (140 - 60 * t / 0.18) * t) * env(n, 0.001, 0.035)
    return norm(hit + thump * 0.8, 0.22)

def stamp():
    n = int(0.35 * SR); t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * (95 - 40 * t) * t) * env(n, 0.001, 0.07)
    click = band(rng.normal(0, 1, n), 300, 3000) * env(n, 0.0005, 0.02)
    return norm(thud + click * 0.9, 0.42)

def tape():
    n = int(0.22 * SR)
    crackle = (rng.random(n) < 0.08).astype(float) * rng.normal(0, 1, n)
    x = band(rng.normal(0, 1, n) * 0.4 + crackle, 1500, 9000)
    e = np.minimum(np.arange(n) / (0.03 * SR), 1) * np.linspace(1, 0.2, n)
    return norm(x * e, 0.14)

def slide():
    n = int(0.42 * SR)
    x = band(rng.normal(0, 1, n), 400, 4000)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return norm(x * e, 0.12)

def draw(dur):
    n = int(max(dur, 0.15) * SR); t = np.arange(n) / SR
    x = band(rng.normal(0, 1, n), 1800, 6500)
    am = 0.55 + 0.45 * np.sin(2 * np.pi * rng.uniform(9, 14) * t) ** 2
    e = np.minimum(t / 0.02, 1) * np.minimum((t[-1] - t) / 0.04 + 0.01, 1)
    return norm(x * am * e, 0.07)

def key():
    n = int(0.05 * SR)
    x = band(rng.normal(0, 1, n), 1200, 7000) * env(n, 0.0005, 0.006)
    return norm(x, rng.uniform(0.06, 0.1))

sfx = np.zeros(N)
for e in EV:
    k = e["kind"]
    s = {"slap": slap, "stamp": stamp, "tape": tape, "slide": slide, "key": key}.get(k)
    snd = draw(e["dur"]) if k == "draw" else s() if s else None
    if snd is None: continue
    i = int(max(e["t"], 0) * SR)
    j = min(N, i + len(snd)); sfx[i:j] += snd[: j - i]

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)

voice = load(os.path.join(ROOT, "voice_raw.wav"))
mix_v = np.zeros(N); mix_v[: min(N, len(voice))] = voice[:N]
# soft room tone so silence never feels dead
room = band(rng.normal(0, 1, N), 80, 900) * 0.004
out = np.stack([mix_v, mix_v], 1) * 0.9 + np.stack([sfx * 0.9, sfx * 0.75], 1) + room[:, None]
pcm = np.clip(out, -1, 1).astype(np.float32)
tmp = os.path.join(ROOT, "mix_pre.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", tmp], input=pcm.tobytes(), check=True)
# voice polish + broadcast loudness for Instagram (~-14 LUFS)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af",
                "highpass=f=70,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-14:TP=-1.5:LRA=9",
                "-ar", str(SR), os.path.join(ROOT, "mix.wav")], check=True)
print("mixed", N / SR, "s")
