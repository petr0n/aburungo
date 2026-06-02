import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { Link } from "react-router";
import { PageShell, SectionNav } from "@/components/PageShell";
import { ProgressWidget } from "@/components/ProgressWidget";

// ── Types ─────────────────────────────────────────────────────────────────────

type CellData = { h: string; k: string; r: string };
type KanaSectionRow = { cells: readonly (CellData | null)[] };
type KanaSectionData = { cols: readonly string[]; rows: readonly KanaSectionRow[] };
type ScriptKey = "h" | "k";

// ── Data (source: kana-data.js — same character set as KANJIDIC2 / kanaData.ts) ──

const KANA_GOJUON: KanaSectionData = {
  cols: ["a", "i", "u", "e", "o"],
  rows: [
    { cells: [{h:"あ",k:"ア",r:"a"}, {h:"い",k:"イ",r:"i"}, {h:"う",k:"ウ",r:"u"}, {h:"え",k:"エ",r:"e"}, {h:"お",k:"オ",r:"o"}] },
    { cells: [{h:"か",k:"カ",r:"ka"}, {h:"き",k:"キ",r:"ki"}, {h:"く",k:"ク",r:"ku"}, {h:"け",k:"ケ",r:"ke"}, {h:"こ",k:"コ",r:"ko"}] },
    { cells: [{h:"さ",k:"サ",r:"sa"}, {h:"し",k:"シ",r:"shi"}, {h:"す",k:"ス",r:"su"}, {h:"せ",k:"セ",r:"se"}, {h:"そ",k:"ソ",r:"so"}] },
    { cells: [{h:"た",k:"タ",r:"ta"}, {h:"ち",k:"チ",r:"chi"}, {h:"つ",k:"ツ",r:"tsu"}, {h:"て",k:"テ",r:"te"}, {h:"と",k:"ト",r:"to"}] },
    { cells: [{h:"な",k:"ナ",r:"na"}, {h:"に",k:"ニ",r:"ni"}, {h:"ぬ",k:"ヌ",r:"nu"}, {h:"ね",k:"ネ",r:"ne"}, {h:"の",k:"ノ",r:"no"}] },
    { cells: [{h:"は",k:"ハ",r:"ha"}, {h:"ひ",k:"ヒ",r:"hi"}, {h:"ふ",k:"フ",r:"fu"}, {h:"へ",k:"ヘ",r:"he"}, {h:"ほ",k:"ホ",r:"ho"}] },
    { cells: [{h:"ま",k:"マ",r:"ma"}, {h:"み",k:"ミ",r:"mi"}, {h:"む",k:"ム",r:"mu"}, {h:"め",k:"メ",r:"me"}, {h:"も",k:"モ",r:"mo"}] },
    { cells: [{h:"や",k:"ヤ",r:"ya"}, null, {h:"ゆ",k:"ユ",r:"yu"}, null, {h:"よ",k:"ヨ",r:"yo"}] },
    { cells: [{h:"ら",k:"ラ",r:"ra"}, {h:"り",k:"リ",r:"ri"}, {h:"る",k:"ル",r:"ru"}, {h:"れ",k:"レ",r:"re"}, {h:"ろ",k:"ロ",r:"ro"}] },
    { cells: [{h:"わ",k:"ワ",r:"wa"}, null, null, null, {h:"を",k:"ヲ",r:"wo"}] },
    { cells: [{h:"ん",k:"ン",r:"n"}, null, null, null, null] },
  ],
};

const KANA_DAKUTEN: KanaSectionData = {
  cols: ["a", "i", "u", "e", "o"],
  rows: [
    { cells: [{h:"が",k:"ガ",r:"ga"}, {h:"ぎ",k:"ギ",r:"gi"}, {h:"ぐ",k:"グ",r:"gu"}, {h:"げ",k:"ゲ",r:"ge"}, {h:"ご",k:"ゴ",r:"go"}] },
    { cells: [{h:"ざ",k:"ザ",r:"za"}, {h:"じ",k:"ジ",r:"ji"}, {h:"ず",k:"ズ",r:"zu"}, {h:"ぜ",k:"ゼ",r:"ze"}, {h:"ぞ",k:"ゾ",r:"zo"}] },
    { cells: [{h:"だ",k:"ダ",r:"da"}, {h:"ぢ",k:"ヂ",r:"ji"}, {h:"づ",k:"ヅ",r:"zu"}, {h:"で",k:"デ",r:"de"}, {h:"ど",k:"ド",r:"do"}] },
    { cells: [{h:"ば",k:"バ",r:"ba"}, {h:"び",k:"ビ",r:"bi"}, {h:"ぶ",k:"ブ",r:"bu"}, {h:"べ",k:"ベ",r:"be"}, {h:"ぼ",k:"ボ",r:"bo"}] },
    { cells: [{h:"ぱ",k:"パ",r:"pa"}, {h:"ぴ",k:"ピ",r:"pi"}, {h:"ぷ",k:"プ",r:"pu"}, {h:"ぺ",k:"ペ",r:"pe"}, {h:"ぽ",k:"ポ",r:"po"}] },
  ],
};

