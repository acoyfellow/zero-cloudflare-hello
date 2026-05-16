#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
ZERO_BIN="${ZERO_BIN:-zero}"

mkdir -p "$ROOT/artifacts"
"$ZERO_BIN" check --json "$ROOT/hello.0"
"$ZERO_BIN" build \
  --emit exe \
  --target linux-musl-x64 \
  "$ROOT/hello.0" \
  --out "$ROOT/artifacts/hello-linux-musl-x64"

printf 'built %s\n' "$ROOT/artifacts/hello-linux-musl-x64"
