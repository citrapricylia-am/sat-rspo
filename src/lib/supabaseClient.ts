// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// LOG ENV (hanya prefix key biar aman)
console.log("[supabaseClient] URL =", url);
console.log("[supabaseClient] KEY  =", anon?.slice(0, 8) + "...");

declare global {
  // eslint-disable-next-line no-var
  var __supabase__: SupabaseClient | undefined;
}

export const supabase: SupabaseClient =
  globalThis.__supabase__ ??
  (globalThis.__supabase__ = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "sat_rspo_auth",
    },
  }));
