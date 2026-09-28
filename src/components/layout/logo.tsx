import { cn } from "@/lib/utils";

/**
 * RAGLabs mark: two retrieval nodes feeding a single generation node. Drawn with
 * `currentColor` so it can sit on any surface without a second asset.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={cn("size-4 text-accent", className)}
    >
      <path
        d="M4.6 5.4h4.2M4.6 14.6h4.2M4.6 5.4v9.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      <path
        d="M8.8 5.4c3 0 4.2 1.6 4.2 4.6s-1.2 4.6-4.2 4.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="2.2 2.2"
      />
      <rect x="2.6" y="3.8" width="3.2" height="3.2" rx="1" fill="currentColor" />
      <rect x="2.6" y="13" width="3.2" height="3.2" rx="1" fill="currentColor" opacity="0.6" />
      <rect
        x="13.4"
        y="8"
        width="4"
        height="4"
        rx="1.2"
        fill="currentColor"
        opacity="0.28"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

/** Wordmark + mark lockup used in the top bar. */
export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      {showText ? (
        <span className="text-sm font-semibold tracking-tight text-fg">
          <span className="text-accent">RAG</span>Labs
        </span>
      ) : null}
    </span>
  );
}
