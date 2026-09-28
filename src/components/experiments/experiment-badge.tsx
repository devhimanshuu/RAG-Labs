import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { RUN_STATUS_META } from "@/lib/constants/status";
import { cn, formatPercent } from "@/lib/utils";
import type { RunStatus } from "@/types";

/**
 * Run status pill. Running states carry a pulsing dot so liveness is visible at
 * a glance in a dense table.
 */
export function ExperimentBadge({
  status,
  className,
}: {
  status: RunStatus;
  className?: string;
}) {
  const meta = RUN_STATUS_META[status];

  return (
    <Badge tone={meta.tone} mono className={cn("gap-1.5", className)}>
      <StatusIndicator tone={meta.tone} pulse={meta.pulse} size="xs" />
      {meta.label}
    </Badge>
  );
}

/**
 * Progress bar for queued or running experiments. Completed runs render the
 * sample count instead of a bar, since a full bar carries no information.
 */
export function ExperimentProgress({
  status,
  progress,
  sampleCount,
  className,
}: {
  status: RunStatus;
  progress: number;
  sampleCount: number;
  className?: string;
}) {
  if (status === "running" || status === "queued") {
    const tone = status === "queued" ? "neutral" : "accent";
    return (
      <div className={cn("flex min-w-32 flex-col gap-1", className)}>
        <Progress
          value={progress * 100}
          tone={tone}
          aria-label={`${RUN_STATUS_META[status].label} progress`}
        />
        <span className="technical text-2xs text-fg-muted">
          {formatPercent(progress, 0)} · {sampleCount} samples
        </span>
      </div>
    );
  }

  return (
    <span className={cn("technical text-2xs text-fg-muted", className)}>
      {sampleCount} samples
    </span>
  );
}
