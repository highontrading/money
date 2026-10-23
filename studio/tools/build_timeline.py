"""Assemble narration takes into one track and write the frame-accurate timeline.

usage: build_timeline.py script.json vo_dir public_dir timeline.json [audio_subdir]
- takes are <id>.wav or <id>.mp3; an <id>.json next to a take (ElevenLabs
  character alignment) gives exact phrase timings for the captions
- audio_subdir puts narration.wav / music.wav under public/audio/<subdir>/
- trims each take, speeds it up slightly (pitch preserved), places it with
  breathing gaps (longer at scene changes, which carry the paper wipe)
- aligns caption words to the audio: caption phrases (split at punctuation)
  are matched to the pauses found in the take, words inside a phrase are
  spread by length
"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf

SR = 48000
FPS = 30
TEMPO = float(os.environ.get("TEMPO", "1.08"))
GAP = 0.16
SCENE_GAP = 0.60
LEAD_IN = 0.45
TAIL = 3.2


def load_take(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-af", f"atempo={TEMPO},highpass=f=75,equalizer=f=220:t=q:w=1.2:g=-1.5,equalizer=f=3200:t=q:w=1.4:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=6:release=80:makeup=2", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).copy()
    rms = np.sqrt(np.convolve(a ** 2, np.ones(480) / 480, mode="same"))
    thr = max(rms.max() * 10 ** (-38 / 20), 1e-4)
    voiced = np.where(rms > thr)[0]
    s, e = max(0, voiced[0] - int(0.03 * SR)), min(len(a), voiced[-1] + int(0.06 * SR))
    a = a[s:e]
    load_take.offset = s / SR  # seconds trimmed from the (tempo-adjusted) head
    fade = int(0.01 * SR)
    a[:fade] *= np.linspace(0, 1, fade); a[-fade:] *= np.linspace(1, 0, fade)
    return a


def pauses(a, min_len=0.11):
    hop = int(0.01 * SR)
    fr = np.sqrt(np.add.reduceat(a ** 2, np.arange(0, len(a), hop)) / hop)
    thr = fr.max() * 10 ** (-32 / 20)
    quiet = fr < thr
    out, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if (j - i) * 0.01 >= min_len and i > 5 and j < len(quiet) - 5:
                out.append(((i + j) / 2 * 0.01, (j - i) * 0.01))
            i = j
        else:
            i += 1
    return out  # (center seconds, length)


def caption_words(cap):
    words, hi = [], False
    for tok in cap.split():
        starts, ends = tok.startswith("*"), tok.endswith("*") or tok.endswith("*.") or tok.endswith("*,")
        if starts: hi = True
        clean = tok.replace("*", "")
        words.append({"text": clean, "hi": hi})
        if ends: hi = False
    return words


def spoken_weight(text):
    # numbers are spoken as words ("1,364" -> "terah sau chaunsath rupaye"), so weigh them by digit count
    if re.search(r"\d", text):
        return 3.5 * len(re.sub(r"\D", "", text)) + 3
    return len(re.sub(r"[^\w₹%]", "", text)) + 1.5


def align(words, dur, ps):
    wts = [spoken_weight(w["text"]) for w in words]
    total = sum(wts)
    # phrase breaks after words ending in punctuation; snap each to the pause
    # nearest its text-proportional position, or keep the proportional estimate
    cuts = [i for i, w in enumerate(words[:-1]) if re.search(r"[.,?!:]$", w["text"])]
    edges, used, last = [0.0], set(), 0.0
    for c in cuts:
        expect = dur * sum(wts[: c + 1]) / total
        cand = [(abs(t - expect), k, t) for k, (t, _) in enumerate(ps) if k not in used and t > last + 0.15 and abs(t - expect) < 0.22 * dur]
        if cand:
            _, k, t = min(cand); used.add(k)
        else:
            t = expect
        edges.append(t); last = t
    edges.append(dur)
    groups, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        if i in cuts: groups.append(cur); cur = []
    groups.append(cur)
    for g, (a, b) in zip(groups, zip(edges[:-1], edges[1:])):
        gw = sum(wts[i] for i in g); acc = a
        for i in g:
            words[i]["t0"] = acc; acc += (b - a) * wts[i] / gw; words[i]["t1"] = acc


PUNCT = re.compile(r"[.,?!:]+(?=\s|$)")


def phrase_spans(tts, al, offset):
    """(start, end) seconds of each punctuation-delimited phrase of the TTS text, from character alignment."""
    chars, t0s, t1s = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    text = "".join(chars)
    spans, a = [], 0
    for m in list(PUNCT.finditer(text)) + [None]:
        b = m.start() if m else len(text)
        idx = [i for i in range(a, b) if not chars[i].isspace()]
        if idx:
            spans.append((t0s[idx[0]] / TEMPO - offset, t1s[idx[-1]] / TEMPO - offset))
        a = m.end() if m else len(text)
    return spans


def align_exact(words, dur, spans):
    cuts = [i for i, w in enumerate(words[:-1]) if re.search(r"[.,?!:]$", w["text"])]
    groups, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        if i in cuts: groups.append(cur); cur = []
    groups.append(cur)
    if len(groups) != len(spans):
        return False
    wts = [spoken_weight(w["text"]) for w in words]
    for g, (a, b) in zip(groups, spans):
        a, b = max(0.0, a), min(dur, max(b, a + 0.1))
        gw = sum(wts[i] for i in g); acc = a
        for i in g:
            words[i]["t0"] = acc; acc += (b - a) * wts[i] / gw; words[i]["t1"] = acc
    return True


def main():
    script, vo, pub, tl_path = sys.argv[1:5]
    sub = sys.argv[5] if len(sys.argv) > 5 else ""
    spec = json.load(open(script))
    lines, moods = spec["lines"], spec.get("moods", {})
    adir = os.path.join(pub, "audio", sub)
    os.makedirs(adir, exist_ok=True)
    track, cursor, prev_scene = [], LEAD_IN, None
    tl_lines, scenes = [], []
    for ln in lines:
        wav = next((p for p in (os.path.join(vo, ln["id"] + x) for x in (".wav", ".mp3")) if os.path.exists(p)), None)
        # while takes are still generating, preview with silence of the expected length
        a = load_take(wav) if wav else np.zeros(int(len(ln["tts"]) * 0.066 * SR), np.float32)
        if prev_scene is not None:
            cursor += SCENE_GAP if ln["scene"] != prev_scene else GAP
        if ln["scene"] != prev_scene:
            scenes.append({"id": ln["scene"], "mood": moods.get(ln["scene"], ln["scene"]), "start_s": max(0, cursor - SCENE_GAP / 2) if prev_scene else 0})
        dur = len(a) / SR
        words = caption_words(ln["cap"])
        al_path = os.path.join(vo, ln["id"] + ".json")
        exact = wav and os.path.exists(al_path) and align_exact(words, dur, phrase_spans(ln["tts"], json.load(open(al_path))["alignment"], load_take.offset))
        if not exact:
            if os.path.exists(al_path): print("  phrase mismatch, falling back to pauses:", ln["id"])
            align(words, dur, pauses(a))
        track.append((cursor, a))
        tl_lines.append({"id": ln["id"], "scene": ln["scene"], "start": round(cursor * FPS), "end": round((cursor + dur) * FPS),
                         "words": [{"text": w["text"], "hi": w["hi"], "start": round((cursor + w["t0"]) * FPS), "end": round((cursor + w["t1"]) * FPS)} for w in words]})
        cursor += dur; prev_scene = ln["scene"]
    total = cursor + TAIL
    mix = np.zeros(int(total * SR) + SR, dtype=np.float32)
    for at, a in track:
        i = int(at * SR); mix[i:i + len(a)] += a
    try:
        import pyloudnorm as pyln
        meter = pyln.Meter(SR)
        mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -16.0)
    except ImportError:
        mix *= 0.25 / (np.sqrt(np.mean(mix[mix != 0] ** 2)) + 1e-9)
    mix = np.tanh(mix * 1.1) / 1.1  # soft limiter instead of hard clipping
    sf.write(os.path.join(adir, "narration.wav"), mix, SR)
    duration = round(total * FPS)
    for i, s in enumerate(scenes):
        s["start"] = round(s.pop("start_s") * FPS)
        s["end"] = scenes[i + 1]["start_s"] * FPS if i + 1 < len(scenes) else duration
    for s in scenes: s["end"] = round(s["end"])
    rel = "/".join(x for x in ("audio", sub) if x)
    json.dump({"fps": FPS, "duration": duration, "lines": tl_lines, "scenes": scenes, "audio": rel + "/narration.wav",
               "music": rel + "/music.wav", "sfx": []}, open(tl_path, "w"), indent=1, ensure_ascii=False)
    print(f"duration {total:.1f}s, {len(tl_lines)} lines, {len(scenes)} scenes")


if __name__ == "__main__":
    main()
