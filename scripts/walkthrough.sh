#!/usr/bin/env bash
#
# Drive every /learn unit end-to-end in headless Chromium.
#
# Against a *static preview build*, never the dev server. HMR remounts React
# mid-session — a design-system edit hot-reloading GrammarClozeCard and
# FillBlankCard once produced a "stuck-in-produce-step" stall that looked
# exactly like an app defect and cost ~15 minutes. A preview bundle ships no
# HMR client, so a concurrent edit by another agent cannot perturb the run.
#
# Usage:  pnpm walkthrough
set -euo pipefail

PORT=4173
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# A git worktree has no .env.local (it is gitignored). Without it src/lib/supabase.ts
# throws at module scope, and Playwright surfaces that as "promise was garbage
# collected" — a misdiagnosis that costs ~15 minutes. Fail with the real reason.
[ -f .env.local ] || { echo "no .env.local — copy it from the main checkout" >&2; exit 1; }

# A leftover preview from an earlier run holds the port, --strictPort then
# refuses to start, and the walkthrough silently drives the STALE bundle and
# reports a pass. Free the port first rather than trusting it is free.
if lsof -ti:"$PORT" >/dev/null 2>&1; then
  echo "port $PORT in use, freeing it"
  lsof -ti:"$PORT" | xargs kill -9 2>/dev/null || true
  sleep 1
fi

pnpm build

pnpm exec vite preview --port "$PORT" --strictPort &
PREVIEW_PID=$!
trap 'kill "$PREVIEW_PID" 2>/dev/null || true' EXIT

# Poll rather than sleeping a fixed guess, and fail loudly if it never comes
# up — a walkthrough against nothing is worse than no walkthrough.
for _ in $(seq 1 40); do
  if curl -fsS -o /dev/null "http://localhost:$PORT/"; then
    break
  fi
  sleep 0.5
done
if ! curl -fsS -o /dev/null "http://localhost:$PORT/"; then
  echo "preview server never came up on $PORT" >&2
  exit 1
fi

BASE="http://localhost:$PORT" node scripts/walkthrough.cjs
