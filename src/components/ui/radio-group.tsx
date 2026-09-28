"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@/lib/utils";

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(function RadioGroup({ className, ...props }, ref) {
  return <RadioGroupPrimitive.Root ref={ref} className={cn("grid gap-2", className)} {...props} />;
});

export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(function RadioGroupItem({ className, ...props }, ref) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-line-strong bg-surface-inset transition-colors",
        "hover:border-fg-disabled focus-ring",
        "data-[state=checked]:border-accent disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex size-full items-center justify-center">
        <span className="size-1.5 rounded-full bg-accent" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

/** Selectable card wrapping a radio item — used for strategy and theme choices. */
export function RadioCard({
  value,
  id,
  title,
  description,
  icon: Icon,
  badge,
  className,
}: {
  value: string;
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-3 rounded-md border border-line bg-surface p-3 transition-colors",
        "hover:border-line-strong hover:bg-surface-hover",
        "has-[[data-state=checked]]:border-accent-line has-[[data-state=checked]]:bg-accent-muted",
        className,
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2 text-sm font-medium text-fg">
          {Icon ? <Icon className="size-3.5 text-fg-muted" aria-hidden /> : null}
          {title}
          {badge}
        </span>
        {description ? (
          <span className="text-xs leading-relaxed text-fg-muted">{description}</span>
        ) : null}
      </div>
    </label>
  );
}
