"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-xs font-medium text-fg-secondary select-none peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

/** Vertical form row: label, control, helper text and error slot. */
export function Field({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-fg-muted", className)} {...props} />;
}

export function FieldError({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p role="alert" className={cn("text-xs font-medium text-danger", className)} {...props} />
  );
}

/**
 * Horizontal settings row — label and description on the left, control on the
 * right. Used throughout Settings, Providers and Models.
 */
export function FieldRow({
  label,
  description,
  htmlFor,
  children,
  className,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        {htmlFor ? (
          <Label htmlFor={htmlFor} className="text-sm text-fg">
            {label}
          </Label>
        ) : (
          <span className="text-sm font-medium text-fg">{label}</span>
        )}
        {description ? (
          <FieldDescription className="max-w-prose">{description}</FieldDescription>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}