const KANA_YOON: KanaSectionData = {
  cols: ["ya", "yu", "yo"],
  rows: [
    { cells: [{h:"きゃ",k:"キャ",r:"kya"}, {h:"きゅ",k:"キュ",r:"kyu"}, {h:"きょ",k:"キョ",r:"kyo"}] },
    { cells: [{h:"しゃ",k:"シャ",r:"sha"}, {h:"しゅ",k:"シュ",r:"shu"}, {h:"しょ",k:"ショ",r:"sho"}] },
    { cells: [{h:"ちゃ",k:"チャ",r:"cha"}, {h:"ちゅ",k:"チュ",r:"chu"}, {h:"ちょ",k:"チョ",r:"cho"}] },
    { cells: [{h:"にゃ",k:"ニャ",r:"nya"}, {h:"にゅ",k:"ニュ",r:"nyu"}, {h:"にょ",k:"ニョ",r:"nyo"}] },
    { cells: [{h:"ひゃ",k:"ヒャ",r:"hya"}, {h:"ひゅ",k:"ヒュ",r:"hyu"}, {h:"ひょ",k:"ヒョ",r:"hyo"}] },
    { cells: [{h:"みゃ",k:"ミャ",r:"mya"}, {h:"みゅ",k:"ミュ",r:"myu"}, {h:"みょ",k:"ミョ",r:"myo"}] },
    { cells: [{h:"りゃ",k:"リャ",r:"rya"}, {h:"りゅ",k:"リュ",r:"ryu"}, {h:"りょ",k:"リョ",r:"ryo"}] },
    { cells: [{h:"ぎゃ",k:"ギャ",r:"gya"}, {h:"ぎゅ",k:"ギュ",r:"gyu"}, {h:"ぎょ",k:"ギョ",r:"gyo"}] },
    { cells: [{h:"じゃ",k:"ジャ",r:"ja"}, {h:"じゅ",k:"ジュ",r:"ju"}, {h:"じょ",k:"ジョ",r:"jo"}] },
    { cells: [{h:"びゃ",k:"ビャ",r:"bya"}, {h:"びゅ",k:"ビュ",r:"byu"}, {h:"びょ",k:"ビョ",r:"byo"}] },
    { cells: [{h:"ぴゃ",k:"ピャ",r:"pya"}, {h:"ぴゅ",k:"ピュ",r:"pyu"}, {h:"ぴょ",k:"ピョ",r:"pyo"}] },
  ],
};

// ── TTS hook ──────────────────────────────────────────────────────────────────

function useSpeak(): (text: string) => void {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const pick = () => {
      const voices = synth.getVoices();
      voiceRef.current =
        voices.find((v) => v.name === "Kyoko") ??
        voices.find((v) => v.lang === "ja-JP") ??
        voices.find((v) => v.lang.toLowerCase().startsWith("ja")) ??
        null;
    };
    pick();
    synth.addEventListener("voiceschanged", pick);
    return () => synth.removeEventListener("voiceschanged", pick);
  }, []);

  return useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ja-JP";
    utt.rate = 0.6;
    if (voiceRef.current) utt.voice = voiceRef.current;
    synth.speak(utt);
  }, []);
}

// ── KanaKey — a single tappable character cell ────────────────────────────────

type KanaKeyProps = {
  cell: CellData | null;
  script: ScriptKey;
  onPlay: (text: string) => void;
};

function KanaKey({ cell, script, onPlay }: KanaKeyProps) {
  const [pulsing, setPulsing] = useState(false);

  if (cell === null) return <div aria-hidden="true" />;

  const char = script === "h" ? cell.h : cell.k;

  function handle() {
    onPlay(char);
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 420);
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={`${char} — ${cell.r}, tap to hear`}
      className={[
        "group relative flex flex-col items-center justify-center gap-0.5 rounded-lg border bg-bg",
        "shadow-key transition-colors duration-150 active:bg-surface-2",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        pulsing ? "border-brand-400" : "border-border hover:border-border-strong",
      ].join(" ")}
      style={{ height: "var(--kana-cell)" }}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 rounded-lg ring-2 ring-brand-500 transition-opacity duration-300",
          pulsing ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <span
        className="leading-none text-fg"
        style={{ fontFamily: "var(--font-jp)", fontSize: "var(--kana-fs)", fontWeight: 500 }}
      >
        {char}
      </span>
      <span
        className="leading-none text-fg-faint group-active:text-fg-subtle"
        style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
      >
        {cell.r}
      </span>
    </button>
  );
}

