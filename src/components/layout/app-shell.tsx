"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { CommandPalette } from "@/components/command/command-palette";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SHORTCUTS } from "@/lib/constants/app";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { toast } from "@/lib/store/toast";
import { useUIStore } from "@/lib/store/ui";
import { useHotkeys } from "@/hooks/use-hotkeys";
import type { AppPath } from "@/types";

/**
 * Application shell.
 *
 * Owns the persistent chrome (top bar, sidebar, drawer, command palette) and the
 * global keyboard map. Page content is rendered inside `main`.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);
  const toggleCommandPalette = useUIStore((state) => state.toggleCommandPalette);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const hotkeys = React.useMemo(() => {
    const bindings: Record<string, (event: KeyboardEvent) => void> = {
      "mod+k": () => toggleCommandPalette(),
      "mod+b": () => toggleSidebar(),
      "mod+/": () =>
        toast.info(
          "Keyboard shortcuts",
          "⌘K commands · ⌘B sidebar · G then a letter to navigate",
        ),
    };

    // "G then <letter>" navigation, derived from the nav definition.
    for (const item of NAV_ITEMS) {
      if (!item.shortcut) continue;
      const [prefix, key] = item.shortcut.toLowerCase().split(" ");
      if (!prefix || !key) continue;
      bindings[`${prefix} ${key}`] = () => router.push(item.href as AppPath);
    }

    return bindings;
  }, [router, toggleCommandPalette, toggleSidebar]);

  useHotkeys(hotkeys);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-100 focus:rounded-sm focus:border focus:border-accent-line focus:bg-surface-elevated focus:px-3 focus:py-1.5 focus:text-sm focus:text-fg"
      >
        Skip to content
      </a>

      <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      <div className="flex flex-1 items-start">
        <Sidebar />
        <main id="main-content" className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-5 lg:px-6">
            {children}
          </div>
        </main>
      </div>

      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <CommandPalette />

      {/* Announces shortcut availability to screen readers on first paint. */}
      <p className="sr-only">
        Press {SHORTCUTS.commandPalette.label} to open the command palette.
      </p>
    </div>
  );
}
