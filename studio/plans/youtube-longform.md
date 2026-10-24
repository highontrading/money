# Money Theory on YouTube: long-form plan

Status: planning. Nothing is built yet. This file is the brief we work from once a topic is picked.

## What carries over from the Reels

- **Look:** the same paper-collage system as `src/components/*`: desk paper, torn cards with real shadows, halftone photos, yellow highlighter, red marker, stamps and tape, animated on twos.
- **Voice:** ElevenLabs `LHJy3mhZWsvhUjy0zUM1` ("Amrut Deshmukh – Booklet Guy", Hindi, informative), using `tools/tts_elevenlabs.py` with timestamps.
- **Script format:** `cap` (Roman Hinglish, `*keywords*`) plus `tts` (Devanagari), grouped by scene. Long-form adds a `chapter` level on top.
- **Rules:** a paradox hook, one mechanism, real numbers with a source, and every number on screen is also said in the voice-over.

## Format

| | Reels (now) | YouTube long-form |
|---|---|---|
| Frame | 1080×1920 | **1920×1080** (optionally rendered at 2560×1440 so YouTube gives it the better VP9 encode) |
| Length | 2–3.5 min | **8–12 min** flagship, 5–6 min "quick explainer" |
| Narration | ~27 lines, ~1,600 chars | ~120–150 lines, ~7,500–9,000 chars for 10 min |
| Captions | burned-in karaoke | small keyword pop-ups only, plus uploaded SRT (Hinglish + English) |
| Music | one synthesized bed | a cue per chapter, ducked under the voice |
| Footage | stills only | **treated stock/archival video in paper frames** |
| Extras | cover | thumbnail (2 variants for Test & Compare), chapters, 3 Shorts cut-downs |

### How long?

- **Pilot: 9–10 minutes.** That's long enough for one story with a real twist and clears the 8-minute mark for mid-roll ads, but short enough to keep retention high on a new channel.
- **5–6 min "Quick Theory" format:** one mechanism, no history arc. Good for turning the existing Reels into long videos (inflation, bonds, repo→EMI).
- **12–15 min:** only once analytics show the 10-minute videos hold above ~40% average view duration.

Narration pace for this voice: about 13 Devanagari chars/sec at speed 1.06. For long-form we drop to ~1.0 and leave ~0.6 s breaths between chapters, so the pace is ~12 chars/sec, or ~7,200 chars for 10 minutes of voice-over plus about 40 s of music-only moments.

## Long-form structure (10 min)

```
0:00–0:40  COLD OPEN   paradox + stakes, archival footage, no logo. Ends on the question.
0:40–0:50  TITLE STING paper title slams in, tape, stamp, 2 s musical hit
0:50–2:30  CH 1        context: the world before (simple, visual, one map or timeline)
2:30–4:30  CH 2        the mechanism, step by step (cut-paper diagrams, counters)
4:30–6:30  CH 3        the turn: what actually happened / the real numbers
6:30–8:30  CH 4        why it still matters: today's version, your EMI/SIP/FD
8:30–9:30  LANDING     recap in 3 cards, the one-line takeaway, "Aap samjhe?"
9:30–10:00 END SCREEN  20 s with space for 2 video tiles + subscribe; sign-off
```

Attention resets every 60–90 s: a chapter card (black label, yellow tape, timecode strip, like the reference job poster), a sharp change in footage, a pattern-interrupt line ("Ab asli khel shuru hota hai"), or a question to the viewer.

## Topic shortlist

