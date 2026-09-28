import * as React from "react";

import { StatusIndicator, type StatusTone } from "@/components/ui/status-indicator";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import type { Trace, TraceStep, TraceStepKind } from "@/types";

const KIND_TONE: Record<TraceStepKind, StatusTone> = {
  rewrite: "info",
  retrieval: "accent",
  rerank: "warning",
  fusion: "neutral",
  generation: "success",
  guardrail: "danger",
};

const STEP_TONES: Record<TraceStep["status"], StatusTone> = {
  ok: "success",
  warning: "warning",
  error: "danger",
};

/**
 * Vertical trace timeline with a per-step waterfall.
 *
 * The bar is positioned from each step's offset and duration rather than being
 * drawn sequentially, which is what makes parallel or corrective stages legible.
 */
export function TraceTimeline({
  trace,
  showWaterfall = true,
  className,
}: {
  trace: Trace;
  showWaterfall?: boolean;
  className?: string;
}) {
  const total = Math.max(trace.latencyMs, 1);

  return (
    <ol className={cn("flex flex-col", className)}>
      {trace.steps.map((step, index) => {
        const isLast = index === trace.steps.length - 1;
        const offsetPercent = (step.offsetMs / total) * 100;
        const widthPercent = Math.max((step.durationMs / total) * 100, 1.5);

        return (
          <li key={step.id} className="relative flex gap-3 pl-0.5">
            {/* Connector rail */}
            <span className="relative flex w-3 shrink-0 flex-col items-center">
              <span className="mt-[5px] flex size-2.5 shrink-0 items-center justify-center">
                <StatusIndicator tone={KIND_TONE[step.kind]} size="sm" />
              </span>
              {!isLast ? (
                <span aria-hidden className="w-px flex-1 bg-line-subtle" />
              ) : null}
            </span>

            <div className={cn("min-w-0 flex-1", !isLast && "pb-3.5")}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="flex items-center gap-2">
                  <span className="text-sm text-fg">{step.name}</span>
                  {step.status !== "ok" ? (
                    <span
                      className={cn(
                        "technical text-2xs uppercase",
                        step.status === "error" ? "text-danger" : "text-warning",
                      )}
                    >
                      {step.status}
                    </span>
                  ) : null}
                </span>
                <span className="technical text-xs text-fg-secondary">
                  {formatDuration(step.durationMs)}
                </span>
              </div>

              {step.detail || step.model ? (
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                  {step.detail ? (
                    <span className="text-2xs text-fg-muted">{step.detail}</span>
                  ) : null}
                  {step.model ? (
                    <span className="technical text-2xs text-fg-disabled">{step.model}</span>
                  ) : null}
                  {step.inputTokens !== undefined ? (
                    <span className="technical text-2xs text-fg-disabled">
                      {formatNumber(step.inputTokens)} in /{" "}
                      {formatNumber(step.outputTokens ?? 0)} out
                    </span>
                  ) : null}
                </div>
              ) : null}

              {showWaterfall ? (
                <div
                  className="relative mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-hover"
                  role="img"
                  aria-label={`${step.name} started at ${formatDuration(step.offsetMs)} and took ${formatDuration(step.durationMs)}`}
                >
                  <span
                    className={cn("absolute top-0 h-full rounded-full", barTone(step))}
                    style={{ left: `${offsetPercent}%`, width: `${widthPercent}%` }}
                  />
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function barTone(step: TraceStep): string {
  if (step.status === "error") return "bg-danger";
  if (step.status === "warning") return "bg-warning";

  switch (step.kind) {
    case "retrieval":
      return "bg-accent";
    case "generation":
      return "bg-success";
    case "rerank":
      return "bg-warning";
    case "rewrite":
      return "bg-info";
    default:
      return "bg-fg-disabled";
  }
}

/** Axis labels under the waterfall, expressed in absolute time. */
export function TraceTimelineScale({
  totalMs,
  className,
}: {
  totalMs: number;
  className?: string;
}) {
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {ticks.map((tick) => (
        <span key={tick} className="technical text-2xs text-fg-disabled">
          {formatDuration(totalMs * tick)}
        </span>
      ))}
    </div>
  );
}
