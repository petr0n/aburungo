#!/usr/bin/env node
/**
 * Aozora Bunko ingestion (docs/plans/04-path-n3.md §5 text source).
 *
 *   node scripts/aozora.mjs index        fetch + filter the catalogue -> data/aozora/manifest.json
 *   node scripts/aozora.mjs fetch [n]    download n works -> data/aozora/texts/<id>.txt
 *
 * Why a catalogue pass first. Aozora is ~19,500 works and only some are safe
 * or useful here, so the filter is the point of this script:
 *
 *   - 作品著作権フラグ = なし     public domain. 913 works are still in
 *                                copyright and are dropped outright.
 *   - 文字遣い種別 = 新字新仮名   modern orthography. The other 7,335 use
 *                                旧仮名遣い / 旧字体, which would teach a
 *                                learner kana usage that is simply wrong now.
 *
 * That leaves ~11,200 works. Everything here is public domain, so it is usable
 * whether or not this app is ever distributed -- unlike the graded-reader
 * corpora, which are CC BY-NC-ND.
 *
 * Register warning, recorded because the levelling numbers will not say it:
 * this is literature, much of it pre-war. It is Book Five material by
 * difficulty and nothing like the N3 exposition Book Three's §5 actually
 * wants. It earns its place by being free, bulk-downloadable and unambiguously
 * clear to use -- not by being level-appropriate.
 *
 * Downloads are deliberately slow and capped; this is a volunteer-run archive.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data/aozora");
const INDEX_URL = "https://www.aozora.gr.jp/index_pages/list_person_all_extended_utf8.zip";
/** Be a good citizen: one request a second, and never a bulk mirror by default. */
const DELAY_MS = 1000;
const DEFAULT_N = 25;

/** RFC4180-ish: the catalogue quotes fields containing commas. */
export function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else quoted = false;
      } else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

/**
 * Strip Aozora's markup to plain prose.
 *
 * The format is documented in every file's own header block:
 *   《...》      ruby (reading gloss)
 *   ｜          marks where a ruby span starts, when it is ambiguous
 *   ［＃...］    input-note: layout directives and glyph descriptions
 *
 * The header (title/author, then a 凡例 fenced by ---- rules) and the trailing
 * 底本 colophon are metadata, not prose, and both are cut.
 *
 * Ruby is discarded rather than kept. It is genuinely useful -- it is furigana,
 * already aligned -- but the consumer here is the levelling pipeline, which
 * reads plain text. Preserving it is a real opportunity, not a lost one.
 * ponytail: readings dropped; parse 《》 into furigana pairs if the reader UI wants them.
 */
export function cleanAozoraText(raw) {
  let t = raw.replace(/\r\n/g, "\n");

  // Header: everything up to and including the second rule line, when the
  // 凡例 block is present at all (some older files omit it).
  const rule = /^-{10,}$/m;
  if (rule.test(t)) {
    const first = t.search(rule);
    const after = t.slice(first + t.slice(first).match(/^-{10,}$/m)[0].length);
    const secondRel = after.search(rule);
    if (secondRel !== -1) {
      const secondLen = after.slice(secondRel).match(/^-{10,}$/m)[0].length;
      t = after.slice(secondRel + secondLen);
    }
  }

  // Colophon: 底本 onwards is bibliographic.
  const colophon = t.search(/^底本[：:]/m);
  if (colophon !== -1) t = t.slice(0, colophon);

  return t
    .replace(/［＃[^］]*］/g, "")   // input notes
    .replace(/《[^》]*》/g, "")     // ruby
    .replace(/[｜|]/g, "")          // ruby-span markers
    .replace(/[ \t　]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cmdIndex() {
  mkdirSync(OUT, { recursive: true });
  const zip = join(OUT, "index.zip");
  process.stdout.write("fetching catalogue... ");
  await download(INDEX_URL, zip);
  console.log("ok");

  const csv = execFileSync("unzip", ["-p", zip], { maxBuffer: 1 << 28 }).toString("utf8");
  const lines = csv.split("\n");
  const hdr = parseCsvLine(lines[0].replace(/^﻿/, ""));
  const col = (name) => hdr.indexOf(name);
  const [iId, iTitle, iOrtho, iCopy, iTxt, iFam, iGiven] = [
    "作品ID", "作品名", "文字遣い種別", "作品著作権フラグ", "テキストファイルURL", "姓", "名",
  ].map(col);

  const works = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const r = parseCsvLine(lines[i]);
    if (r[iCopy] !== "なし") continue;              // still in copyright
    if (r[iOrtho] !== "新字新仮名") continue;        // pre-reform orthography
    if (!r[iTxt]?.endsWith(".zip")) continue;
    works.push({
      id: r[iId],
      title: r[iTitle],
      author: `${r[iFam] ?? ""}${r[iGiven] ?? ""}`.trim(),
      url: r[iTxt],
    });
  }

  const manifest = {
    generated: new Date().toISOString().slice(0, 10),
    source: "Aozora Bunko (https://www.aozora.gr.jp)",
    licence: "public domain in Japan; 作品著作権フラグ = なし only",
    filters: { orthography: "新字新仮名", copyright: "なし" },
    counts: { catalogue: lines.length - 1, usable: works.length },
    works,
  };
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
  console.log(`catalogue ${manifest.counts.catalogue} -> usable ${works.length}`);
  console.log(`-> data/aozora/manifest.json`);
}

async function cmdFetch(nArg) {
  const manifestPath = join(OUT, "manifest.json");
  if (!existsSync(manifestPath)) {
    console.error("no manifest -- run `pnpm aozora index` first");
    process.exit(1);
  }
  const { works } = JSON.parse(readFileSync(manifestPath, "utf8"));
  const n = Math.min(Number(nArg) || DEFAULT_N, works.length);
  const dir = join(OUT, "texts");
  mkdirSync(dir, { recursive: true });

  let got = 0;
  let skipped = 0;
  for (const w of works.slice(0, n)) {
    const dest = join(dir, `${w.id}.txt`);
    if (existsSync(dest)) { skipped++; continue; }
    const tmp = join(OUT, "_work.zip");
    try {
      await download(w.url, tmp);
      const buf = execFileSync("unzip", ["-p", tmp, "*.txt"], { maxBuffer: 1 << 28 });
      const text = cleanAozoraText(new TextDecoder("shift_jis").decode(buf));
      // Provenance travels with the text, as it does for Tatoeba sentences.
      writeFileSync(dest, `# ${w.title} / ${w.author} / aozora:${w.id}\n# ${w.url}\n\n${text}\n`);
      got++;
    } catch (e) {
      console.error(`  skip ${w.id} (${w.title}): ${e.message}`);
    }
    await sleep(DELAY_MS);
  }
  console.log(`fetched ${got}, already had ${skipped} -> data/aozora/texts/`);
}

const invokedDirectly = process.argv[1]?.endsWith("aozora.mjs") ?? false;
const cmd = invokedDirectly ? process.argv[2] : "__imported__";
if (cmd === "index") await cmdIndex();
else if (cmd === "fetch") await cmdFetch(process.argv[3]);
else if (invokedDirectly) {
  console.log("usage: node scripts/aozora.mjs <index|fetch [n]>");
  process.exit(1);
}
