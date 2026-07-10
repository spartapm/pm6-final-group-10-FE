import { JobListPage } from "@/components/jobs/JobListPage";

const VALID_TAGS = ["지원예정", "직무분석", "관심기업", "기타"];

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  if (!VALID_TAGS.includes(decoded)) {
    return (
      <div className="p-8 text-center text-gray-500">유효하지 않은 태그입니다.</div>
    );
  }

  return <JobListPage tag={decoded} />;
}
