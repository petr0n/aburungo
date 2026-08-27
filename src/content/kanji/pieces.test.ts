import { describe, expect, it } from "vitest";
import type { KanjiComponent, Lesson } from "@/types";
import { buildPieceIndex } from "./pieces";

const lesson = (id: string, order: number, kanji: string[]): Lesson => ({
  id, order, situation: "s", title: id, canDo: "c",
  wordIds: [], phraseIds: [], kanji, grammarNote: "",
});

const components: KanjiComponent[] = [
  { glyph: "日", keyword: "sun" },
  { glyph: "月", keyword: "moon" },
  { glyph: "⺡", keyword: "water" },
];

describe("buildPieceIndex", () => {
  it("labels a piece taught when an earlier lesson taught it as a kanji", () => {
    const lessons = [lesson("l1", 1, ["日"]), lesson("l2", 2, ["明"])];
    const index = buildPieceIndex(lessons, { 明: ["日", "月"], 日: [] }, components);
    expect(index.get("明")?.find((p) => p.glyph === "日")?.state).toBe("taught");
  });

  it("labels a piece new on its first appearance anywhere", () => {
    const lessons = [lesson("l1", 1, ["海"])];
    const index = buildPieceIndex(lessons, { 海: ["⺡"] }, components);
    expect(index.get("海")?.[0]?.state).toBe("new");
  });

  it("labels a piece met once it has appeared inside an earlier kanji", () => {
    // ⺡ is never taught as a kanji. It is new in 海 and met in 池.
    const lessons = [lesson("l1", 1, ["海"]), lesson("l2", 2, ["池"])];
    const index = buildPieceIndex(lessons, { 海: ["⺡"], 池: ["⺡"] }, components);
    expect(index.get("海")?.[0]?.state).toBe("new");
    expect(index.get("池")?.[0]?.state).toBe("met");
  });

  it("is order sensitive — the same piece is new then met", () => {
    // The assertion that catches a resolver ignoring lesson order entirely.
    const forward = buildPieceIndex(
      [lesson("l1", 1, ["海"]), lesson("l2", 2, ["池"])],
      { 海: ["⺡"], 池: ["⺡"] }, components,
    );
    const reversed = buildPieceIndex(
      [lesson("l1", 1, ["池"]), lesson("l2", 2, ["海"])],
      { 海: ["⺡"], 池: ["⺡"] }, components,
    );
    expect(forward.get("海")?.[0]?.state).toBe("new");
    expect(reversed.get("海")?.[0]?.state).toBe("met");
  });

  it("counts a kanji taught earlier in the same lesson as taught", () => {
    // Intro cards render in lesson order, so by the time 明 is on screen the
    // learner has just met 日 on the card before it.
    const index = buildPieceIndex([lesson("l1", 1, ["日", "明"])], { 日: [], 明: ["日"] }, components);
    expect(index.get("明")?.[0]?.state).toBe("taught");
  });

  it("gives a kanji with no components an empty list, not undefined", () => {
    const index = buildPieceIndex([lesson("l1", 1, ["水"])], { 水: [] }, components);
    expect(index.get("水")).toEqual([]);
  });

  it("skips a component that has no keyword rather than rendering a blank", () => {
    const index = buildPieceIndex([lesson("l1", 1, ["謎"])], { 謎: ["言", "日"] }, components);
    expect(index.get("謎")?.map((p) => p.glyph)).toEqual(["日"]);
  });

  it("sorts lessons by order rather than trusting array position", () => {
    const index = buildPieceIndex(
      [lesson("l2", 2, ["明"]), lesson("l1", 1, ["日"])],
      { 日: [], 明: ["日"] }, components,
    );
    expect(index.get("明")?.[0]?.state).toBe("taught");
  });
});
