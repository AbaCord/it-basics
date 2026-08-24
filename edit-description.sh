#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <locale> <challenge-id>"
  exit 1
fi

locale="$1"
challenge_id="$2"

file="src/messages/${locale}.json"
tmp_md=$(mktemp --suffix=.md)
tmp_json=$(mktemp)

trap 'rm -f "$tmp_md" "$tmp_json"' EXIT

if ! jq -e --arg id "$challenge_id" \
  '.Challenges[$id].description != null' \
  "$file" > /dev/null; then
  echo "Challenge '$challenge_id' not found in locale '$locale'"
  exit 1
fi

jq -r --arg id "$challenge_id" \
  '.Challenges[$id].description' \
  "$file" > "$tmp_md"

"${EDITOR:-nvim}" "$tmp_md"

jq --rawfile description "$tmp_md" \
  --arg id "$challenge_id" \
  '.Challenges[$id].description = $description' \
  "$file" > "$tmp_json"

mv "$tmp_json" "$file"

echo "Updated $locale/$challenge_id description"
