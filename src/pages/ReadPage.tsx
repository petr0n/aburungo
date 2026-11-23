import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { GlossaryEntry, GlossaryKind, Owner } from "@/types";
import { PageShell } from "@/components/PageShell";
import { Furigana } from "@/components/Furigana";
import { SourceCredit } from "@/components/SourceCredit";
import { useAuth, useUserTier } from "@/store/auth";
import { hydrateFromServer, keepForReview } from "@/db/reviewStore";
import { reachable } from "@/content/access";
import { books } from "@/content/books";
import { findText, glossaryFor, passages, stories, type ReadingText } from "@/content/reading/library";

const KIND_NOTE: Record<GlossaryKind, string | null> = {
  new: null,
  spelling: "another spelling of a word you know",
  "book-four": "taught in Book Four",
  name: "a name",
};

const BOOK_THREE_ORDER = books.find((b) => b.id === "book-3")?.order ?? 3;

/** The glossary's readings and meanings come from JMdict, credited apart from the text. */
const JMDICT_CREDIT = {
  text: "Glossary: JMdict, Electronic Dictionary Research and Development Group",
  link: "https://www.edrdg.org/jmdict/j_jmdict.html",
  licence: "EDRDG licence",
  licenceUrl: "https://www.edrdg.org/edrdg/licence.html",
};

/**
 * Only words no book teaches. A name is never reviewed, a spelling variant
 * points at a word already taught, and a Book Four word gets its schedule from
 * its lesson -- keeping it here would give it a second one.
 */
const KEEPABLE: ReadonlySet<GlossaryKind> = new Set(["new"]);

/** `keep` is null until this owner's saved reviews have loaded. */
type Keeping = { kept: ReadonlySet<string>; keep: ((id: string) => void) | null };

function GlossaryItem({ entry, keeping }: { entry: GlossaryEntry; keeping: Keeping }) {
  const note = KIND_NOTE[entry.kind];
  const kept = keeping.kept.has(entry.id);
  return (
    <li className="flex items-center gap-3 py-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <Furigana japanese={entry.japanese} reading={entry.reading} className="text-jp text-fg" />
        <span className="text-body-sm text-fg-muted">
          {entry.english}
          {note !== null && <span className="text-fg-subtle"> · {note}</span>}
        </span>
      </div>
      {KEEPABLE.has(entry.kind) && (
        <button
          type="button"
          onClick={() => keeping.keep?.(entry.id)}
          disabled={kept || keeping.keep === null}
          aria-label={kept ? `${entry.japanese} kept for review` : `Keep ${entry.japanese} for review`}
          className="min-h-[44px] shrink-0 rounded-xl border border-border px-4 text-body-sm font-medium text-fg active:bg-surface-2 disabled:border-transparent disabled:text-fg-subtle"
        >
          {kept ? "Kept" : "Keep"}
        </button>
      )}
    </li>
  );
}

/**
 * Which glossary words this owner has kept, read from the server so a word kept
 * on the phone reads as kept here. Keep waits for that read: keeping a word
 * before it lands could restart a schedule another device already has.
 */
function useKeeping(): Keeping {
  const owner = useAuth((s) => s.owner);
  // Tagged with its owner, so a switch of account shows nothing until the new one loads.
  const [loaded, setLoaded] = useState<{ owner: Owner; kept: ReadonlySet<string> } | null>(null);
  useEffect(() => {
    if (owner === null) return;
    let cancelled = false;
    void hydrateFromServer(owner).then((states) => {
      if (!cancelled) setLoaded({ owner, kept: new Set(states.map((s) => s.phraseId)) });
    });
    return () => {
      cancelled = true;
    };
  }, [owner]);
  if (owner === null || loaded === null || loaded.owner !== owner) return { kept: new Set(), keep: null };
  return {
    kept: loaded.kept,
    keep: (id) => {
      setLoaded((l) => (l === null || l.owner !== owner ? l : { owner, kept: new Set([...l.kept, id]) }));
      void keepForReview(owner, id);
    },
  };
}

