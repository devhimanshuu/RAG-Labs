"use client";

import { ChevronsLeft, ChevronsRight, Gauge } from "lucide-react";
import * as React from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { IconButton } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { APP_VERSION, SHORTCUTS } from "@/lib/constants/app";
import { useUIStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

/** Workspace-level index usage meter shown above the account row. */
function UsageMeter({ collapsed }: { collapsed: boolean }) {
  const usedPercent = 62;
  const usedTokens = 24_600_000;

  if (collapsed) {
    return (
      <Tooltip
        side="right"
        content={
          <span className="flex flex-col gap-0.5">
            <span className="text-xs text-fg">Index usage</span>
            <span className="technical text-2xs text-fg-muted">
              {(usedTokens / 1_000_000).toFixed(1)}M / 40M vectors · {usedPercent}%
            </span>
          </span>
        }
      >
        <div className="flex h-8 items-center justify-center">
          <Gauge className="size-3.5 text-fg-muted" aria-hidden />
        </div>
      </Tooltip>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 px-1.5 py-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xs font-medium text-fg-secondary">Index usage</span>
        <span className="technical text-2xs text-fg-muted">{usedPercent}%</span>
      </div>
      <Progress value={usedPercent} aria-label="Index usage" className="h-1" />
      <span className="technical text-[10px] text-fg-disabled">
        {(usedTokens / 1_000_000).toFixed(1)}M of 40M vectors
      </span>
    </div>
  );
}

export function Sidebar() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);

  return (
    <aside
      aria-label="Sidebar"
      data-collapsed={collapsed || undefined}
      className={cn(
        "sticky top-12 hidden h-[calc(100dvh-3rem)] shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 ease-out lg:flex",
        collapsed ? "w-14" : "w-60",
      )}
    >
      <div className="shrink-0 p-2">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto px-2 scrollbar-thin">
        <SidebarNav collapsed={collapsed} />
      </nav>

      <div className="shrink-0 border-t border-line-subtle p-2">
        <UsageMeter collapsed={collapsed} />
        {!collapsed ? (
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="mt-1 flex w-full items-center justify-between rounded-sm px-1.5 py-1 text-2xs text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg-secondary focus-ring"
          >
            <span>Command palette</span>
            <span className="technical">{SHORTCUTS.commandPalette.label}</span>
          </button>
        ) : null}
        <div className="mt-1 flex items-center gap-1">
          <div className="min-w-0 flex-1">
            <UserMenu variant="full" collapsed={collapsed} />
          </div>
          {!collapsed ? (
            <Tooltip
              side="top"
              content={
                <span className="flex items-center gap-1.5">
                  Collapse sidebar
                  <span className="technical text-2xs text-fg-muted">
                    {SHORTCUTS.toggleSidebar.label}
                  </span>
                </span>
              }
            >
              <IconButton label="Collapse sidebar" size="sm" onClick={toggleSidebar}>
                <ChevronsLeft />
              </IconButton>
            </Tooltip>
          ) : null}
        </div>
        {collapsed ? (
          <Tooltip side="right" content="Expand sidebar">
            <IconButton
              label="Expand sidebar"
              size="sm"
              className="mt-1 w-full"
              onClick={toggleSidebar}
            >
              <ChevronsRight />
            </IconButton>
          </Tooltip>
        ) : (
          <p className="technical mt-2 px-1.5 text-[10px] uppercase tracking-wide text-fg-disabled">
            v{APP_VERSION}
          </p>
        )}
      </div>
    </aside>
  );
}
