import { redirect } from "next/navigation";
import { JobListPage } from "@/components/jobs/JobListPage";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;

  if (folderId === "etc") {
    return <JobListPage uncategorized />;
  }

  return <JobListPage folderId={folderId} />;
}
