import { redirect } from "next/navigation";

export default async function LegacyTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  if (decoded === "기타") {
    redirect("/folders/etc");
  }

  redirect("/all");
}
