"use client";

import { useEffect, useRef, useState } from "react";
import type { JobPosting, StructuredKeyword } from "@/lib/types";
import { isoToYymmdd, maskYymmdd, yymmddToIso } from "@/lib/deadline";
import { groupKeywords } from "@/lib/keywords";
import { KEYWORD_SECTIONS } from "@/lib/constants";
import { assets } from "@/lib/assets";
import { AssetImage } from "@/components/ui/AssetImage";

interface InsightTabProps {
  form: JobPosting;
  onChange: (updates: Partial<JobPosting>) => void;
  onRegisterKeywordApply?: (fn: () => StructuredKeyword[] | null) => void;
}

const SECTION_DISPLAY: Record<string, string> = {
  자격요건: "자격 요건",
  우대사항: "우대 사항",
  기타: "기타",
};

function SectionLabel({
  iconSrc,
  label,
  action,
}: {
  iconSrc: string;
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-1">
      <AssetImage
        src={iconSrc}
        alt=""
        width={16}
        height={16}
        placeholderClassName="bg-transparent"
      />
      <span className="text-sm font-semibold tracking-[-0.154px] text-dd-black">
        {label}
      </span>
      {action}
    </div>
  );
}

const FIELD_CLASS =
  "w-full resize-none bg-white px-3 py-2 text-sm leading-[1.5] tracking-[-0.154px] text-dd-black outline-none placeholder:text-dd-gray-500";

function AutoGrowTextarea({
  value,
  onChange,
  minRows = 1,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
  placeholder?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={minRows}
      placeholder={placeholder}
      disabled={disabled}
      className={`${FIELD_CLASS} overflow-hidden disabled:opacity-60`}
    />
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
  if (rows > 1) {
    return (
      <AutoGrowTextarea
        value={value}
        onChange={onChange}
        minRows={rows}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={FIELD_CLASS}
    />
  );
}

const INFO_LABEL_WIDTH = "w-[76px]";

function InfoRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`${INFO_LABEL_WIDTH} shrink-0 text-sm font-semibold tracking-[-0.154px] text-dd-black`}
      >
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-white px-1.5 py-0.5 text-sm tracking-[-0.154px] text-dd-black outline-none placeholder:text-dd-gray-500"
      />
    </div>
  );
}

function DeadlineChecks({
  deadlineStatus,
  onChange,
  onStatusChange,
}: {
  deadlineStatus: JobPosting["deadline_status"];
  onChange: (iso: string | null) => void;
  onStatusChange: (status: JobPosting["deadline_status"]) => void;
}) {
  return (
    <>
      <label className="flex items-center gap-[5px] text-sm font-medium text-dd-black">
        <input
          type="checkbox"
          checked={deadlineStatus === "always_open"}
          onChange={(e) => {
            if (e.target.checked) {
              onStatusChange("always_open");
              onChange(null);
            } else {
              onStatusChange(null);
            }
          }}
          className="size-5 accent-dd-black"
        />
        상시채용
      </label>
      <label className="flex items-center gap-[5px] text-sm font-medium text-dd-black">
        <input
          type="checkbox"
          checked={deadlineStatus === "closed"}
          onChange={(e) => {
            if (e.target.checked) {
              onStatusChange("closed");
              onChange(null);
            } else {
              onStatusChange(null);
            }
          }}
          className="size-5 accent-dd-black"
        />
        마감
      </label>
    </>
  );
}

