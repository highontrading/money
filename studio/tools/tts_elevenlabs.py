"""Narration takes from ElevenLabs, one per script line, with character timestamps.

usage: tts_elevenlabs.py script.json out_dir [L05 L12 ...]
Writes out_dir/<id>.mp3 and out_dir/<id>.json (the alignment). Existing takes are
kept unless their ids are passed, so a re-take costs only those lines.
Needs ELEVENLABS_API_KEY. Voice/model can be overridden with ELEVEN_VOICE / ELEVEN_MODEL.
"""
import base64, json, os, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

VOICE = os.environ.get("ELEVEN_VOICE", "LHJy3mhZWsvhUjy0zUM1")  # Amrut Deshmukh, Hindi narrator
MODEL = os.environ.get("ELEVEN_MODEL", "eleven_v4")  # house standard from Oct 2026 onward
SETTINGS = {"stability": 0.45, "similarity_boost": 0.8, "style": 0.2, "use_speaker_boost": True, "speed": 1.0}


def take(text, prev, nxt, tries=5):
    body = json.dumps({"text": text, "model_id": MODEL, "voice_settings": SETTINGS,
                       "previous_text": prev or None, "next_text": nxt or None}).encode()
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128"
    for i in range(tries):
        try:
            req = urllib.request.Request(url, body, {"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except Exception as e:
            msg = e.read().decode()[:300] if hasattr(e, "read") else repr(e)
            print("  retry", msg, file=sys.stderr)
            time.sleep(4 + 6 * i)
    raise RuntimeError("tts failed: " + text)


def main():
    script, out = sys.argv[1:3]
    force = set(sys.argv[3:])
    lines = json.load(open(script))["lines"]
    os.makedirs(out, exist_ok=True)

    def job(i):
        ln = lines[i]
        mp3 = os.path.join(out, ln["id"] + ".mp3")
        if os.path.exists(mp3) and ln["id"] not in force:
            return
        prev = lines[i - 1]["tts"] if i > 0 else ""
        nxt = lines[i + 1]["tts"] if i + 1 < len(lines) else ""
        d = take(ln["tts"], prev, nxt)
        open(mp3, "wb").write(base64.b64decode(d["audio_base64"]))
        json.dump({"text": ln["tts"], "alignment": d["alignment"]}, open(os.path.join(out, ln["id"] + ".json"), "w"), ensure_ascii=False)
        print("ok", ln["id"], round(d["alignment"]["character_end_times_seconds"][-1], 2), "s")

    with ThreadPoolExecutor(2) as ex:
        list(ex.map(job, range(len(lines))))


if __name__ == "__main__":
    main()
