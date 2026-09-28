import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Application panel: the workhorse container for dense tool surfaces.
 *
 * A Panel is a Card with a fixed-height chrome row, which keeps toolbars and
 * titles aligned across Playground, Traces and Pipelines.
 */
export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-lg border border-line bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn(
        "flex min-h-11 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-subtle px-3.5 py-2",
        className,
      )}
      {...props}
    />
  );
}

export function PanelTitle({
  className,
  icon: Icon,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { icon?: React.ElementType }) {
  return (
    <h2 className={cn("flex items-center gap-2 text-sm font-medium text-fg", className)} {...props}>
      {Icon ? <Icon className="size-3.5 text-fg-muted" aria-hidden /> : null}
      {children}
    </h2>
  );
}

export function PanelDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-fg-muted", className)} {...props} />;
}

/** Right-aligned control cluster inside a PanelHeader. */
export function PanelActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-1.5", className)} {...props} />;
}

export function PanelBody({
  className,
  padded = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { padded?: boolean }) {
  return <div className={cn("min-w-0 flex-1", padded && "p-3.5", className)} {...props} />;
}

export function PanelFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cn(
        "flex shrink-0 items-center justify-between gap-3 border-t border-line-subtle px-3.5 py-2",
        className,
      )}
      {...props}
    />
  );
}
