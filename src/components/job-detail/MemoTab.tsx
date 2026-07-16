"use client";

import type { JobPosting } from "@/lib/types";
import { assets } from "@/lib/assets";
import { AssetImage } from "@/components/ui/AssetImage";

interface MemoTabProps {
  form: JobPosting;
  onChange: (updates: Partial<JobPosting>) => void;
}

export function MemoTab({ form, onChange }: MemoTabProps) {
  const count = form.memo.length;
  const overLimit = count >= 5000;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center border-b border-t border-dd-gray-400 bg-white px-[18px] py-4 md:px-9">
        <h3 className="text-xl font-semibold tracking-[-0.22px] text-dd-black">
          메모장
        </h3>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden bg-dd-gray-100 px-[18px] py-[18px] md:px-9">
        <div className="flex shrink-0 items-center gap-1">
          <AssetImage
            src={assets.iconDetailWriting}
            alt=""
            width={16}
            height={16}
            placeholderClassName="bg-transparent"
          />
          <p className="text-sm font-semibold tracking-[-0.154px] text-dd-black">
            나만의 메모를 남겨보세요
          </p>
        </div>

        <textarea
          value={form.memo}
          onChange={(e) => {
            if (e.target.value.length <= 5000) {
              onChange({ memo: e.target.value });
            }
          }}
          className="min-h-0 flex-1 resize-none bg-white px-5 py-3 text-sm leading-[1.5] tracking-[-0.154px] text-dd-black outline-none placeholder:text-dd-gray-500"
          placeholder={`준비 방향, 느낀 점, 궁금한 것 등
이 공고를 저장한 순간의 생각을 기록해두세요.`}
        />

        <p
          className={`shrink-0 text-right text-sm tracking-[-0.154px] ${
            overLimit ? "text-dd-error" : "text-dd-gray-500"
          }`}
        >
          {count} / 5000
        </p>
      </div>
    </div>
  );
}
