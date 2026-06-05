// Server-side Supabase client using the PUBLISHABLE (anon) key.
// Safe for public CMS reads + public storage downloads — RLS still applies.
// Does NOT require SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function createPublicServerClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    const missing = [
      ...(!url ? ["SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(`Missing Supabase environment variable(s): ${missing.join(", ")}`);
  }
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

let _client: ReturnType<typeof createPublicServerClient> | undefined;
export const supabasePublic = new Proxy({} as ReturnType<typeof createPublicServerClient>, {
  get(_, prop, receiver) {
    if (!_client) _client = createPublicServerClient();
    return Reflect.get(_client, prop, receiver);
  },
});
