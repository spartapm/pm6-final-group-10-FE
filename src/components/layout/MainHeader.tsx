"use client";

import { useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { assets } from "@/lib/assets";
import { validateJobUrl } from "@/lib/validators";

interface MainHeaderProps {
  onSubmit: (url: string) => Promise<void>;
  loading?: boolean;
  variant?: "all" | "tag";
}

export function MainHeader({
  onSubmit,
  loading,
  variant = "all",
}: MainHeaderProps) {
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

  const urlBar = (
    <div className="w-full max-w-[640px]">
      <div className="flex items-center gap-2 rounded-[42px] border border-dd-gray-400 bg-dd-gray-100 px-4 py-2">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && !loading && url && handleSubmit()}
          placeholder="https:// 채용공고 URL을 붙여넣으면 자동으로 정리돼요."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-dd-gray-500"
        />
        <button
          onClick={handleSubmit}
          disabled={!url.trim() || loading}
          className="shrink-0 rounded-[16px] bg-dd-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          URL 추가
        </button>
      </div>
      {error && (
        <p className="mt-2 text-center text-sm text-dd-error">{error}</p>
      )}
    </div>
  );

  if (variant === "tag") {
    return (
      <header className="flex min-h-[198px] shrink-0 items-center gap-8 px-10 py-4">
        <button
          onClick={() => window.location.reload()}
          className="shrink-0"
          aria-label="새로고침"
        >
          <AssetImage
            src={assets.logoMain}
            alt="딱풀"
            width={120}
            height={120}
            className="rounded"
            placeholderClassName="rounded bg-dd-gray-200"
          />
        </button>
        <div className="flex-1">{urlBar}</div>
      </header>
    );
  }

  return (
    <header className="flex min-h-[198px] shrink-0 flex-col items-center justify-center gap-6 px-10 py-4">
      <button
        onClick={() => window.location.reload()}
        aria-label="새로고침"
      >
        <AssetImage
          src={assets.logoMain}
          alt="딱풀"
          width={120}
          height={120}
          className="rounded"
          placeholderClassName="rounded bg-dd-gray-200"
        />
      </button>
      {urlBar}
    </header>
  );
}
