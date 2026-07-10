"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { JobPosting } from "@/lib/types";
import { MainHeader } from "../layout/MainHeader";
import { FilterBar } from "./FilterBar";
import { JobCard } from "./JobCard";
import { JobDetailModal } from "../job-detail/JobDetailModal";
import { Modal, ModalButton } from "../ui/Modal";
import { Spinner } from "../ui/Spinner";
import { getParseFailureMessage } from "@/lib/parseFailureMessage";

interface JobListPageProps {
  tag?: string;
}

export function JobListPage({ tag }: JobListPageProps) {
  const queryClient = useQueryClient();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [excludeExpired, setExcludeExpired] = useState(false);
  const [sort, setSort] = useState("saved_at_desc");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [parseLoading, setParseLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JobPosting | null>(null);
  const [parseFailJob, setParseFailJob] = useState<JobPosting | null>(null);
  const [networkError, setNetworkError] = useState(false);

  const queryKey = ["jobs", tag, selectedKeywords, excludeExpired, sort];

  const { data: jobs = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams();
      if (tag) params.set("tag", tag);
      if (excludeExpired) params.set("excludeExpired", "true");
      params.set("sort", sort);
      selectedKeywords.forEach((k) => params.append("keywords", k));
      return apiFetch<JobPosting[]>(`/jobs?${params.toString()}`);
    },
  });

  const { data: jobsForKeywords = [] } = useQuery({
    queryKey: ["jobs", "keyword-source", tag, excludeExpired, sort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (tag) params.set("tag", tag);
      if (excludeExpired) params.set("excludeExpired", "true");
      params.set("sort", sort);
      return apiFetch<JobPosting[]>(`/jobs?${params.toString()}`);
    },
  });

  const { data: allKeywords = [] } = useQuery({
    queryKey: ["keywords"],
    queryFn: () => apiFetch<string[]>("/jobs/keywords"),
  });

  const keywordOptions = useMemo(() => {
    const set = new Set<string>();
    for (const kw of allKeywords) {
      if (kw.trim()) set.add(kw);
    }
    for (const job of jobsForKeywords) {
      for (const kw of job.competency_keywords ?? []) {
        if (typeof kw === "string" && kw.trim()) set.add(kw);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, "ko"));
  }, [allKeywords, jobsForKeywords]);

  const handleParse = useCallback(
    async (url: string) => {
      setParseLoading(true);
      setNetworkError(false);
      try {
        const result = await apiFetch<{ job: JobPosting; parseResult: string }>(
          "/jobs/parse",
          { method: "POST", body: JSON.stringify({ url }) }
        );
        await queryClient.invalidateQueries({ queryKey: ["jobs"] });
        await queryClient.invalidateQueries({ queryKey: ["keywords"] });

        if (result.parseResult === "fail") {
          setParseFailJob(result.job);
        } else {
          setSelectedJob(result.job);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status < 500) throw err;
        }
        setNetworkError(true);
      } finally {
        setParseLoading(false);
      }
    },
    [queryClient]
  );

  async function confirmDelete() {
    if (!deleteTarget) return;
    await apiFetch(`/jobs/${deleteTarget.id}`, { method: "DELETE" });
    await queryClient.invalidateQueries({ queryKey: ["jobs"] });
    setDeleteTarget(null);
    if (selectedJob?.id === deleteTarget.id) setSelectedJob(null);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader
        onSubmit={handleParse}
        loading={parseLoading}
        variant={tag ? "tag" : "all"}
      />

      <FilterBar
        allKeywords={keywordOptions}
        selectedKeywords={selectedKeywords}
        onKeywordsChange={setSelectedKeywords}
        excludeExpired={excludeExpired}
        onExcludeExpiredChange={setExcludeExpired}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="flex-1 overflow-y-auto px-10 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : jobs.length === 0 ? (
          <div className="relative flex flex-col items-center py-16">
            <p className="text-lg font-medium text-dd-black">
              {tag ? "이 탭에 등록된 공고가 없어요." : "첫 채용공고를 등록해 보세요!"}
            </p>
            {!tag && (
              <div
                className="absolute -top-4 right-[20%] hidden text-dd-gray-500 lg:block"
                aria-hidden
              >
                <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
                  <path
                    d="M10 50 Q40 10 70 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrow)"
                  />
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="6"
                      markerHeight="6"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L6,3 L0,6" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onOpen={setSelectedJob}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {parseLoading && (
        <Modal open title="로딩 중" onClose={() => {}} variant="loading">
          <p>
            공고 내용을 가져오는 중이에요! 공고 내용이 완전하지 않을 수 있어요.
            확인 후 수정해서 저장해 보세요.
          </p>
        </Modal>
      )}

      <Modal
        open={!!parseFailJob}
        title="안내"
        onClose={() => setParseFailJob(null)}
        variant="parse-fail"
        actions={
          <>
            <ModalButton
              variant="primary"
              onClick={() => {
                setSelectedJob(parseFailJob);
                setParseFailJob(null);
              }}
            >
              진행하기
            </ModalButton>
            <ModalButton
              variant="outline"
              onClick={() => setParseFailJob(null)}
            >
              취소
            </ModalButton>
          </>
        }
      >
        <p>
          {getParseFailureMessage(parseFailJob?.parse_failure_reason)}
          {" "}수동 입력으로 진행하시겠어요?
        </p>
      </Modal>

      <Modal
        open={!!deleteTarget}
        title="삭제 안내"
        onClose={() => setDeleteTarget(null)}
        variant="confirm-delete"
        actions={
          <>
            <ModalButton variant="danger" onClick={confirmDelete}>
              삭제하기
            </ModalButton>
            <ModalButton
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </ModalButton>
          </>
        }
      >
        <p>삭제하시겠어요?</p>
      </Modal>

      <Modal
        open={networkError}
        title="안내"
        onClose={() => setNetworkError(false)}
        variant="error"
        actions={
          <ModalButton
            variant="outline"
            onClick={() => setNetworkError(false)}
          >
            닫기
          </ModalButton>
        }
      >
        <p>인터넷 연결을 확인하고 다시 시도해 주세요.</p>
      </Modal>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdated={(updated) => {
            setSelectedJob(updated);
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            queryClient.invalidateQueries({ queryKey: ["keywords"] });
          }}
          onDeleted={() => {
            setSelectedJob(null);
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
          }}
        />
      )}
    </div>
  );
}
