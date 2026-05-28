#!/bin/bash
# Vercel install step: clone and build ADS sibling, then install the app.
# Required because pnpm resolves link:../aburungo-design-system at install time
# and Vercel's build server does not have the sibling repo checked out.
set -euo pipefail

# Install pnpm 11 and ensure it takes precedence over Vercel's bundled pnpm.
npm install -g pnpm@11.1.3
export PATH="$(npm bin -g):$PATH"

# Clone ADS to the expected sibling path.
git clone https://github.com/petr0n/aburungo-design-system.git ../aburungo-design-system

# Build ADS so its dist/ is available when the app imports from it.
cd ../aburungo-design-system
pnpm install --frozen-lockfile
pnpm build
cd -

# Install the app (pnpm resolves link:../aburungo-design-system normally now).
pnpm install --frozen-lockfile
