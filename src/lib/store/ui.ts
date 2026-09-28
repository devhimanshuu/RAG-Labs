"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Density } from "@/types";

interface UIState {
  /** Desktop sidebar collapsed to the icon rail. */
  sidebarCollapsed: boolean;
  /** Mobile / tablet navigation drawer. Never persisted. */
  mobileNavOpen: boolean;
  commandPaletteOpen: boolean;
  density: Density;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setDensity: (density: Density) => void;
  /** Applied once after mount so persisted state never breaks SSR markup. */
  rehydrate: () => void;
}

/**
 * Global UI state. Deliberately small: only state that must survive across
 * routes and cannot live in a URL lives here.
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandPaletteOpen: false,
      density: "comfortable",
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      toggleCommandPalette: () => set({ commandPaletteOpen: !get().commandPaletteOpen }),
      setDensity: (density) => set({ density }),
      rehydrate: () => {
        void useUIStore.persist.rehydrate();
      },
    }),
    {
      name: "raglab.ui",
      storage: createJSONStorage(() => localStorage),
      // Server renders the defaults; persisted values apply after mount.
      skipHydration: true,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        density: state.density,
      }),
    },
  ),
);
