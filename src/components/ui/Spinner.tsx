interface SpinnerProps {
  className?: string;
  /** 1회전 시간(ms). 기본 800ms (linear). */
  durationMs?: number;
}

/**
 * 원형 링 스피너 — 일부 호(arc)만 채움, 시계방향 연속 회전.
 * 색상은 currentColor 기준(전경 = 텍스트색, 트랙 = 동일색 저투명도).
 */
export function Spinner({
  className = "size-8",
  durationMs = 800,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="로딩 중"
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current/30 border-t-current ${className}`}
      style={{
        animationDuration: `${durationMs}ms`,
        animationTimingFunction: "linear",
      }}
    />
  );
}
