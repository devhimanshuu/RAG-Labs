"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as React from "react";

import { cn } from "@/lib/utils";

export const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(function ToggleGroup({ className, ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn(
        "inline-flex flex-wrap items-center gap-1",
        className,
      )}
      {...props}
    />
  );
});

export const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(function ToggleGroupItem({ className, ...props }, ref) {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-sm border border-line bg-surface px-2.5 text-xs font-medium text-fg-secondary transition-colors focus-ring",
        "hover:border-line-strong hover:bg-surface-hover hover:text-fg",
        "data-[state=on]:border-accent-line data-[state=on]:bg-accent-muted data-[state=on]:text-accent",
        "disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-3.5",
        className,
      )}
      {...props}
    />
  );
});
