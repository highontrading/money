"""Download Commons files by title (1600px thumbs) and record attribution in public/img/credits.json.

usage: fetch_commons.py key=File:Title.jpg [key=File:Other.jpg ...]
"""
import json, os, re, sys, time, urllib.parse, urllib.request
from html import unescape

UA = "MoneyTheoryStudio/0.1 (educational explainer production)"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img")
CREDITS = os.path.join(OUT, "credits.json")

def get(url, tries=8):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return r.read()
        except Exception as e:
            print("  retry", repr(e)[:80], file=sys.stderr)
            time.sleep(6 + i * 10)
    raise RuntimeError("failed: " + url)

def strip(html):
    return re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", "", html or ""))).strip()

def main(pairs):
    os.makedirs(OUT, exist_ok=True)
    credits = json.load(open(CREDITS)) if os.path.exists(CREDITS) else {}
    titles = {t: k for k, t in pairs}
    q = urllib.parse.urlencode({"action": "query", "format": "json", "titles": "|".join(titles),
                                "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 1600,
                                "iiextmetadatafilter": "LicenseShortName|Artist"})
    d = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))
    norm = {n["to"]: n["from"] for n in d["query"].get("normalized", [])}
    for p in d["query"]["pages"].values():
        if "imageinfo" not in p:
            print("MISSING", p["title"]); continue
        key = titles[norm.get(p["title"], p["title"])]
        ii = p["imageinfo"][0]; m = ii["extmetadata"]
        src = (ii.get("thumburl") or ii["url"]).split("?")[0].replace("//thumb.wikimedia.org/wikipedia/", "//upload.wikimedia.org/wikipedia/")
        ext = os.path.splitext(urllib.parse.urlparse(src).path)[1].lower() or ".jpg"
        path = os.path.join(OUT, key + ext)
        if not os.path.exists(path):
            data = get(src); open(path, "wb").write(data); time.sleep(3)
        credits[key] = {"file": key + ext, "title": p["title"], "page": ii["descriptionurl"],
                        "license": m.get("LicenseShortName", {}).get("value"),
                        "author": strip(m.get("Artist", {}).get("value"))}
        print("ok", key, credits[key]["license"], "|", credits[key]["author"][:50])
    json.dump(credits, open(CREDITS, "w"), indent=1, ensure_ascii=False)

if __name__ == "__main__":
    main([a.split("=", 1) for a in sys.argv[1:]])
