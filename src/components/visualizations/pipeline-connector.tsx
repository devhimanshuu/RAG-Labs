import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Vertical connector between pipeline stages.
 *
 * Shared by the hero diagram, the technique explorer and the pipeline builder so
 * every stage-to-stage transition on the page is drawn identically. When active
 * it lights up and runs an animated flow pulse.
 */
export function PipelineConnector({
  label,
  active = false,
  size = "md",
  className,
}: {
  label?: string;
  active?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex items-center justify-center",
        size === "sm" ? "h-6" : "h-10",
        className,
      )}
    >
      <span
        className={cn(
          "h-full w-px transition-colors duration-200",
          active ? "bg-accent" : "bg-line-strong",
        )}
      />
      {active ? (
        <span className="flow-line absolute inset-y-0 left-1/2 w-px -translate-x-1/2 text-accent/70" />
      ) : null}
      <ChevronDown
        className={cn(
          "absolute bottom-0 translate-y-[3px] transition-colors duration-200",
          size === "sm" ? "size-2.5" : "size-3",
          active ? "text-accent" : "text-line-strong",
        )}
      />
      {label ? (
        <span
          className={cn(
            "technical absolute left-1/2 ml-3 whitespace-nowrap text-2xs transition-colors duration-200",
            active ? "text-accent" : "text-fg-disabled",
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
