#!/usr/bin/env node
/**
 * Authoring queue: JMdict-verified words this app does not teach yet.
 *
 *   node scripts/vocab.mjs candidates <level> [--limit n] [--common] [--with-example]
 *
 * `jlpt.mjs coverage` already says *which* reference words are missing. It does
 * not say enough to author one: no part of speech, no real gloss, no example.
 * This joins that gap list to JMdict and emits paste-ready YAML.
 *
 * It proposes; a human disposes. Nothing here writes into src/content/, and
 * that is deliberate -- placing a word means choosing its lesson, situation,
 * theme and the trap worth warning about, which is the judgement that makes
 * this ladder situation-anchored rather than list-marched. A tool that wired
 * vocabulary straight into books would manufacture exactly the content the
 * plans reject.
 *
 * Two fields are left blank on purpose, because only an author can fill them:
 * `theme` (this app's own grouping, not JMdict's) and `notes` (the trap). The
 * JMdict entry id is pre-written into notes so the citation survives even if
 * nothing else is edited -- content commits require a source line.
 *
 * Ordering is by JMdict `common` then by whether a Tatoeba sentence attests the
 * word. That is not true frequency: the "for Applications" variant collapses
 * JMdict's frequency bands (nf01/news1/ichi1) into one boolean, so this is a
 * filtered queue, not a ranked one.
 */
import { readFileSync, writeFileSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normReading, writtenCompatible } from "./jlpt.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DICT = join(ROOT, "server/data/jmdict-examples-eng-3.6.2.json");
const LEVELS = ["n5", "n4", "n3", "n2", "n1"];

/** JMdict part-of-speech tags -> the app's `word_type`, best effort. */
const WORD_TYPE = [
  [/^v[15k]|^vs|^vk|^vz/, "verb"],
  [/^adj-i/, "i-adjective"],
  [/^adj-na/, "na-adjective"],
  [/^adv/, "adverb"],
  [/^n/, "noun"],
  [/^exp/, "expression"],
  [/^int/, "interjection"],
  [/^ctr/, "counter"],
  [/^pn/, "pronoun"],
];
export const wordTypeFor = (pos = []) => {
  for (const p of pos) for (const [re, t] of WORD_TYPE) if (re.test(p)) return t;
  return "noun";
};

/** Everything JMdict knows about the forms we are looking for. */
function lookupFromDict(wanted) {
  if (!existsSync(DICT)) {
    console.error(`missing ${DICT} -- the dictionary is gitignored; see data/jlpt/README.md`);
    process.exit(1);
  }
  const byKey = new Map();
  const fd = openSync(DICT, "r");
  const size = statSync(DICT).size;
  const CHUNK = 8 * 1024 * 1024;
  const buf = Buffer.alloc(CHUNK);
  let pos = 0;
  let carry = "";
  while (pos < size) {
    const read = readSync(fd, buf, 0, Math.min(CHUNK, size - pos), pos);
    const lines = (carry + buf.toString("utf8", 0, read)).split("\n");
    carry = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith('{"id":"')) continue;
      let e;
      try { e = JSON.parse(line.replace(/,$/, "")); } catch { continue; }
      const kana = (e.kana ?? []).map((k) => k.text);
      const kanji = (e.kanji ?? []).map((k) => k.text);
      // Index by reading; the caller disambiguates homophones on written form.
      for (const r of kana) {
        const key = normReading(r);
        if (!wanted.has(key)) continue;
        const sense = e.sense?.[0];
        const example = e.sense?.flatMap((s) => s.examples ?? []).find((x) => x.sentences?.length);
        const hit = {
          id: e.id,
          kanji,
          kana: r,
          pos: sense?.partOfSpeech ?? [],
          glosses: (e.sense ?? []).flatMap((s) => (s.gloss ?? []).map((g) => g.text)).slice(0, 4),
          common: [...(e.kana ?? []), ...(e.kanji ?? [])].some((f) => f.common),
          example: example
            ? {
                jpn: example.sentences.find((s) => s.lang === "jpn")?.text ?? "",
                eng: example.sentences.find((s) => s.lang === "eng")?.text ?? "",
                tatoeba: example.source?.value ?? "",
              }
            : null,
        };
        if (!byKey.has(key)) byKey.set(key, []);
        byKey.get(key).push(hit);
      }
    }
    pos += read;
  }
  closeSync(fd);
  return byKey;
}

/** kebab-ish id from a reading, matching the vocab.<romaji> convention loosely. */
const KANA_ROMAJI = {
  あ:"a",い:"i",う:"u",え:"e",お:"o",か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko",さ:"sa",し:"shi",す:"su",せ:"se",そ:"so",
  た:"ta",ち:"chi",つ:"tsu",て:"te",と:"to",な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",は:"ha",ひ:"hi",ふ:"fu",へ:"he",ほ:"ho",
  ま:"ma",み:"mi",む:"mu",め:"me",も:"mo",や:"ya",ゆ:"yu",よ:"yo",ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro",わ:"wa",を:"o",ん:"n",
  が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",だ:"da",ぢ:"ji",づ:"zu",で:"de",ど:"do",
  ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",ー:"",っ:"",
};
/**
 * Rough romaji, for the `romaji:` field and the id. Handles the yōon digraphs
 * and long vowels crudely -- an author should read it, not trust it.
 */
