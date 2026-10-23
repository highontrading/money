import sys, subprocess, numpy as np, json
from faster_whisper import WhisperModel
def load(f):
    raw = subprocess.run(["ffmpeg","-v","error","-i",f,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
    return np.frombuffer(raw,np.int16).astype(np.float32)/32768
m = WhisperModel(sys.argv[1], device="cpu", compute_type="int8")
for f in sys.argv[2:]:
    segs, info = m.transcribe(load(f), language="hi", word_timestamps=True)
    print(f, " ".join(s.text for s in segs))
