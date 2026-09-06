import { useState } from "react";
import { Button, Card } from "aburungo-design-system";
import { FillInput } from "@/components/FillInput";
import { Furigana } from "@/components/Furigana";
import { compareAnswer } from "@/lib/compareAnswer";
import { parsePhrases } from "@/content/schema";
import raw from "@/content/phrases/b2-01-plain-form.yaml";
import "@/index.css";
import "./guided-production.css";

// Existing content only. These sentences are training-canonical, not Tatoeba quotations.
// Explicit chunk boundaries avoid deriving Japanese word boundaries from readings.
const phrases = parsePhrases(raw, "phrases/b2-01-plain-form.yaml");
const definitions = [
  {
    id: "plain.i-drink-coffee-every-day",
    title: "A daily habit",
    rule: "Use the plain non-past form.",
    chunks: ["毎日", "コーヒーを", "飲む。"],
    ending: "のむ。",
    cue: "Use the dictionary form of the verb: drink.",
    explanation: "The dictionary form expresses a habit here. The object marker stays with what you drink.",
  },
  {
    id: "plain.im-not-going-out-today",
    title: "Today's plans",
    rule: "Use the plain negative form.",
    chunks: ["今日は", "出かけない。"],
    ending: "でかけない。",
    cue: "Change the verb for going out to its plain negative form.",
    explanation: "This verb drops its final ru before nai. The topic and time expression stay in place.",
  },
  {
    id: "plain.i-read-a-book-last-night",
    title: "Last night",
    rule: "Use the plain past form.",
    chunks: ["昨夜", "本を", "読んだ。"],
    ending: "よんだ。",
    cue: "The plain past follows the same sound change as this verb's te-form.",
    explanation: "For this verb, the past form ends in nda. The object marker stays with what you read.",
  },
];
const exercises = definitions.map((definition) => {
  const phrase = phrases.find((p) => p.id === definition.id);
  if (!phrase || definition.chunks.join("") !== phrase.japanese || !phrase.reading.endsWith(definition.ending)) {
    throw new Error(`Prototype content drift: ${definition.id}`);
  }
  return { ...definition, phrase };
});
type Exercise = (typeof exercises)[number];
type Variant = "frame" | "build" | "recall" | "visible";
const variants: Array<{ id: Variant; title: string; description: string }> = [
  {
    id: "frame",
    title: "1 · With a frame",
    description: "Keep the sentence structure visible while you write the whole sentence.",
  },
  {
    id: "build",
    title: "2 · Build, then write",
    description: "Arrange familiar chunks, then hide them and write the sentence yourself.",
  },
  {
    id: "recall",
    title: "3 · Meaning first",
    description: "Write from the meaning. Reveal a cue or the frame when you need one.",
  },
  {
    id: "visible",
    title: "4 · Model stays visible",
    description: "Keep the full sentence in view. Choose to type it or build it from chunks.",
  },
];
const clean = (value: string) => value.normalize("NFKC").replace(/[\s。、,.!?！？]/g, "");
function matchesModel(answer: string, exercise: Exercise): boolean {
  return (
    compareAnswer(clean(answer), clean(exercise.phrase.reading)) || clean(answer) === clean(exercise.phrase.japanese)
  );
}
function Sentence({ exercise }: { exercise: Exercise }) {
  return (
    <Furigana japanese={exercise.phrase.japanese} reading={exercise.phrase.reading} className="font-jp text-jp-lg" />
  );
}
function Trial({ exercise, variant }: { exercise: Exercise; variant: Variant }) {
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [writing, setWriting] = useState(false);
  const [hint, setHint] = useState(0);
  const [result, setResult] = useState<{ answer: string; matches: boolean } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [assemblyMessage, setAssemblyMessage] = useState("");
  const prefix = exercise.phrase.reading.slice(0, -exercise.ending.length);
  const bank = exercise.chunks.map((_, i) => i).reverse();
  function checkAssembly() {
    if (selected.every((value, index) => value === index)) {
      setWriting(true);
      setSelected([]);
    } else {
      setAssemblyMessage("Not quite. Use the frame hint to check the order, then try again.");
    }
  }
  return (
    <Card>
      <div className="gp-stack">
        <div className="gp-eyebrow">{started ? "Your turn" : "Meet the pattern"} · Book Two</div>
        {!started ? (
          <>
            <h2>{exercise.title}</h2>
            <div className="gp-model">
              <Sentence exercise={exercise} />
              <p>{exercise.phrase.english}</p>
            </div>
            <p>
              {exercise.rule} {exercise.explanation}
            </p>
            <Button onClick={() => setStarted(true)} fullWidth>
              Try it yourself
            </Button>
          </>
        ) : (
          <>
            <h2>{exercise.phrase.english}</h2>
            <p>{exercise.rule} Use the wording from the example.</p>
            {(variant === "frame" || hint >= 2) && (
              <div className="gp-model">
                <span lang="ja" className="font-jp text-jp-lg">
                  {prefix}
                  <span className="gp-blank"> … </span>
                </span>
                <p>Keep this beginning; supply the verb ending.</p>
              </div>
            )}
            {hint >= 1 && <p className="gp-hint">{exercise.cue}</p>}
            {variant === "build" && !writing ? (
              <>
                <p>Tap the chunks in sentence order. Tap a placed chunk to remove it.</p>
                <div className="gp-answer" aria-label="Your assembled sentence">
                  {selected.length === 0 && <span>Build your sentence here</span>}
                  {selected.map((index, position) => (
                    <button
                      className="gp-chip"
                      key={index}
                      onClick={() => {
                        setSelected(selected.filter((_, i) => i !== position));
                        setAssemblyMessage("");
                      }}
                      aria-label={`Remove ${exercise.chunks[index]}`}
                      lang="ja"
                    >
                      {exercise.chunks[index]}
                    </button>
                  ))}
                </div>
                <div className="gp-bank">
                  {bank.map((index) => (
                    <button
                      className="gp-chip"
                      key={index}
                      disabled={selected.includes(index)}
                      onClick={() => {
                        setSelected([...selected, index]);
                        setAssemblyMessage("");
                      }}
                      lang="ja"
                    >
                      {exercise.chunks[index]}
                    </button>
                  ))}
                </div>
                <p role="status">{assemblyMessage}</p>
                <Button disabled={selected.length !== bank.length} onClick={checkAssembly} fullWidth>
                  Check order & write from memory
                </Button>
              </>
            ) : (
              <>
                <p className="gp-input-label">Write the whole sentence</p>
                {!result && !revealed && (
                  <FillInput
                    key={attempt}
                    placeholder="Type the full sentence…"
                    onSubmit={(answer) => setResult({ answer, matches: matchesModel(answer, exercise) })}
                  />
                )}
                {result && (
                  <div className="gp-feedback" role="status">
                    <strong>{result.matches ? "Correct — matches the model." : "This differs from the model."}</strong>
                    <p>
                      Your answer: <span lang="ja">{result.answer}</span>
                    </p>
                    {!result.matches && (
                      <p>
                        That does not necessarily mean your Japanese is wrong. This exercise checks the supplied
                        wording, not every possible sentence.
                      </p>
                    )}
                    <Sentence exercise={exercise} />
                    <p>{exercise.explanation}</p>
                    <Button
                      onClick={() => {
                        setResult(null);
                        setHint(0);
                        setAttempt(attempt + 1);
                      }}
                      fullWidth
                    >
                      Try again without the answer
                    </Button>
                  </div>
                )}
              </>
            )}
            {!result && (
              <div className="gp-actions">
                {hint < 2 && (
                  <Button onClick={() => setHint(hint + 1)}>{hint === 0 ? "Give me a cue" : "Show the frame"}</Button>
                )}
                <Button onClick={() => setRevealed(!revealed)}>
                  {revealed ? "Hide model & try" : "Compare with model"}
                </Button>
              </div>
            )}
            {revealed && !result && (
              <div className="gp-model">
                <Sentence exercise={exercise} />
                <p>{exercise.explanation}</p>
                <p>Take another look, then hide the model when you’re ready.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
function VisibleModelTrial({ exercise }: { exercise: Exercise }) {
  const [mode, setMode] = useState<"type" | "build">("type");
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<{ matches: boolean; answer: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  function switchMode(next: "type" | "build") {
    setMode(next);
    setResult(null);
  }
  return (
    <Card>
      <div className="gp-stack">
        <div className="gp-eyebrow">Practice with the model · Book Two</div>
        <h2>{exercise.phrase.english}</h2>
        <div className="gp-model" aria-label="Visible model sentence">
          <Sentence exercise={exercise} />
          <p>{exercise.rule}</p>
        </div>
        <p>The sentence stays here while you practice. Type it or build it—choose whichever helps.</p>
        <div className="gp-mode" role="group" aria-label="Answer method">
          <button aria-pressed={mode === "type"} onClick={() => switchMode("type")}>
            Type the answer
          </button>
          <button aria-pressed={mode === "build"} onClick={() => switchMode("build")}>
            Build the answer
          </button>
        </div>
        <div hidden={mode !== "type" || result !== null}>
          <FillInput
            key={attempt}
            placeholder="Type the sentence shown above…"
            onSubmit={(answer) => setResult({ answer, matches: matchesModel(answer, exercise) })}
          />
        </div>
        {mode === "build" && !result && (
          <>
            <p>Tap chunks in order. Tap a placed chunk to remove it.</p>
            <div className="gp-answer" aria-label="Your assembled sentence">
              {selected.length === 0 && <span>Build your sentence here</span>}
              {selected.map((index, position) => (
                <button
                  className="gp-chip"
                  key={index}
                  lang="ja"
                  aria-label={`Remove ${exercise.chunks[index]}`}
                  onClick={() => setSelected(selected.filter((_, i) => i !== position))}
                >
                  {exercise.chunks[index]}
                </button>
              ))}
            </div>
            <div className="gp-bank">
              {exercise.chunks
                .map((_, i) => i)
                .reverse()
                .map((index) => (
                  <button
                    className="gp-chip"
                    key={index}
                    lang="ja"
                    disabled={selected.includes(index)}
                    onClick={() => setSelected([...selected, index])}
                  >
                    {exercise.chunks[index]}
                  </button>
                ))}
            </div>
            <Button
              disabled={selected.length !== exercise.chunks.length}
              fullWidth
              onClick={() => {
                const answer = selected.map((index) => exercise.chunks[index]).join("");
                setResult({ answer, matches: matchesModel(answer, exercise) });
              }}
            >
              Check built answer
            </Button>
          </>
        )}
        {result && (
          <div className="gp-feedback" role="status">
            <strong>{result.matches ? "Correct — matches the model." : "This differs from the model."}</strong>
            <p>
              Your answer: <span lang="ja">{result.answer}</span>
            </p>
            <p>
              {result.matches
                ? exercise.explanation
                : "Compare your answer with the sentence above. This checks the model wording, not every possible Japanese sentence."}
            </p>
            <Button
              fullWidth
              onClick={() => {
                setResult(null);
                if (result.matches) setSelected([]);
                setAttempt(attempt + 1);
              }}
            >
              {result.matches ? "Practice again" : "Edit and try again"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export function Prototype() {
  const [variant, setVariant] = useState<Variant>("visible");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [run, setRun] = useState(0);
  const exercise = exercises[exerciseIndex];
  return (
    <main className="gp-shell">
      <header className="gp-header">
        <a href="/prototypes/guided-production.html">
          AburunGo <span>/ studio</span>
        </a>
        <span>Interaction study · 01</span>
      </header>
      <section className="gp-intro">
        <p className="gp-eyebrow">From knowing a pattern to using it</p>
        <h1>
          Build a thought.
          <br />
          Then write it.
        </h1>
        <p>Four ways to practice the same material. Try each and notice how much support feels useful.</p>
      </section>
      <nav className="gp-variants" aria-label="Prototype style">
        {variants.map((v) => (
          <button key={v.id} aria-pressed={variant === v.id} onClick={() => setVariant(v.id)}>
            <strong>{v.title}</strong>
            <span>{v.description}</span>
          </button>
        ))}
      </nav>
      <div className="gp-layout">
        <aside className="gp-sidebar">
          <p className="gp-eyebrow">Choose an example</p>
          {exercises.map((e, i) => (
            <button key={e.id} aria-pressed={i === exerciseIndex} onClick={() => setExerciseIndex(i)}>
              {e.title}
              <span>{e.rule}</span>
            </button>
          ))}
          <button className="gp-reset" onClick={() => setRun(run + 1)}>
            Restart this example
          </button>
          <p>Practice only. No progress is saved.</p>
        </aside>
        <section aria-label="Guided production exercise">
          {variant === "visible" ? (
            <VisibleModelTrial key={`${exerciseIndex}-${run}`} exercise={exercise} />
          ) : (
            <Trial key={`${variant}-${exerciseIndex}-${run}`} variant={variant} exercise={exercise} />
          )}
        </section>
      </div>
      <details className="gp-notes">
        <summary>Prototype notes & content sources</summary>
        <p>
          These are controlled-production studies, not an open-ended Japanese grader. All models are imported unchanged
          from Book Two, Chapter One. That file marks them training-canonical, pending Tatoeba verification. No new
          Japanese sentences or generated substitutions are introduced.
        </p>
        <p>
          Current item: <code>{exercise.id}</code>. Source: <code>src/content/phrases/b2-01-plain-form.yaml</code>.
        </p>
        <p>
          Reuses the app’s FillInput, romaji conversion, Furigana, answer comparison, and design-system Button/Card.
          Full kana or the exact model spelling is accepted; whitespace and common punctuation are ignored. Mixed
          spellings and other valid phrasings may not match. Assistance does not change SRS because these trials have no
          persistence.
        </p>
        <p>
          For review: does the frame help? Does arranging chunks add value before typing? Is writing the whole sentence
          too repetitive? These examples demonstrate interaction; they do not yet demonstrate generalization to unseen
          sentences.
        </p>
      </details>
    </main>
  );
}
