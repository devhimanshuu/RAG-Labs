/**
 * Deterministic clock for mock data.
 *
 * Every mock timestamp is derived from a fixed anchor instead of `Date.now()`.
 * Without this, server rendering and client hydration would disagree on
 * relative labels ("2h ago") and React would warn about a mismatch. Phase 2 can
 * delete this file once timestamps come from the API.
 */
export const MOCK_NOW = "2026-09-28T09:00:00.000Z";

export const MOCK_NOW_DATE = new Date(MOCK_NOW);

/** ISO timestamp a given offset before the mock anchor. */
export function ago({
  days = 0,
  hours = 0,
  minutes = 0,
}: { days?: number; hours?: number; minutes?: number } = {}): string {
  const ms = ((days * 24 + hours) * 60 + minutes) * 60 * 1000;
  return new Date(MOCK_NOW_DATE.getTime() - ms).toISOString();
}

/**
 * Relative label anchored to {@link MOCK_NOW} rather than the real clock.
 * Swap for a live relative-time hook when real data lands.
 */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const seconds = Math.round((then - MOCK_NOW_DATE.getTime()) / 1000);
  const absolute = Math.abs(seconds);
  if (absolute < 45) return "just now";

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  const formatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  for (const [unit, divisor] of units) {
    if (absolute >= divisor) {
      return formatter.format(Math.round(seconds / divisor), unit);
    }
  }
  return formatter.format(seconds, "second");
}
