#!/usr/bin/env bash
#
# Vercel's install step.
#
# This lives in a script rather than inline in vercel.json because
# installCommand is capped at 256 characters and the pinned checkout does not
# fit -- exceeding the cap makes Vercel reject the whole config, which reads as
# a mysterious "Deployment failed" against a docs link rather than a build log.
#
# The design system is pinned on purpose. Cloning its default branch meant a
# merge in that repo could break this repo's builds with no commit here, which
# is what happened on 2026-08-21 when 'recalled' was dropped from
# AnswerOutcome. .github/workflows/ci.yml pins the same sha; bump the two
# together, as their own PR.
set -euo pipefail

DS_SHA=b2ecac62aca5c6ab60f3695b749a2427df71517c
DS_DIR=../aburungo-design-system

npm i -g pnpm@11.1.3
PATH="$(npm config get prefix)/bin:$PATH"
export PATH

git clone https://github.com/petr0n/aburungo-design-system.git "$DS_DIR"
git -C "$DS_DIR" checkout "$DS_SHA"
(cd "$DS_DIR" && pnpm i && pnpm build)

pnpm i --frozen-lockfile
