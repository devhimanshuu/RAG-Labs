"use client";

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
  RECALL_DOMAIN,
  gridProps,
  ratioTick,
  tooltipProps,
  valueFormatter,
  xAxisProps,
  yAxisProps,
} from "@/components/charts/chart-theme";
import type { RecallCurvePoint } from "@/types";

const SERIES = [
  { key: "hybrid", label: "Hybrid" },
  { key: "hyde", label: "HyDE" },
  { key: "naive", label: "Naive" },
] as const;

/**
 * Recall as a function of retrieved depth.
 *
 * The crossover between curves is the decision this chart exists to support:
 * whether a strategy's early-precision advantage survives at higher k.
 */
export function RecallCurveChart({
  data,
  height = 200,
}: {
  data: RecallCurvePoint[];
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="k"
            {...xAxisProps}
            tickFormatter={(value: number) => `k=${value}`}
          />
          <YAxis {...yAxisProps} domain={RECALL_DOMAIN} tickFormatter={ratioTick} />
          <Tooltip
            {...tooltipProps}
            formatter={valueFormatter((value) => value.toFixed(3))}
            labelFormatter={(label) => `Top ${label} retrieved`}
          />
          {SERIES.map((series, index) => (
            <Line
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={CHART_SERIES[index % CHART_SERIES.length]}
              strokeWidth={1.5}
              dot={{ r: 2, strokeWidth: 0, fill: CHART_SERIES[index % CHART_SERIES.length] }}
              activeDot={{ r: 3.5, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
