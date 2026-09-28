import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Keyboard hint. Renders as a real element so shortcut hints stay visually
 * consistent across the sidebar, top bar and command palette.
 */
export function Kbd({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "technical inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-line bg-surface-hover px-1 text-2xs font-medium text-fg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

/** Renders a shortcut string such as "G D" or "⌘K" as separate key caps. */
export function KbdSequence({ keys, className }: { keys: string; className?: string }) {
  const parts = keys.includes(" ") ? keys.split(" ") : keys.split("");
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {parts.map((part, index) => (
        <Kbd key={`${part}-${index}`}>{part}</Kbd>
      ))}
    </span>
  );
}