| # | Working title | Length | Why it works | Signature visuals |
|---|---|---|---|---|
| 1 | **1991: Jab India ne apna sona girvi rakha** | 10–12 min | A real story with a villain (the balance of payments), a ticking clock (about 3 weeks of import cover left) and a twist (the gold flown out in secret). It's the classic Vox history explainer | Paper map with marker flight path Mumbai→London, gold bars as stacked cards, reserves draining like a cut-paper bar, newspaper headlines, archival plane and port footage |
| 2 | **Rupaya girta kyun hai? ₹ vs $** | 9–10 min | Evergreen and searched every month. One mechanism (demand and supply of dollars) | A see-saw of ₹ and $ notes, an import/export conveyor, an RBI "hand" selling dollars from a jar |
| 3 | **Harshad Mehta ne bank receipts se kaise khela** | 12 min | Story, suspense and a mechanism nobody explains properly (ready-forward deals, BRs) | Typed documents (Special Elite), red-string corkboard, Sensex line as a torn strip, 1992 newspaper clippings |
| 4 | **Paisa banta kaise hai? Bank khud paisa banate hain** | 9–10 min | A paradox hook ("most of your money was never printed"). High curiosity | Ledger pages, a loan creating a deposit, a multiplying stack of notes |
| 5 | **Notebandi: 99.3% paisa wapas kaise aaya?** | 10 min | A huge shared memory and a surprising number (RBI annual report) | Queues, ATM footage, ₹500/₹1000 notes being cut, a counting machine |
| 6 | **IPO ka poora safar: DRHP se listing tak** | 9–10 min | Builds on the Jio series and its audience | DRHP document zoom, calendar, lottery drum, bell |
| 7 | **Inflation deep dive: ₹100 ka safar 1991→2026** | 8 min | Expands the inflation Reel | A shrinking note, a price tag wall, the CPI basket |
| 8 | **UPI: ₹1 do second mein kaise pahunchta hai, aur kharcha kaun uthata hai?** | 8–9 min | Everyone uses it, nobody knows the plumbing or the zero-MDR question | Paper pipes and routing switches, phone cut-outs, NPCI switch |

**Recommendation for the pilot: #1 (1991 gold crisis).** It has the strongest story arc, it shows off archival footage and maps (the two things the 16:9 frame adds over Reels), and it's evergreen. **#2 (rupee)** is the safer "search traffic" follow-up.

## Animation menu (what the wide frame adds)

1. **Desk camera / parallax:** collage layers at 3–4 depths, with a slow push-in, pan or tilt across the desk. It gives a "real camera over real paper" feel without breaking the on-twos look.
2. **Footage in paper frames:** video plays inside a torn photo card or a film-strip frame, treated as halftone or ink+yellow duotone, stepped to 12 fps, with grain and a light gate weave. Cards get taped down as the clip starts.
3. **Paper maps:** a cut-out India/world map, marker routes drawing on, pins and stamps, labels on tape.
4. **Long timeline ribbon:** a horizontal paper strip the camera tracks along (1947 → 1991 → 2026), with photos clipped to it.
5. **Source zoom (the Vox move):** a newspaper or RBI circular slides in, the camera zooms to one line, it gets highlighted, and the rest dims.
6. **Paper data viz:** cut-strip bars, a scissor-cut pie, stacked rupee-note bars, counters with typewriter digits, a draining jar.
7. **Split screen:** two torn halves (then vs now, you vs the bank).
8. **Chapter cards:** black label "CHAPTER 2 · THE DEAL", yellow torn strip, timecode, a handwritten "keep it simple" note, all from the reference poster.
9. **Edit-timeline strip:** the filmstrip/waveform bar from the reference, used as a recurring transition and progress element.
10. **Recap cards:** three cards flip in at the end, then the sign-off.

Most of these extend existing pieces (`Card`, `Photo`, `Tape`, `Stamp`, `Marker`, `HL`, `Count`, `Bars`). New components to build: `Camera`, `Footage`, `PaperMap`, `Ribbon`, `DocZoom`, `ChapterCard`, `FilmStrip`, `LowerThird`.

## Stock and archival footage

