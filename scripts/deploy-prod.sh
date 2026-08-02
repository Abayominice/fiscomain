#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_KEY="${SSH_KEY:-$ROOT_DIR/fiscomain/fiscomain_prod}"
SSH_HOST="${SSH_HOST:-root@178.128.174.14}"
REMOTE_DIR="${REMOTE_DIR:-/srv/fiscomain}"
SSH_OPTS=(
  -i "$SSH_KEY"
  -o BatchMode=yes
)

rsync -az --delete --no-owner --no-group \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude "@fiscomain" \
  -e "ssh ${SSH_OPTS[*]}" \
  "$ROOT_DIR/" "$SSH_HOST:$REMOTE_DIR/"

ssh "${SSH_OPTS[@]}" "$SSH_HOST" \
  "cd '$REMOTE_DIR' && npm ci && systemctl restart fiscomain && systemctl --no-pager --full status fiscomain | head -n 20"
