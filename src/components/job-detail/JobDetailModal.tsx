"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { getDdayLabel } from "@/lib/dday";
import { PURPOSE_TAGS } from "@/lib/constants";
import { layout } from "@/lib/design-tokens";
import type { JobPosting } from "@/lib/types";
import { InsightTab } from "./InsightTab";
import { OriginalTab } from "./OriginalTab";
import { MemoTab } from "./MemoTab";
import { Modal, ModalButton } from "../ui/Modal";

interface JobDetailModalProps {
  job: JobPosting;
  onClose: () => void;
  onUpdated: (job: JobPosting) => void;
  onDeleted: () => void;
}

type Tab = "insight" | "original" | "memo";

const TABS: { id: Tab; label: string }[] = [
  { id: "insight", label: "인사이트" },
  { id: "original", label: "원문" },
  { id: "memo", label: "메모" },
];

export function JobDetailModal({
  job,
  onClose,
  onUpdated,
  onDeleted,
}: JobDetailModalProps) {
  const [tab, setTab] = useState<Tab>("insight");
  const [form, setForm] = useState<JobPosting>(job);
  const [dirty, setDirty] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(job);

  useEffect(() => {
    setForm(job);
    setCurrentJob(job);
    setDirty(false);
  }, [job]);

  function updateForm(updates: Partial<JobPosting>) {
    setForm((prev) => ({ ...prev, ...updates }));
    setDirty(true);
  }

  async function handleSave() {
    try {
      const updated = await apiFetch<JobPosting>(`/jobs/${job.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          purpose_tag: form.purpose_tag,
          company_name: form.company_name,
          job_title: form.job_title,
          recruitment_field: form.recruitment_field,
          job_description: form.job_description,
          qualifications: form.qualifications,
          preferences: form.preferences,
          industry: form.industry,
          deadline_raw: form.deadline_raw,
          deadline_date: form.deadline_date,
          required_documents: form.required_documents,
          application_method: form.application_method,
          raw_text: form.raw_text,
          memo: form.memo,
          competency_keywords: form.competency_keywords,
        }),
      });
      setDirty(false);
      onUpdated(updated);
      setShowSave(true);
    } catch (err) {
      if (err instanceof ApiError) setSaveError(true);
    }
  }

  async function handleDelete() {
    await apiFetch(`/jobs/${job.id}`, { method: "DELETE" });
    setShowDelete(false);
    onDeleted();
  }

  function handleClose() {
    if (dirty) {
      setShowLeave(true);
      return;
    }
    onClose();
  }

  const dday = getDdayLabel(form.deadline_date);
  const tagStyle = PURPOSE_TAGS.find((t) => t.value === form.purpose_tag);
  const displayTitle =
    form.recruitment_field || form.job_title || "모집 분야 미정";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="relative z-10 flex flex-col overflow-hidden rounded-lg bg-white shadow-xl"
          style={{
            width: layout.detailModalWidth,
            height: layout.detailModalHeight,
            maxHeight: layout.detailModalHeight,
          }}
        >
          <div className="flex h-10 shrink-0 items-center justify-end px-4">
            <button
              onClick={handleClose}
              className="text-lg text-dd-gray-500 hover:text-dd-black"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <div className="relative shrink-0 px-9 pb-3">
            <div className="relative mb-2 w-fit">
              <button
                type="button"
                onClick={() => setTagOpen(!tagOpen)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{
                  backgroundColor: tagStyle?.bg ?? "#19B469",
                  color: tagStyle?.text ?? "#FFFFFF",
                }}
              >
                {form.purpose_tag ?? "저장 목적을 선택하세요"}
                <span className="text-[10px] leading-none">▾</span>
              </button>
              {tagOpen && (
                <div className="absolute left-0 top-full z-20 mt-1 min-w-[140px] rounded border border-dd-gray-400 bg-white shadow">
                  {[
                    ...PURPOSE_TAGS.map((t) => ({
                      value: t.value,
                      label: t.label,
                    })),
                    { value: null as string | null, label: "태그 해제" },
                  ].map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => {
                        updateForm({ purpose_tag: t.value });
                        setTagOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-dd-gray-100"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <h2 className="text-[26px] font-semibold leading-tight text-dd-black">
              {displayTitle}
            </h2>
            <p className="mt-0.5 text-sm text-dd-gray-500">
              {form.company_name || "기업명 없음"}
            </p>

            {dday.label && (
              <span
                className={`absolute right-9 top-6 text-xl font-semibold ${
                  dday.urgent
                    ? "text-dd-error"
                    : dday.expired
                      ? "text-dd-gray-500"
                      : "text-dd-black"
                }`}
              >
                {dday.expired ? "마감된 공고" : dday.label}
              </span>
            )}
          </div>

          <div className="flex shrink-0 gap-2 px-9 pb-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-5 py-1.5 text-xs font-medium transition ${
                  tab === t.id
                    ? "bg-dd-black text-white"
                    : "bg-dd-gray-100 text-dd-gray-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-hidden px-9 pb-3">
            {tab === "insight" && (
              <InsightTab form={form} onChange={updateForm} />
            )}
            {tab === "original" && (
              <OriginalTab
                job={currentJob}
                form={form}
                onChange={updateForm}
                onImagesChange={async () => {
                  const refreshed = await apiFetch<JobPosting>(
                    `/jobs/${job.id}`
                  );
                  setCurrentJob(refreshed);
                }}
              />
            )}
            {tab === "memo" && <MemoTab form={form} onChange={updateForm} />}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-dd-gray-400 px-9 py-4">
            {form.source_url ? (
              <a
                href={form.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-dd-black bg-white px-6 py-2 text-sm font-medium text-dd-black"
              >
                원본 공고 보러가기
              </a>
            ) : (
              <span />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="rounded-lg bg-dd-black px-6 py-2 text-sm font-medium text-white"
              >
                삭제
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-dd-green px-6 py-2 text-sm font-medium text-white"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showSave}
        title="안내"
        variant="success"
        onClose={() => setShowSave(false)}
        actions={
          <ModalButton variant="outline" onClick={() => setShowSave(false)}>
            닫기
          </ModalButton>
        }
      >
        <p>저장이 완료되었습니다.</p>
      </Modal>

      <Modal
        open={saveError}
        title="안내"
        onClose={() => setSaveError(false)}
        variant="error"
        actions={
          <ModalButton variant="outline" onClick={() => setSaveError(false)}>
            닫기
          </ModalButton>
        }
      >
        <p>
          수정한 내용을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      </Modal>

      <Modal
        open={showLeave}
        title="안내"
        onClose={() => setShowLeave(false)}
        variant="confirm-leave"
        actions={
          <>
            <ModalButton
              variant="danger"
              onClick={() => {
                setShowLeave(false);
                onClose();
              }}
            >
              나가기
            </ModalButton>
            <ModalButton variant="outline" onClick={() => setShowLeave(false)}>
              취소
            </ModalButton>
          </>
        }
      >
        <p>저장하지 않은 변경사항이 있어요. 나가시겠어요?</p>
      </Modal>

      <Modal
        open={showDelete}
        title="삭제 안내"
        onClose={() => setShowDelete(false)}
        variant="confirm-delete"
        actions={
          <>
            <ModalButton variant="danger" onClick={handleDelete}>
              삭제하기
            </ModalButton>
            <ModalButton variant="outline" onClick={() => setShowDelete(false)}>
              취소
            </ModalButton>
          </>
        }
      >
        <p>삭제하시겠어요?</p>
      </Modal>
    </>
  );
}
