/**
 * Build-time feature flags.
 *
 * Deliberately tiny and deliberately not a settings system: a flag here is a
 * decision about what ships, not something a learner toggles.
 */

/**
 * Whether conversation with Hana is available.
 *
 * **Off unless explicitly enabled.** Hana is the only part of the app that
 * costs money per use (Anthropic API), and the owner shelved it rather than
 * carry a metered dependency in what is otherwise a fixed-cost tool. Any value
 * other than the exact string "true" — including the variable being unset —
 * leaves it off, so forgetting to configure something can never start spend.
 *
 * The code is kept rather than deleted: it is written, tested and working, and
 * this is a reversal of one line if that decision changes. See DR-023.
 *
 * Turning it on restores three things: the /conversation route, its nav entry,
 * and the two Hana checkpoint units at the end of the N5 ladder.
 */
export const hanaEnabled = import.meta.env.VITE_HANA_ENABLED === "true";
