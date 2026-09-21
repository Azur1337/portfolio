#!/bin/sh
# Mobile Lighthouse audit against a fresh production build (preview server).
# Everything runs in ONE shell so the sandbox namespace stays consistent.
cd /home/azur/Portfolio2.0

export NO_PROXY=localhost,127.0.0.1

nohup bun run preview -- --port 4173 > /tmp/preview.log 2>&1 &
SERVER_PID=$!

code=000
i=0
while [ $i -lt 20 ]; do
  sleep 1
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/ 2>/dev/null || true)
  [ -z "$code" ] && code=000
  if [ "$code" = "200" ]; then break; fi
  i=$((i+1))
done
echo "HTTP $code"

CHROME_PATH=$(find ~/.cache/ms-playwright -name "chrome-headless-shell" -type f | head -1)
rm -rf /tmp/lh-chrome
bunx lighthouse http://localhost:4173/ \
  --form-factor=mobile \
  --only-categories=performance \
  --output=json \
  --output-path=/home/azur/Portfolio2.0/lh-mobile.json \
  --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-crash-reporter --no-first-run --user-data-dir=/tmp/lh-chrome" > /tmp/lh.log 2>&1
LH_EXIT=$?
echo "LH exit: $LH_EXIT"
tail -5 /tmp/lh.log || true

kill $SERVER_PID 2>/dev/null || true
echo "killed $SERVER_PID"
