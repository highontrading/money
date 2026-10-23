# Explainer reel pipeline (narration first)

Every Money Theory reel is built in this order. The narration is the master clock and everything else is cut to it.

1. **Script** (`script.json`): one entry per caption line. `cap` holds the on-screen Hinglish, with `*word*` marking a yellow keyword. `tts` holds the Devanagari text that gets spoken. Write it like you talk, with connectors ("lekin…", "yaani…", "toh phir…"), not like a list.
2. **Narration** (`build/narrate.py`): the whole script is voiced as **one continuous ElevenLabs take**, using the channel voice and the `/with-timestamps` endpoint. Pauses longer than 0.48 s are trimmed (0.75 s at scene changes), the read is sped up ×1.08 with pitch kept, and the character timestamps become `timeline.json`, which holds every line's and word's exact time.
3. **Edit** (`src/scenes.js`): every entrance, stamp, count-up, punch-in, shake and paper-wipe transition is cued to a spoken word with `cue(line, 'word')`. Nothing is placed at a guessed offset. The camera does a slow push-in per scene and punches in on reveals. The boards animate "on twos" (stop-motion), and the camera moves smoothly at 30 fps.
4. **Score** (`build/music.py`): a lo-fi groove generated in code, with sections that follow the scenes. It opens muffled, the beat comes in, it drops out with a tape-stop before the twist, comes back with a riser and impact, then calms down for the outro. It's royalty-free.
5. **Mix** (`build/audio.py`): voice polish, paper/stamp/tape/whoosh sound effects, music about 15 dB under the voice that dips a further 7 dB while words are spoken, and loudness set to −14 LUFS.
6. **Render**: 1080×1920 at 30 fps, under ~35 MB, plus a cover frame.

```bash
cd <episode>/build
./make.sh --voice   # first time: generate the narration (needs ELEVENLABS_API_KEY, Starter plan or above)
./make.sh           # any later visual or music change reuses the saved narration (no credits)
```

Before posting, check that every line is spoken: `python3 asr.py small voice_raw.wav`. Then check the edit with a contact sheet of frames.
