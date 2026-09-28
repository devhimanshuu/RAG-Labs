"use client";

import * as React from "react";

import { Logo } from "@/components/layout/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { APP_VERSION } from "@/lib/constants/app";

/**
 * Mobile and tablet navigation drawer. Reuses the sidebar's nav so there is a
 * single definition of the route list and its active states.
 */
export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" size="sm" className="w-64 max-w-[80vw] gap-0" showClose={false}>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line-subtle px-3">
          <Logo />
        </div>
        <div className="shrink-0 p-2">
          <WorkspaceSwitcher />
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
          <SidebarNav onNavigate={() => onOpenChange(false)} />
        </nav>
        <div className="shrink-0 border-t border-line-subtle p-2">
          <UserMenu variant="full" />
          <p className="technical mt-2 px-1.5 text-[10px] uppercase tracking-wide text-fg-disabled">
            v{APP_VERSION}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
