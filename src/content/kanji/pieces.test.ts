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
  { glyph: "⺡", keyword: "water", note: "the flowing form of 水" },
  { glyph: "水", keyword: "water" },
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

  it("does not count a kanji from the same lesson as taught", () => {
    // LearnPage renders every intro card for a lesson into one column, so 日
    // is on screen beside 明 rather than behind it. The spec's taught state
    // is an earlier *lesson*, and n5-01 teaching 一 二 三 五 together is the
    // real case: 三 must not claim the learner knows 一 and 二 already.
    const index = buildPieceIndex([lesson("l1", 1, ["日", "明"])], { 日: [], 明: ["日"] }, components);
    expect(index.get("明")?.[0]?.state).toBe("new");
  });

  it("does not count a shape met earlier in the same lesson as met", () => {
    // Same reasoning one state down: 雪's 雨 was met inside 電, and only
    // counts if 電 came in an earlier lesson.
    const same = buildPieceIndex([lesson("l1", 1, ["池", "海"])], { 池: ["⺡"], 海: ["⺡"] }, components);
    expect(same.get("海")?.[0]?.state).toBe("new");
  });

  it("counts the whole of an earlier lesson, not just its first kanji", () => {
    // The snapshot is taken per lesson, so everything lesson 1 introduced --
    // including its last card -- is known by lesson 2.
    const index = buildPieceIndex(
      [lesson("l1", 1, ["月", "日"]), lesson("l2", 2, ["明"])],
      { 月: [], 日: [], 明: ["日", "月"] }, components,
    );
    expect(index.get("明")?.map((p) => p.state)).toEqual(["taught", "taught"]);
  });

  it("shows one row per keyword, since two glyphs can share one", () => {
    // 泳 is ⺡ 水 丶 in KRADFILE and both water shapes carry the keyword
    // "water" -- adjacent identical rows read as a rendering fault. The
    // first listed wins, note and all.
    const index = buildPieceIndex([lesson("l1", 1, ["泳"])], { 泳: ["⺡", "水"] }, components);
    expect(index.get("泳")?.map((p) => p.glyph)).toEqual(["⺡"]);
    expect(index.get("泳")?.[0]?.note).toBe("the flowing form of 水");
  });

  it("keeps first-introduction states when a lesson re-lists a character", () => {
    // Fifteen ladder characters appear in more than one lesson. The index has
    // one entry per character and LearnPage renders it at every introduction,
    // so a later lesson must not overwrite what the first card said.
    const lessons = [
      lesson("l1", 1, ["明"]),
      lesson("l2", 2, ["日"]),
      lesson("l3", 3, ["明"]),
    ];
    const index = buildPieceIndex(lessons, { 明: ["日", "月"], 日: [] }, components);
    expect(index.get("明")?.find((p) => p.glyph === "日")?.state).toBe("new");
  });

  it("still counts a re-listed character as taught for later kanji", () => {
    // Only the index write is guarded -- taught/met accumulation stays
    // unconditional, so a repeat listing cannot un-teach a shape.
    const lessons = [lesson("l1", 1, ["日"]), lesson("l2", 2, ["日"]), lesson("l3", 3, ["明"])];
    const index = buildPieceIndex(lessons, { 日: [], 明: ["日", "月"] }, components);
    expect(index.get("明")?.find((p) => p.glyph === "日")?.state).toBe("taught");
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
