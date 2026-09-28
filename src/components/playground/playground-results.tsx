"use client";

import { Check, Copy, Database, Download, FileSearch, RefreshCw, Sparkles } from "lucide-react";
import * as React from "react";

import { AnswerText } from "@/components/playground/answer-text";
import { RetrievalResultList, RetrievalSummary } from "@/components/rag/retrieval-result";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelActions, PanelBody, PanelFooter, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { toast } from "@/lib/store/toast";
import { formatCostPerMillion, formatDuration, formatNumber } from "@/lib/utils";
import type { RetrievalResult } from "@/types";

export type RunStatus = "idle" | "running" | "complete";

function ChunkSkeleton() {
  return (
    <div className="rounded-md border border-line bg-surface p-2.5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="ml-auto h-3 w-24" />
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="mt-2.5 flex gap-3 border-t border-line-subtle pt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

/** Retrieved chunks for the current run. */
export function RetrievalContextPanel({
  status,
  results,
  className,
}: {
  status: RunStatus;
  results: RetrievalResult[];
  className?: string;
}) {
  return (
    <Panel className={className}>
      <PanelHeader>
        <PanelTitle icon={Database}>Retrieved context</PanelTitle>
        <PanelActions>
          {status === "complete" ? <RetrievalSummary results={results} /> : null}
        </PanelActions>
      </PanelHeader>
      <PanelBody padded={false} className="min-h-0">
        {status === "idle" ? (
          <EmptyState
            icon={FileSearch}
            title="No context retrieved yet"
            description="Run a query to retrieve chunks from the selected dataset and inspect their stage scores."
            bordered={false}
            className="py-12"
          />
        ) : status === "running" ? (
          <div className="flex flex-col gap-1.5 p-3.5">
            <ChunkSkeleton />
            <ChunkSkeleton />
            <ChunkSkeleton />
          </div>
        ) : (
          <div className="p-3.5">
            <RetrievalResultList results={results} />
          </div>
        )}
      </PanelBody>
    </Panel>
  );
}

/** Generated answer for the current run. */
export function AnswerPanel({
  status,
  answer,
  model,
  latencyMs,
  inputTokens,
  outputTokens,
  costUsd,
  citedSources,
  onRegenerate,
  className,
}: {
  status: RunStatus;
  answer: string;
  model: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  citedSources: number;
  onRegenerate: () => void;
  className?: string;
}) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Panel className={className}>
      <PanelHeader>
        <PanelTitle icon={Sparkles}>Answer</PanelTitle>
        <PanelActions>
          <Badge tone="neutral" mono>
            {model}
          </Badge>
          <IconButton
            label={copied ? "Answer copied" : "Copy answer"}
            size="sm"
            disabled={status !== "complete"}
            onClick={() => {
              void copy(answer);
              if (!copied) toast.success("Answer copied to clipboard");
            }}
          >
            {copied ? <Check className="text-success" /> : <Copy />}
          </IconButton>
          <IconButton
            label="Regenerate answer"
            size="sm"
            disabled={status === "running"}
            onClick={onRegenerate}
          >
            <RefreshCw />
          </IconButton>
        </PanelActions>
      </PanelHeader>

      <PanelBody className="min-h-0">
        {status === "idle" ? (
          <EmptyState
            icon={Sparkles}
            title="No answer generated yet"
            description="The generator will cite the retained chunks once a query has run."
            bordered={false}
            className="py-12"
          />
        ) : status === "running" ? (
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="mt-2 h-3.5 w-1/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        ) : (
          <AnswerText content={answer} />
        )}
      </PanelBody>

      {status === "complete" ? (
        <PanelFooter>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="technical text-2xs text-fg-muted">
              {formatDuration(latencyMs)}
            </span>
            <span aria-hidden className="h-3 w-px bg-line" />
            <span className="technical text-2xs text-fg-muted">
              {formatNumber(inputTokens + outputTokens)} tok
            </span>
            <span aria-hidden className="h-3 w-px bg-line" />
            <span className="technical text-2xs text-fg-muted">
              {formatCostPerMillion(costUsd)}
            </span>
            {citedSources > 0 ? (
              <>
                <span aria-hidden className="h-3 w-px bg-line" />
                <span className="technical text-2xs text-fg-muted">
                  {citedSources} citations
                </span>
              </>
            ) : null}
          </span>
          <Button variant="ghost" size="xs">
            <Download />
            Export
          </Button>
        </PanelFooter>
      ) : null}
    </Panel>
  );
}
