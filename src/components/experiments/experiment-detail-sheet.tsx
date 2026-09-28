"use client";

import { LineChart as LineChartIcon, Play, RefreshCw } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { MetricTrendChart, TrendLegend } from "@/components/charts/metric-trend-chart";
import { ExperimentBadge, ExperimentProgress } from "@/components/experiments/experiment-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { JSONViewer } from "@/components/ui/json-viewer";
import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScoreBadge } from "@/components/ui/score-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STRATEGY_LABELS } from "@/lib/constants/app";
import {
  formatCostPerMillion,
  formatDuration,
  formatNumber,
  formatPercent,
  formatTimestamp,
} from "@/lib/utils";
import type { Experiment } from "@/types";

interface MetricRow {
  id: string;
  label: string;
  /** Raw number for ratios, or a pre-formatted string for everything else. */
  value: number | string;
  unit?: "ratio";
}

/** Metric rows shown in the overview and score panels. */
function buildMetricRows(experiment: Experiment): MetricRow[] {
  const { metrics } = experiment;

  return [
    { id: "faithfulness", label: "Faithfulness", value: metrics.faithfulness, unit: "ratio" },
    { id: "answer-relevance", label: "Answer Relevance", value: metrics.answerRelevance, unit: "ratio" },
    { id: "context-recall", label: "Context Recall", value: metrics.contextRecall, unit: "ratio" },
    { id: "context-precision", label: "Context Precision", value: metrics.contextPrecision, unit: "ratio" },
    { id: "latency", label: "Mean latency", value: formatDuration(metrics.latencyMs) },
    { id: "tokens", label: "Mean tokens", value: formatNumber(metrics.tokens) },
    { id: "cost", label: "Total cost", value: formatCostPerMillion(metrics.costUsd) },
    { id: "samples", label: "Samples", value: formatNumber(experiment.sampleCount) },
  ];
}

export function ExperimentDetailSheet({
  experiment,
  open,
  onOpenChange,
}: {
  experiment: Experiment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!experiment) return null;

  const rows = buildMetricRows(experiment);
  const isQueued = experiment.status === "queued";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full">
        <SheetHeader>
          <span className="flex flex-wrap items-center gap-2">
            <span className="technical text-2xs uppercase tracking-wide text-fg-muted">
              Experiment
            </span>
            <ExperimentBadge status={experiment.status} />
            <Badge tone="neutral" mono>
              {STRATEGY_LABELS[experiment.strategy]}
            </Badge>
          </span>
          <SheetTitle>{experiment.name}</SheetTitle>
          <SheetDescription>
            {experiment.datasetName} · {formatNumber(experiment.sampleCount)} samples ·{" "}
            {experiment.model} · started by {experiment.author}
          </SheetDescription>
        </SheetHeader>

        <div className="shrink-0 border-b border-line-subtle px-4 py-3">
          <ExperimentProgress
            status={experiment.status}
            progress={experiment.progress}
            sampleCount={experiment.sampleCount}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" disabled={experiment.status === "running"}>
              <RefreshCw />
              Re-run
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/playground">
                <Play />
                Open in playground
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="shrink-0 px-4 pt-2">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="trend">Trend</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <SheetBody className="p-4">
            <TabsContent value="metrics" className="flex flex-col gap-4">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {rows.map((row) => (
                  <div key={row.id} className="flex flex-col gap-1">
                    <dt className="text-2xs uppercase tracking-wide text-fg-muted">
                      {row.label}
                    </dt>
                    <dd className="technical text-base text-fg">
                      {row.unit === "ratio" ? (row.value as number).toFixed(3) : row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Panel>
                <PanelHeader>
                  <PanelTitle>Quality scores</PanelTitle>
                </PanelHeader>
                <PanelBody className="flex flex-col gap-2.5">
                  {rows
                    .filter((row) => row.unit === "ratio")
                    .map((row) => {
                      const score = row.value as number;
                      return (
                        <div key={row.id} className="flex items-center justify-between gap-3">
                          <span className="text-xs text-fg-secondary">{row.label}</span>
                          <span className="flex items-center gap-3">
                            <ScoreBadge score={score} withBar />
                            <span className="technical w-14 text-right text-2xs text-fg-muted">
                              {formatPercent(score)}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                </PanelBody>
              </Panel>
            </TabsContent>

            <TabsContent value="trend" className="flex flex-col gap-3">
              {experiment.trend && experiment.trend.length > 0 ? (
                <Panel>
                  <PanelHeader>
                    <PanelTitle icon={LineChartIcon}>Metric history</PanelTitle>
                  </PanelHeader>
                  <PanelBody className="flex flex-col gap-3">
                    <TrendLegend />
                    <MetricTrendChart data={experiment.trend} height={240} />
                  </PanelBody>
                </Panel>
              ) : (
                <EmptyState
                  icon={LineChartIcon}
                  title="No run history yet"
                  description="Trend data appears once the experiment has completed at least one evaluation run."
                  hint={`Created ${formatTimestamp(experiment.createdAt)}`}
                />
              )}
            </TabsContent>

            <TabsContent value="config">
              <JSONViewer
                title="experiment"
                defaultExpandDepth={3}
                data={{
                  id: experiment.id,
                  name: experiment.name,
                  strategy: experiment.strategy,
                  status: experiment.status,
                  dataset: { id: experiment.datasetId, name: experiment.datasetName },
                  generator: { model: experiment.model, temperature: 0.1, maxTokens: 1024 },
                  retrieval: { topK: 10, alpha: 0.6, rerankTo: 5, reranker: "bge-reranker-v2-m3" },
                  evaluation: {
                    framework: "ragas",
                    metrics: [
                      "faithfulness",
                      "answer_relevance",
                      "context_recall",
                      "context_precision",
                    ],
                  },
                  samples: experiment.sampleCount,
                  createdBy: experiment.author,
                  createdAt: experiment.createdAt,
                  updatedAt: experiment.updatedAt,
                }}
              />
            </TabsContent>
          </SheetBody>
        </Tabs>

        <div className="shrink-0 border-t border-line-subtle px-4 py-2">
          <span className="technical text-2xs text-fg-disabled">
            updated {formatTimestamp(experiment.updatedAt)}
          </span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
