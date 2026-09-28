import {
  ArrowDownUp,
  CornerDownLeft,
  Database,
  Layers,
  PenLine,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import type { PipelineStageKind } from "@/lib/mock-data/landing";
import { cn } from "@/lib/utils";

/**
 * One icon and one colour per pipeline stage kind.
 *
 * Shared by the hero diagram, the technique explorer and the pipeline builder so
 * a "reranker" looks identical everywhere on the page.
 */
export const STAGE_VISUALS: Record<
  PipelineStageKind,
  { icon: LucideIcon; label: string; color: string }
> = {
  input: { icon: CornerDownLeft, label: "Input", color: "text-fg-muted" },
  transform: { icon: PenLine, label: "Transform", color: "text-info" },
  vector: { icon: Database, label: "Dense", color: "text-accent" },
  sparse: { icon: Search, label: "Sparse", color: "text-warning" },
  rerank: { icon: ArrowDownUp, label: "Rerank", color: "text-chart-5" },
  context: { icon: Layers, label: "Context", color: "text-fg-secondary" },
  generation: { icon: Sparkles, label: "Generate", color: "text-success" },
};

export function StageIcon({
  kind,
  className,
  size = "md",
}: {
  kind: PipelineStageKind;
  className?: string;
  size?: "sm" | "md";
}) {
  const { icon: Icon, color } = STAGE_VISUALS[kind];

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sm border border-line bg-surface-inset",
        size === "sm" ? "size-5" : "size-6",
        className,
      )}
    >
      <Icon className={cn(size === "sm" ? "size-3" : "size-3.5", color)} aria-hidden />
    </span>
  );
}
