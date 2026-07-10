import { API_BASE_URL } from "./constants";
import {
  DEV_AUTH_TOKEN,
  hasDevSession,
  isSupabaseConfigured,
} from "./supabase/config";
import { createClient } from "./supabase/client";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return hasDevSession() ? DEV_AUTH_TOKEN : null;
  }

  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();
  const hasJsonBody =
    options.body != null &&
    options.body !== "" &&
    !(options.body instanceof FormData);

  const headers: HeadersInit = {
    ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      body.error ?? "unknown",
      body.message ?? "요청에 실패했습니다."
    );
  }

  if (response.status === 204) return {} as T;
  return response.json() as Promise<T>;
}
