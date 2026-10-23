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

def whoosh():
    """paper sheet sweeping past the lens: band of noise that swells and sweeps down."""
    n = int(0.7 * SR); t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    for k, (lo, hi) in enumerate([(2500, 7000), (1200, 3500), (500, 1800)]):   # sweep down through bands
        w = np.exp(-((t - 0.25 - k * 0.08) / 0.11) ** 2)
        out += band(x, lo, hi) * w
    return norm(out, 0.2)

sfx = np.zeros(N)
for e in EV:
    k = e["kind"]
    s = {"slap": slap, "stamp": stamp, "tape": tape, "slide": slide, "key": key, "whoosh": whoosh}.get(k)
    snd = draw(e["dur"]) if k == "draw" else s() if s else None
    if snd is None: continue
    i = int(max(e["t"], 0) * SR)
    j = min(N, i + len(snd)); sfx[i:j] += snd[: j - i]

def load(path, ch=1):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32).astype(np.float64)
    return x.reshape(-1, ch) if ch > 1 else x

def fit(x):
    out = np.zeros((N,) + x.shape[1:]); out[: min(N, len(x))] = x[:N]; return out

# voice polish first, so the music ducks against the voice we actually hear
vproc = os.path.join(ROOT, "voice_proc.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(ROOT, "voice_raw.wav"), "-af",
                "highpass=f=75,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-22dB:ratio=3:attack=5:release=90",
                "-ar", str(SR), vproc], check=True)
voice = fit(load(vproc))
# voice envelope -> ducking curve (fast attack, slow release)
win = int(0.03 * SR)
env = np.sqrt(np.convolve(voice ** 2, np.ones(win) / win, "same"))
active = env > env.max() * 0.06
duck = np.where(active, 1.0, 0.0)
k = int(0.35 * SR)                                   # hold/release smoothing
duck = np.convolve(duck, np.ones(k) / k, "same").clip(0, 1)
vrms = np.sqrt(np.mean(voice[active] ** 2))
music_path = os.path.join(ROOT, "music.wav")
if os.path.exists(music_path):
    music = fit(load(music_path, 2))
    mrms = np.sqrt(np.mean(music ** 2)) + 1e-9
    base = vrms / mrms * 10 ** (-15 / 20)            # music sits 15 dB under the voice...
    gain = base * (1 - duck * (1 - 10 ** (-7 / 20)))  # ...and ducks 7 dB more while words are spoken
    music = music * gain[:, None]
else:
    music = np.zeros((N, 2))
room = band(rng.normal(0, 1, N), 80, 900) * 0.002
out = np.stack([voice, voice], 1) + np.stack([sfx * 0.8, sfx * 0.68], 1) * (vrms / 0.12) + music + room[:, None]
pcm = np.clip(out / (np.abs(out).max() + 1e-9) * 0.9, -1, 1).astype(np.float32)
tmp = os.path.join(ROOT, "mix_pre.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", tmp], input=pcm.tobytes(), check=True)
# broadcast loudness for Instagram (~-14 LUFS)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.5:LRA=9",
                "-ar", str(SR), os.path.join(ROOT, "mix.wav")], check=True)
print("mixed", N / SR, "s")
