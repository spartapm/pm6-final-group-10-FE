"use client";

import { useState } from "react";
import { getDdayLabel } from "@/lib/dday";
import { PURPOSE_TAGS } from "@/lib/constants";
import type { JobPosting } from "@/lib/types";

interface JobCardProps {
  job: JobPosting;
  onOpen: (job: JobPosting) => void;
  onDelete: (job: JobPosting) => void;
  selectedKeywords?: string[];
}

// 한글 → 영문 순으로 오름차순 정렬 (JD-C05)
function koThenEnCompare(a: string, b: string): number {
  const aKo = /^[가-힣]/.test(a);
  const bKo = /^[가-힣]/.test(b);
  if (aKo !== bKo) return aKo ? -1 : 1;
  return a.localeCompare(b, "ko", { sensitivity: "base" });
}

export function JobCard({
  job,
  onOpen,
  onDelete,
  selectedKeywords = [],
}: JobCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dday = getDdayLabel(job.deadline_date);
  const tagStyle = PURPOSE_TAGS.find((t) => t.value === job.purpose_tag);

  // 필터로 선택된 키워드를 앞으로 재배열하고(각각 한글→영문 정렬),
  // 선택된 키워드는 색상으로 강조한다. (JD-F05 / JD-C05)
  const selectedSet = new Set(selectedKeywords);
  const allKeywords = job.competency_keywords ?? [];
  const selected = allKeywords
    .filter((kw) => selectedSet.has(kw))
    .sort(koThenEnCompare);
  const rest = allKeywords
    .filter((kw) => !selectedSet.has(kw))
    .sort(koThenEnCompare);
  const keywords = [...selected, ...rest];

  return (
    <div
      className="relative flex h-full flex-col cursor-pointer rounded-lg border border-dd-gray-400 bg-white p-4 transition hover:shadow-md"
      onClick={() => onOpen(job)}
    >
      <button
        className="absolute right-3 top-3 text-lg text-dd-gray-500 hover:text-dd-black"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        aria-label="더보기"
      >
        ···
      </button>

      {menuOpen && (
        <div
          className="absolute right-3 top-10 z-10 rounded border border-dd-gray-400 bg-white shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="block w-full px-4 py-2 text-left text-sm text-dd-error hover:bg-dd-gray-100"
            onClick={() => {
              setMenuOpen(false);
              onDelete(job);
            }}
          >
            삭제
          </button>
        </div>
      )}

      <div className="shrink-0 pr-8">
        <p className="line-clamp-1 text-xs text-dd-gray-500">
          {job.company_name || "기업명 없음"}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-base font-bold leading-snug text-dd-black">
          {job.recruitment_field || job.job_title || "모집 분야 미정"}
        </h3>
      </div>

      <div className="mt-3 shrink-0">
        <p className="text-xs font-medium text-dd-black">핵심역량</p>
        <div className="mt-1 flex h-11 flex-wrap content-start items-start gap-1 overflow-hidden">
          {keywords.map((kw) => {
            const isSelected = selectedSet.has(kw);
            return (
              <span
                key={kw}
                className="shrink-0 whitespace-nowrap rounded border px-2 py-0.5 text-xs leading-none"
                style={{
                  backgroundColor: isSelected ? "#18181B" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#18181B",
                  borderColor: isSelected ? "#18181B" : "#D4D4D8",
                }}
              >
                {kw}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex-1" aria-hidden />

      <div className="flex shrink-0 items-center justify-between pt-3">
        {tagStyle && job.purpose_tag ? (
          <span
            className="rounded px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: tagStyle.bg, color: tagStyle.text }}
          >
            {job.purpose_tag}
          </span>
        ) : (
          <span />
        )}
        {dday.label && (
          <span
            className={`text-sm font-medium ${
              dday.expired
                ? "text-dd-gray-500"
                : dday.urgent
                  ? "text-dd-error"
                  : "text-dd-black"
            }`}
          >
            {dday.expired ? "마감된 공고" : dday.label}
          </span>
        )}
      </div>
    </div>
  );
}