export function roughRomaji(kana) {
  let out = "";
  for (let i = 0; i < kana.length; i++) {
    const pair = kana.slice(i, i + 2);
    if (/^[きしちにひみりぎじびぴ][ゃゅょ]$/.test(pair)) {
      const base = KANA_ROMAJI[pair[0]] ?? "";
      const y = { ゃ: "a", ゅ: "u", ょ: "o" }[pair[1]];
      out += base.replace(/i$/, base.endsWith("shi") || base.endsWith("chi") || base.endsWith("ji") ? "" : "y") + y;
      i++;
      continue;
    }
    if (kana[i] === "っ") { out += (KANA_ROMAJI[kana[i + 1]] ?? "x")[0]; continue; }
    out += KANA_ROMAJI[kana[i]] ?? "";
  }
  return out;
}

const yamlStr = (s) => (/[:#'"\n]/.test(s) ? JSON.stringify(s) : s);

function candidates(level, opts) {
  const covPath = join(ROOT, `data/jlpt/coverage-${level}.json`);
  if (!existsSync(covPath)) {
    console.error(`no coverage report -- run \`node scripts/jlpt.mjs coverage ${level}\` first`);
    process.exit(1);
  }
  const { missing } = JSON.parse(readFileSync(covPath, "utf8"));
  const wanted = new Set(missing.map((m) => normReading(m.reading)));
  process.stderr.write(`scanning JMdict for ${wanted.size} readings... `);
  const dict = lookupFromDict(wanted);
  process.stderr.write("done\n");

  const out = [];
  for (const m of missing) {
    const hits = dict.get(normReading(m.reading)) ?? [];
    // Homophones, and why the order matters. writtenCompatible is deliberately
    // loose -- it exists so 昼御飯 matches 昼ご飯 -- and loose is wrong here.
    // Asking it for あか/赤 returns 銅 first, because 銅's alternate form 赤金
    // shares the kanji 赤 and sorts earlier in the dictionary. Copper, not red.
    // So: exact written form wins, loose compatibility is only the fallback.
    // Same family of bug as 晩 masking ～番 in the coverage report.
    const hit =
      hits.find((h) => h.kanji.includes(m.written)) ??
      (m.written === m.reading ? hits.find((h) => h.kanji.length === 0) : undefined) ??
      hits.find((h) => h.kanji.some((k) => writtenCompatible(m.written, k))) ??
      hits[0];
    if (!hit) continue;
    if (opts.common && !hit.common) continue;
    if (opts.withExample && !hit.example) continue;
    out.push({
      written: hit.kanji[0] ?? hit.kana,
      reading: hit.kana,
      romaji: roughRomaji(hit.kana),
      wordType: wordTypeFor(hit.pos),
      english: hit.glosses.join(", "),
      common: hit.common,
      jmdictId: hit.id,
      example: hit.example,
      sources: m.sources,
    });
  }

  out.sort((a, b) => Number(b.common) - Number(a.common) || Number(!!b.example) - Number(!!a.example));
  const picked = out.slice(0, opts.limit);

  const yaml = picked
    .map((c) => {
      const ex = c.example ? `\n  # example: ${c.example.jpn} — ${c.example.eng} (Tatoeba ${c.example.tatoeba})` : "";
      return [
        `- id: vocab.${roughRomaji(c.reading) || c.reading}`,
        `  jlpt: ${level.toUpperCase()}`,
        `  word_type: ${c.wordType}`,
        `  theme: TODO`,
        `  japanese: ${yamlStr(c.written)}`,
        `  reading: ${yamlStr(c.reading)}`,
        `  romaji: ${yamlStr(c.romaji)}`,
        `  english: ${yamlStr(c.english)}`,
        `  notes: "TODO. JMdict seq ${c.jmdictId}."${ex}`,
      ].join("\n");
    })
    .join("\n\n");

  const jsonPath = join(ROOT, `data/jlpt/candidates-${level}.json`);
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        level: level.toUpperCase(),
        generated: new Date().toISOString().slice(0, 10),
        source: "JMdict for Applications 3.6.2 (CC BY 4.0); examples via Tatoeba (CC BY 2.0 FR)",
        note: "Authoring queue. Not content: theme and notes are TODO, and placement is an authoring decision.",
        counts: { missingInReference: missing.length, matchedInJmdict: out.length, emitted: picked.length },
        candidates: picked,
      },
      null,
      1,
    ),
  );

  const yamlPath = join(ROOT, `data/jlpt/candidates-${level}.yaml`);
  writeFileSync(yamlPath, `# Authoring queue for ${level.toUpperCase()} -- paste into a lesson's vocabulary file and edit.\n# theme and notes are TODO by design. Source: JMdict for Applications 3.6.2.\n\n${yaml}\n`);

  console.log(`${missing.length} missing -> ${out.length} found in JMdict -> ${picked.length} emitted`);
  console.log(`-> data/jlpt/candidates-${level}.json`);
  console.log(`-> data/jlpt/candidates-${level}.yaml`);
}

const invokedDirectly = process.argv[1]?.endsWith("vocab.mjs") ?? false;
if (invokedDirectly) {
  const [cmd, lvl, ...rest] = process.argv.slice(2);
  const level = (lvl ?? "").toLowerCase();
  if (cmd !== "candidates" || !LEVELS.includes(level)) {
    console.log("usage: node scripts/vocab.mjs candidates <n5|n4|n3|n2|n1> [--limit n] [--common] [--with-example]");
    process.exit(1);
  }
  const li = rest.indexOf("--limit");
  candidates(level, {
    limit: li === -1 ? 50 : Number(rest[li + 1]) || 50,
    common: rest.includes("--common"),
    withExample: rest.includes("--with-example"),
  });
}
