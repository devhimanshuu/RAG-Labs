"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_SERIES,
  SCORE_DOMAIN,
  SCORE_TICKS,
  gridProps,
  ratioTick,
  tooltipProps,
  valueFormatter,
  xAxisProps,
  yAxisProps,
} from "@/components/charts/chart-theme";
import type { EvaluationTrendPoint } from "@/types";

export const TREND_SERIES = [
  { key: "faithfulness", label: "Faithfulness" },
  { key: "answerRelevance", label: "Answer Relevance" },
  { key: "contextRecall", label: "Context Recall" },
  { key: "contextPrecision", label: "Context Precision" },
] as const;

/**
 * Evaluation scores across runs.
 *
 * Lines rather than areas: four overlapping filled areas would obscure the
 * small deltas that matter here.
 */
export function MetricTrendChart({
  data,
  height = 220,
  visibleSeries,
}: {
  data: EvaluationTrendPoint[];
  height?: number;
  /** Series keys to render; defaults to all four quality metrics. */
  visibleSeries?: string[];
}) {
  const series = React.useMemo(
    () =>
      visibleSeries
        ? TREND_SERIES.filter((entry) => visibleSeries.includes(entry.key))
        : TREND_SERIES,
    [visibleSeries],
  );

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="run" {...xAxisProps} />
          <YAxis
            {...yAxisProps}
            domain={SCORE_DOMAIN}
            ticks={SCORE_TICKS}
            tickFormatter={ratioTick}
          />
          <Tooltip {...tooltipProps} formatter={valueFormatter((value) => value.toFixed(3))} />
          {series.map((entry, index) => (
            <Line
              key={entry.key}
              type="monotone"
              dataKey={entry.key}
              name={entry.label}
              stroke={CHART_SERIES[index % CHART_SERIES.length]}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Legend rendered outside the chart so it can wrap and stay clickable later. */
export function TrendLegend({ visibleSeries }: { visibleSeries?: string[] }) {
  const series = visibleSeries
    ? TREND_SERIES.filter((entry) => visibleSeries.includes(entry.key))
    : TREND_SERIES;

  return (
    <ul className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
      {series.map((entry, index) => (
        <li key={entry.key} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-0.5 w-3 rounded-full"
            style={{ background: CHART_SERIES[index % CHART_SERIES.length] }}
          />
          <span className="text-2xs text-fg-secondary">{entry.label}</span>
        </li>
      ))}
    </ul>
  );
}
