import type { VerbClass } from "@/types";

const U_VERB_ENDINGS: Record<string, string> = {
  く: "きます",
  ぐ: "ぎます",
  す: "します",
  つ: "ちます",
  ぬ: "にます",
  ぶ: "びます",
  む: "みます",
  る: "ります",
  う: "います",
};

/** Produce the polite (masu) reading from a verb's plain reading + class. */
export function toPoliteReading(reading: string, verbClass: VerbClass): string {
  if (verbClass === "irregular") {
    if (reading === "する") return "します";
    if (reading === "くる") return "きます";
    return reading;
  }
  if (verbClass === "ru") {
    return reading.slice(0, -1) + "ます";
  }
  const final = reading.slice(-1);
  const ending = U_VERB_ENDINGS[final];
  return ending !== undefined ? reading.slice(0, -1) + ending : reading;
}

/**
 * Produce the polite (masu) Japanese form from the plain Japanese + reading + class.
 * Works by replacing the final okurigana on the Japanese string using the same
 * mapping as the reading transformation.
 */
export function toPoliteJapanese(japanese: string, reading: string, verbClass: VerbClass): string {
  if (verbClass === "irregular") {
    if (reading === "する") return "します";
    if (reading === "くる") return "来ます";
    return japanese;
  }
  if (verbClass === "ru") {
    return japanese.slice(0, -1) + "ます";
  }
  const final = reading.slice(-1);
  const ending = U_VERB_ENDINGS[final];
  return ending !== undefined ? japanese.slice(0, -1) + ending : japanese;
}
