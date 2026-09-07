/**
 * Compiles grammar-pattern YAML into a single typed, validated list.
 *
 * Add a new pattern file by creating src/content/grammar/<path>.yaml and
 * pushing it into `allGrammarPatterns` below — mirrors src/content/lessons/index.ts.
 * One flat list across every book, unlike lessons: a pattern is looked up by id
 * and never asked which book it came from.
 */
import type { GrammarPattern } from "@/types";
import { parseGrammarPatterns } from "./schema";
import { allPhrases } from "@/content/index";

import n5Raw from "./n5.yaml";
import b2PlainFormRaw from "./b2-01-plain-form.yaml";
import b2GivingReceivingRaw from "./b2-02-giving-receiving.yaml";
import b2JoiningSentencesRaw from "./b2-03-joining-sentences.yaml";
import b2DoctorRaw from "./b2-04-doctor.yaml";
import b2DecidingRaw from "./b2-05-deciding.yaml";
import b2PotentialRaw from "./b2-06-potential.yaml";
import b2QuotedSpeechRaw from "./b2-07-quoted-speech.yaml";
import b2MakingPlansRaw from "./b2-08-making-plans.yaml";
import b2ConditionalsRaw from "./b2-09-conditionals.yaml";
import b2TroubleRaw from "./b2-10-trouble.yaml";
import b3PassiveRaw from "./b3-00-passive.yaml";
import b3CauseRaw from "./b3-01-cause.yaml";
import b3ContrastRaw from "./b3-02-contrast.yaml";
import b3ConditionsRaw from "./b3-03-conditions.yaml";
import b3TimeRaw from "./b3-04-time.yaml";
import b3StanceRaw from "./b3-05-stance.yaml";
import b3DegreeRaw from "./b3-06-degree.yaml";
import b3PurposeRaw from "./b3-07-purpose.yaml";
import b3ObligationRaw from "./b3-08-obligation.yaml";
import b3ReferenceRaw from "./b3-09-reference.yaml";
import b3RegisterRaw from "./b3-10-register.yaml";
import b4FinishingRaw from "./b4-00-finishing.yaml";
import b4MeaningRaw from "./b4-01-meaning.yaml";
import b4ReasonRaw from "./b4-02-reason.yaml";
import b4TalkRaw from "./b4-03-talk.yaml";
import b4KeigoHumbleRaw from "./b4-04-keigo-humble.yaml";
import b4KeigoHonorificRaw from "./b4-05-keigo-honorific.yaml";
import b4RelationRaw from "./b4-06-relation.yaml";

const phrasesById = new Map(allPhrases.map((p) => [p.id, p]));

export const allGrammarPatterns: GrammarPattern[] = [
  ...parseGrammarPatterns(n5Raw, "grammar/n5.yaml", phrasesById),
  ...parseGrammarPatterns(b2PlainFormRaw, "grammar/b2-01-plain-form.yaml", phrasesById),
  ...parseGrammarPatterns(b2GivingReceivingRaw, "grammar/b2-02-giving-receiving.yaml", phrasesById),
  ...parseGrammarPatterns(b2JoiningSentencesRaw, "grammar/b2-03-joining-sentences.yaml", phrasesById),
  ...parseGrammarPatterns(b2DoctorRaw, "grammar/b2-04-doctor.yaml", phrasesById),
  ...parseGrammarPatterns(b2DecidingRaw, "grammar/b2-05-deciding.yaml", phrasesById),
  ...parseGrammarPatterns(b2PotentialRaw, "grammar/b2-06-potential.yaml", phrasesById),
  ...parseGrammarPatterns(b2QuotedSpeechRaw, "grammar/b2-07-quoted-speech.yaml", phrasesById),
  ...parseGrammarPatterns(b2MakingPlansRaw, "grammar/b2-08-making-plans.yaml", phrasesById),
  ...parseGrammarPatterns(b2ConditionalsRaw, "grammar/b2-09-conditionals.yaml", phrasesById),
  ...parseGrammarPatterns(b2TroubleRaw, "grammar/b2-10-trouble.yaml", phrasesById),
  ...parseGrammarPatterns(b3PassiveRaw, "grammar/b3-00-passive.yaml", phrasesById),
  ...parseGrammarPatterns(b3CauseRaw, "grammar/b3-01-cause.yaml", phrasesById),
  ...parseGrammarPatterns(b3ContrastRaw, "grammar/b3-02-contrast.yaml", phrasesById),
  ...parseGrammarPatterns(b3ConditionsRaw, "grammar/b3-03-conditions.yaml", phrasesById),
  ...parseGrammarPatterns(b3TimeRaw, "grammar/b3-04-time.yaml", phrasesById),
  ...parseGrammarPatterns(b3StanceRaw, "grammar/b3-05-stance.yaml", phrasesById),
  ...parseGrammarPatterns(b3DegreeRaw, "grammar/b3-06-degree.yaml", phrasesById),
  ...parseGrammarPatterns(b3PurposeRaw, "grammar/b3-07-purpose.yaml", phrasesById),
  ...parseGrammarPatterns(b3ObligationRaw, "grammar/b3-08-obligation.yaml", phrasesById),
  ...parseGrammarPatterns(b3ReferenceRaw, "grammar/b3-09-reference.yaml", phrasesById),
  ...parseGrammarPatterns(b3RegisterRaw, "grammar/b3-10-register.yaml", phrasesById),
  ...parseGrammarPatterns(b4FinishingRaw, "grammar/b4-00-finishing.yaml", phrasesById),
  ...parseGrammarPatterns(b4MeaningRaw, "grammar/b4-01-meaning.yaml", phrasesById),
  ...parseGrammarPatterns(b4ReasonRaw, "grammar/b4-02-reason.yaml", phrasesById),
  ...parseGrammarPatterns(b4TalkRaw, "grammar/b4-03-talk.yaml", phrasesById),
  ...parseGrammarPatterns(b4KeigoHumbleRaw, "grammar/b4-04-keigo-humble.yaml", phrasesById),
  ...parseGrammarPatterns(b4KeigoHonorificRaw, "grammar/b4-05-keigo-honorific.yaml", phrasesById),
  ...parseGrammarPatterns(b4RelationRaw, "grammar/b4-06-relation.yaml", phrasesById),
];

export function findGrammarPattern(id: string): GrammarPattern | undefined {
  return allGrammarPatterns.find((p) => p.id === id);
}
