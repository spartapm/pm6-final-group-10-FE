export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const CS_EMAIL = "choigudahm@gmail.com";

export const FOLDER_SLOT_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: "#63CCCA", text: "#18181B" },
  2: { bg: "#32A287", text: "#FFFFFF" },
  3: { bg: "#82D173", text: "#18181B" },
  4: { bg: "#94E8B4", text: "#18181B" },
  5: { bg: "#397367", text: "#FFFFFF" },
};

export const SORT_OPTIONS = [
  { value: "saved_at_desc", label: "저장일 내림차순" },
  { value: "saved_at_asc", label: "저장일 오름차순" },
  { value: "company_asc", label: "기업명 오름차순" },
  { value: "company_desc", label: "기업명 내림차순" },
  { value: "deadline_asc", label: "마감일 오름차순" },
  { value: "deadline_desc", label: "마감일 내림차순" },
] as const;

export const KEYWORD_SECTIONS = ["자격요건", "우대사항", "기타"] as const;
