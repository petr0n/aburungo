import type { GlossaryEntry, GlossaryKind } from "@/types";
import { allGlossaryEntries, bookThreeGates } from "@/content/reading";
import library from "../../data/reading/kc-yomyom.json";
import gvLibrary from "../../data/reading/gv-passages.json";

type Story = (typeof library.stories)[number];
type Passage = (typeof gvLibrary.stories)[number];

const KIND_LABEL: Record<GlossaryKind, string> = {
  new: "new",
  spelling: "taught, other spelling",
  "book-four": "Book Four word",
  name: "name",
};

const byStory = new Map<string, GlossaryEntry[]>();
for (const e of allGlossaryEntries) byStory.set(e.story, [...(byStory.get(e.story) ?? []), e]);
const titles = new Map<string, string>([...library.stories, ...gvLibrary.stories].map((s) => [s.id, s.title]));

function StoryRow({ story }: { story: Story }) {
  const entries = byStory.get(story.id) ?? [];
  return (
    <li className="row">
      <span className="ord">{story.level}</span>
      <div className="body">
        <span className="title" lang="ja">{story.title}</span>
        <span className="cando">
          {story.sentences.length} sentences · {entries.length} glossary entries
        </span>
        <details>
          <summary>Glossary</summary>
          <div className="detail">
            <table>
              <thead>
                <tr><th>Word</th><th>Reading</th><th>Meaning</th><th></th></tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td lang="ja">{e.japanese}</td>
                    <td lang="ja">{e.reading}</td>
                    <td>{e.english}</td>
                    <td>{KIND_LABEL[e.kind]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <details>
          <summary>Story text</summary>
          <div className="detail">
            <ul className="phrases">
              {story.sentences.map((s, i) => (
                <li key={i} lang="ja">{s.jpn}</li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </li>
  );
}

/** A Global Voices gate passage: credit first, as CC BY 3.0 requires. */
function PassageRow({ passage }: { passage: Passage }) {
  const entries = byStory.get(passage.id) ?? [];
  return (
    <li className="row">
      <span className="ord">{passage.gateFor.replace(/^b3\.band-/, "")}</span>
      <div className="body">
        <span className="head">
          <span className="sit">
            By {passage.author}, translated by {passage.translator} ·{" "}
            <a href={passage.link}>Global Voices 日本語</a> · CC BY 3.0
          </span>
        </span>
        <span className="title" lang="ja">{passage.title}</span>
        <details>
          <summary>Passage · {entries.length} glossary entries</summary>
          <div className="detail">
            <p lang="ja">{passage.sentences.map((s) => s.jpn).join("")}</p>
            <table>
              <thead>
                <tr><th>Word</th><th>Reading</th><th>Meaning</th><th></th></tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td lang="ja">{e.japanese}</td>
                    <td lang="ja">{e.reading}</td>
                    <td>{e.english}</td>
                    <td>{KIND_LABEL[e.kind]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </li>
  );
}

/**
 * Book Three's reading library: which story closes each chapter, then every
 * story with its glossary and text. The glossary is what the mining feature
 * will read -- these words never come from lessons -- so the library sits
 * after the ladder rather than inside it.
 */
export function ReadingLibrary() {
  return (
    <section className="chapter" aria-labelledby="reading-h">
      <header className="ch-head">
        <span className="ch-num">読</span>
        <span className="ch-meta">
          <h2 id="reading-h">Reading library</h2>
          <p className="sits">KC よむよむ (CC BY-NC 2.1 JP) and Global Voices 日本語 (CC BY 3.0)</p>
        </span>
        <span className="ch-stats">
          <span><b>{library.stories.length}</b> stories</span>
          <span><b>{gvLibrary.stories.length}</b> gate passages</span>
          <span><b>{allGlossaryEntries.length}</b> glossary entries</span>
        </span>
      </header>
      <ol className="rows">
        {bookThreeGates.map((g) => (
          <li key={g.band} className="row row--cp">
            <span className="ord">{g.band.replace(/^b3\.band-/, "")}</span>
            <span className="cp-body">
              <span className="cp-title">
                {g.story === null ? "No gate text" : <span lang="ja">{titles.get(g.story) ?? g.story}</span>}
              </span>
              <span className="cp-note" lang={g.story === null ? undefined : "ja"}>
                {g.story === null ? g.reason : g.evidence.join(" ")}
              </span>
            </span>
            <span className="cp-tag">{g.story === null ? "no licensed text yet" : "closes the chapter"}</span>
          </li>
        ))}
      </ol>
      <ol className="rows">
        {gvLibrary.stories.map((p) => (
          <PassageRow key={p.id} passage={p} />
        ))}
      </ol>
      <ol className="rows">
        {library.stories.map((s) => (
          <StoryRow key={s.id} story={s} />
        ))}
      </ol>
    </section>
  );
}
