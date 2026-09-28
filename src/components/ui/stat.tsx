import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";

import { Sparkline } from "@/components/ui/sparkline";
import { formatCostPerMillion, formatDelta, formatDuration, formatNumber, formatPercent, formatScore } from "@/lib/utils";
import type { MetricDefinition } from "@/types";
import { cn } from "@/lib/utils";

/** Formats a MetricDefinition value according to its unit. */
export function formatMetricValue(metric: Pick<MetricDefinition, "value" | "unit">): string {
  switch (metric.unit) {
    case "ratio":
      return formatScore(metric.value, 3);
    case "duration":
      return formatDuration(metric.value);
    case "currency":
      return formatCostPerMillion(metric.value);
    case "count":
    default:
      return formatNumber(metric.value);
  }
}

type Direction = "good" | "bad" | "flat";

/**
 * Interprets a delta. A falling latency is a good outcome, which is why the
 * metric carries `higherIsBetter` instead of the caller encoding the polarity.
 */
export function deltaDirection(metric: MetricDefinition): Direction {
  if (metric.delta === undefined || Math.abs(metric.delta) < 0.0005) return "flat";
  const higherIsBetter = metric.higherIsBetter ?? true;
  const improved = metric.delta > 0 === higherIsBetter;
  return improved ? "good" : "bad";
}

/** Colour encodes whether the movement is good; the arrow encodes direction. */
const DIRECTION_STYLES: Record<Direction, string> = {
  good: "text-success",
  bad: "text-danger",
  flat: "text-fg-muted",
};

/** Sparkline colour mirrors the delta verdict — green when improving. */
export function sparklineTone(
  metric: MetricDefinition,
): "success" | "danger" | "accent" {
  const direction = deltaDirection(metric);
  if (direction === "good") return "success";
  if (direction === "bad") return "danger";
  return "accent";
}

/** Compact inline delta, e.g. "+8.2%". */
export function DeltaIndicator({
  metric,
  className,
  showIcon = true,
}: {
  metric: MetricDefinition;
  className?: string;
  showIcon?: boolean;
}) {
  if (metric.delta === undefined) return null;

  const direction = deltaDirection(metric);
  // A falling latency is a good outcome: the number drops while the colour
  // turns green, which is why direction and verdict are tracked separately.
  const Icon =
    direction === "flat" ? Minus : metric.delta > 0 ? TrendingUp : TrendingDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 technical text-2xs",
        DIRECTION_STYLES[direction],
        className,
      )}
      title={`${formatDelta(metric.delta)} vs. previous window · ${
        direction === "good" ? "improvement" : direction === "bad" ? "regression" : "unchanged"
      }`}
    >
      {showIcon ? <Icon className="size-3" aria-hidden /> : null}
      {formatDelta(metric.delta)}
    </span>
  );
}

/**
 * Headline metric card: label, technical value, delta and an optional trend
 * sparkline. Used for retrieval quality scores on Dashboard and Evaluation.
 */
export function MetricCard({
  metric,
  className,
  children,
}: {
  metric: MetricDefinition;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group flex min-w-0 flex-col gap-2 rounded-lg border border-line bg-surface p-3.5 transition-colors hover:border-line-strong",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-xs font-medium text-fg-secondary">{metric.label}</span>
        <DeltaIndicator metric={metric} />
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="technical text-xl font-semibold leading-none tracking-tight text-fg">
          {formatMetricValue(metric)}
        </span>
        {metric.series && metric.series.length > 1 ? (
          <Sparkline
            values={metric.series}
            tone={sparklineTone(metric)}
            area
            className="h-6 w-16 shrink-0"
            aria-label={`${metric.label} trend`}
          />
        ) : null}
      </div>
      {metric.description ? (
        <p className="truncate text-2xs text-fg-muted" title={metric.description}>
          {metric.description}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/**
 * Single inline statistic. Denser than MetricCard — used in rows of four to six
 * under a panel header.
 */
export function Stat({
  label,
  value,
  hint,
  metric,
  icon: Icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  metric?: MetricDefinition;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="flex items-center gap-1.5 text-2xs font-medium uppercase tracking-wide text-fg-muted">
        {Icon ? <Icon className="size-3" aria-hidden /> : null}
        {label}
      </span>
      <span className="technical truncate text-base font-medium text-fg">{value}</span>
      {metric ? <DeltaIndicator metric={metric} /> : null}
      {hint ? <span className="truncate text-2xs text-fg-muted">{hint}</span> : null}
    </div>
  );
}

/** Retrieval-quality style score with a percentage caption. */
export function ScoreStat({
  label,
  score,
  description,
  className,
}: {
  label: string;
  score: number;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs text-fg-secondary">{label}</span>
      <span className="technical text-lg font-semibold leading-none text-fg">
        {formatPercent(score)}
      </span>
      {description ? <span className="text-2xs text-fg-muted">{description}</span> : null}
    </div>
  );
}
