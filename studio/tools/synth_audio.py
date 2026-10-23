"""Original score + foley for the episode, synthesized from scratch (no licensing).

usage: synth_audio.py timeline.json out_dir [music]
Writes music.wav (follows the scene structure) and sfx_*.wav; with "music", only music.wav.
"""
import json, os, sys
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(3)


def t(n):
    return np.arange(int(n * SR)) / SR


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def env(n, a, d, curve=4.0):
    """attack seconds, then exponential decay over d seconds."""
    tt = t(n)
    e = np.where(tt < a, tt / max(a, 1e-4), np.exp(-(tt - a) * curve / max(d, 1e-4)))
    return e


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- instruments

def marimba(f, dur=0.6, vel=1.0):
    tt = t(dur)
    x = (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 7)
         + 0.35 * np.sin(2 * np.pi * f * 3.93 * tt) * np.exp(-tt * 22)
         + 0.12 * np.sin(2 * np.pi * f * 9.2 * tt) * np.exp(-tt * 40))
    x *= np.minimum(1, tt / 0.002)
    return x * vel


def pad(freqs, dur):
    tt = t(dur)
    x = np.zeros_like(tt)
    for f in freqs:
        for det in (-0.07, 0.0, 0.08):
            ff = f * 2 ** (det / 12)
            ph = rng.random() * 2 * np.pi
            for h in range(1, 6):
                x += np.sin(2 * np.pi * ff * h * tt + ph * h) / (h ** 1.6)
    x = lp(x, 1400)
    a = np.minimum(1, tt / 0.9) * np.minimum(1, (dur - tt) / 0.9)
    return x * a / (len(freqs) * 6)


def sub(f, dur):
    tt = t(dur)
    x = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt)
    return x * np.minimum(1, tt / 0.01) * np.exp(-tt * 2.2)


def kick(dur=0.35):
    tt = t(dur)
    f = 45 + 85 * np.exp(-tt * 30)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
    return x + 0.15 * hp(rng.normal(0, 1, len(tt)), 3000) * np.exp(-tt * 120)


def hat(dur=0.06, bright=7000):
    tt = t(dur)
    return hp(rng.normal(0, 1, len(tt)), bright) * np.exp(-tt * 70)


def shaker(dur=0.09):
    tt = t(dur)
    return bp(rng.normal(0, 1, len(tt)), 4000, 11000) * np.sin(np.pi * tt / dur) ** 2


# ------------------------------------------------------------------- arrange

BPM = 96
BEAT = 60 / BPM
# a curious, slightly melancholic loop: Am9 - Fmaj7 - C(add9) - G6
CHORDS = [
    (57, [57, 60, 64, 67, 71]),
    (53, [53, 57, 60, 64, 67]),
    (48, [52, 55, 60, 62, 67]),
    (55, [55, 59, 62, 64, 67]),
]
TENSION = [(50, [50, 53, 57, 60, 64]), (46, [50, 53, 58, 62, 65])]  # Dm9 / Bb for the risk section
ARP = [0, 2, 4, 3, 1, 3, 4, 2]

# intensity per scene: (pad, arp, bass, kick, hats, tension)
LEVELS = {
    "hook": (1.0, 0.9, 0.0, 0.0, 0.0, 0),
    "gap": (0.9, 0.8, 0.7, 0.0, 1.0, 0),
    "grey": (0.9, 0.9, 0.8, 0.0, 1.0, 0),
    "math": (0.8, 1.0, 1.0, 1.0, 1.0, 0),
    "deals": (0.8, 1.0, 1.0, 1.0, 1.0, 0),
    "settle": (0.8, 1.0, 1.0, 1.0, 0.8, 0),
    "risk": (1.0, 0.5, 0.9, 0.0, 0.6, 1),
    "record": (0.8, 1.0, 1.0, 1.0, 1.0, 0),
    "use": (1.0, 0.8, 0.8, 0.6, 0.7, 0),
    "outro": (1.0, 0.7, 0.6, 0.0, 0.0, 0),
    # generic moods, used through each scene's "mood" (set in the script's "moods" map)
    "build": (0.9, 0.9, 0.7, 0.0, 1.0, 0),
    "drive": (0.8, 1.0, 1.0, 1.0, 1.0, 0),
    "tension": (1.0, 0.5, 0.9, 0.0, 0.6, 1),
    "lift": (1.0, 0.8, 0.8, 0.6, 0.7, 0),
}


