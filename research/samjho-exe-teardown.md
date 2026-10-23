# Teardown: @samjho.exe (reference account)

Studied on 23 Oct 2026. I could see the 6 most recent public reels: I downloaded them, pulled frames every 3 seconds and transcribed the narration of the two finance reels.

## Snapshot

| | |
|---|---|
| Followers | ~6,655 |
| Posts | 12 (6 visible publicly; all reels) |
| Age | Very new. The 6 reels went up between 15 and 22 Oct 2026, roughly one a day |
| Format | 9:16, 720×1280, 30 fps, loudness about −14 LUFS (Instagram standard) |
| Length | 88 s to 177 s. The viral one is 88 s |
| Niche | Mixed "explainer" topics: IPOs, scams, EVMs, internet shutdowns, caller-ID rules. It is **not** a finance-only page |

### Reel performance

| Reel | Topic | Length | Likes | Comments |
|---|---|---|---|---|
| DewoJwTsdAS | Jio IPO: 14 lots vs 1 lot, same lottery ticket | 88 s | **77,911** | 344 |
| DezJh-YMdZC | How to apply for an IPO, 6 steps (follow-up to the viral reel) | 93 s | 2,525 | 14 |
| DelI0FesPQV | CNAP caller name rule from 1 Nov | 111 s | 420 | 0 |
| DeiZZ8woBQ6 | Digital-arrest scam call centres in Cambodia | 146 s | 109 | 1 |
| Dej9tYTs4Ta | How an EVM vote travels | 177 s | 128 | 1 |
| DegYxqUMadq | Internet shutdowns | 133 s | 110 | 3 |

**Takeaway:** almost all of the page's traction comes from **one** reel. It went viral because of the topic and the hook, not the visual style; the other reels look just as polished and got around 100 likes each. The page is not yet a proven, consistent performer.

---

## Why the Jio IPO reel worked

1. **A news hook at the right moment.** It went up on 21 Oct, the day Jio's IPO bidding opened. Millions of people were deciding how many lots to apply for that day.
2. **A surprising claim in the first 3 seconds.** "One friend applied 14 lots, another applied just 1. Who gets shares? Maybe the 1-lot guy." That breaks a belief people hold ("more money, better chance").
3. **One mechanism, explained all the way through.** The reel only answers *why* allotment is a lottery: IPO basics, then the 50/15/35 quota split, then retail shares ÷ lot size = maximum winners, then 1 PAN = 1 ticket, then what oversubscription means for you. There are no side topics.
4. **Real numbers on screen**, such as ₹13,428 blocked, 8,50,37,326 retail shares, 70,86,443 maximum winners, 50x oversubscribed. Concrete numbers make it feel researched.
5. **A built-in reason to share.** The caption says "Send this to the friend applying 14 lots 📲". Most of its reach probably came from people sending it to friends.
6. **Credibility lines:** "Financial advice nahi, sirf mechanism", plus the source named in the caption (a SEBI circular).
7. **A sign-off:** every reel ends with "Aap samjhe?" and the mascot.

### Script structure (88 s, about 40 narration lines, around 2 s per line)

```
0–10s   HOOK: the paradox (14 lots vs 1 lot) → "shares come from a parchi (ticket), not money"
10–27s  CONTEXT: what an IPO is → Jio's numbers → 1 lot = 12 shares ≈ ₹13,400
27–40s  STRUCTURE: the cake (50% QIB / 15% NII / 35% retail) → money is only blocked via UPI
40–53s  "ab asli khel" (now the real game): retail shares ÷ lot size = max winners (~70 lakh)
53–75s  TWIST: 1 PAN = 1 parchi, so 1 lot and 16 lots have the same chance → 50x oversubscribed explained
75–88s  TIMELINE + LANDING: T+3 calendar → "IPO lottery hai… par lottery ke bhi rules hote hain. Aap samjhe?"
```

Each line is short, conversational Hinglish. The reel keeps resetting attention with phrases like "Ab asli khel", "Aur yahi twist hai" and "Toh…".

---

## Visual language

- **Look:** a dark, near-black background with a warm vignette, styled like a tech dashboard. One accent colour per series: **yellow** for finance (REALITY.EXE) and **red** for scams (SCAM.EXE), with green for "success" states.
- **Type:** a heavy grotesk for headlines and numbers, plus monospace for labels and chips (`NET OFFER · 24.30 CR SHARES`, `T+3 · 3 WORKING DAYS`). It reads very "fintech app".
- **Fixed layout:**
  - Top left: series badge (`REALITY.EXE · EP 12`). Top right: topic pill (`● JIO IPO`).
  - Middle: one visual idea at a time (card, counter, pie, calendar, grid of dots).
  - Lower third: **burned-in karaoke captions**. The words being spoken are white, keywords are in the accent colour and upcoming words are dimmed.
  - Bottom: `■ @samjho.exe` watermark.
