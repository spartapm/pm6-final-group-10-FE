const PARSE_FAILURE_MESSAGES: Record<string, string> = {
  not_found: "공고를 찾을 수 없어요. URL이 맞는지 확인해 주세요.",
  login_required: "로그인이 필요한 페이지예요. 공개된 채용공고 URL을 사용해 주세요.",
  timeout:
    "공고를 불러오는 데 시간이 오래 걸렸어요. 채용공고 상세 페이지 URL인지 확인해 주세요.",
  blocked: "사이트에서 접근을 차단했어요. 다른 공고 URL을 시도해 주세요.",
  partial_fields: "일부 항목만 가져왔어요. 수동으로 확인·수정해 주세요.",
  parse_error: "채용공고 상세 페이지 URL인지 확인해 주세요. 검색·목록 페이지는 지원하지 않아요.",
};

export function getParseFailureMessage(reason: string | null | undefined): string {
  if (!reason) return PARSE_FAILURE_MESSAGES.parse_error;
  return PARSE_FAILURE_MESSAGES[reason] ?? PARSE_FAILURE_MESSAGES.parse_error;
}
