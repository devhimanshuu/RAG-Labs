"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  CHART_SERIES,
  tooltipProps,
  valueFormatter,
  xAxisProps,
} from "@/components/charts/chart-theme";
import { formatDuration, formatNumber } from "@/lib/utils";
import type { StrategyComparison } from "@/types";

type ComparisonMetric = "faithfulness" | "answerRelevance" | "contextRecall" | "latencyMs";

const METRIC_CONFIG: Record<
  ComparisonMetric,
  { label: string; domain: [number, number]; tickFormatter: (value: number) => string; format: (value: number) => string }
> = {
  faithfulness: {
    label: "Faithfulness",
    domain: [0, 1],
    tickFormatter: (value) => `${Math.round(value * 100)}%`,
    format: (value) => value.toFixed(3),
  },
  answerRelevance: {
    label: "Answer Relevance",
    domain: [0, 1],
    tickFormatter: (value) => `${Math.round(value * 100)}%`,
    format: (value) => value.toFixed(3),
  },
  contextRecall: {
    label: "Context Recall",
    domain: [0, 1],
    tickFormatter: (value) => `${Math.round(value * 100)}%`,
    format: (value) => value.toFixed(3),
  },
  latencyMs: {
    label: "Latency",
    domain: [0, 3200],
    tickFormatter: (value) => `${(value / 1000).toFixed(1)}s`,
    format: formatDuration,
  },
};

/**
 * One metric across all strategies. Only a single series is shown at a time —
 * a grouped bar of four metrics by five strategies turns into noise, and the
 * comparison a researcher actually makes is per-metric.
 */
export function StrategyComparisonChart({
  data,
  metric = "faithfulness",
  height = 200,
}: {
  data: StrategyComparison[];
  metric?: ComparisonMetric;
  height?: number;
}) {
  const config = METRIC_CONFIG[metric];
  const best = Math.max(...data.map((entry) => entry[metric]));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
          barCategoryGap={10}
        >
          <XAxis
            type="number"
            domain={config.domain}
            tickFormatter={config.tickFormatter}
            {...xAxisProps}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={86}
            tick={{ fill: "var(--chart-axis)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            {...tooltipProps}
            formatter={valueFormatter(config.format, config.label)}
            cursor={{ fill: "var(--surface-hover)" }}
          />
          <Bar dataKey={metric} radius={[0, 3, 3, 0]} isAnimationActive={false} maxBarSize={14}>
            {data.map((entry) => (
              <Cell
                key={entry.strategy}
                fill={entry[metric] === best ? CHART_SERIES[0] : "var(--chart-5)"}
                fillOpacity={entry[metric] === best ? 1 : 0.55}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Table companion to the bar chart: exact numbers plus token cost. */
export function StrategyComparisonTable({ data }: { data: StrategyComparison[] }) {
  const metrics: Array<{ key: keyof StrategyComparison; label: string; format: (value: number) => string }> = [
    { key: "faithfulness", label: "Faith.", format: (value) => value.toFixed(3) },
    { key: "answerRelevance", label: "Relev.", format: (value) => value.toFixed(3) },
    { key: "contextRecall", label: "Recall", format: (value) => value.toFixed(3) },
    { key: "contextPrecision", label: "Prec.", format: (value) => value.toFixed(3) },
    { key: "latencyMs", label: "Latency", format: formatDuration },
    { key: "tokens", label: "Tokens", format: formatNumber },
  ];

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="h-8 px-2 text-left text-2xs font-medium uppercase tracking-wide text-fg-muted">
              Strategy
            </th>
            {metrics.map((metric) => (
              <th
                key={metric.key}
                scope="col"
                className="h-8 px-2 text-right text-2xs font-medium uppercase tracking-wide text-fg-muted"
              >
                {metric.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.strategy} className="border-b border-line-subtle last:border-0 hover:bg-surface-hover">
              <td className="h-9 px-2 text-fg">{row.label}</td>
              {metrics.map((metric) => (
                <td key={metric.key} className="technical h-9 px-2 text-right text-xs text-fg-secondary">
                  {metric.format(row[metric.key] as number)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
