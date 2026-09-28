"use client";

import * as React from "react";

/**
 * SSR-safe media query hook. Returns `false` on the server and on the first
 * client render, then settles after mount — so it must not drive markup that
 * differs from the server output. Prefer Tailwind breakpoint classes for
 * layout, and reserve this for behaviour (drawer closing, chart sizing).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Matches the desktop breakpoint used by the application shell. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
