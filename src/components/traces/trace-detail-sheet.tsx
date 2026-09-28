"use client";

import { ArrowRight } from "lucide-react";
import * as React from "react";

import { RetrievalResultList, RetrievalSummary } from "@/components/rag/retrieval-result";
import { TraceTimeline, TraceTimelineScale } from "@/components/traces/trace-timeline";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { JSONViewer } from "@/components/ui/json-viewer";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STRATEGY_LABELS } from "@/lib/constants/app";
import {
  cn,
  formatCostPerMillion,
  formatDuration,
  formatNumber,
  formatTimestamp,
  shortId,
} from "@/lib/utils";
import type { Trace } from "@/types";

function StatCell({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5 px-3 py-2.5", className)}>
      <span className="text-2xs uppercase tracking-wide text-fg-muted">{label}</span>
      <span className="technical text-sm text-fg">{value}</span>
      {hint ? <span className="technical text-2xs text-fg-disabled">{hint}</span> : null}
    </div>
  );
}

/**
 * Trace inspector. Opened from a row in the traces table; shows the request end
 * to end so a retriever change can be evaluated against real timings.
 */
export function TraceDetailSheet({
  trace,
  open,
  onOpenChange,
}: {
  trace: Trace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!trace) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="w-full">
        <SheetHeader>
          <span className="flex items-center gap-2">
            <span className="technical text-2xs uppercase tracking-wide text-fg-muted">
              Trace
            </span>
            <span className="technical rounded-xs border border-line bg-surface-inset px-1.5 text-2xs text-accent">
              #{shortId(trace.id)}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-2xs",
                trace.status === "error" ? "text-danger" : "text-success",
              )}
            >
              <StatusIndicator
                tone={trace.status === "error" ? "danger" : "success"}
                size="xs"
              />
              {trace.status === "error" ? "Failed" : "Succeeded"}
            </span>
          </span>
          <SheetTitle className="pr-4">{trace.query}</SheetTitle>
          <SheetDescription className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="technical">{trace.model}</span>
            <span aria-hidden className="text-fg-disabled">
              ·
            </span>
            <span>{trace.datasetName}</span>
            <span aria-hidden className="text-fg-disabled">
              ·
            </span>
            <span className="technical text-2xs">{formatTimestamp(trace.createdAt)}</span>
          </SheetDescription>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge tone="accent" mono>
              {STRATEGY_LABELS[trace.strategy]}
            </Badge>
            <Badge tone="neutral" mono>
              {trace.steps.length} stages
            </Badge>
          </div>
        </SheetHeader>

        <div className="grid shrink-0 grid-cols-2 divide-x divide-y divide-line-subtle border-b border-line-subtle sm:grid-cols-4 sm:divide-y-0">
          <StatCell label="Latency" value={formatDuration(trace.latencyMs)} />
          <StatCell label="TTFT" value={formatDuration(trace.ttftMs)} />
          <StatCell
            label="Tokens"
            value={formatNumber(trace.inputTokens + trace.outputTokens)}
            hint={`${formatNumber(trace.inputTokens)} in · ${formatNumber(trace.outputTokens)} out`}
          />
          <StatCell label="Cost" value={formatCostPerMillion(trace.costUsd)} />
        </div>

        <Tabs defaultValue="steps" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="shrink-0 px-4 pt-2">
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="retrieval">
              Retrieval
              <span className="technical text-2xs text-fg-muted">
                {trace.retrievalResults.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="answer">Answer</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>

          <SheetBody className="p-4">
            <TabsContent value="steps" className="flex flex-col gap-3">
              <div className="rounded-lg border border-line bg-surface p-3.5">
                <TraceTimeline trace={trace} />
                <TraceTimelineScale
                  totalMs={trace.latencyMs}
                  className="mt-3 border-t border-line-subtle pt-2"
                />
              </div>

              <ol className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-2">
                {trace.steps.map((step, index) => (
                  <li
                    key={step.id}
                    className="flex items-center gap-2 px-1.5 py-1 text-xs text-fg-secondary"
                  >
                    <span className="technical text-2xs text-fg-disabled">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 truncate">{step.name}</span>
                    {index < trace.steps.length - 1 ? (
                      <ArrowRight className="size-3 text-fg-disabled" aria-hidden />
                    ) : null}
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="retrieval" className="flex flex-col gap-3">
              <RetrievalSummary results={trace.retrievalResults} />
              <RetrievalResultList results={trace.retrievalResults} />
            </TabsContent>

            <TabsContent value="answer">
              {trace.answer ? (
                <div className="rounded-lg border border-line bg-surface p-3.5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg-secondary">
                    {trace.answer}
                  </p>
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-line px-3 py-8 text-center text-xs text-fg-muted">
                  Generation was aborted, so no answer was produced for this trace.
                </p>
              )}
            </TabsContent>

            <TabsContent value="raw" className="flex flex-col gap-3">
              <JSONViewer
                title="trace"
                defaultExpandDepth={2}
                maxHeight="22rem"
                data={{
                  id: trace.id,
                  query: trace.query,
                  strategy: trace.strategy,
                  model: trace.model,
                  status: trace.status,
                  latencyMs: trace.latencyMs,
                  ttftMs: trace.ttftMs,
                  usage: {
                    inputTokens: trace.inputTokens,
                    outputTokens: trace.outputTokens,
                    costUsd: trace.costUsd,
                  },
                  dataset: { id: trace.datasetId, name: trace.datasetName },
                  createdAt: trace.createdAt,
                }}
              />
              <CodeBlock
                title="replay"
                language="bash"
                code={`raglab traces replay ${trace.id} --dataset ${trace.datasetId} --strategy ${trace.strategy}`}
              />
            </TabsContent>
          </SheetBody>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
