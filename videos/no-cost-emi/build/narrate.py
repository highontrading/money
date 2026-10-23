# Narration-first step: voice the whole script as ONE continuous ElevenLabs take and
# turn its character timestamps into the master timeline (line + word times) that
# every visual, caption and music cue is cut to.
#
#   python3 narrate.py            call ElevenLabs (needs ELEVENLABS_API_KEY), then build timeline
#   python3 narrate.py --offline  rebuild timeline.json from the saved narration + alignment
import base64, difflib, json, os, subprocess, sys, urllib.request
ROOT = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(ROOT, "..", "script.json")))
MP3 = os.path.join(ROOT, "narration.mp3")
ALIGN = os.path.join(ROOT, "narration_alignment.json")
LEAD, TAIL = 0.4, 2.6      # silence before the first word / end-card hold after the last

def full_text():
    # one line per caption; a blank line between scenes gives the voice a natural breath
    parts, spans, prev = [], [], None
    pos = 0
    for ln in S["lines"]:
        sep = "" if prev is None else ("\n\n" if ln["scene"] != prev else " ")
        pos += len(sep); parts.append(sep)
        spans.append((pos, pos + len(ln["tts"])))
        parts.append(ln["tts"]); pos += len(ln["tts"]); prev = ln["scene"]
    return "".join(parts), spans

def synth(text):
    key = os.environ.get("ELEVENLABS_API_KEY") or sys.exit("Set ELEVENLABS_API_KEY in the environment.")
    voice = os.environ.get("ELEVENLABS_VOICE_ID", "LHJy3mhZWsvhUjy0zUM1")
    body = {
        "text": text,
        "model_id": os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
        # lower stability + some style = more expressive, less "read out" delivery
        "voice_settings": {"stability": 0.32, "similarity_boost": 0.8, "style": 0.45,
                           "use_speaker_boost": True, "speed": 1.0},
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), method="POST",
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs {e.code}: {e.read().decode()[:600]}")
    open(MP3, "wb").write(base64.b64decode(d["audio_base64"]))
    json.dump({"text": text, "alignment": d.get("alignment"), "normalized_alignment": d.get("normalized_alignment")},
              open(ALIGN, "w"), ensure_ascii=False)

def char_times(text, al):
    """start/end time for every character of `text` (None for unmatched characters)."""
    chars = al["characters"]
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    out = [None] * len(text)
    sm = difflib.SequenceMatcher(None, text, "".join(chars), autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            out[a + k] = (st[b + k], en[b + k])
    return out

def build():
    text, spans = full_text()
    saved = json.load(open(ALIGN))
    if saved["text"] != text:
        sys.exit("script.json changed since the narration was generated; re-run narrate.py without --offline")
    ct = char_times(text, saved["alignment"] or saved["normalized_alignment"])
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", MP3],
                               capture_output=True, text=True).stdout)
    lines = []
    for i, (a, b) in enumerate(spans):
        seg = text[a:b]
        words, k = [], 0
        for w in seg.split(" "):
            idx = [a + k + j for j, c in enumerate(w) if c.isalnum() or "ऀ" <= c <= "ॿ"]
            tt = [ct[x] for x in idx if ct[x]]
            if tt:
                words.append({"w": w, "t0": round(tt[0][0] + LEAD, 3), "t1": round(tt[-1][1] + LEAD, 3)})
            k += len(w) + 1
        lines.append({"i": i, "scene": S["lines"][i]["scene"], "start": words[0]["t0"], "end": words[-1]["t1"], "words": words})
    total = round(LEAD + dur + TAIL, 3)
    json.dump({"duration": total, "lead": LEAD, "lines": lines}, open(os.path.join(ROOT, "timeline.json"), "w"),
              ensure_ascii=False, indent=1)
    # voice track with lead-in silence, as the mixer expects
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", MP3, "-af", f"adelay={int(LEAD * 1000)}:all=1,apad=pad_dur={TAIL}",
                    "-ac", "1", "-ar", "44100", os.path.join(ROOT, "voice_raw.wav")], check=True)
    print("narration", round(dur, 2), "s; video", total, "s;", sum(len(l["words"]) for l in lines), "words timed")
    gaps = [round(lines[i + 1]["start"] - lines[i]["end"], 2) for i in range(len(lines) - 1)]
    print("gaps between lines:", gaps)

if __name__ == "__main__":
    if "--offline" not in sys.argv:
        synth(full_text()[0])
    build()
