"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-100 focus-ring disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Accent owns exactly one filled treatment so cyan stays scarce. */
        primary:
          "bg-accent-solid text-accent-fg hover:bg-accent-solid-hover shadow-xs font-semibold",
        secondary:
          "border border-line bg-surface text-fg hover:bg-surface-hover hover:border-line-strong",
        subtle: "bg-surface-hover text-fg hover:bg-surface-active",
        ghost: "text-fg-secondary hover:bg-surface-hover hover:text-fg",
        outline:
          "border border-line-strong bg-transparent text-fg hover:bg-surface-hover",
        danger:
          "border border-danger-line bg-danger-muted text-danger hover:bg-danger hover:text-canvas hover:border-danger",
        link: "text-accent underline-offset-4 hover:underline hover:text-accent-hover",
      },
      size: {
        xs: "h-6 px-2 text-2xs [&_svg]:size-3",
        sm: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
        md: "h-8 px-3 text-sm [&_svg]:size-4",
        lg: "h-9 px-4 text-sm [&_svg]:size-4",
      },
      /** Square affordance for a single icon; omits horizontal padding. */
      square: {
        true: "px-0 aspect-square",
        false: "",
      },
    },
    compoundVariants: [
      { size: "xs", square: true, class: "w-6" },
      { size: "sm", square: true, class: "w-7" },
      { size: "md", square: true, class: "w-8" },
      { size: "lg", square: true, class: "w-9" },
    ],
    defaultVariants: { variant: "secondary", size: "md", square: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, square, asChild = false, type, ...props },
  ref,
) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, square }), className)}
      {...props}
    />
  );
});

export interface IconButtonProps extends Omit<ButtonProps, "square" | "children"> {
  /** Required: icon-only controls need an accessible name. */
  label: string;
  children: React.ReactNode;
}

/** Icon-only button. Always square, always labelled for assistive tech. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, className, variant = "ghost", size = "sm", ...props }, ref) {
    return (
      <Button
        ref={ref}
        aria-label={label}
        title={label}
        variant={variant}
        size={size}
        square
        className={className}
        {...props}
      />
    );
  },
);
