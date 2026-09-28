import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Pills always carry a subtle tinted background and a matching border, never a
 * saturated fill — semantic colour is an indicator here, not decoration.
 */
export const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full border font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      tone: {
        neutral: "border-line bg-surface-hover text-fg-secondary",
        outline: "border-line-strong bg-transparent text-fg-secondary",
        accent: "border-accent-line bg-accent-muted text-accent",
        success: "border-success-line bg-success-muted text-success",
        warning: "border-warning-line bg-warning-muted text-warning",
        danger: "border-danger-line bg-danger-muted text-danger",
        info: "border-info-line bg-info-muted text-info",
      },
      size: {
        sm: "h-5 px-1.5 text-2xs",
        md: "h-6 px-2 text-xs",
      },
      /** Monospaced, tabular variant for statuses and identifiers. */
      mono: {
        true: "technical uppercase tracking-wide",
        false: "",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm", mono: false },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, size, mono, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size, mono }), className)} {...props} />;
}

/** Muted count pill, used for row counts and sidebar badges. */
export function CountBadge({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "technical inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-line bg-surface-hover px-1.5 text-2xs text-fg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Small inline tag used on dataset and pipeline rows. */
export function Tag({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-xs border border-line-subtle bg-surface-inset px-1.5 text-2xs text-fg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