- **Motion:** almost no hard cuts (ffmpeg found only 3 scene changes in 88 s). Everything is **one continuous canvas**: cards slide and morph, numbers count up, dot grids fill. It looks code-generated (HTML/React or Three.js), not made in After Effects.
- **3D moments:** simple stylised renders (pie chart, lottery drum full of paper tickets, server racks, a clay-like "police station"). They're used sparingly as "wow" beats.
- **Mascot:** a small green computer/robot that pops in at reveals and at the end. It gives the page a recognisable face without a human presenter.
- **Audio:** fast, punchy Hinglish narration, about 2 s per line, with no pauses. Background music sits low under the voice.

## Where they're weak, and how we can beat them

| Their weakness | Our edge |
|---|---|
| **Generic, not a niche.** Finance one day, EVMs the next, so followers don't know what to expect | **100% money/finance.** Every reel builds the "Money Theory" brand |
| **Flat dark UI everywhere.** It looks like a Bloomberg terminal, can feel cold and samey, and screenshots of different reels look alike | **Tactile paper-cut / collage look.** Warm, physical and unmistakable in the feed. Almost nobody in Indian finance content does it well |
| **720p output**, with small mono labels that are unreadable on phone | Render at **1080×1920**. Minimum text size for anything that matters |
| Captions repeat the narration word for word, so the screen is text-heavy | Captions stay, but the **visual carries the idea** (a metaphor you can *see*, not a dashboard) |
| **One hit, then a weak follow-up.** The 6-step reel was a list, not a story | Every reel needs a **paradox hook + one mechanism**, never a checklist |
| Stylised 3D can tip into an "AI/stock" feel | Real paper textures, real lighting, slight hand-made imperfection |

---

## What we should copy (structure, not style)

- A **news hook + paradox in 3 s.** Write the hook first, then the script.
- **One mechanism per reel.** If it needs two, make two reels (a series).
- **Real numbers with a source** (SEBI, RBI, MoSPI, NSE) in the caption.
- A **short-line Hinglish script**, about 2 s per line, with an attention reset every 10–15 s.
- **Karaoke captions in the lower third**, with keywords in the accent colour. People watch on mute.
- **Series branding** (episode badge + topic pill) and a **signature sign-off line**.
- **Share CTA aimed at a specific person** ("Send this to the friend who…").
- A **disclaimer line**: "Educational only, not investment advice."
- **88–100 s** is the sweet spot. Their 2–3 minute reels did far worse.

## What "premium paper-cut / Vox style" means in practice

(I'm reading "walk style" as **Vox style**, the collage/paper explainer look. Correct me if you meant something else.)

1. **Real paper, not flat vectors.** Scanned paper and cardboard textures, torn and deckled edges, visible fibres, a slight off-white.
2. **Real depth:** layered cut-outs with soft, directional drop shadows that move when a layer lifts. That's what makes it look physical.
3. **Stop-motion timing:** animate "on twos" (12 fps steps inside a 30 fps video) with tiny random jitter per frame. That's what kills the "AI-smooth" feel.
4. **Collage elements:** halftone newspaper cut-outs, rupee notes, stamps, receipts, highlighter strokes, masking tape, paper clips.
5. **Light grain + vignette** over everything, as if it was shot under a lamp on a desk.
6. **Motion-graphics layer on top:** clean animated numbers, charts and arrows drawn *as paper* (cut-strip bar charts, a paper pie cut with scissors).

## Proposed production pipeline

- **Script:** Hinglish, in the 0–3 s hook / mechanism / twist / landing template above.
- **Voice:** your own recorded voice gives the most "real" feel. Otherwise a high-quality Hindi/Hinglish TTS.
- **Visuals:** built in code (React + Remotion, rendered with headless Chromium), which I can produce end to end here. Paper textures, shadows, stop-motion jitter and karaoke captions synced to the voice timestamps.
- **Output:** 1080×1920, 30 fps, −14 LUFS, with a separate cover frame for the grid.

## Candidate first videos

1. **"₹2 lakh lagaye, shares 0? IPO GMP ka sach"** (timely: Jio lists around 28 Oct). What grey-market premium actually is, why it's unofficial, and why listing day can disappoint.
2. **"Bond ka price girta hai jab interest badhta hai — kyun?"** An evergreen paradox hook that suits a paper see-saw visual.
3. **"2016 ka ₹100 aaj kitna hai?"** Inflation shown as a paper note getting physically cut down each year. Very visual and very shareable.
