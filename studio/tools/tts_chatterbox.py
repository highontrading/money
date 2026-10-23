"""Narration: Chatterbox Multilingual (Hindi) cloned from a Kokoro hm_omega reference.

Every line is transcribed back with faster-whisper; lines that drift from the script
are re-generated with another seed and the best take is kept.

usage: tts_chatterbox.py script.json out_dir [--only L01,L02]
"""
import difflib, json, os, re, sys, time
import numpy as np, soundfile as sf, torch

KOKORO_DIR = os.environ.get("KOKORO_DIR", "kokoro")
REF_TEXT = ("नमस्ते दोस्तों. आज हम पैसे की एक ऐसी बात समझेंगे, जो हर निवेशक को पता होनी चाहिए. "
            "बात सीधी है, पर इसके पीछे का खेल थोड़ा दिलचस्प है.")
SEEDS = [int(x) for x in os.environ.get("SEEDS", "11,23,37").split(",")]
GOOD = float(os.environ.get("GOOD", 0.66))  # numbers come back as digits (dropped here), so a clean take scores ~0.7-0.9


LATIN = {"IPO": "आईपीओ", "GMP": "जीएमपी", "NSE": "एनएसई", "BSE": "बीएसई", "SEBI": "सेबी", "QIB": "क्यूआईबी", "LIC": "एलआईसी"}


def norm(s):
    for k, v in LATIN.items():
        s = re.sub(k, v, s, flags=re.I)
    s = re.sub(r"[\d₹%]+", "", s)
    s = re.sub(r"[\s\.,\?!।'\"-]", "", s)
    return s.replace("ं", "").replace("ँ", "").replace("़", "")


def make_reference(path):
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(KOKORO_DIR, "kokoro-v1.0.onnx"), os.path.join(KOKORO_DIR, "voices-v1.0.bin"))
    a, sr = k.create(REF_TEXT, voice="hm_omega", speed=1.05, lang="hi")
    sf.write(path, a, sr)


def main():
    script = json.load(open(sys.argv[1])); out = sys.argv[2]
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    os.makedirs(out, exist_ok=True)
    ref = os.path.join(out, "_reference.wav")
    if not os.path.exists(ref):
        make_reference(ref)

    torch.set_num_threads(os.cpu_count())
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    from faster_whisper import WhisperModel
    import librosa
    tts = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    asr = WhisperModel("small", device="cpu", compute_type="int8")
    report_path = os.path.join(out, "_report.json")
    report = json.load(open(report_path)) if os.path.exists(report_path) else {}

    for ln in script["lines"]:
        lid = ln["id"]
        if only and lid not in only:
            continue
        if not only and lid in report and os.path.exists(os.path.join(out, lid + ".wav")):
            continue
        best = None
        for seed in SEEDS:
            torch.manual_seed(seed); t0 = time.time()
            wav = tts.generate(ln["tts"], language_id="hi", audio_prompt_path=ref,
                               exaggeration=0.6, cfg_weight=0.45, temperature=0.75)
            a = wav.squeeze(0).numpy()
            a16 = librosa.resample(a, orig_sr=tts.sr, target_sr=16000)
            segs, _ = asr.transcribe(a16, language="hi", beam_size=5)
            heard = " ".join(s.text for s in segs).strip()
            sim = difflib.SequenceMatcher(None, norm(ln["tts"]), norm(heard)).ratio()
            dur = len(a) / tts.sr
            # guard against runaway generations: ~0.075s per Devanagari char is normal speech
            plaus = 0.035 * len(ln["tts"]) < dur < 0.13 * len(ln["tts"]) + 1.0
            score = sim if plaus else sim - 0.5
            print(f"{lid} seed={seed} dur={dur:.1f}s sim={sim:.2f} plaus={plaus} ({time.time()-t0:.0f}s) | {heard}", flush=True)
            if best is None or score > best[0]:
                best = (score, a, seed, heard, sim, dur)
            if score >= GOOD:
                break
        sf.write(os.path.join(out, lid + ".wav"), best[1], tts.sr)
        report[lid] = {"seed": best[2], "sim": round(best[4], 3), "dur": round(best[5], 2), "heard": best[3]}
        json.dump(report, open(report_path, "w"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
