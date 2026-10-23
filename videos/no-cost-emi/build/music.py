# Background score, cut to the narration: a lo-fi groove whose sections, drops and stops
# follow the scene timeline (no licensed audio, so it is free to use commercially).
import json, os, subprocess
import numpy as np
ROOT = os.path.dirname(os.path.abspath(__file__))
SR = 48000
TL = json.load(open(os.path.join(ROOT, "timeline.json")))
DUR = TL["duration"]
N = int(DUR * SR) + SR
rng = np.random.default_rng(5)
BPM = 88
BEAT = 60 / BPM
STEP = BEAT / 4

def midi(m): return 440 * 2 ** ((m - 69) / 12)

def lowpass(x, fc):
    X = np.fft.rfft(x, axis=0); f = np.fft.rfftfreq(x.shape[0], 1 / SR)
    g = 1 / np.sqrt(1 + (f / fc) ** 4)
    return np.fft.irfft(X * (g[:, None] if x.ndim == 2 else g), x.shape[0], axis=0)

def highpass(x, fc):
    return x - lowpass(x, fc)

# ---- instruments ------------------------------------------------------------------
def ep(f, dur, vel):
    """Rhodes-ish electric piano: soft FM tine + bell transient, tremolo."""
    n = int((dur + 1.2) * SR); t = np.arange(n) / SR
    idx = 1.1 * np.exp(-t / 0.5) + 0.25
    mod = np.sin(2 * np.pi * f * t) * idx
    tone = np.sin(2 * np.pi * f * t + mod) + 0.06 * np.sin(2 * np.pi * 14 * f * t) * np.exp(-t / 0.04)
    env = np.minimum(t / 0.006, 1) * np.exp(-t / 2.2)
    rel = np.clip((dur + 0.25 - t) / 0.25, 0, 1)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.6 * t)
    return tone * env * rel * trem * vel

