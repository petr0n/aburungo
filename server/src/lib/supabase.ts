import { createClient } from '@supabase/supabase-js'
import { upstreamFetch } from './upstreamFetch.js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false },
  global: { fetch: upstreamFetch() },
})
