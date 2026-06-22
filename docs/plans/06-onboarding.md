# Onboarding

**Goal:** get the learner into their first real session as fast as possible. Three questions, no
level-setting, no scenario selection, no account required to start.

---

## Principles

- **Frictionless.** The app makes all content and sequencing decisions. Onboarding only captures
  the three preferences that affect session shape.
- **Everyone starts at the beginning.** No level assessment, no placement test. All learners enter
  at N5 Unit 1 (kana prerequisite first). Prior kana knowledge? The kana mini-ladder has a
  test-out path — onboarding doesn't ask.
- **No scenario selection.** The app provides a wide variety of real-life situations across the
  ladder. The learner doesn't choose; they encounter them in a sensible sequence.
- **First can-do goal is automatic.** The app assigns the first can-do ("greet someone in
  Japanese") from N5 Unit 1 — no learner choice. The goal is always the next concrete, reachable
  thing on the ladder.
- **All preferences are changeable at any time** in settings.

---

## The flow

```
Welcome screen  →  3 questions  →  first can-do goal shown  →  first session starts
```

### 1. Welcome screen

One screen. App name, one-line value prop ("Practical Japanese, one real situation at a time."),
single CTA: **Get started**. No marketing copy, no feature list.

### 2. Three questions

Presented one at a time (not a form). Each has a clear header and 2–3 tile options.

---

**Q1 — How intense do you want your learning path to be?**

| Option | What it means |
|---|---|
| Casual and slow | Fewer new items per session; gates unlock conservatively |
| Intermediate | Standard pace; the default |
| Make it challenging | More new items per session; gates unlock faster |

Maps to: `intensity` → orchestrator controls items-per-session and FSRS gate threshold.

---

**Q2 — At the end of a session, would you like a quick check on what you just learned?**

| Option | What it means |
|---|---|
| Yes, quick check | Recognition pass runs after each session (tap the matching Japanese tile) |
| No, just finish | Session ends at the close screen; no recognition pass |

Maps to: `session_end_check: boolean` → orchestrator appends recognition pass or not.

Note: this is a recognition pass, not a quiz. No score, no right/wrong feedback, no judgment —
just a lightweight re-encounter with the session's items. Language in the UI never uses "quiz."

---

**Q3 — How long do you want your sessions to be?**

| Option | Approximate target |
|---|---|
| Short | ~5–7 min |
| Medium | ~10–15 min (default) |
| Long | ~20–25 min |

Maps to: `session_length` → orchestrator controls review count and new-item budget per session.

---

### 3. First can-do goal

After the three questions, the app reveals the first can-do goal automatically:

> **Your first goal:** greet someone in Japanese.

No choices. One sentence. Shown briefly before the session starts — not a screen, just a moment.

### 4. First session

Begins immediately. The first session is the kana mini-ladder (hiragana) unless the learner
tests out (available from within the session, not during onboarding). The N5 main ladder starts
once kana is confirmed.

---

## Data captured

| Field | Type | Values |
|---|---|---|
| `intensity` | enum | `casual` / `intermediate` / `challenging` |
| `session_end_check` | boolean | `true` / `false` |
| `session_length` | enum | `short` / `medium` / `long` |
| `can_do_goal` | auto-assigned | N5 Unit 1 can-do (first in ladder sequence) |

These four values drive the orchestrator. All are stored in user preferences and editable in
settings at any time.

---

## What onboarding does NOT do

- Ask about level or prior experience
- Ask which scenarios or topics the learner wants
- Ask about notification preferences (covered in settings after the first session)
- Require an account (guest learners go through the same flow; progress syncs on sign-up)