def bass(f, dur, vel):
    n = int((dur + 0.1) * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(4 * np.pi * f * t) + 0.25 * np.sin(6 * np.pi * f * t)  # harmonics so phones hear it
    env = np.minimum(t / 0.01, 1) * np.clip((dur - t) / 0.08 + 1, 0, 1) * np.exp(-t / 1.4)
    return np.tanh(1.6 * x * env) * vel

def kick(vel):
    n = int(0.45 * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(58 + 110 * np.exp(-t / 0.03)) / SR
    click = highpass(rng.normal(0, 1, n), 1500) * np.exp(-t / 0.004)
    return (np.sin(ph) * np.exp(-t / 0.13) + 0.5 * click) * vel

def snare(vel):
    n = int(0.35 * SR); t = np.arange(n) / SR
    nz = highpass(rng.normal(0, 1, n), 1200) * np.exp(-t / 0.07)
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05)
    return (0.8 * nz + 0.5 * tone) * vel

def hat(vel, open_=False):
    n = int((0.25 if open_ else 0.05) * SR); t = np.arange(n) / SR
    return highpass(rng.normal(0, 1, n), 7000) * np.exp(-t / (0.09 if open_ else 0.012)) * vel

def boom(vel):
    n = int(2.0 * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(38 + 60 * np.exp(-t / 0.08)) / SR
    crash = highpass(rng.normal(0, 1, n), 3000) * np.exp(-t / 0.5) * 0.25
    return (np.sin(ph) * np.exp(-t / 0.7) + crash) * vel

def riser(dur, vel):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 180 * (12 ** (t / dur))
    sweep = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    nz = highpass(rng.normal(0, 1, n), 2000) * 0.5
    return (sweep + nz) * (t / dur) ** 2.2 * vel

def place(buf, x, t, pan=0.0):
    i = int(t * SR)
    if i >= len(buf) or i + len(x) <= 0: return
    if i < 0: x, i = x[-i:], 0
    j = min(len(buf), i + len(x))
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += x[: j - i] * l * 1.414
    buf[i:j, 1] += x[: j - i] * r * 1.414

# ---- harmony + patterns ----------------------------------------------------------------
CHORDS = [  # Fmaj9 - Em7 - Dm9 - Cmaj9, a gentle descending lo-fi loop
    ([53, 57, 60, 64, 67], 41), ([52, 55, 59, 62, 66], 40), ([50, 53, 57, 60, 64], 38), ([48, 52, 55, 59, 62], 36)]
PATTERNS = {
    #           kick steps            snare     hats         bass   ep    lowpass
    "intro":  dict(k=[],              s=[],     h="soft",    b=0,   e=0.55, lp=1300),
    "light":  dict(k=[0, 10],         s=[],     h="eighth",  b=0.6, e=0.6,  lp=3000),
    "full":   dict(k=[0, 7, 10],      s=[4, 12], h="eighth", b=0.9, e=0.6,  lp=6000),
    "heavy":  dict(k=[0, 3, 7, 10],   s=[4, 12], h="16th",   b=1.0, e=0.65, lp=9000),
    "full_b": dict(k=[0, 6, 10],      s=[4, 12], h="eighth", b=0.85, e=0.55, lp=5000),
    "half":   dict(k=[0, 11],         s=[8],    h="eighth",  b=0.7, e=0.7,  lp=4000),
    "outro":  dict(k=[0],             s=[],     h="soft",    b=0.5, e=0.75, lp=2500),
}

def segment(t0, t1, pat, tail=1.5):
    """Render one section on its own grid anchored at t0 (so downbeats land on the cut)."""
    p = PATTERNS[pat]
    n = int((t1 - t0 + tail) * SR)
    drums = np.zeros((n, 2)); keys = np.zeros((n, 2)); low = np.zeros((n, 2))
    bar = 16 * STEP
    nbars = int(np.ceil((t1 - t0) / bar)) + 1
    for b in range(nbars):
        tb = b * bar
        notes, root = CHORDS[b % 4]
        if tb < t1 - t0:
            for k, m in enumerate(notes):   # gently strummed chord, re-touched on beat 3
                place(keys, ep(midi(m), bar * 0.95, 0.5 * p["e"]), tb + k * 0.012, pan=(k - 2) * 0.25)
                place(keys, ep(midi(m + 12 if k == len(notes) - 1 else m), bar * 0.4, 0.2 * p["e"]), tb + 10 * STEP + k * 0.01, pan=(2 - k) * 0.2)
            if p["b"]:
                place(low, bass(midi(root + 12), bar * 0.45, 0.2 * p["b"]), tb)
                place(low, bass(midi(root + 12), bar * 0.2, 0.14 * p["b"]), tb + 10 * STEP)
        for s in range(16):
            ts = tb + s * STEP + (0.33 * STEP if s % 4 == 2 else 0)    # swing the off-eighths
            if ts >= t1 - t0: break
            if s in p["k"]: place(drums, kick(0.55), ts)
            if s in p["s"]: place(drums, snare(0.6), ts, pan=0.05)
            hv = None
            if p["h"] == "soft" and s % 4 == 2: hv = 0.10
            elif p["h"] == "eighth" and s % 2 == 0: hv = 0.24 if s % 4 == 2 else 0.14
            elif p["h"] == "16th": hv = [0.16, 0.06, 0.12, 0.07][s % 4]
            if hv: place(drums, hat(hv * rng.uniform(0.8, 1.1), open_=(s == 14 and p["h"] != "soft")), ts, pan=0.3)
    # cut off on t1 with a short fade, but let keys ring through the transition
    t = np.arange(n) / SR
    dry_end = np.clip(((t1 - t0) + 0.04 - t) / 0.04, 0, 1)
    ring = np.clip(((t1 - t0) + tail - t) / tail, 0, 1) ** 2
    return lowpass(keys, p["lp"]) * ring[:, None] + (low + lowpass(drums, max(p["lp"] * 1.6, 3000))) * dry_end[:, None]

def tape_stop(x, dur):
    """slow the last `dur` seconds of x down to a halt (pitch + speed drop)."""
    n = int(dur * SR)
    head, tail = x[:-n], x[-n:]
    u = np.linspace(0, 1, n)
    pos = np.cumsum(1 - u) ; pos = pos / pos[-1] * (n * 0.5)
    out = np.stack([np.interp(pos, np.arange(n), tail[:, c]) for c in range(2)], 1) * (1 - u[:, None] ** 2)
    return np.concatenate([head, out])

def reverb(x, secs=1.8, mix=0.22):
    n = int(secs * SR); t = np.arange(n) / SR
    ir = rng.normal(0, 1, (n, 2)) * np.exp(-t / (secs / 4))[:, None]
    ir = lowpass(ir, 5000); ir /= np.sqrt((ir ** 2).sum(0))
    L = len(x) + n
    nfft = 1 << (L - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, nfft, axis=0) * np.fft.rfft(ir, nfft, axis=0), nfft, axis=0)[: len(x)]
    return x + wet * mix

# ---- arrangement from the timeline ---------------------------------------------------
lines = TL["lines"]
scenes = []
for l in lines:
    if not scenes or scenes[-1][0] != l["scene"]: scenes.append([l["scene"], l["start"], l["end"]])
    else: scenes[-1][2] = l["end"]
def cut_after(name):
    k = [s[0] for s in scenes].index(name)
    return round((scenes[k][2] + scenes[k + 1][1]) / 2 * 15) / 15
brk, drop = lines[12]["start"], lines[13]["start"] - 0.05
plan = [
    (0.0, cut_after("hook"), "intro"),
    (cut_after("hook"), cut_after("three"), "light"),
    (cut_after("three"), brk + 0.45, "full"),
    (drop, cut_after("twist"), "heavy"),
    (cut_after("twist"), cut_after("fine"), "full_b"),
    (cut_after("fine"), cut_after("land"), "half"),
    (cut_after("land"), DUR - 1.2, "outro"),
]
music = np.zeros((N, 2))
for t0, t1, pat in plan:
    seg = segment(t0, t1, pat)
    if pat == "full":               # "Par... ab aata hai asli khel": the beat grinds to a halt
        seg = tape_stop(seg[: int((t1 - t0) * SR)], 0.6)
    i = int(t0 * SR); j = min(N, i + len(seg)); music[i:j] += seg[: j - i]
# break: low drone + riser into the drop, then an impact on the drop
place(music, riser(drop - brk + 0.15, 0.22), brk - 0.1, pan=0)
n = int((drop - brk) * SR); t = np.arange(n) / SR
drone = (np.sin(2 * np.pi * midi(38) * t) + 0.4 * np.sin(2 * np.pi * midi(50) * t)) * np.minimum(t / 0.3, 1) * 0.08
place(music, drone, brk)
place(music, boom(0.55), drop)
# small lift into the hook's question and a soft hit on the RBI reveal
place(music, riser(1.2, 0.10), cut_after("hook") - 1.2)
place(music, boom(0.25), cut_after("hook"))
# vinyl crackle + hiss bed for warmth
crack = (rng.random(N) < 0.0009) * rng.normal(0, 1, N) * 0.25
hiss = lowpass(rng.normal(0, 1, N), 6000) * 0.006
music += np.stack([crack + hiss, np.roll(crack, 7) + hiss], 1)
music = highpass(reverb(music), 45)
# fade the very end
t = np.arange(N) / SR
music *= np.clip((DUR + 0.3 - t) / 1.6, 0, 1)[:, None]
music = np.tanh(music * 1.2) / 1.2
music /= np.abs(music).max() + 1e-9
music *= 0.7
out = os.path.join(ROOT, "music.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", out],
               input=music[: int(DUR * SR)].astype(np.float32).tobytes(), check=True)
print("music", round(DUR, 2), "s; sections:", [(round(a, 2), p) for a, _, p in plan], "drop at", round(drop, 2))