function TextRow({ text }: { text: ReadingText }) {
  return (
    <li>
      <Link
        to={`/read/${text.id}`}
        className="flex min-h-[56px] flex-col justify-center rounded-xl px-3 py-2 active:bg-surface-sunken"
      >
        <span lang="ja" className="text-body text-fg" style={{ fontFamily: "var(--font-jp)" }}>{text.title}</span>
        <span className="text-caption text-fg-subtle">
          {text.level} · {text.sentences.length} sentences · {text.glossary.length} words in the glossary
        </span>
      </Link>
    </li>
  );
}

function Library() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-display text-fg">Read</h1>
        <p className="max-w-prose text-body text-fg-muted">
          Real Japanese stories and news passages. Tap a sentence to see the words it uses that the
          lessons have not taught yet, and keep the ones you want to learn: they join your daily review
          in the sentence you found them in.
        </p>
      </header>
      <section className="flex flex-col gap-2">
        <h2 className="text-heading-sm font-semibold text-fg">Stories</h2>
        <ul className="flex flex-col">{stories.map((t) => <TextRow key={t.id} text={t} />)}</ul>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-heading-sm font-semibold text-fg">News passages</h2>
        <p className="text-body-sm text-fg-subtle">Harder than the stories: translated news, one paragraph each.</p>
        <ul className="flex flex-col">{passages.map((t) => <TextRow key={t.id} text={t} />)}</ul>
      </section>
    </div>
  );
}

function Reader({ text }: { text: ReadingText }) {
  const [open, setOpen] = useState<number | null>(null);
  const keeping = useKeeping();
  return (
    <div className="flex flex-col gap-6 py-8">
      <Link to="/read" className="flex min-h-[44px] items-center text-body-sm text-fg-subtle">← Library</Link>
      <header className="flex flex-col gap-2">
        <h1 lang="ja" className="text-heading text-fg" style={{ fontFamily: "var(--font-jp)" }}>{text.title}</h1>
        <SourceCredit {...text.credit} />
      </header>
      <ol className="flex flex-col gap-1">
        {text.sentences.map((s, i) => {
          const words = glossaryFor(s, text.glossary);
          const isOpen = open === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`min-h-[44px] w-full rounded-lg px-2 py-2 text-left text-jp wrap-anywhere leading-relaxed text-fg ${isOpen ? "bg-surface-sunken" : "active:bg-surface-sunken"}`}
                style={{ fontFamily: "var(--font-jp)" }}
                lang="ja"
              >
                {s}
              </button>
              {isOpen && (
                <div className="px-2 pb-2">
                  {words.length === 0 ? (
                    <p className="py-2 text-body-sm text-fg-subtle">No glossary words here.</p>
                  ) : (
                    <ul className="divide-y divide-border">{words.map((e) => <GlossaryItem key={e.id} entry={e} keeping={keeping} />)}</ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <section className="flex flex-col gap-2 border-t border-border pt-6">
        <h2 className="text-heading-sm font-semibold text-fg">Glossary</h2>
        <ul className="divide-y divide-border">{text.glossary.map((e) => <GlossaryItem key={e.id} entry={e} keeping={keeping} />)}</ul>
        <SourceCredit {...JMDICT_CREDIT} />
      </section>
    </div>
  );
}

/** Book Three's reading library (/read) and reader (/read/:id). */
export function ReadPage() {
  const { id } = useParams();
  const tier = useUserTier();

  if (!reachable(BOOK_THREE_ORDER, tier)) {
    return (
      <PageShell>
        <div className="flex flex-col gap-4 py-8">
          <h1 className="text-display text-fg">Read</h1>
          <p className="max-w-prose text-body text-fg-muted">
            The reading library goes with Book Three: real stories and news in Japanese, with a
            glossary for every word the lessons have not taught. It comes with a free account.
          </p>
          <Link
            to="/"
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
          >
            Sign in or create an account
          </Link>
        </div>
      </PageShell>
    );
  }

  const text = id === undefined ? undefined : findText(id);
  return (
    <PageShell>
      <div className="w-full">
        {id === undefined ? (
          <Library />
        ) : text === undefined ? (
          <div className="flex flex-col gap-4 py-8">
            <p className="text-body text-fg-muted">There is no text here.</p>
            <Link to="/read" className="flex min-h-[44px] items-center text-body-sm text-fg-subtle">← Library</Link>
          </div>
        ) : (
          <Reader text={text} />
        )}
      </div>
    </PageShell>
  );
}
