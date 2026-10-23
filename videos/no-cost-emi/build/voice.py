# Synthesize each script line, trim silence, lay out on a timeline.
#   python3 voice.py                 Piper (offline placeholder voice)
#   python3 voice.py elevenlabs      ElevenLabs; needs ELEVENLABS_API_KEY (ELEVENLABS_VOICE_ID overrides the channel voice)
#   python3 voice.py recorded        your own takes, one per line, in build/recorded/00.wav, 01.wav, ...
import hashlib, json, os, subprocess, sys, urllib.request
import numpy as np
ROOT = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(ROOT, "..", "script.json")))
ENGINE = sys.argv[1] if len(sys.argv) > 1 else "piper"
MODEL = os.path.join(ROOT, "voices", "hi_IN-pratham-medium.onnx")
SR = 44100
LEAD = 0.35            # silence before first line
GAP, SCENE_GAP = 0.14, 0.38
CACHE = os.path.join(ROOT, "lines", ENGINE)
os.makedirs(CACHE, exist_ok=True)

def piper(i, text):
    out = os.path.join(CACHE, f"{i:02d}.wav")
    subprocess.run(["piper", "-m", MODEL, "--length-scale", "0.9", "--sentence-silence", "0.12", "-f", out],
                   input=text.encode(), capture_output=True, check=True)
    return out

def elevenlabs(i, text):
    key, voice = os.environ.get("ELEVENLABS_API_KEY"), os.environ.get("ELEVENLABS_VOICE_ID", "LHJy3mhZWsvhUjy0zUM1")
    if not key or not voice:
        sys.exit("Set ELEVENLABS_API_KEY in the environment.")
    model = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")
    lines = S["lines"]
    body = {
        "text": text, "model_id": model,
        # neighbouring lines keep intonation continuous across separate requests
        "previous_text": lines[i - 1]["tts"] if i > 0 else None,
        "next_text": lines[i + 1]["tts"] if i + 1 < len(lines) else None,
        "voice_settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35,
                           "use_speaker_boost": True, "speed": 1.05},
    }
    # cache by request so re-runs don't spend credits
    tag = hashlib.sha1(json.dumps([voice, body], sort_keys=True).encode()).hexdigest()[:10]
    out = os.path.join(CACHE, f"{i:02d}-{tag}.mp3")
    if os.path.exists(out):
        return out
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), method="POST",
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    with urllib.request.urlopen(req, timeout=120) as r, open(out, "wb") as f:
        f.write(r.read())
    return out

def recorded(i, text):
    out = os.path.join(ROOT, "recorded", f"{i:02d}.wav")
    if not os.path.exists(out):
        sys.exit(f"Missing recording {out} for line {i}: {S['lines'][i]['cap']}")
    return out

def load_trimmed(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    env = np.convolve(np.abs(a), np.ones(440) / 440, "same")
    idx = np.where(env > 0.01)[0]
    return a[max(idx[0] - 600, 0): idx[-1] + 1200]

synth = {"piper": piper, "elevenlabs": elevenlabs, "recorded": recorded}[ENGINE]
track, timeline, t = [np.zeros(int(LEAD * SR), np.float32)], [], LEAD
prev = None
for i, ln in enumerate(S["lines"]):
    if prev is not None:
        g = SCENE_GAP if ln["scene"] != prev else GAP
        track.append(np.zeros(int(g * SR), np.float32)); t += g
    a = load_trimmed(synth(i, ln["tts"]))
    d = len(a) / SR
    timeline.append({"i": i, "scene": ln["scene"], "start": round(t, 3), "end": round(t + d, 3)})
    track.append(a); t += d; prev = ln["scene"]
track.append(np.zeros(int(2.2 * SR), np.float32)); t += 2.2   # end card hold
v = np.concatenate(track)
v = (np.clip(v, -1, 1) * 32767).astype(np.int16)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
                os.path.join(ROOT, "voice_raw.wav")], input=v.tobytes(), check=True)
json.dump({"duration": round(t, 3), "lines": timeline}, open(os.path.join(ROOT, "timeline.json"), "w"), indent=1)
print("engine", ENGINE, "duration", round(t, 2))