function DeadlineRow({
  label,
  value,
  deadlineStatus,
  onChange,
  onStatusChange,
}: {
  label: string;
  value: string | null;
  deadlineStatus: JobPosting["deadline_status"];
  onChange: (iso: string | null) => void;
  onStatusChange: (status: JobPosting["deadline_status"]) => void;
}) {
  const [text, setText] = useState(() => isoToYymmdd(value));
  const dateDisabled =
    deadlineStatus === "always_open" || deadlineStatus === "closed";

  useEffect(() => {
    setText(isoToYymmdd(value));
  }, [value]);

  function handleChange(raw: string) {
    const masked = maskYymmdd(raw);
    setText(masked);

    if (masked === "") {
      onChange(null);
      return;
    }
    const iso = yymmddToIso(masked);
    if (iso) onChange(iso);
  }

  const invalid =
    !dateDisabled &&
    text.replace(/\D/g, "").length === 6 &&
    !yymmddToIso(text);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className={`${INFO_LABEL_WIDTH} shrink-0 text-sm font-semibold tracking-[-0.154px] text-dd-black`}
        >
          {label}
        </span>
        <div className="min-w-0 flex-1">
          <input
            type="text"
            inputMode="numeric"
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="YY-MM-DD"
            maxLength={8}
            disabled={dateDisabled}
            className="w-full bg-white px-1.5 py-0.5 text-sm tracking-[-0.154px] text-dd-black outline-none placeholder:text-dd-gray-500 disabled:opacity-60"
          />
          {invalid && (
            <p className="mt-0.5 text-[10px] text-dd-error">
              yy-mm-dd 형식으로 입력해 주세요.
            </p>
          )}
        </div>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <DeadlineChecks
            deadlineStatus={deadlineStatus}
            onChange={onChange}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 pl-[84px] md:hidden">
        <DeadlineChecks
          deadlineStatus={deadlineStatus}
          onChange={onChange}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}

function parseKeywordInput(input: string): StructuredKeyword[] | null {
  const next = input
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  if (next.length > 30 || next.some((k) => k.length > 20)) {
    return null;
  }

  return next.map((text, order) => ({
    text,
    source_section: "기타" as const,
    order,
    source: "user" as const,
  }));
}

