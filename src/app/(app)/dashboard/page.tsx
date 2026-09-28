import { Activity, ArrowUpRight, Clock, Coins, Hash, Plus, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { MetricTrendChart, TrendLegend } from "@/components/charts/metric-trend-chart";
import {
  ActivityFeed,
  ProviderHealthPanel,
  RecentExperimentsPanel,
  TraceVelocityStrip,
  WorkspaceStatsStrip,
} from "@/components/dashboard/overview-panels";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Panel, PanelActions, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Sparkline } from "@/components/ui/sparkline";
import { DeltaIndicator, MetricCard, formatMetricValue } from "@/components/ui/stat";
import {
  mockDashboardMetrics,
  mockEvaluationTrend,
  mockOperationalMetrics,
} from "@/lib/mock-data";
import { cn, formatDuration, formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const OPERATIONAL_ICONS = {
  "p50-latency": Clock,
  "p95-latency": Clock,
  "tokens-per-query": Hash,
  "cost-per-1k": Coins,
} as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Workspace health, retrieval quality and recent activity across every dataset and strategy."
        actions={
          <>
            <Button variant="secondary" asChild>
              <Link href="/experiments">
                <Plus />
                New experiment
              </Link>
            </Button>
            <Button variant="primary" asChild>
              <Link href="/playground">
                <Sparkles />
                Open playground
              </Link>
            </Button>
          </>
        }
        meta={
          <>
            <TraceVelocityStrip tracesPerHour={1840} />
            <span className="flex items-center gap-1.5 text-2xs text-fg-muted">
              <Activity className="size-3" aria-hidden />
              Window: last 12 evaluation runs
            </span>
          </>
        }
      />

      {/* Retrieval quality headline */}
      <section aria-label="Retrieval quality" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {mockDashboardMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      {/* Trend + provider health */}
      <section className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader>
            <PanelTitle icon={Activity}>Retrieval quality over time</PanelTitle>
            <PanelActions>
              <Button variant="ghost" size="xs" asChild>
                <Link href="/evaluation">
                  Evaluation
                  <ArrowUpRight />
                </Link>
              </Button>
            </PanelActions>
          </PanelHeader>
          <PanelBody className="pt-3">
            <TrendLegend />
            <MetricTrendChart data={mockEvaluationTrend} height={228} />
          </PanelBody>
        </Panel>

        <ProviderHealthPanel />
      </section>

      {/* Runs + activity */}
      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentExperimentsPanel />
        </div>
        <ActivityFeed />
      </section>

      {/* Operational metrics */}
      <section aria-label="Operational metrics">
        <Panel>
          <PanelHeader>
            <PanelTitle icon={Clock}>Operational metrics</PanelTitle>
            <PanelActions>
              <span className="technical text-2xs text-fg-muted">
                vs. previous 12-run window
              </span>
            </PanelActions>
          </PanelHeader>
          <PanelBody padded={false}>
            <dl className="grid grid-cols-2 divide-line-subtle lg:grid-cols-4 lg:divide-x">
              {mockOperationalMetrics.map((metric, index) => {
                const Icon = OPERATIONAL_ICONS[metric.id as keyof typeof OPERATIONAL_ICONS];

                return (
                  <div
                    key={metric.id}
                    className={cn(
                      "flex flex-col gap-2 border-line-subtle px-3.5 py-3",
                      index < mockOperationalMetrics.length - 1 && "border-b lg:border-b-0",
                      index % 2 === 0 && "border-r lg:border-r-0",
                      index < 2 && "lg:border-r",
                    )}
                  >
                    <dt className="flex items-center gap-1.5 text-2xs uppercase tracking-wide text-fg-muted">
                      {Icon ? <Icon className="size-3" aria-hidden /> : null}
                      {metric.label}
                    </dt>
                    <dd className="flex items-end justify-between gap-3">
                      <span className="flex flex-col gap-1">
                        <span className="technical text-lg font-semibold leading-none text-fg">
                          {metric.unit === "currency"
                            ? `$${metric.value.toFixed(1)}`
                            : metric.unit === "duration"
                              ? formatDuration(metric.value)
                              : formatNumber(metric.value)}
                        </span>
                        <DeltaIndicator metric={metric} />
                      </span>
                      {metric.series ? (
                        <Sparkline
                          values={metric.series}
                          area
                          tone="muted"
                          className="h-6 w-20 shrink-0"
                          aria-label={`${metric.label} trend`}
                        />
                      ) : null}
                    </dd>
                    <p className="text-2xs text-fg-muted">{metric.description}</p>
                  </div>
                );
              })}
            </dl>
          </PanelBody>
        </Panel>
      </section>

      {/* Workspace totals */}
      <section aria-label="Workspace totals">
        <h2 className="sr-only">Workspace totals</h2>
        <WorkspaceStatsStrip />
      </section>

      {/* Accessible summary of the headline numbers for screen readers. */}
      <p className="sr-only">
        Current faithfulness {formatMetricValue(mockDashboardMetrics[0])}, answer relevance{" "}
        {formatMetricValue(mockDashboardMetrics[1])}, context recall{" "}
        {formatMetricValue(mockDashboardMetrics[2])}, context precision{" "}
        {formatMetricValue(mockDashboardMetrics[3])}.
      </p>
    </div>
  );
}
