import type { DeadlineStatus } from "./types";

/**
 * 상시/수시채용 등 마감일 없는 공고인지.
 * - '채용시 마감'/'충원시'는 상시채용 체크 대상이 아님 (P0 오류 케이스).
 */
export function isAlwaysOpenDeadline(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;

  if (
    /채용\s*시\s*(마감|까지)?|충원\s*시/.test(trimmed) &&
    !/상시|수시/.test(trimmed)
  ) {
    return false;
  }

  return (
    /상시\s*채용|수시\s*채용|상시채용|수시채용/.test(trimmed) ||
    /마감일\s*[:：]\s*상시/.test(trimmed) ||
    /상시\s*채용중/.test(trimmed) ||
    /~\s*상시\b/.test(trimmed) ||
    /(?:^|[\s·,])상시(?:$|[\s·,])/.test(trimmed) ||
    /(?:^|[\s·,])수시(?:$|[\s·,])/.test(trimmed)
  );
}

export function isPastDeadline(date: string | null | undefined): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(date);
  if (Number.isNaN(deadline.getTime())) return false;
  deadline.setHours(0, 0, 0, 0);
  return deadline.getTime() < today.getTime();
}

/** 저장된 status가 없을 때 파싱 정책에 맞춰 체크박스 상태 유도 */
export function deriveDeadlineStatus(
  deadlineRaw: string,
  deadlineDate: string | null,
  deadlineStatus: DeadlineStatus
): DeadlineStatus {
  if (deadlineStatus === "always_open" || deadlineStatus === "closed") {
    return deadlineStatus;
  }
  if (isAlwaysOpenDeadline(deadlineRaw)) return "always_open";
  if (isPastDeadline(deadlineDate)) return "closed";
  return null;
}
