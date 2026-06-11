#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "Error: Not a git repository" >&2
  exit 1
fi

if git diff --cached --quiet && [ -z "$(git diff --cached --name-only)" ]; then
  echo "=== No staged changes. Using unstaged changes. ==="
  echo ""
  echo "=== Changed files ==="
  git diff --name-only
  echo ""
  echo "=== Diff ==="
  git diff
else
  echo "=== Staged changes ==="
  echo ""
  echo "=== Changed files ==="
  git diff --cached --name-only
  echo ""
  echo "=== Diff ==="
  git diff --cached
fi
