#!/usr/bin/env bash
# Remove install, build, and cache output from this repo.
# Usage: scripts/clean.sh [--dry-run]
set -euo pipefail

dry_run=0
if [[ "${1:-}" == "--dry-run" ]]; then
  dry_run=1
elif [[ -n "${1:-}" ]]; then
  echo "Usage: $(basename "$0") [--dry-run]" >&2
  exit 1
fi

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

dir_names=(
  node_modules
  .next
  dist
  build
  out
  coverage
  storybook-static
  .turbo
  .cache
  .vercel
  .swc
  .vite
)

file_names=(
  "*.tsbuildinfo"
  "next-env.d.ts"
  ".eslintcache"
  "*storybook.log"
  ".pnpm-debug.log*"
)

dir_expr=()
for name in "${dir_names[@]}"; do
  dir_expr+=(-o -name "$name")
done
dir_expr=("${dir_expr[@]:1}")

file_expr=()
for name in "${file_names[@]}"; do
  file_expr+=(-o -name "$name")
done
file_expr=("${file_expr[@]:1}")

paths=()
while IFS= read -r path; do
  [[ -n "$path" ]] && paths+=("$path")
done < <(
  find . \
    -path './.git' -prune -o \
    -type d \( "${dir_expr[@]}" \) -prune -print
  find . \
    -path './.git' -prune -o \
    -type d \( "${dir_expr[@]}" \) -prune -o \
    -type f \( "${file_expr[@]}" \) -print
)

count=0
if ((${#paths[@]})); then
  for path in "${paths[@]}"; do
    if ((dry_run)); then
      printf 'would remove %s\n' "$path"
    else
      rm -rf "$path"
      printf 'removed %s\n' "$path"
    fi
    count=$((count + 1))
  done
fi

if ((dry_run)); then
  printf 'dry run: %s path(s)\n' "$count"
else
  printf 'removed %s path(s)\n' "$count"
  printf 'run pnpm install to restore dependencies\n'
fi
