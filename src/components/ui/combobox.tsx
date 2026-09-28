"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Right-aligned technical metadata, e.g. a dimension or context window. */
  meta?: string;
  /** Optional grouping key. */
  group?: string;
}

/**
 * Searchable single-select. Preferred over `Select` once a list exceeds roughly
 * a dozen options or when options carry technical metadata.
 */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches",
  disabled = false,
  className,
  triggerClassName,
  id,
  "aria-label": ariaLabel,
}: {
  options: ComboboxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  id?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  const groups = React.useMemo(() => {
    const map = new Map<string, ComboboxOption[]>();
    for (const option of options) {
      const key = option.group ?? "";
      const bucket = map.get(key);
      if (bucket) bucket.push(option);
      else map.set(key, [option]);
    }
    return Array.from(map.entries());
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface-inset px-2.5 text-sm transition-colors",
          "hover:border-line-strong focus-ring disabled:cursor-not-allowed disabled:opacity-50",
          selected ? "text-fg" : "text-fg-muted",
          triggerClassName,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          {selected?.meta ? (
            <span className="technical shrink-0 text-2xs text-fg-muted">{selected.meta}</span>
          ) : null}
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
      </PopoverTrigger>
      <PopoverContent className={cn("w-[--radix-popover-trigger-width] min-w-60 p-0", className)}>
        <Command loop>
          <div className="border-b border-line-subtle">
            <CommandInput placeholder={searchPlaceholder} />
          </div>
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {groups.map(([groupName, groupOptions]) => (
              <CommandGroup key={groupName || "default"} heading={groupName || undefined}>
                {groupOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "size-3.5 shrink-0",
                        option.value === value ? "text-accent" : "text-transparent",
                      )}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.meta ? (
                      <span className="technical shrink-0 text-2xs text-fg-muted">{option.meta}</span>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
