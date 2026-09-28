import * as React from "react";

import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types";

export type { StatusTone };

const DOT_TONES: Record<StatusTone, string> = {
  neutral: "bg-fg-disabled",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

const TEXT_TONES: Record<StatusTone, string> = {
  neutral: "text-fg-secondary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

const SIZES = { xs: "size-1.5", sm: "size-2", md: "size-2.5" } as const;

/**
 * Status dot. `pulse` is reserved for live states (running, indexing) so motion
 * always means "something is happening right now".
 */
export function StatusIndicator({
  tone = "neutral",
  label,
  pulse = false,
  size = "sm",
  className,
  ...props
}: {
  tone?: StatusTone;
  label?: React.ReactNode;
  pulse?: boolean;
  size?: keyof typeof SIZES;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <span className="relative inline-flex shrink-0">
        {pulse ? (
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full opacity-60 animate-pulse-dot",
              DOT_TONES[tone],
            )}
          />
        ) : null}
        <span aria-hidden className={cn("rounded-full", SIZES[size], DOT_TONES[tone])} />
      </span>
      {label ? (
        <span className={cn("text-xs", TEXT_TONES[tone])}>{label}</span>
      ) : null}
    </span>
  );
}

/** Dot-only indicator for dense tables, with the label kept as a tooltip. */
export function StatusDot({
  tone = "neutral",
  label,
  pulse = false,
  size = "sm",
  className,
}: {
  tone?: StatusTone;
  label: string;
  pulse?: boolean;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span title={label} className={cn("inline-flex", className)}>
      <span className="sr-only">{label}</span>
      <StatusIndicator tone={tone} pulse={pulse} size={size} aria-label={label} />
    </span>
  );
}
