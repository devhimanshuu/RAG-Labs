"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { IconButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { useUIStore } from "@/lib/store/ui";

const OPTIONS = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
] as const;

/**
 * Theme picker. The icon is only resolved after mount because `resolvedTheme`
 * is unknown during server rendering — rendering it earlier would produce a
 * hydration mismatch on the icon.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);

  React.useEffect(() => setMounted(true), []);

  const current = mounted ? (theme ?? "dark") : "dark";
  const ActiveIcon = OPTIONS.find((option) => option.value === current)?.icon ?? Moon;

  return (
    <DropdownMenu>
      <Tooltip content="Appearance">
        <DropdownMenuTrigger asChild>
          <IconButton label="Change appearance" size="sm" disabled={!mounted}>
            <ActiveIcon />
          </IconButton>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current} onValueChange={setTheme}>
          {OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <option.icon className="size-3.5" aria-hidden />
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <div className="px-2 py-1.5">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="text-2xs text-fg-muted transition-colors hover:text-accent"
          >
            More commands via ⌘K
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
