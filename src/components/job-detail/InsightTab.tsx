"use client";

import { useState } from "react";
import type { JobPosting } from "@/lib/types";

interface InsightTabProps {
  form: JobPosting;
  onChange: (updates: Partial<JobPosting>) => void;
}

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex size-3.5 shrink-0 items-center justify-center text-dd-black">
      {children}
    </span>
  );
}

function SectionLabel({
  icon,
  label,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <SectionIcon>{icon}</SectionIcon>
      <span className="text-xs font-medium text-dd-black">{label}</span>
      {action}
    </div>
  );
}

function FieldBox({
  value,
  onChange,
  rows = 1,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const className =
    "w-full resize-none rounded-lg border border-dd-gray-400 bg-dd-gray-100 px-3 py-2 text-xs leading-relaxed text-dd-black outline-none";

  if (rows > 1) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

function InfoRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-14 shrink-0 pt-0.5 text-xs text-dd-gray-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 rounded border border-dd-gray-400 bg-dd-gray-100 px-1.5 py-0.5 text-xs text-dd-black outline-none"
      />
    </div>
  );
}

export function InsightTab({ form, onChange }: InsightTabProps) {
  const [editingKeywords, setEditingKeywords] = useState(false);
  const [keywordInput, setKeywordInput] = useState(
    (form.competency_keywords ?? []).join(", ")
  );
  const [keywordError, setKeywordError] = useState(false);

  const keywords = [...(form.competency_keywords ?? [])].sort((a, b) =>
    a.localeCompare(b, "ko", { sensitivity: "base" })
  );

  function saveKeywords() {
    const next = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    if (next.length > 30 || next.some((k) => k.length > 20)) {
      setKeywordError(true);
      return;
    }

    setKeywordError(false);
    onChange({ competency_keywords: next });
    setEditingKeywords(false);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h3 className="shrink-0 px-1 pb-3 text-lg font-semibold text-dd-black">
        채용 공고
      </h3>

      <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5 overflow-y-auto pr-1">
        <div className="space-y-5">
          <section>
            <SectionLabel
              icon={
                <svg viewBox="0 0 14 14" fill="currentColor" className="size-3.5">
                  <path d="M3 4h8v1H3V4zm0 3h8v1H3V7zm0 3h5v1H3v-1zM2 2h10a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z" />
                </svg>
              }
              label="모집 분야"
            />
            <FieldBox
              value={String(form.recruitment_field ?? "")}
              onChange={(value) => onChange({ recruitment_field: value })}
              placeholder="모집 분야가 파싱된 정보가 뜨는 공간입니다."
            />
          </section>

          <section>
            <SectionLabel
              icon={
                <svg viewBox="0 0 14 14" fill="currentColor" className="size-3.5">
                  <path d="M7 1l1.2 2.8L11 4l-2.2 1.8L9.6 9 7 7.4 4.4 9l.8-3.2L3 4l2.8-.2L7 1z" />
                </svg>
              }
              label="AI 추출 - 핵심 역량키워드"
              action={
                !editingKeywords ? (
                  <button
                    type="button"
                    onClick={() => {
                      setKeywordInput((form.competency_keywords ?? []).join(", "));
                      setEditingKeywords(true);
                    }}
                    className="ml-1 text-[10px] text-dd-gray-500 underline"
                  >
                    편집하기
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveKeywords}
                    className="ml-1 text-[10px] font-medium text-dd-green"
                  >
                    저장하기
                  </button>
                )
              }
            />

            {editingKeywords ? (
              <>
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  className="w-full rounded-lg border border-dd-gray-400 bg-dd-gray-100 px-3 py-2 text-xs outline-none"
                  placeholder="역량키워드, 역량키워드..."
                />
                <p
                  className={`mt-1 text-[10px] ${keywordError ? "text-dd-error" : "text-dd-gray-500"}`}
                >
                  키워드는 공백 포함 한글 15자, 영어 20자, 전체 키워드는 30개로
                  제한됩니다.
                </p>
              </>
            ) : (
              <div className="flex h-[50px] flex-wrap content-start items-start gap-1.5 overflow-hidden">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="shrink-0 whitespace-nowrap rounded-full bg-dd-black px-3 py-1 text-xs leading-none text-white"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionLabel
              icon={
                <svg viewBox="0 0 14 14" fill="currentColor" className="size-3.5">
                  <path d="M2 12V4l5-3 5 3v8H2zm2-1h6V5.2L7 3.4 4 5.2V11z" />
                </svg>
              }
              label="기업 · 공고 정보"
            />
            <div className="space-y-2 rounded-lg border border-dd-gray-400 bg-dd-gray-100 px-3 py-2">
              <InfoRow
                label="기업 이름"
                value={String(form.company_name ?? "")}
                onChange={(value) => onChange({ company_name: value })}
              />
              <InfoRow
                label="업종"
                value={String(form.industry ?? "")}
                onChange={(value) => onChange({ industry: value })}
              />
              <InfoRow
                label="공고 마감일"
                value={String(form.deadline_raw ?? "")}
                onChange={(value) => onChange({ deadline_raw: value })}
              />
            </div>
          </section>

          <section>
            <SectionLabel
              icon={
                <svg viewBox="0 0 14 14" fill="currentColor" className="size-3.5">
                  <path d="M4 2h6v10H4V2zm1 1v8h4V3H5zm1 1h2v1H6V4zm0 2h2v1H6V6z" />
                </svg>
              }
              label="접수 서류"
            />
            <FieldBox
              value={String(form.required_documents ?? "")}
              onChange={(value) => onChange({ required_documents: value })}
              placeholder="접수 서류가 파싱된 정보가 뜨는 공간입니다."
            />
          </section>

          <section>
            <SectionLabel
              icon={
                <svg viewBox="0 0 14 14" fill="currentColor" className="size-3.5">
                  <path d="M12 2L6 8 4 6l-5 5h12V2z" />
                </svg>
              }
              label="지원 방법"
            />
            <FieldBox
              value={String(form.application_method ?? "")}
              onChange={(value) => onChange({ application_method: value })}
              placeholder="지원 방법이 파싱된 정보가 뜨는 공간입니다."
            />
          </section>
        </div>

        <div className="space-y-5">
          <section>
            <SectionLabel
              icon={
                <svg viewBox="0 0 14 14" fill="currentColor" className="size-3.5">
                  <path d="M4 2h6v10H4V2zm1 1v8h4V3H5zm1 1h2v1H6V4zm0 2h2v1H6V6z" />
                </svg>
              }
              label="담당 업무"
            />
            <FieldBox
              value={String(form.job_description ?? "")}
              onChange={(value) => onChange({ job_description: value })}
              rows={3}
              placeholder="담당 업무가 파싱된 정보가 뜨는 공간입니다."
            />
          </section>

          <section>
            <SectionLabel
              icon={
                <svg viewBox="0 0 14 14" fill="currentColor" className="size-3.5">
                  <path d="M7 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-4 5a4 4 0 018 0H3z" />
                </svg>
              }
              label="자격 요건"
            />
            <FieldBox
              value={String(form.qualifications ?? "")}
              onChange={(value) => onChange({ qualifications: value })}
              rows={2}
              placeholder="자격 요건이 파싱된 정보가 뜨는 공간입니다."
            />
          </section>

          <section>
            <SectionLabel
              icon={
                <svg viewBox="0 0 14 14" fill="currentColor" className="size-3.5">
                  <path d="M7 1l1.5 3 3.3.5-2.4 2.3.6 3.3L7 8.8 3 10.1l.6-3.3L1.2 4.5 4.5 4 7 1z" />
                </svg>
              }
              label="우대 사항"
            />
            <FieldBox
              value={String(form.preferences ?? "")}
              onChange={(value) => onChange({ preferences: value })}
              rows={3}
              placeholder="우대 사항이 파싱된 정보가 뜨는 공간입니다."
            />
          </section>
        </div>
      </div>
    </div>
  );
}
