import posthog from "posthog-js";

/** PostHog 클라이언트 이벤트. 미설정/미로드 시 no-op. */
export function captureEvent(
  eventName: string,
  properties: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;
  posthog.capture(eventName, properties);
}
