"use client";

import * as React from "react";

import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal.
 *
 * Wraps a section so it fades and lifts into place once visible. Content is
 * rendered immediately when the user prefers reduced motion, and the observer
 * fallback in `useInView` guarantees content is never left hidden.
 */
export function Reveal({
  children,
  className,
  /** Stagger in milliseconds, for lists of siblings. */
  delayMs = 0,
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  as?: React.ElementType;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const hidden = !inView && !prefersReducedMotion;

  return (
    <Component
      ref={ref}
      style={hidden ? undefined : { transitionDelay: `${delayMs}ms` }}
      className={cn(
        "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
        hidden ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
    >
      {children}
    </Component>
  );
}
