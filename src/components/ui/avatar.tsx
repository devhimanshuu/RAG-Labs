"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-5 text-[9px]",
  sm: "size-6 text-[10px]",
  md: "size-7 text-2xs",
  lg: "size-9 text-xs",
} as const;

export function Avatar({
  initials,
  alt,
  size = "md",
  className,
  ...props
}: {
  initials: string;
  alt: string;
  size?: keyof typeof SIZES;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>, "children">) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-line bg-surface-hover",
        SIZES[size],
        className,
      )}
      {...props}
    >
      {alt ? <AvatarPrimitive.Image alt={alt} className="size-full object-cover" /> : null}
      <AvatarPrimitive.Fallback
        delayMs={alt ? 200 : 0}
        className="technical flex size-full items-center justify-center font-medium uppercase text-fg-secondary"
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

/** Overlapping avatar row for workspace members. */
export function AvatarStack({
  members,
  max = 4,
  className,
}: {
  members: Array<{ id: string; initials: string; name: string }>;
  max?: number;
  className?: string;
}) {
  const visible = members.slice(0, max);
  const overflow = members.length - visible.length;

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((member) => (
        <Avatar
          key={member.id}
          initials={member.initials}
          alt={member.name}
          size="sm"
          className="-ml-1.5 ring-2 ring-surface first:ml-0"
        />
      ))}
      {overflow > 0 ? (
        <span className="technical -ml-1.5 inline-flex size-6 items-center justify-center rounded-full border border-line bg-surface-hover text-2xs text-fg-muted ring-2 ring-surface">
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
