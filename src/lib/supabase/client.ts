import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "./config";
import { createMockSupabaseClient } from "./mock-client";

export function createClient() {
  if (!isSupabaseConfigured()) {
    return createMockSupabaseClient();
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
