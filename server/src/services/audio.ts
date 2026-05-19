import { supabase } from '../lib/supabase.js'

export async function getAudioUrl(cardId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('audio_url')
    .eq('id', cardId)
    .single()

  if (error) return null
  return (data as { audio_url: string | null }).audio_url
}
