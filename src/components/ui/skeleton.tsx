import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Loading placeholder. Uses a single shared shimmer so every skeleton in the
 * app pulses in phase rather than each element animating independently.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-sm bg-surface-hover",
        "bg-[linear-gradient(90deg,transparent_0%,var(--surface-active)_50%,transparent_100%)] bg-[length:200%_100%] animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}

/** Convenience stack of text-line skeletons. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}
