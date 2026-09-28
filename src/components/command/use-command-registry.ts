"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import { NAV_ITEMS } from "@/lib/constants/navigation";
import { SHORTCUTS } from "@/lib/constants/app";
import { useToastStore } from "@/lib/store/toast";
import { useUIStore } from "@/lib/store/ui";
import type { AppPath } from "@/types";

export interface CommandDefinition {
  id: string;
  label: string;
  /** Secondary line shown under the label. */
  description?: string;
  icon?: React.ElementType;
  /** Rendered as key caps on the right edge. */
  shortcut?: string;
  /** Extra search terms that should surface this command. */
  keywords?: string[];
  run: () => void;
}

export interface CommandGroupDefinition {
  id: string;
  label: string;
  commands: CommandDefinition[];
}

/**
 * The single source of truth for palette commands.
 *
 * Phase 2 features (create experiment, upload dataset, replay trace) register
 * here rather than inside the palette component.
 */
export function useCommandRegistry(): CommandGroupDefinition[] {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);
  const pushToast = useToastStore((state) => state.push);

  const close = React.useCallback(() => {
    setCommandPaletteOpen(false);
  }, [setCommandPaletteOpen]);

  const go = React.useCallback(
    (href: AppPath) => {
      close();
      setMobileNavOpen(false);
      router.push(href);
    },
    [close, router, setMobileNavOpen],
  );

  return React.useMemo<CommandGroupDefinition[]>(() => {
    const navigation: CommandDefinition[] = NAV_ITEMS.map((item) => ({
      id: `go-${item.href.slice(1)}`,
      label: `Go to ${item.label}`,
      description: item.description,
      icon: item.icon,
      shortcut: item.shortcut,
      keywords: [item.label.toLowerCase()],
      run: () => go(item.href),
    }));

    const create: CommandDefinition[] = [
      {
        id: "create-experiment",
        label: "Create Experiment",
        description: "Evaluate a strategy against a dataset",
        shortcut: SHORTCUTS.newExperiment.label,
        keywords: ["new", "run", "benchmark", "eval"],
        run: () => {
          close();
          pushToast({
            title: "Create experiment",
            description: "The experiment builder arrives in Phase 2.",
            tone: "info",
          });
        },
      },
      {
        id: "create-dataset",
        label: "Create Dataset",
        description: "Ingest documents and build an index",
        shortcut: SHORTCUTS.newDataset.label,
        keywords: ["new", "upload", "corpus", "ingest"],
        run: () => {
          close();
          pushToast({
            title: "Create dataset",
            description: "Document ingestion arrives in Phase 2.",
            tone: "info",
          });
        },
      },
      {
        id: "create-pipeline",
        label: "Create Pipeline",
        description: "Compose retrieval and generation stages",
        keywords: ["new", "graph", "flow"],
        run: () => {
          close();
          pushToast({
            title: "Create pipeline",
            description: "The pipeline editor arrives in Phase 2.",
            tone: "info",
          });
        },
      },
    ];

    const actions: CommandDefinition[] = [
      {
        id: "search",
        label: "Search",
        description: "Search datasets, experiments, traces and models",
        shortcut: SHORTCUTS.search.label,
        keywords: ["find", "filter", "query"],
        run: () => {
          close();
          pushToast({
            title: "Global search",
            description: "Full-text search arrives once the API is connected.",
            tone: "info",
          });
        },
      },
      {
        id: "open-settings",
        label: "Open Settings",
        description: "Workspace, appearance and integrations",
        icon: NAV_ITEMS[NAV_ITEMS.length - 1].icon,
        shortcut: "G S",
        keywords: ["preferences", "config"],
        run: () => go("/settings"),
      },
      {
        id: "toggle-sidebar",
        label: "Toggle Sidebar",
        description: "Collapse or expand the navigation rail",
        shortcut: SHORTCUTS.toggleSidebar.label,
        keywords: ["nav", "collapse", "expand"],
        run: () => {
          close();
          toggleSidebar();
        },
      },
      {
        id: "copy-workspace-id",
        label: "Copy Workspace ID",
        keywords: ["identifier", "clipboard"],
        run: () => {
          close();
          void navigator.clipboard?.writeText("ws_raglab_research");
          pushToast({ title: "Workspace ID copied", tone: "success" });
        },
      },
    ];

    const appearance: CommandDefinition[] = [
      {
        id: "toggle-theme",
        label: "Toggle Theme",
        description: `Currently ${resolvedTheme === "light" ? "light" : "dark"}`,
        keywords: ["dark", "light", "appearance", "mode"],
        run: () => {
          close();
          setTheme(resolvedTheme === "light" ? "dark" : "light");
        },
      },
      {
        id: "theme-dark",
        label: "Use Dark Theme",
        keywords: ["night", "appearance"],
        run: () => {
          close();
          setTheme("dark");
        },
      },
      {
        id: "theme-light",
        label: "Use Light Theme",
        keywords: ["day", "appearance"],
        run: () => {
          close();
          setTheme("light");
        },
      },
      {
        id: "theme-system",
        label: "Use System Theme",
        keywords: ["auto", "appearance"],
        run: () => {
          close();
          setTheme("system");
        },
      },
    ];

    const help: CommandDefinition[] = [
      {
        id: "documentation",
        label: "Open Documentation",
        description: "Guides for datasets, strategies and metrics",
        keywords: ["docs", "help", "learn"],
        run: () => {
          close();
          pushToast({
            title: "Documentation",
            description: "The docs site is not part of Phase 1.",
            tone: "info",
          });
        },
      },
      {
        id: "keyboard-shortcuts",
        label: "Keyboard Shortcuts",
        shortcut: SHORTCUTS.help.label,
        keywords: ["keys", "hotkeys", "help"],
        run: () => {
          close();
          pushToast({
            title: "Keyboard shortcuts",
            description: "⌘K commands · ⌘B sidebar · G then a letter to navigate",
            tone: "info",
          });
        },
      },
    ];

    return [
      { id: "navigation", label: "Navigation", commands: navigation },
      { id: "create", label: "Create", commands: create },
      { id: "actions", label: "Actions", commands: actions },
      { id: "appearance", label: "Appearance", commands: appearance },
      { id: "help", label: "Help", commands: help },
    ];
  }, [
    close,
    go,
    pushToast,
    resolvedTheme,
    setTheme,
    toggleSidebar,
  ]);
}
