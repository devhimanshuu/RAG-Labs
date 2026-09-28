/**
 * Shared chart styling.
 *
 * Colours are referenced as CSS custom properties rather than JS values, so a
 * theme switch repaints the charts without re-rendering or remounting them.
 *
 * The objects below are declared `as const` so their literal members stay
 * assignable to recharts' fairly strict SVG prop types.
 */

export const CHART_SERIES = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export const axisTickStyle = {
  fill: "var(--chart-axis)",
  fontSize: 10,
} as const;

/** Recharts tooltip props, styled from the same tokens as the rest of the UI. */
export const tooltipProps = {
  contentStyle: {
    background: "var(--surface-elevated)",
    border: "1px solid var(--line)",
    borderRadius: "8px",
    padding: "6px 9px",
    boxShadow: "var(--shadow-md)",
    fontSize: 11,
  },
  labelStyle: {
    color: "var(--fg-secondary)",
    fontSize: 10,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  itemStyle: {
    color: "var(--fg)",
    fontSize: 11,
    padding: "1px 0",
  },
  wrapperStyle: { outline: "none" },
  cursor: { stroke: "var(--line-strong)", strokeWidth: 1 },
} as const;

export const gridProps = {
  stroke: "var(--chart-grid)",
  strokeDasharray: "2 4",
  vertical: false,
} as const;

export const xAxisProps = {
  tick: axisTickStyle,
  tickLine: false,
  axisLine: { stroke: "var(--chart-grid)" },
  tickMargin: 8,
  minTickGap: 12,
} as const;

export const yAxisProps = {
  tick: axisTickStyle,
  tickLine: false,
  axisLine: false,
  width: 34,
} as const;

/**
 * Quality metrics live in a narrow band near the top of 0..1. Domain is
 * truncated to 0.5..1 so a 0.03 improvement is actually visible; the axis
 * labels always show the true percentages so the truncation is explicit.
 */
export const SCORE_DOMAIN: [number, number] = [0.5, 1];

/** Explicit ticks so the truncated axis reads as clean 10-point increments. */
export const SCORE_TICKS = [0.5, 0.6, 0.7, 0.8, 0.9, 1];

/** Recall curves span much lower values, so they keep the full domain. */
export const RECALL_DOMAIN: [number, number] = [0, 1];

/* -------------------------------------------------------------------------- */
/* Tooltip / axis formatters                                                  */
/* -------------------------------------------------------------------------- */

type TooltipFormatterResult = string | [string, string];
export type TooltipFormatter = (value: unknown) => TooltipFormatterResult;

/**
 * Builds a recharts tooltip formatter. Recharts types the incoming value as a
 * loose union, so the value is coerced rather than annotated.
 */
export function valueFormatter(
  format: (value: number) => string,
  label?: string,
): TooltipFormatter {
  return (value) => {
    const text = format(Number(value));
    return label ? [text, label] : text;
  };
}

/** Compact axis labels: 2_180_000 -> "2.2M". */
export function compactTick(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}

/** Duration axis labels in seconds. */
export function durationTick(value: number): string {
  return `${(value / 1000).toFixed(1)}s`;
}

/** Percentage axis labels for 0..1 ratios. */
export function ratioTick(value: number): string {
  return `${Math.round(value * 100)}%`;
}
