#!/bin/bash
BODY=$(cat)
PORT="${JOY_PORT:-50055}"
URL="${JOY_URL:-http://127.0.0.1:${PORT}/hooks}"
curl -s -o /dev/null --connect-timeout 1 \
  -X POST -H 'Content-Type: application/json' \
  -d "$BODY" \
  "$URL" 2>/dev/null || true
