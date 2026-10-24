"""Subtitles for YouTube from the narration timeline.

usage: make_srt.py script.json timeline.json out.srt [translations.json]
Without translations it uses the on-screen Hinglish captions (`cap`, *markers* removed).
Cues follow the real line timings; long lines are split into ≤2-line chunks
(~46 chars per line) with time shared by length.
"""
import json, re, sys, textwrap

FPS = 30
MAX = 80
WRAP = 46


def ts(frame):
    ms = int(round(frame / FPS * 1000))
    h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def chunks(text):
    parts = re.split(r"(?<=[.?!:])\s+", text.strip())
    out, cur = [], ""
    for p in parts:
        if cur and len(cur) + 1 + len(p) > MAX:
            out.append(cur); cur = p
        else:
            cur = (cur + " " + p).strip()
    if cur: out.append(cur)
    final = []
    for c in out:  # a single sentence that is still too long: split at a comma
        while len(c) > MAX and "," in c[:MAX]:
            k = c[:MAX].rfind(",") + 1
            final.append(c[:k].strip()); c = c[k:].strip()
        final.append(c)
    return final


def main():
    script, tl, out = sys.argv[1:4]
    tr = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else None
    caps = {l["id"]: (tr[l["id"]] if tr else l["cap"].replace("*", "")) for l in json.load(open(script))["lines"]}
    cues = []
    for l in json.load(open(tl))["lines"]:
        parts = chunks(caps[l["id"]])
        total = sum(len(p) for p in parts)
        t = l["start"]
        for p in parts:
            d = (l["end"] - l["start"]) * len(p) / total
            cues.append((t, t + d, "\n".join(textwrap.wrap(p, WRAP))))
            t += d
    with open(out, "w") as f:
        for i, (a, b, txt) in enumerate(cues, 1):
            end = b + 6 if i == len(cues) else min(b + 6, cues[i][0] - 1)  # linger a little, never overlap
            f.write(f"{i}\n{ts(a)} --> {ts(end)}\n{txt}\n\n")
    print(len(cues), "cues ->", out)


if __name__ == "__main__":
    main()
