import type { DeadlineStatus } from "./types";

export function getDdayLabel(
  deadlineDate: string | null,
  deadlineStatus?: DeadlineStatus
): {
  label: string;
  urgent: boolean;
  expired: boolean;
} {
  if (deadlineStatus === "always_open") {
    return { label: "상시채용", urgent: false, expired: false };
  }

  if (deadlineStatus === "closed") {
    return { label: "마감", urgent: false, expired: true };
  }

  if (!deadlineDate) {
    return { label: "", urgent: false, expired: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineDate);
  deadline.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff < 0) {
    return { label: "마감", urgent: false, expired: true };
  }

  if (diff === 0) {
    return { label: "D-0", urgent: true, expired: false };
  }

  return {
    label: `D-${diff}`,
    urgent: diff <= 7,
    expired: false,
  };
}
