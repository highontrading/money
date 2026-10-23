#!/usr/bin/env bash
# Full rebuild: voice -> SFX cues -> mix -> frames -> MP4 + cover.
#   ./make.sh [piper|elevenlabs|recorded]
set -euo pipefail
cd "$(dirname "$0")"
export NODE_PATH=${NODE_PATH:-/opt/node-tools/node_modules}
python3 voice.py "${1:-piper}"
node render.js sfx
python3 audio.py
rm -rf frames
N=$(python3 -c "import json,math;print(math.ceil(json.load(open('timeline.json'))['duration']*15))")
Q=$(( (N + 3) / 4 ))
for w in 0 1 2 3; do
  a=$(( w * Q )); b=$(( (w + 1) * Q < N ? (w + 1) * Q : N ))
  node render.js frames "$a" "$b" frames &
done
wait
ffmpeg -y -v error -framerate 15 -i frames/%05d.jpg -i mix.wav -filter:v "fps=30,format=yuv420p" \
  -c:v libx264 -preset slow -crf 21 -maxrate 6M -bufsize 12M -profile:v high -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 -shortest ../out/no-cost-emi.mp4
node render.js cover ../out/no-cost-emi-cover.jpg 8.2
echo "done: ../out/no-cost-emi.mp4"
