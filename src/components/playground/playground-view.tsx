"use client";

import { Bookmark, ListTree } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { PageHeader } from "@/components/layout/page-header";
import { PipelinePreview } from "@/components/playground/pipeline-preview";
import {
  AnswerPanel,
  RetrievalContextPanel,
  type RunStatus,
} from "@/components/playground/playground-results";
import {
  DEFAULT_PLAYGROUND_SETTINGS,
  QueryComposer,
  type PlaygroundSettings,
} from "@/components/playground/query-composer";
import { Button } from "@/components/ui/button";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { STRATEGY_LABELS } from "@/lib/constants/app";
import {
  DEFAULT_PLAYGROUND_ANSWER,
  DEMO_QUERY,
  getPipelineById,
  mockDefaultPipeline,
  mockRetrievalResults,
} from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import type { RagStrategy, RetrievalResult } from "@/types";

/** Each strategy maps to the pipeline that executes it. */
const STRATEGY_PIPELINE: Record<RagStrategy, string> = {
  naive: "pl_naive",
  hybrid: "pl_hybrid_rerank",
  hyde: "pl_hyde",
  "multi-query": "pl_multi_query",
  crag: "pl_crag",
};

const STAGE_INTERVAL_MS = 260;
const MIN_RUN_MS = 1100;

/**
 * Playground.
 *
 * The run is simulated with timer-driven stage progression rather than a real
 * request — Phase 1 has no engine. Everything else (settings, rerank thresholds,
 * kept/dropped flags) is derived from state so the interface already behaves
 * like the finished product.
 */
export function PlaygroundView() {
  const [datasetId, setDatasetId] = React.useState("ds_finance_reports");
  const [query, setQuery] = React.useState(DEMO_QUERY);
  const [settings, setSettings] = React.useState<PlaygroundSettings>(DEFAULT_PLAYGROUND_SETTINGS);
  const [status, setStatus] = React.useState<RunStatus>("idle");
  const [activeStageId, setActiveStageId] = React.useState<string | null>(null);

  const timers = React.useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  React.useEffect(() => clearTimers, [clearTimers]);

  const pipelineId = STRATEGY_PIPELINE[settings.strategy];
  const pipeline = getPipelineById(pipelineId) ?? mockDefaultPipeline;
  const stages = pipeline.nodes.filter((node) => node.kind !== "input");
  const activeStages = settings.useRerank
    ? stages
    : stages.filter((stage) => stage.kind !== "rerank");

  const updateSettings = React.useCallback((patch: Partial<PlaygroundSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
    // Changing strategy invalidates the previous run, as it would in production.
    if (patch.strategy) {
      setStatus("idle");
      setActiveStageId(null);
    }
  }, []);

  const run = React.useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.warning("Nothing to run", "Enter a query before running the playground.");
      return;
    }

    clearTimers();
    setStatus("running");
    setActiveStageId("query");

    activeStages.forEach((stage, index) => {
      timers.current.push(
        setTimeout(() => setActiveStageId(stage.id), (index + 1) * STAGE_INTERVAL_MS),
      );
    });

    const total = Math.max(MIN_RUN_MS, activeStages.length * STAGE_INTERVAL_MS + 420);
    timers.current.push(
      setTimeout(() => {
        setStatus("complete");
        setActiveStageId(null);
        toast.success("Run complete", `${activeStages.length} stages executed in ${total}ms.`);
      }, total),
    );
  }, [activeStages, clearTimers, query]);

  useHotkeys({ "mod+enter": () => run() });

  const results = React.useMemo<RetrievalResult[]>(
    () =>
      mockRetrievalResults.map((result, index) => ({
        ...result,
        // The rerank threshold makes the retained set react to the slider.
        kept: index < settings.rerankCount,
      })),
    [settings.rerankCount],
  );

  const keptCount = results.filter((result) => result.kept).length;
  const totalLatencyMs = activeStages.reduce((total, stage) => total + (stage.latencyMs ?? 0), 0);
  const inputTokens = 1620 + results.slice(0, settings.rerankCount).reduce((total, r) => total + r.tokens, 0);
  const outputTokens = 396;

  const reset = React.useCallback(() => {
    clearTimers();
    setQuery(DEMO_QUERY);
    setSettings(DEFAULT_PLAYGROUND_SETTINGS);
    setDatasetId("ds_finance_reports");
    setStatus("idle");
    setActiveStageId(null);
    toast.info("Playground reset", "Query and retrieval settings were restored to defaults.");
  }, [clearTimers]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Playground"
        description="Run a query end to end against any dataset and strategy, then inspect every chunk the retriever considered."
        actions={
          <>
            <Button variant="ghost" size="md" asChild>
              <Link href="/traces">
                <ListTree />
                View traces
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() =>
                toast.info(
                  "Save as experiment",
                  "Persisting playground runs as experiments arrives in Phase 2.",
                )
              }
            >
              <Bookmark />
              Save as experiment
            </Button>
          </>
        }
        meta={
          <>
            <span className="technical text-2xs text-fg-muted">
              Strategy: {STRATEGY_LABELS[settings.strategy]}
            </span>
            <span className="technical text-2xs text-fg-muted">
              Top K: {settings.topK}
            </span>
            <span className="technical text-2xs text-fg-muted">
              Rerank: {settings.useRerank ? settings.rerankCount : "off"}
            </span>
            <span className="technical text-2xs text-fg-muted">Model: {settings.model}</span>
          </>
        }
      />

      <QueryComposer
        datasetId={datasetId}
        onDatasetIdChange={setDatasetId}
        query={query}
        onQueryChange={setQuery}
        settings={settings}
        onSettingsChange={updateSettings}
        status={status}
        onRun={run}
        onReset={reset}
      />

      <PipelinePreview pipelineId={pipelineId} activeStageId={activeStageId} />

      <div className="grid gap-4 lg:grid-cols-2">
        <RetrievalContextPanel status={status} results={results} />
        <AnswerPanel
          status={status}
          answer={DEFAULT_PLAYGROUND_ANSWER}
          model={settings.model}
          latencyMs={totalLatencyMs}
          inputTokens={inputTokens}
          outputTokens={outputTokens}
          costUsd={(inputTokens / 1_000_000) * 2 + (outputTokens / 1_000_000) * 8}
          citedSources={settings.citeSources ? keptCount : 0}
          onRegenerate={run}
        />
      </div>
    </div>
  );
}
