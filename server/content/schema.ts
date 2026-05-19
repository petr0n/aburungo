import { z } from 'zod'

export const CardSchema = z.object({
  japanese: z.string().min(1),
  reading: z.string().min(1),
  romaji: z.string().min(1),
  english: z.string().min(1),
  notes: z.string().optional(),
})

export const DeckFileSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),
  title_en: z.string().min(1),
  title_ja: z.string().min(1),
  description: z.string().min(1),
  display_order: z.number().int().positive(),
  cards: z.array(CardSchema).min(1),
})

export type DeckFile = z.infer<typeof DeckFileSchema>
export type CardEntry = z.infer<typeof CardSchema>