| Source | Reachable from this environment | What it's good for | License |
|---|---|---|---|
| Wikimedia Commons (photos + video) | yes (already used; rate-limits bursts) | Indian cities, RBI, BSE, notes, markets, trains | CC BY / BY-SA / PD / GODL-India, so attribution is kept in `credits.json` |
| Internet Archive (Prelinger and other public-domain films) | yes | Vintage money, bank, factory and newsreel footage (about 530 money/bank films in Prelinger alone) | Mostly public domain; check each item |
| Library of Congress | yes | Historic photos and documents | Mostly PD |
| Pexels / Pixabay | **no, blocked by the network policy** | Modern Indian b-roll (street, phones, offices) | Free licenses |

Every clip gets the same treatment: crop → grayscale or duotone → halftone or contrast curve → 12 fps → grain → torn-paper mask. That makes mixed sources look like one deliberate style rather than "stock".

We'll check every license before using a clip. Credits go in the description and in `public/img/credits.json`.

## Sound design

- **Voice:** ElevenLabs with `previous_text` / `next_text`. For long-form: stability ~0.55 for consistency across 10 minutes and speed ~1.0. Model: `eleven_v4` (channel standard, picked on the IPO cold-open test).
- **Music:** one cue per chapter (tension for the crisis, lighter for the mechanism, a resolve for the landing) with stingers at chapter cards, sidechain-ducked about 12 dB under the voice. Option A: extend `tools/synth_audio.py` (original, no licensing). Option B: ElevenLabs Music (check that your plan allows commercial use).
- **SFX layer:** paper slide, tear, tape rip, stamp thud, marker squeak, typewriter, scissors, coin, note riffle, cash counter, projector rattle under archival clips, whooshes and risers into reveals, a low boom on the title. These can be generated with ElevenLabs Sound Effects (same API key, uses credits) or synthesized, and placed automatically from animation cues as the Reels already do.
- **Room tone:** a quiet desk/room bed so silences never feel dead.
- **Mix:** voice ~ −16 LUFS short-term, music −28 to −30 under speech, master **−14 LUFS integrated, −1 dBTP**.

## Script process

1. Research note with sources (RBI, MoSPI, SEBI, Hansard/Parliament, newspaper archives).
2. Beat sheet: a one-line purpose for every chapter and every reset point.
3. Full script in the existing JSON format plus `chapter`, about 130 lines. You review it before any voice is spent.
4. Table read of the cold open in both models (cheap), then pick one.
5. Full voice-over → `qa_vo.py` (Whisper check) → re-takes for drifted lines.
6. Lock the timeline, then build the animation against it.

## Budget check (ElevenLabs)

Starter plan: 40,000 chars/month. **About 23,300 are left until 23 Nov 2026.** A 10-minute script is ~7,500 chars, or ~10,000 with re-takes. That allows one long video plus a few Reels this cycle, or two long videos with no Reels. SFX generation draws from the same pool. If we go to 2 long videos a month plus Reels, the Creator tier (100k chars) is the comfortable fit.

## Pipeline work before the pilot

- A 16:9 theme and safe areas, with the end-screen zone kept clear for the last 20 s.
- A chapter layer in the script → timeline → auto-generated YouTube chapter timestamps.
- A `Footage` component (Remotion `OffthreadVideo`) and an ffmpeg pre-treatment script.
- A `Camera` / parallax rig.
- Audio: per-chapter cues, ducking, SFX placement, room tone.
- Render by chapter and concatenate (disk is limited; a 10-minute master is large).
- Thumbnail still at 1280×720, plus title, description, chapters, credits and SRT exports.
- Shorts: 3 vertical cut-downs re-laid out from the same scenes.

## Decisions needed

1. Pilot topic (recommended: 1991 gold crisis).
2. Length: 9–10 min (recommended) or a 5–6 min first test.
3. Music: original synthesized score or ElevenLabs Music.
4. Footage: Commons + Internet Archive only, or also open the network to Pexels/Pixabay (they need a domain allowlist change and a free API key).
5. Captions: keyword pop-ups + SRT (recommended), or full karaoke captions like the Reels.
