export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const PURPOSE_TAGS = [
  { value: "지원예정", label: "지원예정", bg: "#32A287", text: "#FFFFFF" },
  { value: "직무분석", label: "직무분석", bg: "#A9FDAC", text: "#18181B" },
  { value: "관심기업", label: "관심기업", bg: "#F1FFE7", text: "#18181B" },
  { value: "기타", label: "기타", bg: "#95959C", text: "#FFFFFF" },
] as const;

export const TAG_ROUTES = [
  { href: "/all", label: "전체보기" },
  { href: "/tags/지원예정", label: "지원예정" },
  { href: "/tags/직무분석", label: "직무분석" },
  { href: "/tags/관심기업", label: "관심기업" },
  { href: "/tags/기타", label: "기타" },
] as const;

export const SORT_OPTIONS = [
  { value: "saved_at_desc", label: "저장일 내림차순" },
  { value: "saved_at_asc", label: "저장일 오름차순" },
  { value: "company_asc", label: "기업명 오름차순" },
  { value: "company_desc", label: "기업명 내림차순" },
  { value: "deadline_asc", label: "마감일 오름차순" },
  { value: "deadline_desc", label: "마감일 내림차순" },
] as const;

export type PurposeTag = (typeof PURPOSE_TAGS)[number]["value"];
