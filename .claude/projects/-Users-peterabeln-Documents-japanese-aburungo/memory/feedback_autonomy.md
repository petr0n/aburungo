---
name: feedback_autonomy
description: User wants Claude to act autonomously on routine edits — no confirmation needed for CLAUDE.md, settings, or similar housekeeping files
metadata:
  type: feedback
---

Don't ask for permission before editing CLAUDE.md, settings.json, or other project configuration/documentation files. Just make the change.

**Why:** User finds confirmation prompts for routine edits annoying and slowing.

**How to apply:** When a task clearly requires updating CLAUDE.md, settings.json, docs, or similar files, do it directly without asking. Reserve confirmation for destructive or high-blast-radius actions (deleting branches, force-pushing, dropping DB tables).
