#!/usr/bin/env node
/**
 * Aozora Bunko ingestion (docs/plans/04-stage-reading.md §5 text source).
 *
 *   node scripts/aozora.mjs index        fetch + filter the catalogue -> data/aozora/manifest.json
 *   node scripts/aozora.mjs fetch [n]    download n works -> data/aozora/texts/<id>.txt
 *   node scripts/aozora.mjs fetch [n] --juvenile   ...from the 童話 subset only
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

/**
 * Is this work classified as children's/juvenile literature?
 *
 * NDC prefixes the class with K for 児童書 -- "NDC K913" against "NDC 913".
 * Checked against the whole catalogue: all 35 K-bearing values are K<digits>,
 * so there is no adult class with a stray K to false-positive on.
 *
 * Measured, not assumed, and the assumption lost: against the 451 words taught
 * today, juvenile works run a median 71.0% coverage against 69.6% for the rest
 * -- 12 works versus 190, so the gap is inside the noise either way. 童話 is
 * the traditional way into Japanese extensive reading, but Aozora's is pre-war
 * children's literature, which is still literary. This flag narrows the
 * catalogue; it does not lower the level. Aozora stays Book Four/Five
 * material.
 *
 * The NDC field is kept regardless: slicing the catalogue by class (fiction,
 * essays, poetry, juvenile) costs one field and saves re-downloading it.
 */
export const isJuvenile = (ndc) => /(^|\s)K\d/.test(ndc ?? "");

/** Requested work count, floored at 1 -- see the call site for why. */
export function clampCount(arg) {
  const n = Math.floor(Number(arg));
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_N;
}

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

/**
 * Both commands shell out to unzip: the catalogue arrives as a zip and so does
 * every work. Fail here with something actionable rather than letting execFile
 * throw a bare ENOENT from three frames down.
 */
function requireUnzip() {
  try {
    execFileSync("unzip", ["-v"], { stdio: "ignore" });
  } catch {
    console.error("`unzip` not found on PATH -- required to read Aozora's zip files.");
    console.error("  macOS: preinstalled   Debian/Ubuntu: apt install unzip   Alpine: apk add unzip");
    process.exit(1);
  }
}

async function cmdIndex() {
  requireUnzip();
  mkdirSync(OUT, { recursive: true });
  const zip = join(OUT, "index.zip");
  process.stdout.write("fetching catalogue... ");
  await download(INDEX_URL, zip);
  console.log("ok");

  const csv = execFileSync("unzip", ["-p", zip], { maxBuffer: 1 << 28 }).toString("utf8");
  const lines = csv.split("\n");
  const hdr = parseCsvLine(lines[0].replace(/^﻿/, ""));
  const col = (name) => hdr.indexOf(name);
  // Validate before filtering. Unchecked, a renamed column makes indexOf return
  // -1, every row reads undefined, every row fails the filter, and the run ends
  // with a cheerful "usable 0" that looks like Aozora removed its whole
  // catalogue rather than like this script broke.
  const NEEDED = ["作品ID", "作品名", "文字遣い種別", "作品著作権フラグ", "テキストファイルURL", "姓", "名", "分類番号"];
  const missingCols = NEEDED.filter((name) => col(name) === -1);
  if (missingCols.length) {
    console.error(`catalogue is missing expected column(s): ${missingCols.join(", ")}`);
    console.error("Aozora changed its CSV shape -- update NEEDED in scripts/aozora.mjs to match.");
    process.exit(1);
  }
  const [iId, iTitle, iOrtho, iCopy, iTxt, iFam, iGiven, iNdc] = NEEDED.map(col);

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
      // NDC class, kept so the catalogue can be sliced without re-downloading
      // it -- juvenile vs fiction vs essays vs poetry.
      ndc: (r[iNdc] ?? "").trim(),
      url: r[iTxt],
    });
  }

  const manifest = {
    generated: new Date().toISOString().slice(0, 10),
    source: "Aozora Bunko (https://www.aozora.gr.jp)",
    licence: "public domain in Japan; 作品著作権フラグ = なし only",
    filters: { orthography: "新字新仮名", copyright: "なし" },
    counts: {
      catalogue: lines.length - 1,
      usable: works.length,
      juvenile: works.filter((w) => isJuvenile(w.ndc)).length,
    },
    works,
  };
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
  console.log(
    `catalogue ${manifest.counts.catalogue} -> usable ${works.length} (${manifest.counts.juvenile} juvenile)`,
  );
  console.log(`-> data/aozora/manifest.json`);
}

async function cmdFetch(nArg, juvenileOnly) {
  requireUnzip();
  const manifestPath = join(OUT, "manifest.json");
  if (!existsSync(manifestPath)) {
    console.error("no manifest -- run `pnpm aozora index` first");
    process.exit(1);
  }
  const all = JSON.parse(readFileSync(manifestPath, "utf8")).works;
  if (juvenileOnly && !all.some((w) => "ndc" in w)) {
    console.error("manifest predates --juvenile -- re-run `pnpm aozora index`");
    process.exit(1);
  }
  const works = juvenileOnly ? all.filter((w) => isJuvenile(w.ndc)) : all;
  // Clamp before slicing. `fetch -1` would otherwise slice(0, -1) -- every work
  // but the last, ~11,000 downloads at a second apiece against an archive run
  // by volunteers. A typo should not do that.
  const n = Math.min(clampCount(nArg), works.length);
  if (juvenileOnly) console.log(`juvenile subset: ${works.length} works`);
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
else if (cmd === "fetch") {
  const args = process.argv.slice(3);
  await cmdFetch(
    args.find((a) => !a.startsWith("--")),
    args.includes("--juvenile"),
  );
}
else if (invokedDirectly) {
  console.log("usage: node scripts/aozora.mjs <index | fetch [n] [--juvenile]>");
  process.exit(1);
}
