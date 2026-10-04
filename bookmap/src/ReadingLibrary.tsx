import type { GlossaryEntry, GlossaryKind } from "@/types";
import { allGlossaryEntries, bookThreeGates } from "@/content/reading";
import library from "../../data/reading/kc-yomyom.json";

type Story = (typeof library.stories)[number];

const KIND_LABEL: Record<GlossaryKind, string> = {
  new: "new",
  spelling: "taught, other spelling",
  "book-four": "Book Four word",
  name: "name",
};

const byStory = new Map<string, GlossaryEntry[]>();
for (const e of allGlossaryEntries) byStory.set(e.story, [...(byStory.get(e.story) ?? []), e]);
const stories = new Map<string, Story>(library.stories.map((s) => [s.id, s]));

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
          <p className="sits">KC よむよむ, Japan Foundation Kansai Center · CC BY-NC 2.1 JP</p>
        </span>
        <span className="ch-stats">
          <span><b>{library.stories.length}</b> stories</span>
          <span><b>{allGlossaryEntries.length}</b> glossary entries</span>
        </span>
      </header>
      <ol className="rows">
        {bookThreeGates.map((g) => (
          <li key={g.band} className="row row--cp">
            <span className="ord">{g.band.replace(/^b3\.band-/, "")}</span>
            <span className="cp-body">
              <span className="cp-title">
                {g.story === null ? "No gate text" : <span lang="ja">{stories.get(g.story)?.title ?? g.story}</span>}
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
        {library.stories.map((s) => (
          <StoryRow key={s.id} story={s} />
        ))}
      </ol>
    </section>
  );
}
