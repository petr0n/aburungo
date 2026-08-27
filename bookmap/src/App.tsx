import { useState } from "react";
import type { Book, Lesson } from "@/types";
import { books } from "@/content/books";
import { allWords } from "@/content/vocabulary";
import { allPhrases } from "@/content";
import { allGrammarPatterns } from "@/content/grammar";
import { BookNav } from "./BookNav";
import { ChapterNav } from "./ChapterNav";

const words = new Map(allWords.map((w) => [w.id, w]));
const phrases = new Map(allPhrases.map((p) => [p.id, p]));
const patterns = new Map(allGrammarPatterns.map((g) => [g.id, g]));

const CHECKPOINT_LABEL: Record<NonNullable<Lesson["checkpoint"]>, string> = {
  recognition: "Recognition checkpoint",
  production: "Production checkpoint",
  conversation: "Conversation with Hana",
  "can-do": "Can-do review",
};

function LessonRow({ lesson, n, total }: { lesson: Lesson; n: number; total: number }) {
  if (lesson.checkpoint) {
    return (
      <li className="row row--cp">
        <span className="ord">{lesson.order}</span>
        <span className="cp-body">
          <span className="cp-title">{CHECKPOINT_LABEL[lesson.checkpoint]}</span>
          <span className="cp-note">{lesson.canDo}</span>
        </span>
        <span className="cp-tag">{lesson.chapterId === undefined ? "closes the book" : "closes the chapter"}</span>
      </li>
    );
  }
  const pattern = lesson.patternId ? patterns.get(lesson.patternId) : undefined;
  const lessonWords = lesson.wordIds.map((id) => words.get(id)).filter((w) => w !== undefined);
  const lessonPhrases = lesson.phraseIds.map((id) => phrases.get(id)).filter((p) => p !== undefined);

  return (
    <li className="row">
      <span className="ord">{lesson.order}</span>
      <div className="body">
        <span className="head">
          <span className="n">Lesson {n} of {total}</span>
          <span className="sit">{lesson.situation}</span>
        </span>
        <span className="title">{lesson.title}</span>
        <span className="cando">{lesson.canDo}</span>
        {pattern && (
          <span className="pat">
            <span lang="ja">{pattern.pattern}</span> — {pattern.gloss}
          </span>
        )}
        <details>
          <summary>
            {lesson.wordIds.length} words · {lesson.phraseIds.length} phrases
            {lesson.kanji.length > 0 && ` · ${lesson.kanji.length} kanji`}
          </summary>
          <div className="detail">
            {lessonWords.length > 0 && (
              <table>
                <thead>
                  <tr><th>Word</th><th>Reading</th><th>Meaning</th></tr>
                </thead>
                <tbody>
                  {lessonWords.map((word) => (
                    <tr key={word.id}>
                      <td lang="ja">{word.japanese}</td>
                      <td lang="ja">{word.reading}</td>
                      <td>{word.english}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {lessonPhrases.length > 0 && (
              <ul className="phrases">
                {lessonPhrases.map((phrase) => (
                  <li key={phrase.id}>
                    <span lang="ja">{phrase.japanese}</span> <em>{phrase.english}</em>
                  </li>
                ))}
              </ul>
            )}
            {lesson.kanji.length > 0 && (
              <p className="kanji">
                {lesson.kanji.map((k) => (
                  <span key={k} className="k" lang="ja">{k}</span>
                ))}
              </p>
            )}
            <p className="note">{lesson.grammarNote}</p>
          </div>
        </details>
      </div>
    </li>
  );
}

function ChapterSection({ book, chapter }: { book: Book; chapter: Book["chapters"][number] }) {
  const own = book.lessons.filter((l) => l.chapterId === chapter.id);
  const teaching = own.filter((l) => !l.checkpoint);
  const situations = [...new Set(teaching.map((l) => l.situation))];
  const teachingIndex = new Map(teaching.map((l, i) => [l.id, i + 1]));

  return (
    <section id={`ch-${chapter.order}`} className="chapter" aria-labelledby={`ch-h-${chapter.order}`}>
      <header className="ch-head">
        <span className="ch-num">{chapter.order}</span>
        <span className="ch-meta">
          <h2 id={`ch-h-${chapter.order}`}>{chapter.title}</h2>
          <p className="sits">{situations.join(" · ")}</p>
        </span>
        <span className="ch-stats">
          <span><b>{teaching.length}</b> lessons</span>
          <span><b>{teaching.reduce((a, l) => a + l.wordIds.length, 0)}</b> words</span>
          <span><b>{teaching.reduce((a, l) => a + l.phraseIds.length, 0)}</b> phrases</span>
        </span>
      </header>
      <ol className="rows">
        {own.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} n={teachingIndex.get(lesson.id) ?? 0} total={teaching.length} />
        ))}
      </ol>
    </section>
  );
}

export function App() {
  const [bookId, setBookId] = useState(books[0].id);
  const book = books.find((b) => b.id === bookId) ?? books[0];

  // book.lessons is already the shipped ladder: the app's own content modules
  // filter the Hana-gated checkpoints out behind VITE_HANA_ENABLED (DR-023).
  const teaching = book.lessons.filter((l) => !l.checkpoint);
  const closers = book.lessons.filter((l) => l.chapterId === undefined);
  const wordCount = new Set(book.lessons.flatMap((l) => l.wordIds)).size;
  const phraseCount = new Set(book.lessons.flatMap((l) => l.phraseIds)).size;
  const patternCount = new Set(book.lessons.flatMap((l) => (l.patternId ? [l.patternId] : []))).size;
  const kanjiCount = new Set(book.lessons.flatMap((l) => l.kanji)).size;

  const selectBook = (b: Book) => {
    setBookId(b.id);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <ChapterNav key={book.id} chapters={book.chapters} />
      <div className="wrap">
        <header className="book">
          <BookNav books={books} current={book} onSelect={selectBook} />
          <p className="eyebrow">AburunGo · {book.title} · id prefix {book.progressKey}</p>
          <h1>{book.title} Ladder</h1>
          <p className="sub">
            Every chapter, lesson and checkpoint a learner meets, in order. Expand any lesson for
            the words and phrases it teaches. Rendered from the app's own content modules, so it
            is what the app ships — not a plan of what it might.
          </p>
          <div className="totals">
            <div><b>{book.lessons.length}</b><span>lessons</span></div>
            <div><b>{book.chapters.length}</b><span>chapters</span></div>
            <div><b>{book.lessons.length - teaching.length}</b><span>checkpoints</span></div>
            <div><b>{wordCount}</b><span>words</span></div>
            <div><b>{phraseCount}</b><span>phrases</span></div>
            <div><b>{patternCount}</b><span>patterns</span></div>
            <div><b>{kanjiCount}</b><span>kanji</span></div>
          </div>
        </header>

        {book.chapters.map((chapter) => (
          <ChapterSection key={chapter.id} book={book} chapter={chapter} />
        ))}

        {closers.length > 0 && (
          <section className="closers">
            <h3>Closing the book</h3>
            <p>Belongs to no chapter: it reviews every situation in the book rather than one chapter's worth.</p>
            <ol className="rows">
              {closers.map((lesson) => (
                <LessonRow key={lesson.id} lesson={lesson} n={0} total={0} />
              ))}
            </ol>
          </section>
        )}

        <footer>
          Chapter length varies on purpose. Padding a chapter to a round number would put a
          checkpoint mid-situation, which is what DR-021 exists to prevent.
        </footer>
      </div>
    </>
  );
}