def music(tl):
    fps = tl["fps"]; total = tl["duration"] / fps + 2.5
    L = int(total * SR)
    out = np.zeros((L, 2))

    def add(x, at, pan=0.0, gain=1.0):
        i = int(at * SR)
        if i >= L: return
        x = x[: L - i] * gain
        out[i:i + len(x), 0] += x * (1 - max(0, pan))
        out[i:i + len(x), 1] += x * (1 + min(0, pan))

    scenes = [(s.get("mood", s["id"]), s["start"] / fps, s["end"] / fps) for s in tl["scenes"]]
    scenes[-1] = (scenes[-1][0], scenes[-1][1], total)

    bar = 4 * BEAT
    nbars = int(total / bar) + 1
    for b in range(nbars):
        t0 = b * bar
        sc = next((s for s in scenes if s[1] <= t0 + 0.01 < s[2]), scenes[-1])
        lv = LEVELS.get(sc[0], LEVELS["math"])
        prog = TENSION if lv[5] else CHORDS
        root, notes = prog[(b // 2) % len(prog)] if lv[5] else prog[b % len(prog)]
        if b % (2 if lv[5] else 1) == 0:
            add(pad([midi(n) for n in notes[:4]], bar * (2 if lv[5] else 1) + 0.9), t0, 0, 0.55 * lv[0])
        for k in range(8):
            if lv[1] <= 0: break
            n = notes[ARP[(k + b) % 8] % len(notes)] + 12
            vel = (0.55 if k % 2 else 0.8) * lv[1]
            add(marimba(midi(n), 0.7, vel), t0 + k * BEAT / 2, pan=(-0.35 if k % 2 else 0.3), gain=0.32)
        for q in range(4):
            if lv[2] > 0 and q in (0, 2, 3):
                add(sub(midi(root - 12), BEAT * 0.95), t0 + q * BEAT, 0, 0.55 * lv[2])
            if lv[3] > 0 and q in (0, 2):
                add(kick(), t0 + q * BEAT, 0, 0.55 * lv[3])
            if lv[4] > 0:
                add(hat(), t0 + q * BEAT + BEAT / 2, 0.25, 0.10 * lv[4])
                add(shaker(), t0 + q * BEAT + BEAT * 0.75, -0.3, 0.05 * lv[4])

    # final resolution chord under the sign-off
    end = scenes[-1][1]
    add(pad([midi(n) for n in [45, 52, 57, 60, 64]], 5.5), end + 0.5, 0, 0.6)
    for i, n in enumerate([69, 72, 76, 79]):
        add(marimba(midi(n), 1.5, 0.8), end + 0.6 + i * 0.12, 0.2 * (i - 1.5), 0.3)

    # glue: gentle saturation, fade in/out, normalize to -14 dBFS peak-ish
    out = np.tanh(out * 1.4) / 1.4
    fi = int(1.2 * SR); out[:fi] *= np.linspace(0, 1, fi)[:, None]
    fo = int(2.0 * SR); out[-fo:] *= np.linspace(1, 0, fo)[:, None]
    out *= 0.2 / (np.sqrt(np.mean(out ** 2)) + 1e-9)
    return np.clip(out, -0.98, 0.98)


# --------------------------------------------------------------------- foley

def sfx():
    s = {}
    n = rng.normal(0, 1, int(0.6 * SR))
    tt = t(0.18)
    s["drop"] = bp(n[:len(tt)], 900, 5000) * np.exp(-tt * 38) * 0.5 + np.sin(2 * np.pi * 95 * tt) * np.exp(-tt * 40) * 0.45
    tt = t(0.42)
    sweep = bp(n[:len(tt)], 600, 7000) * np.sin(np.pi * tt / 0.42) ** 1.5
    s["slide"] = lp(sweep, 4500) * 0.55
    tt = t(0.6)
    wn = rng.normal(0, 1, len(tt))
    s["whoosh"] = (lp(wn, 1800) * 0.7 + bp(wn, 2000, 6000) * 0.25) * np.sin(np.pi * tt / 0.6) ** 2 * 0.9
    tt = t(0.3)
    s["stamp"] = (np.sin(2 * np.pi * (70 + 60 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 18) * 0.9
                  + bp(rng.normal(0, 1, len(tt)), 300, 3000) * np.exp(-tt * 60) * 0.6)
    tt = t(0.34)
    m = bp(rng.normal(0, 1, len(tt)), 2500, 6500) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * tt)) * np.sin(np.pi * tt / 0.34)
    s["marker"] = m * 0.35
    tt = t(0.05)
    s["tick"] = bp(rng.normal(0, 1, len(tt)), 1500, 6000) * np.exp(-tt * 140) * 0.5
    tt = t(1.1)
    s["coin"] = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) * a for f, d, a in [(2093, 5, 0.5), (3270, 7, 0.35), (4730, 9, 0.25), (6200, 12, 0.15)]) * np.minimum(1, tt / 0.002) * 0.35
    tt = t(0.25)
    s["pop"] = np.sin(2 * np.pi * (300 + 500 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 25) * 0.35
    return s


if __name__ == "__main__":
    import soundfile as sf
    tl = json.load(open(sys.argv[1])); out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    sf.write(os.path.join(out, "music.wav"), music(tl), SR)
    for k, v in (sfx().items() if sys.argv[3:4] != ["music"] else []):
        v = v / (np.abs(v).max() + 1e-9) * 0.8
        sf.write(os.path.join(out, f"sfx_{k}.wav"), v.astype(np.float32), SR)
    print("ok")
