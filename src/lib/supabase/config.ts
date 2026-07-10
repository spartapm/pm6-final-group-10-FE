export const DEV_AUTH_COOKIE = "ddakpool-dev-auth";
export const DEV_AUTH_TOKEN = "dev-local-token";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}

export function enableDevSession(): void {
  if (typeof document !== "undefined") {
    document.cookie = `${DEV_AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
}

export function clearDevSession(): void {
  if (typeof document !== "undefined") {
    document.cookie = `${DEV_AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function hasDevSession(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim() === `${DEV_AUTH_COOKIE}=1`);
}
