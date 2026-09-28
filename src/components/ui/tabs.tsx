"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

/**
 * Two list treatments: `underline` for page-level section switching, `pill` for
 * compact segmented controls inside panels.
 */
export function TabsList({
  className,
  variant = "underline",
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: "underline" | "pill";
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        // Horizontal scroll keeps long tab sets usable on narrow viewports
        // instead of wrapping or overflowing the page.
        "flex max-w-full items-center overflow-x-auto scrollbar-none",
        variant === "underline"
          ? "gap-1 border-b border-line-subtle"
          : "w-fit gap-0.5 rounded-md border border-line bg-surface-inset p-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  variant = "underline",
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  variant?: "underline" | "pill";
}) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors focus-ring",
        "text-fg-muted hover:text-fg-secondary disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-fg [&_svg]:size-3.5",
        variant === "underline"
          ? "-mb-px h-9 border-b-2 border-transparent px-2.5 data-[state=active]:border-accent"
          : "h-7 rounded-sm px-2.5 text-xs data-[state=active]:bg-surface data-[state=active]:shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("outline-none focus-visible:outline-none", className)}
      {...props}
    />
  );
}
