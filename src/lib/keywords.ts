import type { StructuredKeyword } from "./types";

export function keywordTexts(keywords: StructuredKeyword[] | undefined): string[] {
  return (keywords ?? []).map((k) => k.text).filter(Boolean);
}

export function parseKeywords(value: unknown): StructuredKeyword[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item === "string") {
        const text = item.trim();
        if (!text) return null;
        return {
          text,
          source_section: "기타" as const,
          order: index,
          source: "llm" as const,
        };
      }
      if (item && typeof item === "object" && "text" in item) {
        const raw = item as Partial<StructuredKeyword>;
        const text = String(raw.text ?? "").trim();
        if (!text) return null;
        const section = raw.source_section;
        const sourceSection =
          section === "자격요건" || section === "우대사항" || section === "기타"
            ? section
            : "기타";
        return {
          text,
          source_section: sourceSection,
          order: typeof raw.order === "number" ? raw.order : index,
          source: raw.source === "user" ? "user" : "llm",
        };
      }
      return null;
    })
    .filter((item): item is StructuredKeyword => item !== null);
}

export function groupKeywords(keywords: StructuredKeyword[]) {
  const groups: Record<string, StructuredKeyword[]> = {
    자격요건: [],
    우대사항: [],
    기타: [],
  };

  for (const kw of keywords) {
    groups[kw.source_section]?.push(kw);
  }

  for (const section of Object.keys(groups)) {
    groups[section].sort((a, b) => a.order - b.order || a.text.localeCompare(b.text, "ko"));
  }

  return groups;
}

export function keywordsForCardDisplay(
  keywords: StructuredKeyword[],
  selectedKeywords: string[] = []
) {
  const groups = groupKeywords(keywords);
  const ordered = [
    ...groups["자격요건"],
    ...groups["우대사항"],
    ...groups["기타"],
  ].map((k) => k.text);

  if (selectedKeywords.length === 0) {
    return ordered.slice(0, 6);
  }

  const onCard = new Set(ordered);
  // 필터바 선택 순서 유지 + 이 카드에 실제 있는 키워드만
  const matched = selectedKeywords.filter((kw) => onCard.has(kw));
  const matchedSet = new Set(matched);
  const rest = ordered.filter((kw) => !matchedSet.has(kw));

  return [...matched, ...rest].slice(0, 6);
}

export function koThenEnCompare(a: string, b: string): number {
  const aKo = /^[가-힣]/.test(a);
  const bKo = /^[가-힣]/.test(b);
  if (aKo !== bKo) return aKo ? -1 : 1;
  return a.localeCompare(b, "ko", { sensitivity: "base" });
}
