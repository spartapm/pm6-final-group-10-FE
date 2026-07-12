"use client";

import { useRef, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { getJobImageUrl } from "@/lib/jobImageUrl";
import type { JobPosting } from "@/lib/types";

interface OriginalTabProps {
  job: JobPosting;
  form: JobPosting;
  onChange: (updates: Partial<JobPosting>) => void;
  onImagesChange: () => void;
}

export function OriginalTab({
  job,
  form,
  onChange,
  onImagesChange,
}: OriginalTabProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  async function uploadFile(file: File) {
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("JPG, PNG 파일만 첨부할 수 있어요.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("4MB 이하의 파일만 첨부할 수 있어요.");
      return;
    }
    if ((job.job_posting_images?.length ?? 0) >= 5) {
      setError("이미지는 최대 5개까지 첨부할 수 있어요.");
      return;
    }

    setError("");
    const formData = new FormData();
    formData.append("file", file);

    await apiFetch(`/jobs/${job.id}/images`, {
      method: "POST",
      body: formData,
    });
    onImagesChange();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h3 className="shrink-0 pb-3 text-lg font-semibold text-dd-black">
        원문 스냅샷 & 이미지 첨부
      </h3>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">

      <div>
        <div className="mb-1 flex items-center gap-2">
          <label className="text-xs font-medium text-dd-gray-500">
            텍스트 원문
          </label>
          {job.parsing_status === "fail" && !form.raw_text && (
            <span className="text-xs text-dd-error">
              공고 원문을 불러오지 못했어요. 직접 입력해 주세요.
            </span>
          )}
        </div>
        <textarea
          value={form.raw_text}
          onChange={(e) => onChange({ raw_text: e.target.value })}
          rows={6}
          placeholder="공고 원문을 인식하지 못했어요. 원문을 직접 붙여넣어 주세요."
          className="w-full rounded-[8px] border border-dd-gray-400 bg-dd-gray-100 px-3 py-2 text-sm outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-dd-gray-500">
          이미지 첨부
        </label>
        <p className="mb-2 text-xs text-dd-gray-500">
          캡처 이미지를 끌어다 놓으세요. JPG, PNG 파일당 최대 4MB, 이미지 최대
          5장
        </p>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-dd-gray-400 bg-dd-gray-100 p-6"
        >
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-[8px] border border-dd-gray-400 bg-white px-4 py-2 text-sm"
          >
            파일 선택
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
            }}
          />
        </div>
        {error && <p className="mt-1 text-xs text-dd-error">{error}</p>}

        <div className="mt-3 flex flex-wrap gap-2">
          {(job.job_posting_images ?? []).map((img) => {
            const src = getJobImageUrl(img.storage_path);
            return (
              <div key={img.id} className="relative">
                <button
                  type="button"
                  onClick={() => src && setPreview(src)}
                  className="flex size-16 items-center justify-center overflow-hidden rounded border border-dd-gray-400 bg-dd-gray-100"
                >
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt="첨부 이미지"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-dd-gray-500">IMG</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await apiFetch(`/jobs/${job.id}/images/${img.id}`, {
                      method: "DELETE",
                    });
                    onImagesChange();
                  }}
                  className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-dd-error text-xs text-white"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-2xl text-white"
            onClick={() => setPreview(null)}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="이미지 미리보기"
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      </div>
    </div>
  );
}
