import * as React from "react";

import { cn } from "@/lib/utils";

export type ScoreTone = "success" | "warning" | "danger" | "neutral" | "accent";

/**
 * Score thresholds. Retrieval quality below 0.65 is not usable, and above 0.85
 * is production-grade — the badge colour communicates that without a legend.
 */
export function scoreTone(score: number): ScoreTone {
  if (!Number.isFinite(score)) return "neutral";
  if (score >= 0.85) return "success";
  if (score >= 0.65) return "warning";
  return "danger";
}

const TONE_TEXT: Record<ScoreTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-fg-secondary",
  accent: "text-accent",
};

const TONE_BAR: Record<ScoreTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-fg-disabled",
  accent: "bg-accent",
};

/**
 * Monospaced score readout. Fixed fraction digits keep score columns aligned
 * across every table in the app.
 */
export function ScoreBadge({
  score,
  digits = 3,
  tone,
  className,
  withBar = false,
}: {
  score: number;
  digits?: number;
  tone?: ScoreTone;
  className?: string;
  withBar?: boolean;
}) {
  const resolved = tone ?? scoreTone(score);

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      title={`Score ${score.toFixed(digits)}`}
    >
      {withBar ? <ScoreBar score={score} tone={resolved} className="w-12" /> : null}
      <span className={cn("technical text-xs font-medium", TONE_TEXT[resolved])}>
        {Number.isFinite(score) ? score.toFixed(digits) : "—"}
      </span>
    </span>
  );
}

/** Thin magnitude bar rendered next to a score in retrieval tables. */
export function ScoreBar({
  score,
  tone,
  className,
}: {
  score: number;
  tone?: ScoreTone;
  className?: string;
}) {
  const resolved = tone ?? scoreTone(score);
  const width = Number.isFinite(score) ? Math.min(100, Math.max(0, score * 100)) : 0;

  return (
    <span
      aria-hidden
      className={cn("inline-flex h-1 overflow-hidden rounded-full bg-surface-hover", className)}
    >
      <span className={cn("h-full rounded-full", TONE_BAR[resolved])} style={{ width: `${width}%` }} />
    </span>
  );
}
