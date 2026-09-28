import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Standard page header: title, description, primary actions and an optional
 * slot for tabs or a filter bar. Every route uses it so vertical rhythm and
 * action placement stay identical across the app.
 */
export function PageHeader({
  title,
  description,
  actions,
  meta,
  tabs,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  /** Compact metadata row rendered under the title block. */
  meta?: React.ReactNode;
  /** Tabs or filters, rendered flush with the content below. */
  tabs?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-fg">{title}</h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-relaxed text-fg-secondary">{description}</p>
          ) : null}
          {meta ? <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5">{meta}</div> : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {tabs ? <div className="mt-4">{tabs}</div> : null}
    </div>
  );
}

/** Divider between a page header and the content that follows. */
export function PageDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("my-5 h-px w-full bg-line-subtle", className)} />;
}
