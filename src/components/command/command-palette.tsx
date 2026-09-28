"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import * as React from "react";

import { DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd, KbdSequence } from "@/components/ui/kbd";
import { useCommandRegistry } from "@/components/command/use-command-registry";
import { SHORTCUTS } from "@/lib/constants/app";
import { useUIStore } from "@/lib/store/ui";

/**
 * Global command palette (⌘K / Ctrl+K).
 *
 * Built on cmdk, which owns the combobox semantics, arrow navigation and
 * filtering; this component adds RAGLab's grouping, iconography and shortcuts.
 */
export function CommandPalette() {
  const open = useUIStore((state) => state.commandPaletteOpen);
  const setOpen = useUIStore((state) => state.setCommandPaletteOpen);
  const groups = useCommandRegistry();

  // cmdk keeps its own query/selection state, so remount on each open to reset.
  const [instanceKey, setInstanceKey] = React.useState(0);
  React.useEffect(() => {
    if (open) setInstanceKey((current) => current + 1);
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          aria-label="Command palette"
          className="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-surface-elevated shadow-xl data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out"
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search for a page, or run a RAGLab command.
          </DialogPrimitive.Description>

          <Command key={instanceKey} loop className="flex flex-col">
            <div className="flex items-center gap-2.5 border-b border-line-subtle px-3.5">
              <Search className="size-4 shrink-0 text-fg-muted" aria-hidden />
              <CommandInput
                autoFocus
                placeholder="Search pages and commands…"
                aria-label="Search pages and commands"
              />
              <KbdSequence keys={SHORTCUTS.commandPalette.label} className="shrink-0" />
            </div>

            <CommandList className="max-h-[22rem]">
              <CommandEmpty>No matching commands.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.id} heading={group.label}>
                  {group.commands.map((command) => {
                    const Icon = command.icon;
                    return (
                      <CommandItem
                        key={command.id}
                        value={[command.label, command.description, ...(command.keywords ?? [])]
                          .filter(Boolean)
                          .join(" ")}
                        onSelect={() => command.run()}
                        className="justify-between"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          {Icon ? (
                            <Icon className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
                          ) : null}
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate">{command.label}</span>
                            {command.description ? (
                              <span className="truncate text-2xs text-fg-muted">
                                {command.description}
                              </span>
                            ) : null}
                          </span>
                        </span>
                        {command.shortcut ? (
                          <KbdSequence
                            keys={command.shortcut}
                            className="shrink-0 pl-3 opacity-70"
                          />
                        ) : null}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>

            <div className="flex items-center justify-between gap-4 border-t border-line-subtle px-3.5 py-2 text-2xs text-fg-muted">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Kbd>↑↓</Kbd> navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>↵</Kbd> select
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>Esc</Kbd> close
                </span>
              </span>
              <span className="technical hidden sm:inline">RAGLab</span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}
