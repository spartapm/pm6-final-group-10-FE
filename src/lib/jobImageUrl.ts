export function getJobImageUrl(storagePath: string): string {
  if (!storagePath) return "";
  // API에서 signed URL / data URL로 내려오면 그대로 사용
  if (storagePath.startsWith("data:") || storagePath.startsWith("http")) {
    return storagePath;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!supabaseUrl) return "";

  return `${supabaseUrl}/storage/v1/object/public/job-images/${storagePath}`;
}
