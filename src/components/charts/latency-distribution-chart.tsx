"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_SERIES,
  gridProps,
  tooltipProps,
  valueFormatter,
  xAxisProps,
  yAxisProps,
} from "@/components/charts/chart-theme";
import { formatNumber } from "@/lib/utils";
import type { LatencyBucket } from "@/types";

/**
 * Latency histogram. Read for tail shape rather than averages — a healthy p50
 * with a fat right tail is the failure mode this view is meant to expose.
 */
export function LatencyDistributionChart({
  data,
  height = 200,
}: {
  data: LatencyBucket[];
  height?: number;
}) {
  const peak = Math.max(...data.map((bucket) => bucket.count));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap={6}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="bucket"
            {...xAxisProps}
            tickFormatter={(value: string) => value.replace(/s$/, "")}
            minTickGap={8}
          />
          <YAxis
            {...yAxisProps}
            tickFormatter={(value: number) => formatNumber(value)}
            allowDecimals={false}
          />
          <Tooltip
            {...tooltipProps}
            formatter={valueFormatter(formatNumber, "Requests")}
            cursor={{ fill: "var(--surface-hover)" }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {data.map((bucket) => (
              <Cell key={bucket.bucket} fill={bucket.count === peak ? CHART_SERIES[0] : "var(--chart-5)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
