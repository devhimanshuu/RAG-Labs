"use client";

import { Search, X } from "lucide-react";
import * as React from "react";

import { IconButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Wrapping control row placed directly under a page header. */
export function Toolbar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

/** Pushes everything after it to the right edge of the toolbar. */
export function ToolbarSpacer() {
  return <span aria-hidden className="ml-auto" />;
}

export function ToolbarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-2", className)} {...props} />;
}

/**
 * Search field for list pages. Controlled — the page owns the query so it can
 * also drive the empty state and result count.
 */
export function ToolbarSearch({
  value,
  onValueChange,
  placeholder = "Search…",
  label = "Search",
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("w-full sm:w-64", className)}>
      <Input
        type="search"
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        startAdornment={<Search aria-hidden />}
        endAdornment={
          value ? (
            <IconButton
              label="Clear search"
              size="xs"
              variant="ghost"
              className="size-5"
              onClick={() => onValueChange("")}
            >
              <X />
            </IconButton>
          ) : null
        }
      />
    </div>
  );
}

/** Inline result count, kept monospaced so it aligns with table figures. */
export function ToolbarCount({ shown, total, noun }: { shown: number; total: number; noun: string }) {
  return (
    <span className="technical text-2xs text-fg-muted">
      {shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`}
    </span>
  );
}
