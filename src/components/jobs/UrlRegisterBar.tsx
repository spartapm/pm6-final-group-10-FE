"use client";

import { useState } from "react";
import { validateJobUrl } from "@/lib/validators";

interface UrlRegisterBarProps {
  onSubmit: (url: string) => Promise<void>;
  loading?: boolean;
}

export function UrlRegisterBar({ onSubmit, loading }: UrlRegisterBarProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    const validation = validateJobUrl(url);
    if (!validation.valid) {
      setError(validation.message ?? "URL 형식 오류");
      return;
    }

    setError("");
    try {
      await onSubmit(url.trim());
      setUrl("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="border-b bg-white px-6 py-6 text-center">
      <div className="mb-4 text-2xl font-bold text-[#32A287]">딱풀</div>
      <div className="mx-auto flex max-w-2xl gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && !loading && url && handleSubmit()}
          placeholder="https:// 채용공고 URL을 붙여넣으면 자동으로 정리돼요."
          className="flex-1 rounded border px-4 py-3 text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={!url.trim() || loading}
          className="rounded bg-[#32A287] px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          URL 추가
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-[#F25E5E]">{error}</p>}
    </div>
  );
}
