"use client";

import * as React from "react";

import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { formatDuration, formatNumber, formatPercent, formatScore } from "@/lib/utils";

/** Serializable formatters — functions cannot cross the server/client boundary. */
export type NumberFormat = "percent" | "ratio" | "duration" | "number" | "plain";

function formatValue(value: number, format: NumberFormat, digits: number): string {
  switch (format) {
    case "percent":
      return formatPercent(value, digits);
    case "ratio":
      return formatScore(value, digits);
    case "duration":
      return formatDuration(value);
    case "number":
      return formatNumber(Math.round(value));
    case "plain":
    default:
      return value.toFixed(digits);
  }
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * Counts a number up when it scrolls into view.
 *
 * The first render always shows the final value so server markup and the first
 * client paint agree; the animation only starts after mount.
 */
export function AnimatedNumber({
  value,
  format = "plain",
  digits = 2,
  durationMs = 900,
  className,
  delayMs = 0,
}: {
  value: number;
  format?: NumberFormat;
  digits?: number;
  durationMs?: number;
  className?: string;
  delayMs?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = React.useState(value);

  React.useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (start === 0) start = now;
      const elapsed = now - start - delayMs;
      const progress = elapsed <= 0 ? 0 : Math.min(1, elapsed / durationMs);
      setDisplay(value * easeOutCubic(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    setDisplay(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [delayMs, durationMs, inView, prefersReducedMotion, value]);

  return (
    <span ref={ref} className={className}>
      {formatValue(display, format, digits)}
    </span>
  );
}
