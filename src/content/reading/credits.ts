/**
 * The licence credit for each reading text, kept apart from the texts so the
 * daily review can credit a sentence without loading every story: a JSON file
 * is one module, so importing kc-yomyom.json here would put all of it in the
 * main bundle. The KC credit is copied from its `attribution`, and a test
 * holds the two equal. The GV file is small enough to import.
 */
import { attribution as gvLicence, stories as gv } from "../../../data/reading/gv-passages.json";

export type Credit = { text: string; link: string; licence: string; licenceUrl: string };

export const KC_CREDIT: Credit = {
  text: "KC よむよむ, The Japan Foundation Japanese-Language Institute, Kansai",
  link: "https://www.jpf.go.jp/j/kansai/clip/yomyom/",
  licence: "CC BY-NC 2.1 JP",
  licenceUrl: "https://creativecommons.org/licenses/by-nc/2.1/jp/",
};

const GV = new Map<string, Credit>(
  gv.map((p) => [
    p.id,
    {
      text: `By ${p.author}, translated by ${p.translator}, Global Voices 日本語`,
      link: p.link,
      licence: gvLicence.licence,
      licenceUrl: gvLicence.licenceUrl,
    },
  ]),
);

/** GV requires its author, translator and article link wherever a passage is shown. */
export function creditFor(textId: string): Credit | undefined {
  return GV.get(textId) ?? (textId.startsWith("kc.") ? KC_CREDIT : undefined);
}
