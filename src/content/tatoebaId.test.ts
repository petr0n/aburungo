import { describe, expect, it } from "vitest";
import { parsePhrase } from "./schema";

/**
 * Book Three cites its sentences. `04-stage-reading.md` §8: at the reading
 * stage and above every sentence comes from Tatoeba with its id, or it does
 * not ship. `WordExample` has required a `tatoebaId` all along; `Phrase` had
 * no equivalent, so a band author had nowhere to put the citation the book's
 * whole sourcing model depends on.
 */
const base = {
  id: "band1.because-it-rained",
  japanese: "雨が降ったせいで試合は中止になった。",
  reading: "あめがふったせいでしあいはちゅうしになった。",
  romaji: "ame ga futta sei de shiai wa chuushi ni natta.",
  english: "The game was cancelled because it rained.",
  scenario: "cause",
};

describe("Phrase.tatoebaId", () => {
  it("carries the citation through the parser", () => {
    expect(parsePhrase({ ...base, tatoebaId: "229619" }, "test").tatoebaId).toBe("229619");
  });

  it("stays optional, because Books One and Two predate the rule", () => {
    expect(parsePhrase(base, "test").tatoebaId).toBeUndefined();
  });

  it("rejects a bare number, which is what YAML turns an unquoted id into", () => {
    // 229619 unquoted parses as a number, and every other id in the codebase
    // is a string — so this would compare unequal everywhere without failing.
    expect(() => parsePhrase({ ...base, tatoebaId: 229619 }, "test")).toThrow(/non-string tatoebaId/);
  });
});
