"use client";

import * as React from "react";

import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const TONES = {
  accent: "bg-accent",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  muted: "bg-fg-disabled",
} as const;

/**
 * Bar that draws itself when scrolled into view.
 *
 * Driven by a CSS transition on `transform` rather than a per-frame animation,
 * so a whole table of bars costs one compositor property each.
 */
export function AnimatedBar({
  value,
  tone = "accent",
  delayMs = 0,
  className,
  trackClassName,
  label,
}: {
  /** Ratio from 0 to 1. */
  value: number;
  tone?: keyof typeof TONES;
  delayMs?: number;
  className?: string;
  trackClassName?: string;
  label?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const scale = inView || prefersReducedMotion ? Math.min(1, Math.max(0, value)) : 0;

  return (
    <span
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(
        "block h-1 w-full overflow-hidden rounded-full",
        trackClassName ?? "bg-surface-hover",
        className,
      )}
    >
      <span
        className={cn("block h-full origin-left rounded-full", TONES[tone])}
        style={{
          transform: `scaleX(${scale})`,
          transition: `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
        }}
      />
    </span>
  );
}
