"""Narration via ElevenLabs (voice from ELEVENLABS_VOICE_ID), one take per line.

Uses the with-timestamps endpoint so captions can be aligned to real speech, and
passes the neighbouring lines as previous_text/next_text so the delivery flows
like one continuous read.

usage: tts_elevenlabs.py script.json out_dir [--only L01,L02]
writes out_dir/<id>.mp3 and out_dir/<id>.align.json
"""
import base64, json, os, sys, time, urllib.request

VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "LHJy3mhZWsvhUjy0zUM1")
MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_v4")
SETTINGS = {"stability": 0.45, "similarity_boost": 0.8, "style": 0.25, "use_speaker_boost": True, "speed": 1.06}


def synth(text, prev, nxt):
    body = {"text": text, "model_id": MODEL, "voice_settings": SETTINGS}
    if prev: body["previous_text"] = prev
    if nxt: body["next_text"] = nxt
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
    for i in range(5):
        try:
            return json.load(urllib.request.urlopen(req, timeout=180))
        except urllib.error.HTTPError as e:
            msg = e.read()[:300]
            if e.code in (429, 500, 502, 503):
                time.sleep(4 + i * 6); continue
            raise RuntimeError(f"{e.code} {msg}")
    raise RuntimeError("elevenlabs: retries exhausted")


def main():
    script = json.load(open(sys.argv[1])); out = sys.argv[2]
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    os.makedirs(out, exist_ok=True)
    lines = script["lines"]
    for i, ln in enumerate(lines):
        if only and ln["id"] not in only: continue
        mp3 = os.path.join(out, ln["id"] + ".mp3")
        if os.path.exists(mp3) and not only: continue
        prev = lines[i - 1]["tts"] if i > 0 else None
        nxt = lines[i + 1]["tts"] if i + 1 < len(lines) else None
        d = synth(ln["tts"], prev, nxt)
        open(mp3, "wb").write(base64.b64decode(d["audio_base64"]))
        json.dump(d.get("normalized_alignment") or d["alignment"], open(os.path.join(out, ln["id"] + ".align.json"), "w"), ensure_ascii=False)
        print(ln["id"], f'{d["alignment"]["character_end_times_seconds"][-1]:.1f}s', flush=True)


if __name__ == "__main__":
    main()
