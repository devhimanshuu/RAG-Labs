import { Activity, Clock, Coins, Gauge, Target, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

import { LatencyDistributionChart } from "@/components/charts/latency-distribution-chart";
import { MetricTrendChart, TrendLegend } from "@/components/charts/metric-trend-chart";
import { RecallCurveChart } from "@/components/charts/recall-curve-chart";
import { TokenSpendChart } from "@/components/charts/token-spend-chart";
import { StrategyComparisonPanel } from "@/components/evaluation/strategy-comparison-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-table";
import { Panel, PanelActions, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { ScoreBadge } from "@/components/ui/score-badge";
import { MetricCard } from "@/components/ui/stat";
import { STRATEGY_LABELS } from "@/lib/constants/app";
import {
  mockEvaluationMetrics,
  mockEvaluationTrend,
  mockExperiments,
  mockLatencyDistribution,
  mockRecallCurve,
  mockTokenSpend,
} from "@/lib/mock-data";
import { formatDuration, formatNumber, formatPercent } from "@/lib/utils";

export const metadata: Metadata = { title: "Evaluation" };

const SUMMARY_METRICS = [
  { id: "faithfulness", label: "Faithfulness" },
  { id: "answerRelevance", label: "Answer Relevance" },
  { id: "contextRecall", label: "Context Recall" },
  { id: "contextPrecision", label: "Context Precision" },
] as const;

export default function EvaluationPage() {
  const scored = mockExperiments.filter((experiment) => experiment.status !== "queued");
  const baseline = scored.find((experiment) => experiment.status === "completed");
  const samples = scored.reduce((total, experiment) => total + experiment.sampleCount, 0);
  const cost = scored.reduce((total, experiment) => total + experiment.metrics.costUsd, 0);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Evaluation"
        description="RAG quality metrics aggregated across completed runs: answer grounding, retrieval coverage and end-to-end cost."
        actions={
          <>
            <Button variant="secondary">Export report</Button>
            <Button variant="primary">
              <Target />
              New evaluation run
            </Button>
          </>
        }
        meta={
          <>
            <span className="technical text-2xs text-fg-muted">
              {scored.length} runs · {formatNumber(samples)} samples
            </span>
            <span className="technical text-2xs text-fg-muted">Framework: ragas (mock)</span>
            <Badge tone="accent" mono>
              window: 12 runs
            </Badge>
          </>
        }
      />

      <section
        aria-label="Quality metrics"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6"
      >
        {mockEvaluationMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader>
            <PanelTitle icon={TrendingUp}>Metric trend</PanelTitle>
            <PanelActions>
              <span className="technical text-2xs text-fg-muted">per evaluation run</span>
            </PanelActions>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3 pt-3">
            <TrendLegend />
            <MetricTrendChart data={mockEvaluationTrend} height={240} />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle icon={Gauge}>Recall@k</PanelTitle>
            <PanelActions>
              <span className="technical text-2xs text-fg-muted">top-k sweep</span>
            </PanelActions>
          </PanelHeader>
          <PanelBody className="pt-3">
            <RecallCurveChart data={mockRecallCurve} height={240} />
          </PanelBody>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StrategyComparisonPanel />
        </div>

        <Panel>
          <PanelHeader>
            <PanelTitle icon={Clock}>Latency distribution</PanelTitle>
            <PanelActions>
              <span className="technical text-2xs text-fg-muted">p50 {formatDuration(1420)}</span>
            </PanelActions>
          </PanelHeader>
          <PanelBody className="pt-3">
            <LatencyDistributionChart data={mockLatencyDistribution} height={236} />
          </PanelBody>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader>
            <PanelTitle icon={Coins}>Token usage</PanelTitle>
            <PanelActions>
              <span className="technical text-2xs text-fg-muted">prompt vs. completion</span>
            </PanelActions>
          </PanelHeader>
          <PanelBody className="pt-3">
            <TokenSpendChart data={mockTokenSpend} height={216} />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle icon={Activity}>Quality summary</PanelTitle>
          </PanelHeader>
          <PanelBody className="flex flex-col gap-3">
            {SUMMARY_METRICS.map((entry) => {
              const value = baseline?.metrics[entry.id] ?? 0;

              return (
                <div key={entry.id} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-fg-secondary">{entry.label}</span>
                  <span className="flex items-center gap-3">
                    <ScoreBadge score={value} withBar />
                    <span className="technical w-12 text-right text-2xs text-fg-muted">
                      {formatPercent(value)}
                    </span>
                  </span>
                </div>
              );
            })}

            <div className="mt-1 flex items-center justify-between gap-3 border-t border-line-subtle pt-3">
              <span className="text-xs text-fg-secondary">Total spend</span>
              <span className="technical text-xs text-fg">${cost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-fg-secondary">Samples evaluated</span>
              <span className="technical text-xs text-fg">{formatNumber(samples)}</span>
            </div>
          </PanelBody>
        </Panel>
      </section>

      <Panel>
        <PanelHeader>
          <PanelTitle icon={Target}>Per-experiment scores</PanelTitle>
          <PanelActions>
            <span className="technical text-2xs text-fg-muted">{scored.length} scored runs</span>
          </PanelActions>
        </PanelHeader>
        <PanelBody padded={false}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Experiment</TableHead>
                <TableHead className="hidden sm:table-cell">Dataset</TableHead>
                <TableHead>Strategy</TableHead>
                {SUMMARY_METRICS.map((entry) => (
                  <TableHead key={entry.id} align="right" className="hidden md:table-cell">
                    {entry.label}
                  </TableHead>
                ))}
                <TableHead align="right" className="hidden lg:table-cell">
                  Latency
                </TableHead>
                <TableHead align="right">Faithfulness</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scored.map((experiment) => (
                <TableRow key={experiment.id} interactive>
                  <TableCell className="text-xs font-medium text-fg">{experiment.name}</TableCell>
                  <TableCell className="hidden text-xs sm:table-cell">
                    {experiment.datasetName}
                  </TableCell>
                  <TableCell>
                    <Badge tone="neutral" mono>
                      {STRATEGY_LABELS[experiment.strategy]}
                    </Badge>
                  </TableCell>
                  {SUMMARY_METRICS.map((entry) => (
                    <TableCell
                      key={entry.id}
                      align="right"
                      className="technical hidden text-xs md:table-cell"
                    >
                      {experiment.metrics[entry.id].toFixed(3)}
                    </TableCell>
                  ))}
                  <TableCell align="right" className="technical hidden text-xs lg:table-cell">
                    {formatDuration(experiment.metrics.latencyMs)}
                  </TableCell>
                  <TableCell align="right">
                    <ScoreBadge score={experiment.metrics.faithfulness} withBar />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PanelBody>
      </Panel>
    </div>
  );
}
