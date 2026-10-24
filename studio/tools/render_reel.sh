#!/bin/sh
# Render one reel (video + cover) from its own entry point:
#   sh tools/render_reel.sh gold-dhanteras
# The lossless-ish master in out/ is ~300 MB, so it's deleted once the
# delivery encode in final/ exists.
set -e
id="$1"
mkdir -p out final
npx remotion render "src/reels/$id/entry.tsx" "$id" "out/$id.mp4" --crf=18 --audio-bitrate=192k
npx remotion still "src/reels/$id/entry.tsx" "$id-cover" "out/$id-cover.jpg" --frame=0 --jpeg-quality=92
sh tools/finalize.sh "out/$id.mp4" "final/$id.mp4"
cp "out/$id-cover.jpg" "final/$id-cover.jpg"
rm -f "out/$id.mp4"
