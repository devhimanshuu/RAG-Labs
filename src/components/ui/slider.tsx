"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(function Slider({ className, ...props }, ref) {
  const thumbCount = props.value?.length ?? props.defaultValue?.length ?? 1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2",
        "data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-surface-hover">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="focus-ring block size-3.5 rounded-full border-2 border-accent bg-surface shadow-xs transition-transform hover:scale-110 disabled:pointer-events-none"
          aria-label="Value"
        />
      ))}
    </SliderPrimitive.Root>
  );
});

/** Slider with a label and a live technical readout of the current value. */
export function LabeledSlider({
  id,
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (next: number) => String(next),
  description,
  disabled,
  className,
}: {
  id: string;
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium text-fg-secondary">
          {label}
        </label>
        <span className="technical text-xs text-fg">{formatValue(value)}</span>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={([next]) => onValueChange(next)}
        aria-label={label}
      />
      {description ? <p className="text-2xs text-fg-muted">{description}</p> : null}
    </div>
  );
}