// ── KanaGrid — inline-grid for one section ────────────────────────────────────

type KanaGridProps = {
  section: KanaSectionData;
  script: ScriptKey;
  onPlay: (text: string) => void;
};

function KanaGrid({ section, script, onPlay }: KanaGridProps) {
  const colCount = section.cols.length;
  return (
    <div className="overflow-x-auto pb-1">
      <div
        className="inline-grid gap-1.5 md:gap-2"
        style={{ gridTemplateColumns: `repeat(${colCount}, var(--kana-cell))` }}
      >
        {section.rows.map((row, ri) => (
          <Fragment key={ri}>
            {row.cells.map((cell, ci) => (
              <KanaKey key={ci} cell={cell} script={script} onPlay={onPlay} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Segmented control ─────────────────────────────────────────────────────────

type SegmentedOption = { value: ScriptKey; label: string };

type SegmentedProps = {
  value: ScriptKey;
  onChange: (v: ScriptKey) => void;
  options: readonly SegmentedOption[];
};

function Segmented({ value, onChange, options }: SegmentedProps) {
  return (
    <div className="inline-flex gap-1 rounded-xl border border-border bg-surface p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={[
              "h-9 rounded-lg px-4 text-body-sm font-medium transition-colors",
              active
                ? "bg-bg text-fg shadow-card"
                : "text-fg-subtle active:text-fg-muted",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ── ScriptBlock — all three sections for one script ───────────────────────────

type ScriptBlockProps = { script: ScriptKey; onPlay: (text: string) => void };

const SCRIPT_SECTIONS = [
  { key: "gojuon" as const, data: KANA_GOJUON, title: "Gojūon", note: "The base 46" },
  { key: "dakuten" as const, data: KANA_DAKUTEN, title: "Dakuten & handakuten", note: "Voiced sounds and the p-row" },
  { key: "yoon" as const, data: KANA_YOON, title: "Yōon", note: "Contracted sounds" },
];

function ScriptBlock({ script, onPlay }: ScriptBlockProps) {
  return (
    <div className="flex flex-col gap-10">
      {SCRIPT_SECTIONS.map((s) => (
        <section key={s.key} className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-heading-sm font-semibold text-fg">{s.title}</h3>
            <span className="text-body-sm text-fg-subtle">{s.note}</span>
          </div>
          <KanaGrid section={s.data} script={script} onPlay={onPlay} />
        </section>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const SECTION_LINKS = [{ to: "/kana/practice", label: "Practice" }];

const SCRIPT_OPTIONS: readonly SegmentedOption[] = [
  { value: "h", label: "Hiragana" },
  { value: "k", label: "Katakana" },
];

// CSS custom properties for responsive cell sizing
const kanaVars = {
  "--kana-cell": "clamp(50px, 13.5vw, 92px)",
  "--kana-fs": "clamp(22px, 6vw, 30px)",
} as React.CSSProperties;

export function KanaPage() {
  const speak = useSpeak();

  const [script, setScript] = useState<ScriptKey>(() => {
    try {
      const saved = localStorage.getItem("aburungo-kana-script");
      return saved === "h" || saved === "k" ? saved : "h";
    } catch {
      return "h";
    }
  });

  useEffect(() => {
    try { localStorage.setItem("aburungo-kana-script", script); } catch { /* ignore */ }
  }, [script]);

  return (
    <PageShell
      sideNav={
        <div className="flex flex-col gap-6">
          <SectionNav links={SECTION_LINKS} />
          <ProgressWidget section="kana" />
        </div>
      }
    >
      <div className="w-full" style={kanaVars}>
        <div className="flex flex-col gap-8 py-8 md:py-10">
          <header className="flex flex-col gap-2">
            <h1 className="text-display text-fg">Kana</h1>
            <p className="max-w-prose text-body text-fg-muted">
              Hiragana and katakana, laid out by their logical rows. Tap any
              character to hear it.
            </p>
          </header>

          <div className="flex items-center justify-between border-b border-border pb-6">
            <Segmented
              value={script}
              onChange={setScript}
              options={SCRIPT_OPTIONS}
            />
            <span
              className="hidden text-jp text-fg-subtle sm:inline"
              style={{ fontFamily: "var(--font-jp)" }}
            >
              {script === "h" ? "ひらがな" : "カタカナ"}
            </span>
          </div>

          <ScriptBlock script={script} onPlay={speak} />

          <div className="pb-4">
            <Link
              to="/kana/practice"
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-brand-600 text-body font-semibold text-white active:bg-brand-700"
            >
              Practice kana →
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
