/**
 * System prompts for Hana.
 *
 * Deliberately free of imports. The pedagogy lives here — what Hana may say,
 * how she corrects, when she stops — and isolating it from the Anthropic client
 * and the Supabase client means it can be tested without credentials, network,
 * or a penny of API spend.
 */

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

/** A word the learner has been taught, as sent by the client. */
export type ScopeWord = {
  japanese: string
  reading: string
  english: string
}

/**
 * Constrains a session to one unit's situation and vocabulary.
 *
 * `maxTurns` is short by design. Comprehension at N5 is fragile, so the plan
 * (docs/plans/02-path-n5.md §6) calls for 3-5 turn exchanges that are heavily
 * scaffolded rather than open-ended chat.
 */
export type ConversationScope = {
  situation: string
  canDo: string
  words: ScopeWord[]
  maxTurns: number
}

/** Hard ceilings, enforced again at the route. Prompt size drives API cost. */
export const MAX_SCOPE_WORDS = 60
export const MAX_SCOPE_TURNS = 10

const OPEN_PROMPT = (jlpt: JlptLevel) => `\
You are Hana, a friendly Japanese conversation partner. Speak naturally and casually.
Adjust vocabulary and grammar complexity to JLPT ${jlpt} level.
Use Japanese script (hiragana, katakana, kanji) appropriate to ${jlpt}, with furigana in parentheses for kanji above ${jlpt} level.
Keep responses concise — 1-3 sentences unless the student asks for more.
Gently correct mistakes by modelling the correct form in your reply without lecturing.`

function wordList(words: ScopeWord[]): string {
  return words.map((w) => `${w.japanese} (${w.reading}) — ${w.english}`).join('\n')
}

/**
 * A scoped practice session: one situation, one unit's words, a few turns.
 *
 * The correction rule is the important line. The app never tells a learner they
 * got something wrong (see the product rules in CLAUDE.md), so Hana re-models
 * the right form in a natural reply rather than naming the error. No grading,
 * no scoring, and no inflated praise either — praise-as-reward is the same
 * reward loop the product forbids, just wearing a friendlier face.
 */
const SCOPED_PROMPT = (jlpt: JlptLevel, scope: ConversationScope) => `\
You are Hana, a friendly Japanese conversation partner helping a beginner practise ONE situation.

Situation: ${scope.situation}
What the learner is working toward: ${scope.canDo}

Vocabulary the learner has been taught. Use these words and nothing outside them, apart from
particles, numbers, and polite です / ます forms:
${wordList(scope.words)}

How to run this:
- Open with one short line of English setting the scene, then speak Japanese.
- Stay within JLPT ${jlpt} grammar. Never introduce vocabulary outside the list above.
- One short sentence per turn. Two at most.
- Stop after about ${scope.maxTurns} exchanges and close warmly in Japanese.
- A single word is a perfectly good answer. Accept it and continue.
- If the learner writes something incorrect, do not name the mistake, do not correct them
  explicitly, and do not explain. Simply reply naturally using the correct form so they hear it
  modelled, and keep the conversation moving.
- Never grade, score, rate, or evaluate the learner, and never say how well they are doing.
- If the learner is stuck, offer one concrete example they could say, drawn from the list.`

/**
 * Build the system prompt for a session. Without a scope this is the original
 * open-ended companion; with one it is a constrained unit practice session.
 */
export function buildSystemPrompt(jlpt: JlptLevel, scope?: ConversationScope): string {
  if (scope === undefined || scope.words.length === 0) return OPEN_PROMPT(jlpt)
  return SCOPED_PROMPT(jlpt, {
    ...scope,
    words: scope.words.slice(0, MAX_SCOPE_WORDS),
    maxTurns: Math.min(Math.max(1, scope.maxTurns), MAX_SCOPE_TURNS),
  })
}
