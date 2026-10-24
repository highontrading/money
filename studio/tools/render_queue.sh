#!/bin/sh
# Render reels listed in build/queue.txt one at a time, in order.
# Append a reel id to queue it; append STOP to end the runner.
#   sh tools/render_queue.sh
cd "$(dirname "$0")/.."
touch build/queue.txt build/queue.done
while true; do
  next=$(grep -vxF -f build/queue.done build/queue.txt | head -1)
  if [ -z "$next" ]; then sleep 20; continue; fi
  echo "$next" >> build/queue.done
  [ "$next" = "STOP" ] && exit 0
  if sh tools/render_reel.sh "$next" > "build/render-$next.log" 2>&1; then echo "ok $next"; else echo "FAILED $next"; fi
done
