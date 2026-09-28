import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Human-readable duration.
 *
 * RAG pipelines report latencies from sub-millisecond reranking to multi-second
 * generation, so the unit is chosen per value instead of once per column.
 */
export function formatDuration(milliseconds: number): string {
  if (!Number.isFinite(milliseconds)) return "—";
  if (milliseconds < 1) return `${milliseconds.toFixed(2)}ms`;
  if (milliseconds < 1000) return `${Math.round(milliseconds)}ms`;
  return `${(milliseconds / 1000).toFixed(2)}s`;
}

/** Compact integer formatting: 4284 -> "4,284", 1200000 -> "1.2M". */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US");
}

export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < 1000) return String(value);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Token counts are always shown with grouping so columns line up. */
export function formatTokens(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1_000_000) return `${formatCompactNumber(value)}`;
  return formatNumber(value);
}

/**
 * Normalised score display. All retrieval metrics are stored as 0..1 ratios.
 * `digits` keeps a fixed column width in tables and metric cards.
 */
export function formatScore(ratio: number, digits = 3): string {
  if (!Number.isFinite(ratio)) return "—";
  return ratio.toFixed(digits);
}

/** Ratios are shown as percentages in dashboards and tooltips. */
export function formatPercent(ratio: number, digits = 1): string {
  if (!Number.isFinite(ratio)) return "—";
  return `${(ratio * 100).toFixed(digits)}%`;
}

/** Signed delta for trend indicators: "+8.2%", "-1.4%". */
export function formatDelta(ratio: number, digits = 1): string {
  const sign = ratio > 0 ? "+" : "";
  return `${sign}${(ratio * 100).toFixed(digits)}%`;
}

/** Cost per million tokens, e.g. "$0.15". */
export function formatCostPerMillion(usd: number): string {
  if (!Number.isFinite(usd)) return "—";
  if (usd === 0) return "Free";
  return `$${usd < 1 ? usd.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : usd.toFixed(2)}`;
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

const relativeFormatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

/**
 * Relative timestamps ("2h ago"). Accepts an ISO string so mock data stays
 * serialisable and can be swapped for API payloads later.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "—";
  const seconds = Math.round((then.getTime() - now.getTime()) / 1000);
  if (Math.abs(seconds) < 45) return "just now";
  for (const [unit, divisor] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= divisor) {
      return relativeFormatter.format(Math.round(seconds / divisor), unit);
    }
  }
  return relativeFormatter.format(seconds, "second");
}

/** Absolute timestamp used in tooltips and detail panels. */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value >= 100 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
}

/** "24 documents" / "1 document" without a pluralisation dependency. */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Short, stable-looking identifier rendering: "8fa21c4e9b12" -> "8FA21". */
export function shortId(id: string, length = 5): string {
  return id.replace(/[^a-zA-Z0-9]/g, "").slice(0, length).toUpperCase();
}

/** Truncate long free text for table cells while keeping the tail readable. */
export function truncate(value: string, max = 72): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
