"""Transcribe every narration take back and flag lines that drift from the script.

usage: qa_vo.py script.json vo_dir [model]
"""
import difflib, json, os, re, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

LATIN = {"IPO": "आईपीओ", "GMP": "जीएमपी", "SIP": "एसआईपी", "STP": "एसटीपी", "EMI": "ईएमआई", "RBI": "आरबीआई", "CPI": "सीपीआई",
         "FD": "एफडी", "NAV": "एनएवी", "LTP": "एलटीपी", "SEBI": "सेबी", "MCLR": "एमसीएलआर", "NSE": "एनएसई", "BSE": "बीएसई"}


def norm(s):
    for k, v in LATIN.items():
        s = re.sub(k, v, s, flags=re.I)
    s = re.sub(r"[A-Za-z\d₹%]+", "", s)
    s = re.sub(r"[\s\.,\?!।'\"-]", "", s)
    return s.replace("ं", "").replace("ँ", "").replace("़", "")


def main():
    script = json.load(open(sys.argv[1])); vo = sys.argv[2]
    m = WhisperModel(sys.argv[3] if len(sys.argv) > 3 else "small", device="cpu", compute_type="int8")
    for ln in script["lines"]:
        p = os.path.join(vo, ln["id"] + ".mp3")
        a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout, dtype=np.float32)
        segs, _ = m.transcribe(a, language="hi", beam_size=5)
        heard = " ".join(s.text for s in segs).strip()
        sim = difflib.SequenceMatcher(None, norm(ln["tts"]), norm(heard)).ratio()
        print(f"{'!!' if sim < 0.7 else '  '} {ln['id']} {sim:.2f} | {heard}", flush=True)


if __name__ == "__main__":
    main()
