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

`build/voice.py` supports three voices. Each one re-times the visuals, captions and sound effects automatically.

| Engine | Command | Notes |
|---|---|---|
| ElevenLabs | `./make.sh elevenlabs` | Needs `ELEVENLABS_API_KEY` set in the environment and `api.elevenlabs.io` allowed in the network settings. The channel voice `LHJy3mhZWsvhUjy0zUM1` is the default; set `ELEVENLABS_VOICE_ID` to override it. Optional: `ELEVENLABS_MODEL` (default `eleven_multilingual_v2`). Lines are cached in `build/lines/elevenlabs/`, so re-runs don't spend credits. |
| Your own recording | `./make.sh recorded` | One take per line of `script.json`, saved as `build/recorded/00.wav`, `01.wav` and so on. |
| Piper (placeholder) | `./make.sh piper` | Offline voice `hi_IN-pratham-medium`. Licensed CC BY-NC-SA 4.0 (non-commercial) and sounds robotic, so don't post it. |

ElevenLabs reads the Devanagari `tts` field of each line. Neighbouring lines are sent with every request so the intonation flows across lines.

There is no music bed. Add a track inside Instagram at a low volume.

## Rebuild

```bash
cd build
./make.sh elevenlabs     # or: piper | recorded
```

This runs voice, then the sound-effect cues, the mix (−14 LUFS), the frames (15 unique frames/s, held "on twos"), the MP4 and the cover. It takes about 3 minutes. The textures and halftones in `assets/` come from `textures.py` and `svg2png.js`. The fonts are Google Fonts (OFL/Apache) and live in `fonts/`.

## Reusing the design system

`src/engine.js` is topic-agnostic. It contains the ransom-note titles, label chips, torn paper, tape, rubber stamps, hand-drawn strokes, typewriter reveals, karaoke captions and stop-motion jitter. A new episode only needs a new `script.json` and a new `src/scenes.js`.
