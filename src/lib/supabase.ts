/**
 * Supabase browser client.
 *
 * Used exclusively for auth token management — acquiring and refreshing JWTs
 * that are then passed to the Hono API server. All data reads/writes go
 * through the API server, never directly through this client.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
