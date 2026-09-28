import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)} {...props} />
  );
}

export function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("inline-flex min-w-0 items-center gap-1.5", className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li role="presentation" aria-hidden className={cn("text-fg-disabled", className)} {...props}>
      <ChevronRight className="size-3.5" />
    </li>
  );
}

/** Root crumb — always the workspace, kept muted so the page title leads. */
export function BreadcrumbRoot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("technical text-xs uppercase tracking-wide text-fg-muted", className)}
      {...props}
    />
  );
}

export function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      className={cn("truncate text-sm font-medium text-fg", className)}
      {...props}
    />
  );
}
