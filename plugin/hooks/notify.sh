#!/bin/bash
BODY=$(cat)
curl -s -o /dev/null --connect-timeout 1 \
  -X POST -H 'Content-Type: application/json' \
  -d "$BODY" \
  http://127.0.0.1:50055/hooks 2>/dev/null || true
