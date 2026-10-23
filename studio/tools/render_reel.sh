#!/bin/sh
# Render one reel (video + cover) from its own entry point:
#   sh tools/render_reel.sh gold-dhanteras
set -e
id="$1"
mkdir -p out
npx remotion render "src/reels/$id/entry.tsx" "$id" "out/$id.mp4" --crf=18 --audio-bitrate=192k
npx remotion still "src/reels/$id/entry.tsx" "$id-cover" "out/$id-cover.jpg" --frame=0 --jpeg-quality=92
