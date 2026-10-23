#!/usr/bin/env bash
# Narration-first build: narration -> timeline -> edit (visuals cued to words) -> score -> mix -> MP4.
#   ./make.sh            uses the saved narration (build/narration.mp3 + alignment)
#   ./make.sh --voice    re-voices the script with ElevenLabs first (needs ELEVENLABS_API_KEY)
set -euo pipefail
cd "$(dirname "$0")"
export NODE_PATH=${NODE_PATH:-/opt/node-tools/node_modules}
if [[ "${1:-}" == "--voice" ]]; then python3 narrate.py; else python3 narrate.py --offline; fi
node render.js sfx
python3 music.py
python3 audio.py
rm -rf frames
N=$(python3 -c "import json,math;print(math.ceil(json.load(open('timeline.json'))['duration']*30))")
W=4; Q=$(( (N + W - 1) / W ))
for w in $(seq 0 $((W - 1))); do
  a=$(( w * Q )); b=$(( (w + 1) * Q < N ? (w + 1) * Q : N ))
  node render.js frames "$a" "$b" frames &
done
wait
ffmpeg -y -v error -framerate 30 -i frames/%05d.jpg -i mix.wav -filter:v "format=yuv420p" \
  -c:v libx264 -preset slow -crf 21 -maxrate 4.2M -bufsize 8M -profile:v high -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 -shortest ../out/no-cost-emi.mp4
COVER=$(python3 -c "import json;t=json.load(open('timeline.json'));print(round(t['lines'][2]['end']+0.3,2))")
node render.js cover ../out/no-cost-emi-cover.jpg "$COVER"
echo "done: ../out/no-cost-emi.mp4"
