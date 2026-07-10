"use client";

import type { JobPosting } from "@/lib/types";

interface MemoTabProps {
  form: JobPosting;
  onChange: (updates: Partial<JobPosting>) => void;
}

export function MemoTab({ form, onChange }: MemoTabProps) {
  const count = form.memo.length;
  const overLimit = count >= 5000;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h3 className="shrink-0 pb-2 text-lg font-semibold text-dd-black">메모장</h3>
      <p className="shrink-0 pb-3 text-xs text-dd-gray-500">
        나만의 메모를 남겨 보세요.
      </p>
      <textarea
        value={form.memo}
        onChange={(e) => {
          if (e.target.value.length <= 5000) {
            onChange({ memo: e.target.value });
          }
        }}
        className="min-h-0 flex-1 resize-none rounded-lg border border-dd-gray-400 bg-dd-gray-100 px-3 py-2 text-sm outline-none"
        placeholder={`준비 방향, 느낀 점, 궁금한 것 등 이 공고를 저장한 순간의 생각을 기록해 두세요.

Tip. 준비 방향이나 느낀 점을 적어 두면, 나중에 이 공고를 다시 봤을 때 도움이 돼요.`}
      />
      <p className={`shrink-0 pt-2 text-xs ${overLimit ? "text-dd-error" : "text-dd-gray-500"}`}>
        {count}/5000
      </p>
    </div>
  );
}
