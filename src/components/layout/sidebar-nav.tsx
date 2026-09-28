"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Kbd } from "@/components/ui/kbd";
import { Tooltip } from "@/components/ui/tooltip";
import { NAV_GROUPS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavRow({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  const row = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex h-8 items-center gap-2.5 rounded-sm px-2 text-sm transition-colors focus-ring",
        collapsed && "justify-center px-0",
        active
          ? "bg-accent-muted font-medium text-accent"
          : "text-fg-secondary hover:bg-surface-hover hover:text-fg",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
        />
      ) : null}
      <Icon className="size-4 shrink-0" aria-hidden />
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.shortcut ? (
            <span
              aria-hidden
              className="hidden shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 xl:flex"
            >
              {item.shortcut.split(" ").map((key) => (
                <Kbd key={key} className="h-4 min-w-4 text-[10px]">
                  {key}
                </Kbd>
              ))}
            </span>
          ) : null}
          {item.badge ? (
            <span className="technical shrink-0 text-2xs text-fg-muted">{item.badge}</span>
          ) : null}
        </>
      ) : null}
    </Link>
  );

  if (!collapsed) return row;

  return (
    <Tooltip
      side="right"
      content={
        <span className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-fg">{item.label}</span>
          <span className="text-2xs text-fg-muted">{item.description}</span>
        </span>
      }
    >
      {row}
    </Tooltip>
  );
}

/**
 * Sidebar navigation groups. Shared by the desktop rail and the mobile drawer
 * so both stay in sync automatically.
 */
export function SidebarNav({
  collapsed = false,
  onNavigate,
  className,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={cn("flex flex-col gap-4", className)}>
      {NAV_GROUPS.map((group) => (
        <div key={group.id} className="flex flex-col gap-0.5">
          {collapsed ? (
            <div aria-hidden className="mx-2 mb-1 h-px bg-line-subtle" />
          ) : (
            <p className="px-2 pb-1 pt-1 text-2xs font-medium uppercase tracking-wide text-fg-muted">
              {group.label}
            </p>
          )}
          {group.items.map((item) => (
            <NavRow
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={isActivePath(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}
