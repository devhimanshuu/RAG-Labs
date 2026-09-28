import * as React from "react";

import { cn } from "@/lib/utils";

const WIDTHS = {
  /** Default reading measure for copy-led sections. */
  default: "max-w-6xl",
  /** Wider measure for sections that carry a large visualization. */
  wide: "max-w-7xl",
  /** Narrow measure for single-column argument sections. */
  narrow: "max-w-4xl",
} as const;

/**
 * Landing section wrapper. Owns vertical rhythm and the page gutter so every
 * section aligns to the same grid without repeating padding classes.
 */
export function Section({
  id,
  children,
  className,
  innerClassName,
  width = "default",
  /** Adds a fading hairline above the section. */
  divided = true,
  as: Component = "section",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  width?: keyof typeof WIDTHS;
  divided?: boolean;
  as?: React.ElementType;
}) {
  return (
    <Component
      id={id}
      className={cn("relative scroll-mt-20", divided && "border-t border-line-subtle", className)}
    >
      <div className={cn("mx-auto w-full px-5 py-20 sm:px-8 sm:py-24", WIDTHS[width], innerClassName)}>
        {children}
      </div>
    </Component>
  );
}

/**
 * Section heading block: a mono eyebrow, a display heading and a lead
 * paragraph. Reusing it is what keeps the page's vertical rhythm consistent.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  actions,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Eyebrow className={cn(align === "center" && "justify-center")}>{eyebrow}</Eyebrow>
      <h2 className="max-w-3xl text-balance text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-fg-secondary sm:text-base">
          {description}
        </p>
      ) : null}
      {actions ? <div className="mt-2">{actions}</div> : null}
    </div>
  );
}

/** Mono label with a leading accent tick — the page's recurring motif. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 technical text-2xs uppercase tracking-[0.16em] text-fg-muted",
        className,
      )}
    >
      <span aria-hidden className="h-px w-4 bg-accent" />
      {children}
    </p>
  );
}
