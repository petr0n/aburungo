#!/usr/bin/env bash
#
# Nightly SIGNED-IN walkthrough on the owner's Mac, run by launchd
# (scripts/launchd/app.aburungo.nightly-walk.plist; install steps in
# docs/testing.md). CI's nightly walk is a guest and stops at Book One; this
# one signs in as walkthrough@aburungo.app and walks Books One to Four.
#
# It never runs in the main checkout, which other agents edit all day. It runs
# in a dedicated worktree (NIGHTLY_DIR) that it hard-resets to origin/main, so
# nothing else may use that worktree. Everything lives under ~/aburungo-nightly,
# not ~/Documents: macOS refuses launchd jobs access to ~/Documents (exit 126,
# "Operation not permitted"). So it also keeps its own design-system clone at
# CI's pin, and its own copies of .env.local and server/.env in env/. A failed night opens or comments on the
# GitHub issue labelled nightly-failure, same as walkthrough.yml.
#
# Usage:  scripts/nightly-local.sh
#         NIGHTLY_DRY_RUN=1 scripts/nightly-local.sh --report <log>
#           (prints the gh commands a failure would run, files nothing)
set -euo pipefail

NIGHTLY_HOME="${NIGHTLY_HOME:-$HOME/aburungo-nightly}"
NIGHTLY_DIR="$NIGHTLY_HOME/aburungo"
DS_DIR="$NIGHTLY_HOME/aburungo-design-system"  # package.json links ../aburungo-design-system
LOG_DIR="${LOG_DIR:-$HOME/Library/Logs/aburungo-nightly}"
API_PORT="${API_PORT:-3190}"
PREVIEW_PORT="${PREVIEW_PORT:-4390}"
REPO=petr0n/aburungo

report_failure() { # $1 = log file, $2 = one-line reason
  local log="$1" reason="$2" n msg
  # An outage is not a lesson stall; say which it was.
  if grep -qE 'ENOTFOUND|getaddrinfo|AuthRetryableFetchError|fetch failed|ECONNREFUSED' "$log"; then
    reason="Supabase unreachable (DNS/connection error in log), not an app defect -- $reason"
  fi
  msg="Nightly **local signed-in walkthrough** failed on main ($(date +%F), $(hostname -s)): $reason

Log: \`$log\`

\`\`\`
$(tail -n 60 "$log" | cut -c1-300)
\`\`\`"
  run() { if [ -n "${NIGHTLY_DRY_RUN:-}" ]; then { printf 'DRY RUN:'; printf ' %q' "$@"; echo; } >&2; else "$@"; fi; }
  run gh label create nightly-failure --repo "$REPO" --color B60205 --force >/dev/null
  n=$(gh issue list --repo "$REPO" --label nightly-failure --state open --json number -q '.[0].number')
  if [ -n "$n" ]; then run gh issue comment "$n" --repo "$REPO" --body "$msg"
  else run gh issue create --repo "$REPO" --label nightly-failure --title "Nightly tests failing" --body "$msg"; fi
}

if [ "${1:-}" = "--report" ]; then
  report_failure "$2" "${3:-manual report}"
  exit 0
fi

# Keep the Mac awake for the whole run (~1h45m).
if [ -z "${NIGHTLY_CAFFEINATED:-}" ]; then
  NIGHTLY_CAFFEINATED=1 exec caffeinate -i bash "$0" "$@"
fi

mkdir -p "$LOG_DIR"
LOG="${NIGHTLY_LOG:-$LOG_DIR/$(date +%F-%H%M).log}"
export NIGHTLY_LOG="$LOG"
exec >>"$LOG" 2>&1
echo "=== nightly start $(date) ==="

# Two signed-in walks on the walk account reset each other's progress. A
# manual walk already running makes tonight a skip, not a failure.
if pgrep -f walkthrough.cjs >/dev/null; then
  echo "=== SKIPPED: another walkthrough.cjs is running ==="
  pgrep -fl walkthrough.cjs
  exit 0
fi

cd "$NIGHTLY_DIR"
if [ -z "${NIGHTLY_RESET_DONE:-}" ]; then
  git fetch -q origin
  git reset -q --hard origin/main
  echo "=== at $(git log -1 --oneline) ==="
  # Run main's copy of this script from here on, so a merged change to it
  # takes effect the same night. (git replaces the file rather than editing
  # it in place, so the copy bash is reading now is unaffected.)
  NIGHTLY_RESET_DONE=1 exec bash "$NIGHTLY_DIR/scripts/nightly-local.sh" "$@"
fi

# Both gitignored; refresh env/ from the main checkout if they change.
cp "$NIGHTLY_HOME/env/.env.local" .env.local
cp "$NIGHTLY_HOME/env/server.env" server/.env

cleanup() {
  [ -n "${API_PID:-}" ] && kill "$API_PID" 2>/dev/null || true
  lsof -ti:"$API_PORT" | xargs kill 2>/dev/null || true
  ls -t "$LOG_DIR"/*.log 2>/dev/null | tail -n +15 | xargs rm -f
}
trap cleanup EXIT

fail() { echo "=== NIGHTLY FAILED: $1 ==="; report_failure "$LOG" "$1"; exit 1; }

# Same design-system pin as CI (ci.yml), built the same way.
pin=$(sed -n 's/^ *ref: \([0-9a-f]\{40\}\).*/\1/p' .github/workflows/ci.yml | head -1)
[ -n "$pin" ] || fail "no design-system pin in ci.yml"
(cd "$DS_DIR" && git fetch -q origin && git checkout -q --detach "$pin" \
  && pnpm install --frozen-lockfile && pnpm build) || fail "design-system build at $pin"

pnpm install --frozen-lockfile || fail "pnpm install"

lsof -ti:"$API_PORT" | xargs kill 2>/dev/null || true
(cd server && PORT="$API_PORT" FRONTEND_URL="http://localhost:$PREVIEW_PORT" exec ./node_modules/.bin/tsx src/index.ts) &
API_PID=$!
for _ in $(seq 1 60); do curl -fsS -o /dev/null "http://localhost:$API_PORT/health" && break; sleep 1; done
curl -fsS -o /dev/null "http://localhost:$API_PORT/health" || fail "API never answered on :$API_PORT"
echo "=== API up on :$API_PORT ==="

# 3h ceiling: a hung browser must not hold the Mac awake forever.
status=0
WALKTHROUGH_PORT="$PREVIEW_PORT" VITE_API_URL="http://localhost:$API_PORT" \
  perl -e 'alarm shift; exec @ARGV' 10800 bash scripts/walkthrough.sh || status=$?

# Never trust the exit code alone: the summary must be there, signed in,
# with lessons walked.
summary=$(grep '=== SUMMARY:' "$LOG" | tail -1 || true)
[ "$status" -eq 0 ] || fail "walkthrough exited $status"
[[ "$summary" == *"walkedAs=signed-in"* ]] || fail "no signed-in SUMMARY line"
[[ "$summary" == *"lessonsWalked=0,"* ]] && fail "walked zero lessons"
echo "=== nightly OK $(date) ==="
