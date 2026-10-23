"""Search Wikimedia Commons files; prints title, size, license, author."""
import json, sys, time, urllib.parse, urllib.request
UA = "MoneyTheoryStudio/0.1 (educational explainer production)"

def api(params, tries=6):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({"format": "json", **params})
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=40) as r:
                return json.load(r)
        except Exception as e:
            print("  retry", repr(e)[:80], file=sys.stderr); time.sleep(5 + i * 8)
    raise RuntimeError("commons api failed")

def search(q, n=10):
    d = api({"action": "query", "generator": "search", "gsrnamespace": 6, "gsrlimit": n, "gsrsearch": q,
             "prop": "imageinfo", "iiprop": "url|size|extmetadata|mime",
             "iiextmetadatafilter": "LicenseShortName|Artist"})
    out = []
    for p in d.get("query", {}).get("pages", {}).values():
        ii = p["imageinfo"][0]; m = ii.get("extmetadata", {})
        out.append((p["title"], ii["width"], ii["height"], ii.get("mime"),
                    m.get("LicenseShortName", {}).get("value"),
                    (m.get("Artist", {}).get("value") or "")[:60]))
    return out

if __name__ == "__main__":
    for q in sys.argv[1:]:
        print("##", q)
        for row in search(q):
            print("  ", " | ".join(str(x) for x in row))
        time.sleep(4)
