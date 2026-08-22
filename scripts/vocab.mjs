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
import { readFileSync, readdirSync, writeFileSync, existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normReading, writtenCompatible } from "./jlpt.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DICT = join(ROOT, "server/data/jmdict-examples-eng-3.6.2.json");
const LEVELS = ["n5", "n4", "n3", "n2", "n1"];

/**
 * JMdict parts of speech -> the app's `word_type`. The right-hand side is the
 * WordType union in src/types.ts, not JMdict's own vocabulary: a queue that
 * emits "i-adjective" is not paste-ready, it is a schema error waiting to
 * happen. The union has no home for pronouns or expressions, so those land on
 * noun and the raw JMdict tags are written into notes for the author to see.
 */
const WORD_TYPE = [
  [/^v[15k]|^vs|^vk|^vz/, "verb"],
  [/^adj-i/, "i-adj"],
  [/^adj-na/, "na-adj"],
  [/^adv/, "adverb"],
  [/^ctr/, "counter"],
  [/^int/, "interjection"],
  [/^n|^pn|^exp/, "noun"],
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
  ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",ゔ:"vu",ー:"",っ:"",
};
/** Katakana borrow the same table; a third of the queue is loanwords. */
const toHiragana = (s) => s.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const SMALL_VOWEL = { ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o" };
/**
 * Rough romaji, for the `romaji:` field and the id. Handles the yōon digraphs
 * and long vowels crudely -- an author should read it, not trust it.
 */
export function roughRomaji(rawKana) {
  const kana = toHiragana(rawKana);
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
    if (SMALL_VOWEL[pair[1]] && KANA_ROMAJI[pair[0]]) {
      const base = KANA_ROMAJI[pair[0]];
      // ウィスキー: a bare vowel takes the glide, everything else drops its own.
      out += (base === "u" ? "w" : base.replace(/[aeiou]$/, "")) + SMALL_VOWEL[pair[1]];
      i++;
      continue;
    }
    // コーヒー -> koohii, not koohi: the shipped content spells the long vowel out.
    if (kana[i] === "ー") { out += /[aeiou]$/.test(out) ? out.slice(-1) : ""; continue; }
    if (kana[i] === "っ") { out += (KANA_ROMAJI[kana[i + 1]] ?? "x")[0]; continue; }
    out += KANA_ROMAJI[kana[i]] ?? "";
  }
  return out;
}

/**
 * Homophones are real, distinct words -- 着る and 切る both belong in the queue --
 * but they cannot share an id. Disambiguate the way the shipped content already
 * does (vocab.atsui-hot, vocab.hashi-chopsticks): romaji plus the lead gloss.
 */
const glossSlug = (english) =>
  english
    .split(/[,;(]/)[0]
    .replace(/^to /, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .filter(Boolean)
    .slice(0, 2)
    .join("-");

/** Ids the ladder already spends. Proposing one is not paste-ready either. */
function shippedWordIds() {
  const dir = join(ROOT, "src/content/vocabulary");
  if (!existsSync(dir)) return new Set();
  const ids = new Set();
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".yaml")) continue;
    for (const m of readFileSync(join(dir, f), "utf8").matchAll(/^- id: (\S+)/gm)) ids.add(m[1]);
  }
  return ids;
}

export function assignIds(cards, taken = new Set()) {
  const byBase = new Map();
  for (const c of cards) {
    const base = `vocab.${roughRomaji(c.reading) || c.reading}`;
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(c);
  }
  const used = new Set(taken);
  for (const [base, group] of byBase) {
    // 熱い is missing, but 暑い already holds vocab.atsui-hot -- the queue has to
    // dodge the shipped id as well as its own siblings.
    const needsSuffix = group.length > 1 || used.has(base);
    for (const c of group) {
      const slug = glossSlug(c.english ?? "");
      let id = needsSuffix ? `${base}-${slug || "x"}` : base;
      for (let n = 2; used.has(id); n++) id = `${base}-${slug || "x"}-${n}`;
      used.add(id);
      c.id = id;
    }
  }
  return cards;
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
      pos: hit.pos,
      english: hit.glosses.join(", "),
      common: hit.common,
      jmdictId: hit.id,
      example: hit.example,
      sources: m.sources,
    });
  }

  // Two reference rows reaching one JMdict entry are not two words: Tanos lists
  // 集る where open-anki lists 集まる, same reading, same seq. Emitting both ships
  // a byte-identical phantom row into a queue that is supposed to shrink.
  const byEntry = new Map();
  for (const c of out) {
    const prev = byEntry.get(c.jmdictId);
    if (prev) prev.sources = [...new Set([...prev.sources, ...c.sources])];
    else byEntry.set(c.jmdictId, c);
  }
  const unique = [...byEntry.values()];

  unique.sort((a, b) => Number(b.common) - Number(a.common) || Number(!!b.example) - Number(!!a.example));
  const picked = unique.slice(0, opts.limit);
  assignIds(picked, shippedWordIds());

  const yaml = picked
    .map((c) => {
      const ex = c.example ? `\n  # example: ${c.example.jpn} — ${c.example.eng} (Tatoeba ${c.example.tatoeba})` : "";
      const pos = c.pos.length ? ` JMdict pos: ${c.pos.join("/")}.` : "";
      return [
        `- id: ${c.id}`,
        `  jlpt: ${level.toUpperCase()}`,
        `  word_type: ${c.wordType}`,
        `  theme: TODO`,
        `  japanese: ${yamlStr(c.written)}`,
        `  reading: ${yamlStr(c.reading)}`,
        `  romaji: ${yamlStr(c.romaji)}`,
        `  english: ${yamlStr(c.english)}`,
        `  notes: "TODO. JMdict seq ${c.jmdictId}.${pos}"${ex}`,
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
        source:
          "JMdict for Applications 3.6.2 (CC BY 4.0); examples via Tatoeba (CC BY 2.0 FR); " +
          "level membership via Tanos JLPT lists (CC BY) and open-anki-jlpt-decks (MIT)",
        note: "Authoring queue. Not content: theme and notes are TODO, and placement is an authoring decision.",
        counts: {
          missingInReference: missing.length,
          matchedInJmdict: out.length,
          uniqueEntries: unique.length,
          emitted: picked.length,
        },
        candidates: picked,
      },
      null,
      1,
    ) + "\n",
  );

  const yamlPath = join(ROOT, `data/jlpt/candidates-${level}.yaml`);
  writeFileSync(yamlPath, `# Authoring queue for ${level.toUpperCase()} -- paste into a lesson's vocabulary file and edit.\n# theme and notes are TODO by design. Source: JMdict for Applications 3.6.2.\n\n${yaml}\n`);

  console.log(`${missing.length} missing -> ${out.length} found in JMdict -> ${unique.length} unique -> ${picked.length} emitted`);
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
