"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import posthog from "posthog-js";
import { FolderEditModal } from "@/components/folders/FolderEditModal";
import { AssetImage } from "@/components/ui/AssetImage";
import { apiFetch, ApiError } from "@/lib/api-client";
import { assets } from "@/lib/assets";
import { FOLDER_SLOT_COLORS } from "@/lib/constants";
import { validateJobUrl } from "@/lib/validators";
import type { Folder, Profile } from "@/lib/types";

interface HeaderAreaProps {
  onSubmit?: (url: string, folderId: string | null) => Promise<void>;
  loading?: boolean;
  compact?: boolean;
}

function FolderColorIcon({ color }: { color: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M3.33301 6.66699L3.33301 15.8337C3.33301 16.2939 3.7061 16.667 4.16634 16.667H15.833C16.2933 16.667 16.6663 16.2939 16.6663 15.8337V7.50033C16.6663 7.04009 16.2933 6.66699 15.833 6.66699H10.4163L8.74967 5.00033C8.56214 4.8128 8.30779 4.70744 8.04257 4.70744H4.16634C3.7061 4.70744 3.33301 5.08054 3.33301 5.54077V6.66699Z"
        fill={color}
      />
    </svg>
  );
}

export function HeaderArea({ onSubmit, loading, compact }: HeaderAreaProps) {
  const pathname = usePathname();
  const showUrlBar =
    pathname === "/all" ||
    pathname === "/" ||
    pathname.startsWith("/folders/");

  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiFetch<Profile>("/profile"),
  });

  useEffect(() => {
    if (posthog.__loaded && profile?.id) {
      posthog.identify(profile.id, {
        email: profile.email,
        nickname: profile.nickname,
      });
    }
  }, [profile]);

  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: () => apiFetch<Folder[]>("/folders"),
    enabled: showUrlBar,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setValidated(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleUrlSubmit() {
    const validation = validateJobUrl(url);
    if (!validation.valid) {
      setError(validation.message ?? "URL 형식 오류");
      setValidated(false);
      setDropdownOpen(false);
      return;
    }

    setError("");
    setValidated(true);
    setDropdownOpen(true);
  }

  async function handleFolderSelect(folderId: string | null) {
    if (!onSubmit) return;
    setDropdownOpen(false);
    setValidated(false);
    try {
      await onSubmit(url.trim(), folderId);
      setUrl("");
    } catch (err) {
      if (err instanceof ApiError && err.code === "duplicate_url") {
        // POP-10은 JobListPage에서 처리
        return;
      }
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <header
      className={`relative shrink-0 bg-white px-5 ${
        compact
          ? "min-h-[216px] border-b border-dd-gray-200 pb-4 pt-[22px]"
          : showUrlBar
            ? "pb-6 pt-[22px]"
            : "pb-5 pt-[22px]"
      }`}
    >
      <div className={`flex ${compact || pathname === "/settings" ? "h-[21px]" : "justify-end"}`}>
        {!compact && pathname !== "/settings" && (
          <Link
            href="/settings"
            className="font-pretendard flex items-center gap-1 text-sm font-semibold text-dd-black hover:opacity-80"
          >
            <span>{profile?.nickname ?? "설정"}</span>
            <AssetImage
              src={assets.iconSettings}
              alt=""
              width={16}
              height={16}
              placeholderClassName="bg-transparent"
            />
          </Link>
        )}
      </div>

      <div
        className={`flex items-center justify-center gap-[15px] ${
          compact ? "mt-4" : "mt-[33px]"
        }`}
      >
        <Link href="/all" className="shrink-0" aria-label="딱풀 홈">
          <AssetImage
            src={assets.logoDdakpool}
            alt=""
            width={84}
            height={84}
            className="size-[84px]"
            placeholderClassName="size-[84px] rounded bg-dd-gray-200"
          />
        </Link>
        <Link href="/all" className="shrink-0" aria-label="딱풀 홈">
          <AssetImage
            src={assets.logoWordmark}
            alt="ddakpool"
            width={194}
            height={64}
            className="h-[61px] w-auto"
            placeholderClassName="h-[61px] w-[185px] rounded bg-dd-gray-200"
            priority
          />
        </Link>
      </div>

      {showUrlBar && onSubmit && (
        <div
          ref={containerRef}
          className="relative mx-auto mt-[22px] flex w-full max-w-[686px] flex-col items-center"
        >
          <div className="flex h-[55px] w-full items-center overflow-hidden rounded-[42px] bg-dd-input-bg pl-8">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
                setValidated(false);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && !loading && url && handleUrlSubmit()
              }
              placeholder="https:// 채용공고 URL을 붙여넣으면 자동으로 정리돼요."
              className="font-pretendard min-w-0 flex-1 bg-transparent text-base tracking-[-0.176px] text-dd-black outline-none placeholder:text-dd-gray-500"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!url.trim() || loading}
              className="font-pretendard flex h-[55px] shrink-0 items-center justify-center gap-[4px] rounded-[30px] bg-dd-primary-green px-4 text-base font-bold tracking-[-0.176px] text-white disabled:opacity-50"
            >
              URL 추가
              <AssetImage
                src={assets.iconChevronDownWhite}
                alt=""
                width={24}
                height={24}
                placeholderClassName="bg-transparent"
              />
            </button>
          </div>

          {dropdownOpen && validated && (
            <div className="absolute right-0 top-full z-30 mt-2 w-[167px] overflow-hidden rounded-2xl bg-white py-1 shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
              <button
                type="button"
                onClick={() => handleFolderSelect(null)}
                className="font-pretendard flex h-9 w-full items-center gap-2.5 px-3.5 text-left text-sm text-dd-black hover:bg-dd-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assets.iconBookmark}
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                일단 저장하기
              </button>

              <div className="mx-3 my-1 border-t border-dd-gray-200" />

              {folders.map((folder) => {
                const color =
                  FOLDER_SLOT_COLORS[folder.slot] ?? FOLDER_SLOT_COLORS[1];
                return (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => handleFolderSelect(folder.id)}
                    className="font-pretendard flex h-9 w-full items-center gap-2.5 px-3.5 text-left text-sm text-dd-black hover:bg-dd-gray-100"
                  >
                    <FolderColorIcon color={color.bg} />
                    <span className="truncate">{folder.name}</span>
                  </button>
                );
              })}

              <div className="mx-3 my-1 border-t border-dd-gray-200" />

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  setValidated(false);
                  setFolderModalOpen(true);
                }}
                className="font-pretendard flex h-9 w-full items-center gap-2.5 px-3.5 text-left text-sm text-dd-black hover:bg-dd-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assets.iconFilterAlt}
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                폴더 수정하기
              </button>
            </div>
          )}

          {error && (
            <p className="font-pretendard mt-2 text-center text-sm text-dd-error">
              {error}
            </p>
          )}
        </div>
      )}

      <FolderEditModal
        open={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
      />
    </header>
  );
}
