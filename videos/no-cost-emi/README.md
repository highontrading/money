# FILE 02: No-cost EMI ka asli cost

An 87-second Hinglish explainer reel, 1080×1920 at 30 fps, mixed to about −14 LUFS. It uses the collage design system: steel-blue board, cream paper, halftone cut-outs, ransom-note type, yellow tape and marker.

- Video: `out/no-cost-emi.mp4`
- Cover for the grid: `out/no-cost-emi-cover.jpg`
- Script and captions: `script.json` (`cap` is the on-screen Hinglish text, where `*word*` marks a yellow keyword; `tts` is the Devanagari text sent to the voice)

## The one mechanism

A "no-cost" EMI still has interest. The bank charges its normal card-EMI interest, and the brand gives an upfront discount of the same amount, so your six EMIs still add up to the sticker price. What the discount doesn't cover:

| Item | Amount |
|---|---|
| Interest at 16% p.a., 6 months, reducing balance, on a ₹30,000 price | ₹1,350, covered by the brand discount (loan = ₹28,650) |
| 18% GST on that interest | ₹243 |
| Processing fee ₹199 + 18% GST | ₹235 |
| **Extra you pay** | **₹478** |

Sources: the RBI circular RBI/2013-14/292 (17 Sep 2013) says that "the very concept of zero percent interest is non-existent". Issuers (Paisabazaar and BankBazaar summarise this) say GST at 18% applies to the interest and the processing fee on card EMIs. The numbers are an illustration, and fees vary by bank (₹99 to ₹299 is typical).

Suggested caption line: *Send this to the friend who buys everything on EMI 📲 · Educational only, not investment advice · Source: RBI circular, 17 Sep 2013.*

## Voice

The narration is a **placeholder** made with the offline Piper voice `hi_IN-pratham-medium`. That voice is licensed **CC BY-NC-SA 4.0 (non-commercial)**, so replace it with your own recording before you monetise the reel. To swap it:

1. Record the lines in `script.json` in order, one file per line, as `build/lines/00.wav`, `01.wav` and so on. Or record one take and I'll cut it.
2. Re-run the pipeline. The visuals, captions and sound effects re-time themselves from `build/timeline.json`.

There is no music bed. Add a track inside Instagram at a low volume.

## Rebuild

```bash
cd build
python3 voice.py                  # voice lines -> voice_raw.wav + timeline.json (needs piper + voices/)
node render.js sfx                # sound-effect cue list from the animation
python3 audio.py                  # SFX + voice mix, loudness to -14 LUFS
node render.js frames 0 1305 frames   # 15 unique frames/s, held "on twos"
ffmpeg -framerate 15 -i frames/%05d.jpg -i mix.wav -filter:v "fps=30,format=yuv420p" \
  -c:v libx264 -crf 19 -c:a aac -b:a 192k -shortest ../out/no-cost-emi.mp4
node render.js cover ../out/no-cost-emi-cover.jpg 8.2
```

`node` needs `NODE_PATH` set to wherever Playwright is installed. The textures and halftones in `assets/` come from `textures.py` and `svg2png.js`. The fonts are Google Fonts (OFL/Apache) and live in `fonts/`.

## Reusing the design system

`src/engine.js` is topic-agnostic. It contains the ransom-note titles, label chips, torn paper, tape, rubber stamps, hand-drawn strokes, typewriter reveals, karaoke captions and stop-motion jitter. A new episode only needs a new `script.json` and a new `src/scenes.js`.
