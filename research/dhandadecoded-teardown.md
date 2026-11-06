# Teardown: @dhandadecoded.in, "Paise Ka Khel · Day 1: Hawala"

Studied on 6 Nov 2026 from one reel the owner shared. I pulled frames once a second (`dhandadecoded/sheet_1.jpg` covers 0–17 s and `sheet_2.jpg` covers 18–34 s), sampled the transitions at 5 fps and looked at a spectrogram of the audio. The narration wasn't transcribed. The beats below come from the burned-in captions and on-screen labels. I don't have its view or like counts. The owner says this style is going viral.

## Snapshot

| | |
|---|---|
| Format | 9:16, 720×1280, 30 fps |
| Length | **35 s** |
| Shots | 14 illustrations, so a new image every ~2.5 s |
| Series | "Paise Ka Khel", a numbered *day* series (DAY 1 → DAY 2), ending on "Day 2 jald" |
| Look | Comic or graphic-novel illustration: inked lines, flat colour with painted lighting, warm tungsten against blue night |
| Cast | **The same two characters in almost every shot**: a young guy (navy track jacket, grey tee, jeans) who stands in for the viewer, and an old hawala operator (white kurta, glasses) |

## Beat sheet

```
0–2s    HOOK      "HAWALA" title over the kid peeking into a shady shop → red ILLEGAL stamp
2–5s    PARADOX   wide alley, men carrying bags: "phir bhi roz crore'on ka khel chalta hai"
5–7s    SERIES    DAY 1 · PAISE KA KHEL (kid at Marine Drive at night, notes drifting past)
7–10s   SETUP     bag of cash on the counter → "₹10 CRORE · CASH"
10–13s  TWIST     kid holding a torn note: "Badle mein milta hai… ₹10 KA EK NOTE"
13–16s  MECHANISM uncle on the phone: "Us note ka serial number Dubai bheja jaata hai" + chat bubble "Sr. No. 7AB 482913"
16–19s  PAYOFF    Dubai office: "Dubai mein wahi number dikhao…" → "₹10 CRORE · DUBAI MEIN" (the kid peeks in, the same witness)
19–22s  WHY       uncle burns the slip: ✗ BANK ✗ FLIGHT ✗ RECORD (one line added per beat)
22–24s  REFRAME   map from Mumbai to Dubai: "Paisa border paar hua… hi nahi."
24–26s  BUSINESS  "~2.5% COMMISSION"
26–29s  STAKES    raid ("Par pakde gaye…") → uncle behind bars, red JAIL stamp
29–35s  CLIFF     DAY 2 · "YE PAISA AATA KAHAN SE HAI?" over a mountain of cash bags → follow card "Dhandha Decoded · Paise Ka Khel · Day 2 jald · + FOLLOW KARO"
```

## Why it works

1. **A story instead of a lecture.** It follows one transaction from start to finish (₹10 crore in Mumbai → a ₹10 note → a serial number → ₹10 crore in Dubai), so the viewer watches the money move rather than having it described. Every beat is an event: a handover, a phone call, burning the evidence, a raid.
2. **Recurring characters make it feel like a show.** The kid appears in the hook, on Marine Drive, holding the token note, peeking into the Dubai office and at the cliffhanger. He is the viewer's eyes inside a world they can't normally see. Using the same face and outfit everywhere is what makes the shots read as one story. Without him they would read as stock images.
3. **A forbidden-world topic.** Hawala is illegal, secret and huge ("roz crore'on"), so curiosity does half the work. This matters: the @samjho.exe teardown found that topic and hook mattered more than visual polish.
4. **It's very short and ends on a cliffhanger.** At 35 s with no dead air (the audio never drops for more than 0.25 s until the last half-second), completion and replays stay high. "DAY 2" and "Day 2 jald" give people a reason to follow, which a one-off explainer doesn't.
5. **One big number per shot**, always the same lockup: a huge figure (₹10 CRORE, ₹10, ~2.5%) with a small pill label under it. Captions are small and sit mid-frame. Red is used only for danger stamps (ILLEGAL, JAIL) and ✗ marks.
6. **Cheap motion that still feels cinematic.** These are AI stills, not animation. Each shot gets a slow push-in or drift, a few animated elements on top (flying notes), labels that pop in with a little overshoot, and blur or whip transitions between shots. Under the voice there is a music bed and whooshes on the cuts.
7. **Specific Indian places**: Mumbai chawl lanes, Marine Drive, a Dubai skyline office. Viewers recognise them.

