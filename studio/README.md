# Money Theory studio

Code-built explainer Reels (1080×1920, 30 fps). The look is a Vox-style paper collage: off-white desk paper, torn and cut cards with real drop shadows, halftone B&W photos, yellow highlighter, red marker, rubber stamps, tape. Paper moves "on twos" (12 fps steps) with a slight per-frame wobble, so it reads as hand-animated, not AI-smooth.

## Pipeline for one episode

```
script/ep01-gmp.json         narration lines: Roman Hinglish caption (*keywords* get highlighted) + Devanagari TTS text, grouped by scene
tools/tts_chatterbox.py      voice: Chatterbox Multilingual (Hindi), cloned from a Kokoro hm_omega reference;
                             every take is transcribed back with Whisper and re-rolled if it drifts from the script
tools/build_timeline.py      trims + speeds takes ×1.08, lays them out, aligns caption words to pauses
                             -> public/audio/narration.wav + src/data/timeline.json
tools/synth_audio.py         original score that follows the scene structure + paper foley (no licensing)
tools/fetch_commons.py       real photos/textures from Wikimedia Commons, attribution kept in public/img/credits.json
tools/process_images.py      halftone B&W photo treatment, paper textures, grain, stamp ink mask
src/scenes/*.tsx             one component per scene; cues are tied to narration words, e.g. word('L17', 'jodo')
```

Commands (TTS runs in a Python venv with chatterbox-tts, kokoro-onnx, faster-whisper):

```
python tools/tts_chatterbox.py script/ep01-gmp.json build/vo
python tools/build_timeline.py script/ep01-gmp.json build/vo public src/data/timeline.json
python tools/synth_audio.py src/data/timeline.json public/audio
python tools/process_images.py
npx remotion studio src/Root.tsx                     # live preview
npx remotion render src/Root.tsx ep01-gmp out/ep01-gmp.mp4 --crf=18
npx remotion still src/Root.tsx ep01-cover out/ep01-cover.png
node tools/stills.mjs out/stills <frame> <frame> ... # quick layout review
```

## Topic reels (ElevenLabs narration)

Five more reels use the same design system, each with its own script, timeline, audio and scene folder. They have no episode numbers.

| Reel | Script | Scenes |
|---|---|---|
| Gold on Dhanteras: where ₹18,360 goes in a day | `script/gold-dhanteras.json` | `src/reels/gold-dhanteras/` |
| Credit card minimum due: ₹3,244 interest | `script/credit-card-minimum-due.json` | `src/reels/credit-card-minimum-due/` |
| Endowment policy: 1.5x money, 3.7% IRR | `script/policy-irr.json` | `src/reels/policy-irr/` |
| Regular vs direct plan: 1% = ₹31 lakh | `script/direct-vs-regular.json` | `src/reels/direct-vs-regular/` |
| -50% then +50% = ₹75: average vs CAGR | `script/average-vs-cagr.json` | `src/reels/average-vs-cagr/` |

```
python tools/tts_elevenlabs.py script/<id>.json build/<id>/vo [L05 ...]   # ElevenLabs takes + character timestamps (needs ELEVENLABS_API_KEY)
TEMPO=1.06 python tools/build_timeline.py script/<id>.json build/<id>/vo public src/data/<id>.json <id>
python tools/synth_audio.py src/data/<id>.json public/audio/<id> music
node tools/stills.mjs src/reels/<id>/entry.tsx <id> out/stills <frame> ...
sh tools/render_reel.sh <id>                                              # out/<id>.mp4 + out/<id>-cover.jpg
```

The voice is the Hindi narrator "Amrut Deshmukh" (`eleven_multilingual_v2`). Captions are timed from ElevenLabs' character alignment: each caption phrase (split at punctuation) is matched to the same phrase of the Devanagari text, so keep the punctuation of `cap` and `tts` in step. Re-take a line by passing its id to `tts_elevenlabs.py`; the other takes are kept. Each script's `moods` map sets the music intensity per scene, and `data_note` records the assumptions behind the numbers.

## Layout rules

- Instagram covers the top ~220 px, bottom ~380 px and the right rail; visuals live in y 400–1240, captions at y ~1270.
- One idea per beat; every number on screen is said in the voice-over.
- Palette: paper `#ECE6DA`, ink `#141414`, yellow `#F5C518` (highlight / key numbers), red `#D2341F` (crossing out, warnings only).
- Type: Anton (headlines), Archivo 800 (captions), IBM Plex Mono (labels), Caveat (handwritten notes), Special Elite (typed documents).
