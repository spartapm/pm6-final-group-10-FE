"use client";

import { useEffect, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { assets } from "@/lib/assets";
import { SORT_OPTIONS } from "@/lib/constants";

interface FilterBarProps {
  allKeywords: string[];
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  excludeExpired: boolean;
  onExcludeExpiredChange: (v: boolean) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export function FilterBar({
  allKeywords,
  selectedKeywords,
  onKeywordsChange,
  excludeExpired,
  onExcludeExpiredChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingKeywords, setPendingKeywords] = useState<string[]>(selectedKeywords);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    setPendingKeywords(selectedKeywords);
  }, [selectedKeywords]);

  function toggleKeyword(kw: string) {
    setPendingKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  }

  function applyKeywords() {
    onKeywordsChange(pendingKeywords);
    setDropdownOpen(false);
  }

  const sortedAll = [...allKeywords].sort((a, b) => a.localeCompare(b, "ko"));
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "저장일 내림차순";

  return (
    <div className="shrink-0 space-y-3 bg-dd-gray-100 px-10 py-4">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setPendingKeywords(selectedKeywords);
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center gap-1.5 rounded-[16px] bg-dd-black px-4 py-2 text-sm font-medium text-dd-yellow"
          >
            역량키워드
            <AssetImage
              src={assets.iconChevronDownYellow}
              alt=""
              width={9}
              height={5}
              placeholderClassName="bg-transparent"
            />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full z-20 mt-2 w-[524px] rounded-lg border border-dd-gray-400 bg-white p-4 shadow-lg">
                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                  {sortedAll.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => toggleKeyword(kw)}
                      className={`rounded px-3 py-1 text-sm ${
                        pendingKeywords.includes(kw)
                          ? "bg-dd-black text-white"
                          : "border border-dd-gray-400 bg-white text-dd-black"
                      }`}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
                <button
                  onClick={applyKeywords}
                  className="mt-4 rounded-[16px] bg-dd-green px-4 py-2 text-sm text-white"
                >
                  적용하기
                </button>
              </div>
            </>
          )}
        </div>

        {selectedKeywords.length > 0 && (
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {selectedKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() =>
                  onKeywordsChange(selectedKeywords.filter((k) => k !== kw))
                }
                className="shrink-0 rounded-[16px] bg-dd-black px-3 py-1 text-xs text-white"
              >
                {kw} ×
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-dd-black">
          <input
            type="checkbox"
            checked={excludeExpired}
            onChange={(e) => onExcludeExpiredChange(e.target.checked)}
            className="size-4 accent-dd-black"
          />
          마감제외
        </label>

        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 text-sm text-dd-black"
          >
            {sortLabel}
            <AssetImage
              src={assets.iconChevron}
              alt=""
              width={9}
              height={5}
              placeholderClassName="bg-transparent"
            />
          </button>
          {sortOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSortOpen(false)}
              />
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded border border-dd-gray-400 bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onSortChange(opt.value);
                      setSortOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-dd-gray-100 ${
                      sort === opt.value ? "font-medium" : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
