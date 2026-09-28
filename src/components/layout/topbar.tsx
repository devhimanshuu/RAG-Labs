"use client";

import { HelpCircle, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Logo } from "@/components/layout/logo";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbRoot,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconButton } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { APP_NAME, SHORTCUTS, WORKSPACE } from "@/lib/constants/app";
import { getRouteMeta } from "@/lib/constants/navigation";
import { useUIStore } from "@/lib/store/ui";

/** Placeholder search affordance — opens the command palette, as in Raycast. */
function SearchTrigger() {
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);

  return (
    <>
      <button
        type="button"
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden h-7 w-44 items-center gap-2 rounded-sm border border-line bg-surface-inset px-2 text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg-secondary focus-ring md:flex xl:w-56"
      >
        <Search className="size-3.5 shrink-0" aria-hidden />
        <span className="flex-1 text-left">Search…</span>
        <Kbd>⌘K</Kbd>
      </button>
      <IconButton
        label="Search"
        size="sm"
        className="md:hidden"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search />
      </IconButton>
    </>
  );
}

function HelpMenu() {
  return (
    <Popover>
      <Tooltip content={`Help · ${SHORTCUTS.help.label}`}>
        <PopoverTrigger asChild>
          <IconButton label="Help and shortcuts" size="sm">
            <HelpCircle />
          </IconButton>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="border-b border-line-subtle px-3 py-2.5">
          <p className="text-xs font-medium text-fg">Keyboard shortcuts</p>
        </div>
        <dl className="divide-y divide-line-subtle">
          {[
            { label: "Command palette", keys: SHORTCUTS.commandPalette.label },
            { label: "Toggle sidebar", keys: SHORTCUTS.toggleSidebar.label },
            { label: "Run query", keys: SHORTCUTS.runQuery.label },
            { label: "New experiment", keys: SHORTCUTS.newExperiment.label },
            { label: "New dataset", keys: SHORTCUTS.newDataset.label },
            { label: "Go to a page", keys: "G then letter" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 px-3 py-2">
              <dt className="text-xs text-fg-secondary">{row.label}</dt>
              <dd className="technical text-2xs text-fg-muted">{row.keys}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-line-subtle px-3 py-2">
          <span className="text-2xs text-fg-muted">
            Navigation is fully keyboard operable — no pointer required.
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const meta = getRouteMeta(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b border-line bg-canvas/85 px-2.5 backdrop-blur-md sm:px-3">
      <IconButton
        label="Open navigation"
        size="sm"
        className="lg:hidden"
        onClick={onOpenMobileNav}
      >
        <Menu />
      </IconButton>

      <Link
        href="/dashboard"
        className="flex shrink-0 items-center rounded-sm focus-ring"
        aria-label={`${APP_NAME} home`}
      >
        <Logo />
      </Link>

      <span aria-hidden className="hidden h-4 w-px shrink-0 bg-line sm:block" />

      <Breadcrumb className="hidden min-w-0 sm:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbRoot>{WORKSPACE.name}</BreadcrumbRoot>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{meta?.title ?? "Not found"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <SearchTrigger />
        <span aria-hidden className="mx-0.5 hidden h-4 w-px bg-line sm:block" />
        <HelpMenu />
        <NotificationMenu />
        <ThemeToggle />
        <span aria-hidden className="mx-0.5 hidden h-4 w-px bg-line sm:block" />
        <UserMenu variant="compact" />
      </div>
    </header>
  );
}
