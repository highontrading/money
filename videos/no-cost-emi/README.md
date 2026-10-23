# FILE 02: No-cost EMI ka asli cost

A 96-second Hinglish explainer reel, 1080×1920 at 30 fps, mixed to about −14 LUFS. It uses the collage design system: steel-blue board, cream paper, halftone cut-outs, ransom-note type, yellow tape and marker.

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

## How it's built

This video follows the narration-first pipeline in [`../README.md`](../README.md). The narration is one continuous ElevenLabs take (voice `LHJy3mhZWsvhUjy0zUM1`, `eleven_multilingual_v2`), saved as `build/narration.mp3` with its timestamps in `build/narration_alignment.json`. Every visual is cued to its spoken word, and the music is generated to the same timeline.

```bash
cd build
./make.sh            # rebuild from the saved narration: timeline, SFX, music, mix, frames, MP4, cover (~6 min)
./make.sh --voice    # re-voice the script first (needs ELEVENLABS_API_KEY; about 1,400 credits)
```

The narration is 93 s and the video 96 s. Speed and pause trimming are set in `build/narrate.py` (`NARRATION_SPEED`, `MAX_PAUSE`, `SCENE_PAUSE`).

## Reusing the design system

`src/engine.js` is topic-agnostic. It contains the ransom-note titles, label chips, torn paper, tape, rubber stamps, hand-drawn strokes, typewriter reveals, karaoke captions and stop-motion jitter. A new episode only needs a new `script.json` and a new `src/scenes.js`.
