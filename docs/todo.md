# Todo

## Pending

- [ ] **Review all closed PRs** — go through the test checklist on each merged PR (#1–#17) and manually verify each item. None of the PR checklists have been worked through yet.
- [ ] **Sign in with Apple** — skipped for now (requires $99/yr Apple Developer account). Supabase supports it natively; steps: register App ID + Services ID on developer.apple.com, generate Sign in with Apple private key, enter Team ID / Key ID / Services ID / private key in Supabase Auth → Providers → Apple, then add the Apple button to `AuthForm` alongside Google.
- [ ] **`user_kana_progress` migration** — new Supabase migration; columns: `user_id`, `character`, `recognized` (int), `recalled` (int), `last_seen_at` (timestamptz)
- [ ] **Extend `/api/progress/stats`** — return per-tier phrase + kanji + kana breakdowns (currently global counts only)
- [ ] **Progress store (Zustand)** — localStorage key `aburungo_progress` for guests, API mirror for signed-in users; shape defined in DR-009
- [ ] **Two-tone progress bar widget** — sidebar component; light fill = reviewed/seen, dark fill = mastered/recalled; context-sensitive per page section (phrases for practice/flashcard, kana for kana, kanji for kanji)
- [ ] **Profile page progress dashboard** — full stats view + per-script and full kana reset controls with confirmation dialog; wipes `user_kana_progress` rows for signed-in users

## In progress

<!-- Move items here when actively working on them -->

## Done

- [x] **Persistent PageShell** — shared two-row header, `max-w-5xl` content width, sidebar always present on desktop (lg); `SectionNav` sub-nav on practice/flashcard/kana pages (DR-008)
- [x] **Profile route** — `/profile` added; guests see sign-in prompt, logged-in users see account info (DR-008)
- [x] **Soft prompt for `/conversation`** — replaced `ProtectedRoute` hard-redirect with inline soft prompt for guests (DR-008)
