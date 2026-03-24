#!/bin/sh
curl -s -X POST http://localhost:${PORT:-3100}/login \
  -H 'Content-Type: application/json' \
  -d "{\"companyId\": ${1:?Usage: ./login.sh <companyId>}}" | cat
