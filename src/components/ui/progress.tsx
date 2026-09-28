"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";

const TONES = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-fg-disabled",
} as const;

export function Progress({
  value,
  tone = "accent",
  className,
  indicatorClassName,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  tone?: keyof typeof TONES;
  indicatorClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value ?? 0));

  return (
    <ProgressPrimitive.Root
      value={clamped}
      aria-label={ariaLabel}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-surface-hover",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full transition-[width] duration-300 ease-out",
          TONES[tone],
          indicatorClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

/** Indeterminate variant used while an experiment is being queued. */
export function IndeterminateBar({ className }: { className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      aria-valuetext="In progress"
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-surface-hover", className)}
    >
      <div className="absolute inset-y-0 w-1/3 animate-[shimmer_1.4s_linear_infinite] rounded-full bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] bg-[length:200%_100%]" />
    </div>
  );
}
