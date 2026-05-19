import { supabase } from '../lib/supabase.js'

export type KanjiResult = {
  id: string
  character: string
  meanings: string[]
  onReadings: string[]
  kunReadings: string[]
  strokeCount: number | null
  jlptLevel: number | null
  joyoGrade: number | null
  frequency: number | null
  kanjivgSvg: string | null
}

type KanjiRow = {
  id: string
  character: string
  meanings: string[]
  on_readings: string[] | null
  kun_readings: string[] | null
  stroke_count: number | null
  jlpt_level: number | null
  joyo_grade: number | null
  frequency: number | null
  kanjivg_svg: string | null
}

function toResult(row: KanjiRow): KanjiResult {
  return {
    id: row.id,
    character: row.character,
    meanings: row.meanings,
    onReadings: row.on_readings ?? [],
    kunReadings: row.kun_readings ?? [],
    strokeCount: row.stroke_count,
    jlptLevel: row.jlpt_level,
    joyoGrade: row.joyo_grade,
    frequency: row.frequency,
    kanjivgSvg: row.kanjivg_svg,
  }
}

type ListParams = {
  jlpt?: number
  grade?: number
  limit: number
  offset: number
}

export async function listKanji(params: ListParams): Promise<KanjiResult[]> {
  let query = supabase
    .from('kanji')
    .select('*')
    .order('frequency', { ascending: true, nullsFirst: false })
    .range(params.offset, params.offset + params.limit - 1)

  if (params.jlpt !== undefined) query = query.eq('jlpt_level', params.jlpt)
  if (params.grade !== undefined) query = query.eq('joyo_grade', params.grade)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => toResult(row as KanjiRow))
}

export async function getKanji(character: string): Promise<KanjiResult | null> {
  const { data, error } = await supabase
    .from('kanji')
    .select('*')
    .eq('character', character)
    .single()

  if (error) return null
  return toResult(data as KanjiRow)
}