export function InsightTab({
  form,
  onChange,
  onRegisterKeywordApply,
}: InsightTabProps) {
  const [editingKeywords, setEditingKeywords] = useState(false);
  const [keywordInput, setKeywordInput] = useState(
    (form.competency_keywords ?? []).map((k) => k.text).join(", ")
  );
  const [keywordError, setKeywordError] = useState(false);

  const groups = groupKeywords(form.competency_keywords ?? []);

  useEffect(() => {
    if (!onRegisterKeywordApply) return;
    onRegisterKeywordApply(() => {
      if (!editingKeywords) return null;
      const parsed = parseKeywordInput(keywordInput);
      if (!parsed) {
        setKeywordError(true);
        return null;
      }
      setKeywordError(false);
      return parsed;
    });
  }, [editingKeywords, keywordInput, onRegisterKeywordApply]);

  function saveKeywords() {
    const parsed = parseKeywordInput(keywordInput);
    if (!parsed) {
      setKeywordError(true);
      return;
    }
    setKeywordError(false);
    onChange({ competency_keywords: parsed });
    setEditingKeywords(false);
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-col gap-1 border-b border-t border-dd-gray-400 bg-white px-[18px] py-4 md:flex-row md:items-center md:gap-2 md:px-9">
        <h3 className="text-xl font-semibold tracking-[-0.22px] text-dd-black">
          채용 공고
        </h3>
        <p className="text-xs tracking-[-0.132px] text-dd-gray-500">
          저장된 텍스트는 해당 영역을 클릭해 수정이 가능합니다.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-dd-gray-100">
        <div className="grid grid-cols-1 items-start md:grid-cols-2">
          <div className="flex flex-col gap-7 self-stretch px-[18px] py-[18px] md:pl-9 md:pr-[18px]">
            <section>
              <SectionLabel
                iconSrc={assets.iconDetailBriefcase}
                label="모집 분야"
              />
              <FieldBox
                value={String(form.recruitment_field ?? "")}
                onChange={(value) =>
                  onChange({ recruitment_field: value, job_title: value })
                }
                placeholder="모집 분야를 인식하지 못했어요. 직접 입력해 주세요."
              />
            </section>

            <section>
              <SectionLabel
                iconSrc={assets.iconDetailSparkles}
                label="AI 추출 - 핵심 역량키워드"
                action={
                  !editingKeywords ? (
                    <button
                      type="button"
                      onClick={() => {
                        setKeywordInput(
                          (form.competency_keywords ?? [])
                            .map((k) => k.text)
                            .join(", ")
                        );
                        setEditingKeywords(true);
                      }}
                      className="ml-1 border-b border-dd-gray-500 text-xs tracking-[-0.132px] text-dd-gray-500"
                    >
                      편집하기
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={saveKeywords}
                      className="ml-1 text-xs font-medium text-dd-primary-green"
                    >
                      적용
                    </button>
                  )
                }
              />

              {editingKeywords ? (
                <>
                  <AutoGrowTextarea
                    value={keywordInput}
                    onChange={setKeywordInput}
                    minRows={2}
                    placeholder="역량키워드, 역량키워드..."
                  />
                  <p
                    className={`mt-1 text-[10px] ${
                      keywordError ? "text-dd-error" : "text-dd-gray-500"
                    }`}
                  >
                    키워드는 공백 포함 한글 15자, 영어 20자, 전체 키워드는 30개로
                    제한됩니다.
                  </p>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  {KEYWORD_SECTIONS.map((section) => {
                    const items = groups[section];
                    if (!items.length) return null;
                    return (
                      <div key={section} className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-dd-black">
                          {SECTION_DISPLAY[section] ?? section}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {items.map((kw) => (
                            <span
                              key={`${section}-${kw.text}-${kw.order}`}
                              className="inline-flex items-center justify-center rounded-full bg-dd-black px-3 py-1 text-xs font-medium leading-[1.5] tracking-[-0.132px] text-white"
                            >
                              {kw.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <SectionLabel
                iconSrc={assets.iconDetailBuilding}
                label="기업 · 공고 정보"
              />
              <div className="flex flex-col gap-1">
                <InfoRow
                  label="기업 이름"
                  value={String(form.company_name ?? "")}
                  onChange={(value) => onChange({ company_name: value })}
                  placeholder="기업 이름이 파싱된 정보가 뜨는 공간입니다."
                />
                <InfoRow
                  label="업종"
                  value={String(form.industry ?? "")}
                  onChange={(value) => onChange({ industry: value })}
                  placeholder="업종이 파싱된 정보가 뜨는 공간입니다."
                />
                <DeadlineRow
                  label="공고 마감일"
                  value={form.deadline_date ?? null}
                  deadlineStatus={form.deadline_status}
                  onChange={(iso) => onChange({ deadline_date: iso })}
                  onStatusChange={(status) =>
                    onChange({ deadline_status: status })
                  }
                />
              </div>
            </section>

            <section>
              <SectionLabel
                iconSrc={assets.iconDetailFile}
                label="접수 서류"
              />
              <FieldBox
                value={String(form.required_documents ?? "")}
                onChange={(value) => onChange({ required_documents: value })}
                placeholder="접수 서류를 인식하지 못했어요. 직접 입력해 주세요."
              />
            </section>

            <section>
              <SectionLabel
                iconSrc={assets.iconDetailSend}
                label="지원 방법"
              />
              <FieldBox
                value={String(form.application_method ?? "")}
                onChange={(value) => onChange({ application_method: value })}
                placeholder="지원 방법을 인식하지 못했어요. 직접 입력해 주세요."
              />
            </section>
          </div>

          <div className="flex flex-col gap-7 self-stretch px-[18px] py-[18px] md:pl-[18px] md:pr-9">
            <section>
              <SectionLabel
                iconSrc={assets.iconDetailFile}
                label="담당 업무"
              />
              <FieldBox
                value={String(form.job_description ?? "")}
                onChange={(value) => onChange({ job_description: value })}
                rows={3}
                placeholder="담당 업무를 인식하지 못했어요. 직접 입력해 주세요."
              />
            </section>

            <section>
              <SectionLabel
                iconSrc={assets.iconDetailUser}
                label="자격 요건"
              />
              <FieldBox
                value={String(form.qualifications ?? "")}
                onChange={(value) => onChange({ qualifications: value })}
                rows={2}
                placeholder="자격 요건을 인식하지 못했어요. 직접 입력해 주세요."
              />
            </section>

            <section>
              <SectionLabel
                iconSrc={assets.iconDetailPin}
                label="우대 사항"
              />
              <FieldBox
                value={String(form.preferences ?? "")}
                onChange={(value) => onChange({ preferences: value })}
                rows={3}
                placeholder="우대 사항을 인식하지 못했어요. 직접 입력해 주세요."
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
