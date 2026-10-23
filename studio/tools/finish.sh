#!/bin/bash
# Render the given compositions, then make Instagram encodes (-14 LUFS) and covers.
# usage: tools/finish.sh comp [comp ...]
set -u
cd "$(dirname "$0")/.."
mkdir -p out/final build
for c in "$@"; do
  if [ ! -f "out/final/${c}_master.mp4" ]; then
    npx remotion render src/Root.tsx "$c" "out/final/${c}_master.mp4" --crf=18 --audio-bitrate=256k ${GL:+--gl=$GL} > "build/render_${c}.log" 2>&1 || { echo "RENDER FAILED $c"; tail -c 600 "build/render_${c}.log"; continue; }
  fi
  m=$(ffmpeg -nostats -i "out/final/${c}_master.mp4" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | python3 -c "
import sys,json,re; t=sys.stdin.read(); d=json.loads(re.findall(r'\{[^{}]*\}', t)[-1])
print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
  ffmpeg -v error -y -i "out/final/${c}_master.mp4" -c:v libx264 -preset slow -crf 21 -maxrate 12M -bufsize 24M -profile:v high -pix_fmt yuv420p -movflags +faststart \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11:${m}:linear=true" -ar 48000 -c:a aac -b:a 256k "out/final/${c}.mp4"
  ffmpeg -v error -y -i "out/final/${c}.mp4" -vf scale=720:1280 -c:v libx264 -preset medium -crf 27 -movflags +faststart -c:a aac -b:a 160k "out/final/${c}_preview-720p.mp4"
  npx remotion still src/Root.tsx "${c}-cover" "out/final/${c}_cover.png" --log=error > /dev/null 2>&1
  echo "DONE $c $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/final/${c}.mp4)s"
done
