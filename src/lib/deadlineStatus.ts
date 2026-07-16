import type { DeadlineStatus } from "./types";

/** 상시/수시채용 등 마감일 없는 공고인지 */
export function isAlwaysOpenDeadline(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  return /상시|수시|채용\s*시|충원\s*시|채용시\s*마감/.test(trimmed);
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
