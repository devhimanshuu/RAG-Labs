import {
  ArrowDownUp,
  Database,
  GitMerge,
  LogIn,
  PenLine,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { StatusIndicator, type StatusTone } from "@/components/ui/status-indicator";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PipelineNode as PipelineNodeModel, PipelineNodeKind } from "@/types";

/**
 * Per-kind presentation. Extracted so the pipeline canvas, the playground stage
 * strip and the pipeline list all describe a stage identically.
 */
export const NODE_KIND_META: Record<
  PipelineNodeKind,
  { icon: LucideIcon; label: string; tone: string }
> = {
  input: { icon: LogIn, label: "Input", tone: "text-fg-muted" },
  rewrite: { icon: PenLine, label: "Rewrite", tone: "text-info" },
  retrieval: { icon: Database, label: "Retrieval", tone: "text-accent" },
  fusion: { icon: GitMerge, label: "Fusion", tone: "text-fg-secondary" },
  rerank: { icon: ArrowDownUp, label: "Rerank", tone: "text-warning" },
  generation: { icon: Sparkles, label: "Generation", tone: "text-success" },
  evaluation: { icon: Target, label: "Evaluation", tone: "text-info" },
};

const STATUS_TONES: Record<string, StatusTone> = {
  idle: "neutral",
  queued: "neutral",
  running: "accent",
  completed: "success",
  failed: "danger",
  cancelled: "neutral",
};

/**
 * A pipeline stage card.
 *
 * Deliberately framework-agnostic: no React Flow types appear here, so the same
 * component can be dropped into an `@xyflow/react` custom node in Phase 2
 * without modification.
 */
export function PipelineNode({
  node,
  className,
  selected = false,
  showConfig = true,
  compact = false,
  onSelect,
}: {
  node: PipelineNodeModel;
  className?: string;
  selected?: boolean;
  showConfig?: boolean;
  compact?: boolean;
  onSelect?: (node: PipelineNodeModel) => void;
}) {
  const { icon: Icon, label, tone } = NODE_KIND_META[node.kind];
  const interactive = Boolean(onSelect);

  const content = (
    <>
      <div className="flex items-start gap-2.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-line bg-surface-inset">
          <Icon className={cn("size-3.5", tone)} aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-fg">{node.title}</span>
          <span className="truncate text-2xs text-fg-muted">
            {node.subtitle ?? label}
          </span>
        </div>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <StatusIndicator
            tone={STATUS_TONES[node.status] ?? "neutral"}
            size="xs"
            pulse={node.status === "running"}
          />
          {node.latencyMs !== undefined ? (
            <span className="technical text-2xs text-fg-muted">
              {formatDuration(node.latencyMs)}
            </span>
          ) : null}
        </span>
      </div>

      {showConfig && node.config.length > 0 ? (
        <dl className="mt-2.5 flex flex-col gap-1 border-t border-line-subtle pt-2">
          {node.config.map((entry) => (
            <div key={entry.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-2xs text-fg-muted">{entry.label}</dt>
              <dd className="technical truncate text-2xs text-fg-secondary">{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </>
  );

  const classes = cn(
    "w-full rounded-lg border bg-surface p-2.5 text-left transition-colors",
    compact ? "max-w-52" : "max-w-60",
    selected
      ? "border-accent-line bg-accent-muted/40 shadow-[0_0_0_1px_var(--accent-line)]"
      : "border-line",
    interactive && "hover:border-line-strong hover:bg-surface-hover focus-ring cursor-pointer",
    className,
  );

  if (!interactive) return <div className={classes}>{content}</div>;

  return (
    <button type="button" onClick={() => onSelect?.(node)} className={classes}>
      {content}
    </button>
  );
}

/** Compact inline stage chip used in the playground header. */
export function PipelineStageChip({
  title,
  kind,
  latencyMs,
  index,
  active = false,
  className,
}: {
  title: string;
  kind: PipelineNodeKind;
  latencyMs?: number;
  index: number;
  active?: boolean;
  className?: string;
}) {
  const { icon: Icon } = NODE_KIND_META[kind];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-1.5 transition-colors",
        active
          ? "border-accent-line bg-accent-muted"
          : "border-line bg-surface hover:border-line-strong",
        className,
      )}
    >
      <span className="technical text-2xs text-fg-disabled">{index}</span>
      <Icon className={cn("size-3.5", active ? "text-accent" : NODE_KIND_META[kind].tone)} aria-hidden />
      <span className={cn("text-xs", active ? "text-accent" : "text-fg-secondary")}>{title}</span>
      {latencyMs !== undefined ? (
        <span className="technical text-2xs text-fg-muted">{formatDuration(latencyMs)}</span>
      ) : null}
    </span>
  );
}
