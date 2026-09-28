"use client";

import * as React from "react";

/**
 * Fires once when an element scrolls into view.
 *
 * Used for scroll reveals and metric counters. Defaults to triggering slightly
 * before the element is fully visible so the animation reads as a response to
 * scrolling rather than a delayed pop.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
} = {}) {
  const ref = React.useRef<T | null>(null);
  // Without observer support, treat the content as visible instead of hiding it
  // forever — resolved at init so the effect never has to push state.
  const [inView, setInView] = React.useState(
    () => typeof IntersectionObserver === "undefined",
  );

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
