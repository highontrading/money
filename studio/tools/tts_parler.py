"""Synthesize narration lines with ai4bharat/indic-parler-tts.

usage: tts_parler.py lines.json out_dir [--only id,id] [--seed N]
lines.json: [{"id": "...", "tts": "..."}] ; writes out_dir/<id>.wav
"""
import json, os, sys, time
import torch, soundfile as sf
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer

MODEL = "ai4bharat/indic-parler-tts"
DESC = os.environ.get("VOICE_DESC", "Rohit speaks with a confident, warm and engaging tone at a moderately fast pace. "
        "The recording is very clear and close-sounding, with no background noise.")

def main():
    lines = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
    only = None
    if "--only" in sys.argv: only = set(sys.argv[sys.argv.index("--only") + 1].split(","))
    seed = int(sys.argv[sys.argv.index("--seed") + 1]) if "--seed" in sys.argv else 7
    torch.set_num_threads(os.cpu_count())
    model = ParlerTTSForConditionalGeneration.from_pretrained(MODEL).eval()
    tok = AutoTokenizer.from_pretrained(MODEL)
    dtok = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
    d = dtok(DESC, return_tensors="pt")
    for ln in lines:
        if only and ln["id"] not in only: continue
        path = os.path.join(out, ln["id"] + ".wav")
        if os.path.exists(path) and not only: continue
        torch.manual_seed(seed)
        p = tok(ln["tts"], return_tensors="pt"); t0 = time.time()
        with torch.inference_mode():
            audio = model.generate(input_ids=d.input_ids, attention_mask=d.attention_mask,
                                   prompt_input_ids=p.input_ids, prompt_attention_mask=p.attention_mask)
        a = audio.cpu().numpy().squeeze()
        sf.write(path, a, model.config.sampling_rate)
        print(f"{ln['id']}: {len(a)/model.config.sampling_rate:.1f}s audio in {time.time()-t0:.0f}s", flush=True)

if __name__ == "__main__":
    main()
