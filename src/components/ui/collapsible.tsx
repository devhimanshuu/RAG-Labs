"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleContent = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(function CollapsibleContent({ className, ...props }, ref) {
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Disclosure trigger with a rotating chevron. Styled as a quiet inline control so
 * it reads as a section header rather than a button.
 */
export function CollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        "group flex w-full items-center gap-1.5 rounded-sm py-1.5 text-xs font-medium text-fg-secondary transition-colors hover:text-fg focus-ring [&[data-state=open]>svg]:rotate-90",
        className,
      )}
      {...props}
    >
      <ChevronRight
        className="size-3.5 shrink-0 text-fg-muted transition-transform duration-150"
        aria-hidden
      />
      {children}
    </CollapsiblePrimitive.Trigger>
  );
}
