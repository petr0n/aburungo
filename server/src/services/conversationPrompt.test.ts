import { describe, it, expect } from 'vitest'
import {
  buildSystemPrompt,
  MAX_SCOPE_TURNS,
  MAX_SCOPE_WORDS,
  type ConversationScope,
} from './conversationPrompt.js'

const scope = (over: Partial<ConversationScope> = {}): ConversationScope => ({
  situation: 'At the café',
  canDo: 'Order something to drink',
  words: [
    { japanese: 'コーヒー', reading: 'こーひー', english: 'coffee' },
    { japanese: 'お願いします', reading: 'おねがいします', english: 'please' },
  ],
  maxTurns: 4,
  ...over,
})

describe('buildSystemPrompt', () => {
  it('falls back to the open companion when no scope is given', () => {
    const p = buildSystemPrompt('N5')
    expect(p).toContain('Speak naturally and casually')
    expect(p).not.toContain('Situation:')
  })

  it('falls back to the open prompt when a scope carries no words', () => {
    // An empty word list would otherwise produce "use these words: <nothing>",
    // which forbids Hana from saying anything at all.
    const p = buildSystemPrompt('N5', scope({ words: [] }))
    expect(p).toContain('Speak naturally and casually')
  })

  it('names the situation and the can-do the learner is working toward', () => {
    const p = buildSystemPrompt('N5', scope())
    expect(p).toContain('At the café')
    expect(p).toContain('Order something to drink')
  })

  it('lists each word with its reading and meaning', () => {
    const p = buildSystemPrompt('N5', scope())
    expect(p).toContain('コーヒー (こーひー) — coffee')
    expect(p).toContain('お願いします (おねがいします) — please')
  })

  it('forbids vocabulary outside the list', () => {
    expect(buildSystemPrompt('N5', scope())).toContain(
      'Never introduce vocabulary outside the list above',
    )
  })

  it('carries the JLPT level into the scoped prompt', () => {
    expect(buildSystemPrompt('N4', scope())).toContain('JLPT N4 grammar')
  })

  it('states the turn limit it was given', () => {
    expect(buildSystemPrompt('N5', scope({ maxTurns: 3 }))).toContain('about 3 exchanges')
  })

  it('caps runaway turn counts', () => {
    const p = buildSystemPrompt('N5', scope({ maxTurns: 999 }))
    expect(p).toContain(`about ${MAX_SCOPE_TURNS} exchanges`)
  })

  it('raises a nonsensical turn count to at least one', () => {
    expect(buildSystemPrompt('N5', scope({ maxTurns: 0 }))).toContain('about 1 exchanges')
  })

  it('caps the word list, since prompt size is API spend', () => {
    const many = Array.from({ length: MAX_SCOPE_WORDS + 40 }, (_, i) => ({
      japanese: `語${i}`,
      reading: `ご${i}`,
      english: `word ${i}`,
    }))
    const p = buildSystemPrompt('N5', scope({ words: many }))
    expect(p).toContain('語0 (ご0) — word 0')
    expect(p).not.toContain(`語${MAX_SCOPE_WORDS} (`)
  })

  it('tells Hana to model the correct form rather than name the mistake', () => {
    // The product rule: the app never tells a learner they failed.
    const p = buildSystemPrompt('N5', scope())
    expect(p).toContain('do not name the mistake')
    expect(p).toContain('modelled')
  })

  it('forbids grading or rating the learner', () => {
    const p = buildSystemPrompt('N5', scope())
    expect(p).toContain('Never grade, score, rate, or evaluate')
  })

  it('accepts a one-word answer, per the N5 scaffolding plan', () => {
    expect(buildSystemPrompt('N5', scope())).toContain('A single word is a perfectly good answer')
  })
})