## Money Theory today, compared

| | Money Theory now | This reel |
|---|---|---|
| Visual | Paper collage, halftone *real* photos, stamps, tape | Illustrated scenes, cinematic lighting |
| People on screen | None recurring | 2 recurring characters |
| Shape | Mechanism explainer with numbers, 60–180 s | Story of one case, 30–45 s, ends on a cliffhanger |
| Packaging | One-off topics | A series with day numbers and a "next part" promise |

The **stamps, red ✗ marks, one-number-per-beat rule and caption discipline** already carry over. What's missing is **characters, story and a series**.

## What we need to make these

1. **A cast of our own (do this first).** One protagonist designed for Money Theory, plus 2–3 recurring supporting characters, such as a seth/operator, a CA or banker, and a common middle-class saver. Each needs a reference sheet (front, ¾, side, 6–8 expressions) and a locked outfit and colour. This has to be an original design, not a re-skin of the Dhandha Decoded kid.
2. **Image generation that keeps characters consistent.** Higgsfield is already connected to this workspace. It can build character sheets, store reference elements and generate images from them. Expect about 14 final images per 35-second reel, and ~30–40 generations once rerolls are counted. We also need a **written style lock** (one paragraph of style prompt plus 2–3 style reference frames) so every episode looks the same. Credits per reel need checking before we commit to a schedule.
3. **A new story template in Remotion** (`studio/src/story/` or similar), with these pieces:
   - a full-bleed still with slow push or pan and optional 2-layer parallax
   - blur and whip transitions between shots
   - the big-number + pill-label lockup
   - stamps, a ✗/✓ checklist, a chat or SMS bubble, a map with an arc between two cities, and a series title card ("DAY n")
   - an end card with a follow CTA
   - small particle overlays (notes, coins)

   Stamps, the red marker, the timeline, word-tied cues and the finish/encode pipeline can come straight from the current kit.
4. **Story-shaped scripts.** The format is cold open → paradox → follow one case → the twist in how it works → stakes or consequence → a cliffhanger that leads into the next part. It runs 30–45 s at ~2.5 s per shot. Episodes are planned as **series of 3–5 parts** so each one promises the next.
5. **Audio.** Use the same ElevenLabs voice and model, read faster with no pauses, and put the existing `synth_audio.py` score under it with added whooshes and impacts on the cuts. A 35 s reel is about 450–550 Devanagari characters, which is cheap on the Starter plan.
6. **A design decision for the owner.** `CLAUDE.md` says every Reel uses the paper-collage system. This format breaks that, so the owner has to choose:
   - **(a) A separate series in the illustrated look**, while news and mechanism explainers stay in collage.
   - **(b) A hybrid:** the illustrated characters become paper cut-outs (white border, drop shadow, moving on twos) placed in collage scenes. That keeps the brand recognisable and makes us look different from Dhandha Decoded, not like a copy.

   My recommendation is **(b) for the pilot**, with (a) as the fallback if it reads as too busy.

## Topic ideas that fit this format

Each is a "hidden money world" with a case to follow and a natural Part 2:

- **Angadia**: how Gujarati couriers carry diamonds and cash with no paperwork
- **Benami property**: the house is in the driver's name
- **Shell companies**: ₹100 crore through five companies in one afternoon
- **Pump and dump on Telegram**: the "tip" that empties your account
- **Ponzi anatomy**: why the first investors really do get paid
- **Gold smuggling**: why a 1 kg bar is worth the risk (the duty arbitrage)
- **Cricket satta**: where the bookie's money goes
- **Harshad Mehta's BR trick**: the bank receipt that wasn't backed by anything

Keep the Money Theory angle: show the mechanism with real numbers, never present a crime as a how-to, and add an "ye illegal hai, aur isliye pakde jaate hain" (this is illegal, and this is why people get caught) beat like the JAIL shot here.
