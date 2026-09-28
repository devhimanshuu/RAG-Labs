import type { LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Empty state. Every list surface in RAGLabs renders one of these rather than a
 * blank region, so an empty workspace still reads as a finished product.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  hint,
  className,
  bordered = true,
  ...props
}: {
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Optional secondary line, typically a keyboard shortcut or CLI hint. */
  hint?: React.ReactNode;
  bordered?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        bordered && "rounded-lg border border-dashed border-line",
        className,
      )}
      {...props}
    >
      <span className="flex size-9 items-center justify-center rounded-md border border-line bg-surface-hover">
        <Icon className="size-4 text-fg-muted" aria-hidden />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-sm font-medium text-fg">{title}</p>
        {description ? (
          <p className="text-xs leading-relaxed text-fg-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="mt-1 flex items-center gap-2">{actions}</div> : null}
      {hint ? <div className="text-2xs text-fg-disabled">{hint}</div> : null}
    </div>
  );
}

/** Compact inline empty row for tables, so the header row stays visible. */
export function EmptyRow({
  colSpan,
  icon: Icon,
  title,
  description,
  actions,
}: {
  colSpan: number;
  icon: LucideIcon;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <EmptyState
          icon={Icon}
          title={title}
          description={description}
          actions={actions}
          bordered={false}
          className="py-12"
        />
      </td>
    </tr>
  );
}
