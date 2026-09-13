#!/usr/bin/env python3
"""
AburunGo Content Audit - Layer 2 (trimmed per feedback).

Kept checks:
  1. Source citation markers on content files (# content-source / # jlpt-source / # Source:)
  5. Source citation in commit messages for content changes (per CLAUDE.md)

Deleted (covered by pnpm test):
  2. Lesson reference integrity - contentIntegrity.test.ts + kanji/scope.test.ts
  3. JLPT consistency - fires on nothing, only looks at Book Two
  4. Ladder regeneration - ladder.test.mjs + manifest.test.mjs

Run from the repo root. Exits 0 unless a blocking finding is present.
"""

import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

# Discover the repo root at import time — works on any machine, including
# GitHub Actions runners where the path is not /Users/peterabeln/...
def repo_root() -> Path:
    try:
        r = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, timeout=10,
        )
        if r.returncode == 0:
            return Path(r.stdout.strip())
    except Exception:
        pass
    # Best-effort fallback: assume CWD is the repo root.
    return Path.cwd()

REPO = repo_root()
CONTENT_DIR = REPO / "src" / "content"

FINDINGS: List[Dict[str, Any]] = []


def add_finding(file, line, kind, summary, why):
    FINDINGS.append({"file": file, "line": line, "type": kind, "summary": summary, "why": why, "agent": "content-audit"})


def run(cmd: list[str], timeout: int = 120) -> tuple[int, str, str]:
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return r.returncode, r.stdout, r.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "timeout"
    except Exception as e:
        return -1, "", str(e)


# ── 1. Source citation markers ──────────────────────────────────────────

def check_source_markers() -> None:
    """Content files carrying Japanese should carry a source marker."""
    for yf in CONTENT_DIR.rglob("*.yaml"):
        text = yf.read_text(encoding="utf-8", errors="replace")
        if not text.strip():
            continue
        rel = str(yf.relative_to(REPO))

        if yf.name.endswith(".test.yaml"):
            continue

        # Accept any of: # content-source, # jlpt-source, # Source:
        has_marker = bool(re.search(r"#\s*(content-source|jlpt-source|Source:)", text))
        has_japanese = bool(re.search(r"[ぁ-ゟヽヾ一-龯]", text))

        if has_japanese and not has_marker:
            is_vocab_or_phrase_or_kanji = (
                "vocabulary" in yf.parts or "phrases" in yf.parts or "kanji" in yf.parts
            )
            if is_vocab_or_phrase_or_kanji:
                add_finding(rel, None, "blocking",
                    f"{yf.name} carries Japanese but no source marker",
                    "CLAUDE.md requires source citation for Japanese content. "
                    "Vocabulary, phrase, and kanji files must carry # content-source, "
                    "# jlpt-source, or # Source: markers.")


# ── 5. Commit message source citation ───────────────────────────────────

def check_commit_citations() -> None:
    """Content changes in the current branch must cite a source per CLAUDE.md."""
    # Try the full-clone range first.
    code, stdout, _ = run(
        ["git", "log", "origin/main..HEAD", "--format=%H %s", "--", "src/content/"],
        timeout=10,
    )
    if code == 0 and stdout.strip():
        lines = stdout.strip().split("\n")
    else:
        # Shallow checkout (CI PR runner): origin/main may not resolve.
        # Scan recent content-touching commits from HEAD instead.
        code2, stdout2, _ = run(
            ["git", "log", "--format=%H %s", "-n", "100", "--", "src/content/"],
            timeout=10,
        )
        if code2 != 0 or not stdout2.strip():
            return
        lines = stdout2.strip().split("\n")
    for line in lines:
        sha, msg = line.split(" ", 1)
        if not re.search(r"Source:", msg, re.IGNORECASE):
            add_finding(f"commit {sha[:7]}", None, "blocking",
                f"Commit {sha[:7]} modifies content without a source citation",
                f"Subject: '{msg}'. CLAUDE.md requires source citation in the commit "
                "message for any commit that adds or modifies Japanese content.")


def main() -> None:
    if not REPO.is_dir():
        print("Not in aburungo repo", file=sys.stderr)
        sys.exit(1)

    check_source_markers()
    check_commit_citations()

    print(json.dumps(FINDINGS, indent=2))

    blocking = [f for f in FINDINGS if f["type"] == "blocking"]
    if blocking:
        print(f"\nBLOCKING: {len(blocking)} finding(s)", file=sys.stderr)
        sys.exit(1)
    else:
        print(f"\nOK: {len(FINDINGS)} advisory finding(s), no blocking", file=sys.stderr)


if __name__ == "__main__":
    main()
