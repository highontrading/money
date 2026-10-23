#!/bin/sh
# Delivery encode: Instagram-friendly bitrate, -14 LUFS, fast start.
#   sh tools/finalize.sh out/<id>.mp4 final/<id>.mp4
set -e
mkdir -p "$(dirname "$2")"
ffmpeg -y -v error -i "$1" -c:v libx264 -preset slow -crf 23 -maxrate 4500k -bufsize 9M -pix_fmt yuv420p \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$2"
