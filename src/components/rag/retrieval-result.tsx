"use client";

import { Check, ChevronDown, Copy, FileText, X } from "lucide-react";
import * as React from "react";

import { IconButton } from "@/components/ui/button";
import { ScoreBar, scoreTone } from "@/components/ui/score-badge";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn, formatNumber } from "@/lib/utils";
import type { RetrievalResult as RetrievalResultModel } from "@/types";

const TONE_TEXT = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-fg-secondary",
  accent: "text-accent",
} as const;

/**
 * A single retrieved chunk.
 *
 * Collapsed it answers "what did we retrieve and how relevant is it"; expanded
 * it exposes the raw stage scores (dense, sparse, rerank) so a developer can see
 * *why* the chunk ranked where it did.
 */
export function RetrievalResult({
  result,
  defaultExpanded = false,
  className,
}: {
  result: RetrievalResultModel;
  defaultExpanded?: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const { copied, copy } = useCopyToClipboard();
  const tone = scoreTone(result.score);

  return (
    <article
      className={cn(
        "group rounded-md border border-line bg-surface transition-colors",
        result.kept ? "hover:border-line-strong" : "opacity-75 hover:opacity-100",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <span className="technical shrink-0 rounded-xs border border-line bg-surface-inset px-1.5 text-2xs text-fg-muted">
          #{String(result.rank).padStart(2, "0")}
        </span>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 text-2xs",
            result.kept ? "text-success" : "text-fg-disabled",
          )}
          title={result.kept ? "Kept after reranking" : "Dropped after reranking"}
        >
          {result.kept ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
          {result.kept ? "kept" : "dropped"}
        </span>

        <span className="ml-auto flex shrink-0 items-center gap-2">
          <ScoreBar score={result.score} tone={tone} className="w-14" />
          <span className={cn("technical text-xs font-medium", TONE_TEXT[tone])}>
            {result.score.toFixed(3)}
          </span>
          <IconButton
            label={expanded ? "Collapse chunk" : "Expand chunk"}
            size="xs"
            variant="ghost"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
          >
            <ChevronDown className={cn("transition-transform", expanded && "rotate-180")} />
          </IconButton>
        </span>
      </div>

      <div className="px-2.5 pb-2">
        <p
          className={cn(
            "text-xs leading-relaxed text-fg-secondary",
            !expanded && "line-clamp-2",
          )}
        >
          {result.content}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line-subtle px-2.5 py-1.5">
        <span className="flex min-w-0 items-center gap-1.5 text-2xs text-fg-muted">
          <FileText className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{result.documentName}</span>
        </span>
        <span className="technical text-2xs text-fg-muted">p.{result.page}</span>
        <span className="technical text-2xs text-fg-disabled">{result.tokens} tok</span>

        {expanded ? (
          <span className="ml-auto flex items-center gap-1.5">
            <span className="technical text-2xs text-fg-disabled">{result.chunkId}</span>
            <IconButton
              label={copied ? "Chunk ID copied" : "Copy chunk ID"}
              size="xs"
              variant="ghost"
              onClick={() => void copy(result.chunkId)}
            >
              {copied ? <Check className="text-success" /> : <Copy />}
            </IconButton>
          </span>
        ) : null}
      </div>

      {expanded ? (
        <dl className="grid grid-cols-3 divide-x divide-line-subtle border-t border-line-subtle sm:grid-cols-4">
          <ScoreCell label="Dense" value={result.denseScore} />
          <ScoreCell label="Sparse" value={result.sparseScore} />
          <ScoreCell label="Rerank" value={result.rerankScore} />
          <ScoreCell label="Final" value={result.score} className="hidden sm:block" />
        </dl>
      ) : null}
    </article>
  );
}

function ScoreCell({
  label,
  value,
  className,
}: {
  label: string;
  value?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5 px-2.5 py-1.5", className)}>
      <dt className="text-2xs text-fg-muted">{label}</dt>
      <dd className="technical text-xs text-fg-secondary">
        {value === undefined ? "—" : value.toFixed(3)}
      </dd>
    </div>
  );
}

/** Ranked list wrapper with a summary header. */
export function RetrievalResultList({
  results,
  className,
  emptyMessage = "No chunks were retrieved for this query.",
}: {
  results: RetrievalResultModel[];
  className?: string;
  emptyMessage?: string;
}) {
  if (results.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line px-3 py-6 text-center text-xs text-fg-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-1.5", className)}>
      {results.map((result) => (
        <li key={result.id}>
          <RetrievalResult result={result} />
        </li>
      ))}
    </ul>
  );
}

/** Compact totals row above a retrieval list. */
export function RetrievalSummary({
  results,
  className,
}: {
  results: RetrievalResultModel[];
  className?: string;
}) {
  const kept = results.filter((result) => result.kept).length;
  const tokens = results.reduce((total, result) => total + result.tokens, 0);
  const best = results.reduce((max, result) => Math.max(max, result.score), 0);

  return (
    <span className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      <span className="technical text-2xs text-fg-muted">{kept} kept</span>
      <span aria-hidden className="h-3 w-px bg-line" />
      <span className="technical text-2xs text-fg-muted">{results.length} retrieved</span>
      <span aria-hidden className="h-3 w-px bg-line" />
      <span className="technical text-2xs text-fg-muted">{formatNumber(tokens)} tok</span>
      <span aria-hidden className="h-3 w-px bg-line" />
      <span className="technical text-2xs text-fg-muted">top {best.toFixed(3)}</span>
    </span>
  );
}
