"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const fieldStyles =
  "w-full rounded-md border border-line bg-surface-inset text-fg transition-colors duration-100 placeholder:text-fg-muted hover:border-line-strong focus:border-accent-line disabled:cursor-not-allowed disabled:opacity-50 read-only:text-fg-secondary";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders leading/trailing adornments (icons, keyboard hints, units). */
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, startAdornment, endAdornment, ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      className={cn(
        fieldStyles,
        "h-8 px-2.5 text-sm",
        startAdornment && "pl-7",
        endAdornment && "pr-8",
        className,
      )}
      {...props}
    />
  );

  if (!startAdornment && !endAdornment) return input;

  return (
    <div className="relative flex w-full items-center">
      {startAdornment ? (
        <span className="pointer-events-none absolute left-2.5 flex items-center text-fg-muted [&_svg]:size-3.5">
          {startAdornment}
        </span>
      ) : null}
      {input}
      {endAdornment ? (
        <span className="absolute right-2 flex items-center text-fg-muted [&_svg]:size-3.5">
          {endAdornment}
        </span>
      ) : null}
    </div>
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(fieldStyles, "resize-y px-2.5 py-2 text-sm leading-relaxed", className)}
      {...props}
    />
  );
});
