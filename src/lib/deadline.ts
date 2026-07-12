// 마감일 필드는 yy-mm-dd(숫자) 형식으로 입력/표시하고,
// 내부 저장값(deadline_date)은 YYYY-MM-DD로 유지한다. (JD-DP-INS-08)

/** "2026-07-15" -> "26-07-15" (없으면 빈 문자열) */
export function isoToYymmdd(iso: string | null | undefined): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  return `${m[1].slice(2)}-${m[2]}-${m[3]}`;
}

/** 사용자 입력에서 숫자만 남겨 yy-mm-dd 형태로 마스킹 (최대 6자리) */
export function maskYymmdd(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 6);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)].filter(
    Boolean
  );
  return parts.join("-");
}

/** "26-07-15" -> "2026-07-15" (유효한 날짜일 때만, 아니면 null) */
export function yymmddToIso(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 6) return null;

  const year = 2000 + Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const day = Number(digits.slice(4, 6));

  if (month < 1 || month > 12) return null;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
