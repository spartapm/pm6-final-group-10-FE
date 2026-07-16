"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AssetImage } from "@/components/ui/AssetImage";
import { apiFetch, ApiError } from "@/lib/api-client";
import { assets } from "@/lib/assets";
import { keywordTexts } from "@/lib/keywords";
import type { JobPosting, Profile } from "@/lib/types";
import { HeaderArea } from "../layout/HeaderArea";
import { TabGNB } from "../layout/GNB";
import { FilterBar } from "./FilterBar";
import { JobCard } from "./JobCard";
import { JobDetailModal } from "../job-detail/JobDetailModal";
import { Modal, ModalButton } from "../ui/Modal";
import { Spinner } from "../ui/Spinner";
import { getParseFailureMessage } from "@/lib/parseFailureMessage";
import { OnboardingModal } from "../onboarding/OnboardingModal";

interface JobListPageProps {
  folderId?: string;
  uncategorized?: boolean;
}

export function JobListPage({ folderId, uncategorized }: JobListPageProps) {
  const queryClient = useQueryClient();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [excludeExpired, setExcludeExpired] = useState(false);
  const [sort, setSort] = useState("saved_at_desc");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [parseLoading, setParseLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JobPosting | null>(null);
  const [parseFailJob, setParseFailJob] = useState<JobPosting | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiFetch<Profile>("/profile"),
  });

  const queryKey = ["jobs", folderId, uncategorized, selectedKeywords, excludeExpired, sort];

  const { data: jobs = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams();
      if (folderId) params.set("folderId", folderId);
      if (uncategorized) params.set("uncategorized", "true");
      if (excludeExpired) params.set("excludeExpired", "true");
      params.set("sort", sort);
      selectedKeywords.forEach((k) => params.append("keywords", k));
      return apiFetch<JobPosting[]>(`/jobs?${params.toString()}`);
    },
  });

  const { data: jobsForKeywords = [] } = useQuery({
    queryKey: ["jobs", "keyword-source", folderId, uncategorized, excludeExpired, sort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (folderId) params.set("folderId", folderId);
      if (uncategorized) params.set("uncategorized", "true");
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
      for (const kw of keywordTexts(job.competency_keywords)) {
        if (kw.trim()) set.add(kw);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, "ko"));
  }, [allKeywords, jobsForKeywords]);

  const handleParse = useCallback(
    async (url: string, selectedFolderId: string | null) => {
      setParseLoading(true);
      setNetworkError(false);
      try {
        const result = await apiFetch<{ job: JobPosting; parseResult: string }>(
          "/jobs/parse",
          {
            method: "POST",
            body: JSON.stringify({ url, folder_id: selectedFolderId }),
          }
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

  useEffect(() => {
    if (profile && !profile.onboarding_completed_at) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const emptyMessage = uncategorized
    ? "미분류 공고가 없어요."
    : folderId
      ? "이 폴더에 등록된 공고가 없어요."
      : "첫 채용공고를 등록해 보세요!";

  const showEmptyIllustration = !folderId && !uncategorized && jobs.length === 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <HeaderArea onSubmit={handleParse} loading={parseLoading} />
      <TabGNB />

      <FilterBar
        allKeywords={keywordOptions}
        selectedKeywords={selectedKeywords}
        onKeywordsChange={setSelectedKeywords}
        excludeExpired={excludeExpired}
        onExcludeExpiredChange={setExcludeExpired}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="flex-1 overflow-y-auto bg-dd-gray-100 px-20 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : jobs.length === 0 ? (
          showEmptyIllustration ? (
            // Figma 907:9030 — 전체보기 0건: 3단 가이드 일러스트만
            <div className="flex justify-center">
              <AssetImage
                src={assets.listEmpty}
                alt="사람인·잡코리아에서 URL을 복사해오세요. 저장하기 전 목적 태그로 분류하세요. 목적에 맞게 분류하고 조회하세요."
                width={1042}
                height={253}
                className="h-auto w-full max-w-[1042px] object-contain"
                placeholderClassName="h-[253px] w-full max-w-[1042px] rounded bg-dd-gray-200"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-24">
              <p className="text-base font-medium text-dd-gray-500">
                {emptyMessage}
              </p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,252px)] justify-start gap-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onOpen={setSelectedJob}
                onDelete={setDeleteTarget}
                selectedKeywords={selectedKeywords}
              />
            ))}
          </div>
        )}
      </div>

      {parseLoading && (
        <Modal open title="로딩 중" onClose={() => { }} variant="loading">
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
            <ModalButton variant="outline" onClick={() => setParseFailJob(null)}>
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
        title="안내"
        onClose={() => setDeleteTarget(null)}
        variant="confirm-delete"
        actions={
          <>
            <ModalButton variant="danger" onClick={confirmDelete}>
              삭제하기
            </ModalButton>
            <ModalButton variant="outline" onClick={() => setDeleteTarget(null)}>
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
          <ModalButton variant="outline" onClick={() => setNetworkError(false)}>
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

      <OnboardingModal
        open={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }}
      />
    </div>
  );
}
