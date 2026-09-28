"use client";

import * as React from "react";

import { ScoreBadge } from "@/components/ui/score-badge";
import { PipelineConnector } from "@/components/visualizations/pipeline-connector";
import { StageIcon } from "@/components/visualizations/stage-visuals";
import {
  getHeroNode,
  heroFlow,
  heroPipelineGroup,
  type PipelineGraphNode,
} from "@/lib/mock-data/landing";
import { cn, formatDuration, formatNumber } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Node cards                                                                 */
/* -------------------------------------------------------------------------- */

function NodeCard({
  node,
  active,
  onActivate,
  className,
}: {
  node: PipelineGraphNode;
  active: boolean;
  onActivate: (id: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => onActivate(node.id)}
      onFocus={() => onActivate(node.id)}
      aria-pressed={active}
      className={cn(
        "group w-full rounded-lg border p-2.5 text-left transition-colors duration-200 focus-ring",
        active
          ? "border-accent-line bg-accent-muted"
          : "border-line bg-surface hover:border-line-strong hover:bg-surface-hover",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <StageIcon kind={node.stageKind} size="sm" />
        <span
          className={cn(
            "technical text-2xs uppercase tracking-wide",
            active ? "text-accent" : "text-fg-muted",
          )}
        >
          {node.kind}
        </span>
        {node.latencyMs !== undefined ? (
          <span className="technical ml-auto text-2xs text-fg-muted">
            {formatDuration(node.latencyMs)}
          </span>
        ) : null}
      </span>
      <span className="mt-1.5 block truncate text-xs font-medium text-fg">{node.label}</span>
      <span className="mt-0.5 block truncate text-2xs text-fg-muted">{node.summary}</span>
    </button>
  );
}

/** Labelled container holding the parallel dense and sparse retrievers. */
function GroupStage({
  active,
  activeId,
  onActivate,
}: {
  active: boolean;
  activeId: string;
  onActivate: (id: string) => void;
}) {
  const group = getHeroNode(heroPipelineGroup.id);
  if (!group) return null;

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-dashed p-2.5 transition-colors duration-200 sm:max-w-md",
        active ? "border-accent-line bg-accent-muted/40" : "border-line-strong bg-surface-inset",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onMouseEnter={() => onActivate(group.id)}
          onFocus={() => onActivate(group.id)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-sm text-left transition-colors focus-ring",
            active ? "text-accent" : "text-fg-secondary hover:text-fg",
          )}
        >
          <span className="technical truncate text-2xs uppercase tracking-wide">
            {group.label}
          </span>
          <span className="technical shrink-0 text-2xs text-fg-muted">
            {heroPipelineGroup.nodeIds.length} in parallel
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {heroPipelineGroup.nodeIds.map((id) => {
          const child = getHeroNode(id);
          if (!child) return null;
          return (
            <NodeCard
              key={id}
              node={child}
              active={activeId === id}
              onActivate={onActivate}
            />
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Inspector                                                                  */
/* -------------------------------------------------------------------------- */

function Inspector({ node }: { node: PipelineGraphNode }) {
  return (
    <aside className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <header className="flex items-center gap-2.5 border-b border-line-subtle px-3.5 py-2.5">
        <StageIcon kind={node.stageKind} />
        <div className="flex min-w-0 flex-col">
          <span className="technical text-2xs uppercase tracking-wide text-fg-muted">
            {node.kind}
          </span>
          <span className="truncate text-xs font-medium text-fg">{node.label}</span>
        </div>
        {node.latencyMs !== undefined ? (
          <span className="technical ml-auto shrink-0 text-xs text-fg-secondary">
            {formatDuration(node.latencyMs)}
          </span>
        ) : null}
      </header>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <p className="text-xs leading-relaxed text-fg-secondary">{node.detail}</p>

        {node.score !== undefined ? (
          <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface-inset px-2.5 py-2">
            <span className="text-2xs text-fg-muted">Top score</span>
            <ScoreBadge score={node.score} withBar />
          </div>
        ) : null}

        <dl className="flex flex-col gap-1.5">
          {node.config.map((entry) => (
            <div key={entry.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-2xs text-fg-muted">{entry.label}</dt>
              <dd className="technical truncate text-2xs text-fg-secondary">{entry.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <footer className="border-t border-line-subtle px-3.5 py-2">
        <p className="text-2xs text-fg-disabled">
          Hover or tab through a stage to inspect it.
        </p>
      </footer>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Graph                                                                      */
/* -------------------------------------------------------------------------- */

const DEFAULT_STAGE = "rerank";

function rowContains(row: { id: string; children?: string[] }, id: string): boolean {
  return row.id === id || (row.children?.includes(id) ?? false);
}

/**
 * Interactive RAG pipeline.
 *
 * Deliberately a real diagram rather than a decorative illustration: every stage
 * is focusable, and selecting one explains what that stage does and what it
 * costs. Total latency is summed from the stage data, not hardcoded.
 */
export function HeroPipeline({ className }: { className?: string }) {
  const [activeId, setActiveId] = React.useState(DEFAULT_STAGE);
  const activeNode = getHeroNode(activeId) ?? getHeroNode(DEFAULT_STAGE);

  const totalLatencyMs = React.useMemo(
    () =>
      heroFlow.reduce((total, row) => total + (getHeroNode(row.id)?.latencyMs ?? 0), 0),
    [],
  );

  return (
    <div className={cn("grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]", className)}>
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface-inset">
        <div className="dot-backdrop pointer-events-none absolute inset-0 opacity-60" aria-hidden />

        <header className="relative flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-subtle px-4 py-2.5">
          <span className="technical text-2xs uppercase tracking-wide text-fg-muted">
            pipeline
          </span>
          <span className="technical text-2xs text-accent">hybrid-rerank</span>
          <span className="technical ml-auto text-2xs text-fg-muted">
            total {formatDuration(totalLatencyMs)}
          </span>
          <span className="technical text-2xs text-fg-disabled">
            {heroFlow.length} stages
          </span>
        </header>

        <div className="relative flex flex-col items-center px-4 py-5 sm:px-6">
          {heroFlow.map((row, index) => {
            const node = getHeroNode(row.id);
            if (!node) return null;

            const rowActive = rowContains(row, activeId);
            const nextRow = heroFlow[index + 1];
            const connectorActive = nextRow
              ? rowActive || rowContains(nextRow, activeId)
              : false;

            return (
              <React.Fragment key={row.id}>
                {row.children && row.children.length > 0 ? (
                  <GroupStage
                    active={rowActive}
                    activeId={activeId}
                    onActivate={setActiveId}
                  />
                ) : (
                  <NodeCard
                    node={node}
                    active={rowActive}
                    onActivate={setActiveId}
                    className="sm:max-w-md"
                  />
                )}
                {nextRow ? (
                  <PipelineConnector label={nextRow.edgeLabel} active={connectorActive} />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>

        <footer className="relative flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line-subtle px-4 py-2.5">
          <span className="technical text-2xs text-fg-muted">
            context {formatNumber(2184)} tokens
          </span>
          <span aria-hidden className="h-3 w-px bg-line" />
          <span className="technical text-2xs text-fg-muted">output 396 tokens</span>
          <span aria-hidden className="h-3 w-px bg-line" />
          <span className="technical text-2xs text-success">faithfulness 0.942</span>
        </footer>
      </div>

      {activeNode ? <Inspector node={activeNode} /> : null}
    </div>
  );
}
