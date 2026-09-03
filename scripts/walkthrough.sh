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
# A guest reaches Book One and stops there, so a plain run verifies ~100 lessons
# and none of Book Two. Put WALKTHROUGH_EMAIL and WALKTHROUGH_PASSWORD in
# .env.local (gitignored) and the driver signs in first, which lifts it to the
# free tier and reaches Book Four. The summary line says which way it walked.
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

# Credentials live in .env.local, which is gitignored. Read only the two keys we
# want, so nothing else in that file leaks into the driver's environment. An
# existing WALKTHROUGH_EMAIL in the shell wins, for a one-off run as someone else.
if [ -z "${WALKTHROUGH_EMAIL:-}" ]; then
  WALKTHROUGH_EMAIL="$(sed -n 's/^WALKTHROUGH_EMAIL=//p' .env.local | tr -d '"' | head -1)"
  WALKTHROUGH_PASSWORD="$(sed -n 's/^WALKTHROUGH_PASSWORD=//p' .env.local | tr -d '"' | head -1)"
fi
export WALKTHROUGH_EMAIL WALKTHROUGH_PASSWORD

# The API server's CORS allowlist is FRONTEND_URL, defaulting to the dev server
# on :5173 (server/src/index.ts). This walk serves a preview build on :4173, so
# every /api call from it is blocked at preflight unless the server was started
# with FRONTEND_URL pointing here. A signed-in walk needs those calls: progress
# is server-durable (DR-018).
if [ -n "${WALKTHROUGH_EMAIL:-}" ] && lsof -ti:3000 >/dev/null 2>&1; then
  if ! curl -fsS -o /dev/null -H "Origin: http://localhost:$PORT" \
       -D- "http://localhost:3000/health" 2>/dev/null | grep -qi "access-control-allow-origin"; then
    echo "WARNING: API server on :3000 does not allow origin http://localhost:$PORT." >&2
    echo "         Restart it as: FRONTEND_URL=http://localhost:$PORT pnpm dev:api" >&2
  fi
fi

BASE="http://localhost:$PORT" node scripts/walkthrough.cjs
