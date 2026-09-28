"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = "end",
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-52 overflow-hidden rounded-lg border border-line bg-surface-elevated p-1 shadow-lg",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

const ITEM_CLASSES =
  "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-fg-secondary outline-none transition-colors data-[highlighted]:bg-surface-hover data-[highlighted]:text-fg data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-fg-muted";

export function DropdownMenuItem({
  className,
  icon: Icon,
  shortcut,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  icon?: React.ElementType;
  /** Rendered as a trailing key hint, right-aligned. */
  shortcut?: string;
}) {
  return (
    <DropdownMenuPrimitive.Item className={cn(ITEM_CLASSES, className)} {...props}>
      {Icon ? <Icon aria-hidden /> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut ? (
        <span className="technical ml-3 shrink-0 text-2xs text-fg-disabled">{shortcut}</span>
      ) : null}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(ITEM_CLASSES, "pr-6", className)}
      {...props}
    >
      {children}
      <span className="absolute right-2 flex items-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-3.5 text-accent" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem className={cn(ITEM_CLASSES, "pr-6", className)} {...props}>
      {children}
      <span className="absolute right-2 flex items-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="size-1.5 rounded-full bg-accent" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-2xs font-medium uppercase tracking-wide text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-line-subtle", className)}
      {...props}
    />
  );
}
