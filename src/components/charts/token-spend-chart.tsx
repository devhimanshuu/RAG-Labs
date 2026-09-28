"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  CHART_SERIES,
  compactTick,
  gridProps,
  tooltipProps,
  valueFormatter,
  xAxisProps,
  yAxisProps,
} from "@/components/charts/chart-theme";
import { formatNumber } from "@/lib/utils";
import type { TokenSpendPoint } from "@/types";

/**
 * Prompt vs. completion tokens per day.
 *
 * Stacked so the total is read at a glance while the input/output split — the
 * part a cost optimisation actually targets — stays visible.
 */
export function TokenSpendChart({
  data,
  height = 200,
}: {
  data: TokenSpendPoint[];
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap={4}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...xAxisProps} />
          <YAxis {...yAxisProps} tickFormatter={compactTick} />
          <Tooltip
            {...tooltipProps}
            formatter={valueFormatter(formatNumber)}
            cursor={{ fill: "var(--surface-hover)" }}
          />
          <Bar
            dataKey="input"
            name="Input tokens"
            stackId="tokens"
            fill={CHART_SERIES[1]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="output"
            name="Output tokens"
            stackId="tokens"
            fill={CHART_SERIES[0]}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
