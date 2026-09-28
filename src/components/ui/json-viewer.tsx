"use client";

import { Check, ChevronDown, Copy } from "lucide-react";
import * as React from "react";

import { IconButton } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const VALUE_CLASSES: Record<string, string> = {
  string: "text-success",
  number: "text-info",
  boolean: "text-warning",
  null: "text-fg-disabled",
  key: "text-fg-secondary",
};

function primitive(value: JsonValue): string {
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

function kindOf(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/** Single key/value line. */
function JsonRow({
  label,
  value,
  depth,
  trailingComma,
  expandDepth,
}: {
  label: string | null;
  value: JsonValue;
  depth: number;
  trailingComma: boolean;
  /** Remaining auto-expand levels; children receive one less. */
  expandDepth: number;
}) {
  const isContainer = typeof value === "object" && value !== null;
  const [open, setOpen] = React.useState(expandDepth > 0);

  const entries = React.useMemo(() => {
    if (!isContainer) return [] as Array<[string, JsonValue]>;
    return Array.isArray(value)
      ? value.map((item, index) => [String(index), item] as [string, JsonValue])
      : Object.entries(value as Record<string, JsonValue>);
  }, [isContainer, value]);

  const isArray = Array.isArray(value);
  const openBrace = isArray ? "[" : "{";
  const closeBrace = isArray ? "]" : "}";

  return (
    <div style={{ paddingLeft: depth === 0 ? 0 : 14 }} className="relative">
      <div className="flex items-start gap-1">
        {isContainer && entries.length > 0 ? (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="focus-ring -ml-1 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-xs text-fg-muted hover:text-fg"
          >
            <ChevronDown
              className={cn("size-3 transition-transform", !open && "-rotate-90")}
              aria-hidden
            />
          </button>
        ) : (
          <span className="ml-3 w-4 shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          {label !== null ? (
            <span className={VALUE_CLASSES.key}>{label}</span>
          ) : null}
          {label !== null ? <span className="text-fg-muted">: </span> : null}

          {isContainer ? (
            <>
              <span className="text-fg-muted">{openBrace}</span>
              {!open || entries.length === 0 ? (
                <span className="text-fg-muted">
                  {entries.length === 0 ? "" : ` ${entries.length} ${isArray ? "items" : "keys"} `}
                  {closeBrace}
                  {trailingComma ? "," : ""}
                </span>
              ) : null}
            </>
          ) : (
            <span className={cn(VALUE_CLASSES[kindOf(value)])}>
              {primitive(value)}
              {trailingComma ? "," : ""}
            </span>
          )}
        </div>
      </div>

      {isContainer && open && entries.length > 0 ? (
        <div>
          {entries.map(([key, child], index) => (
            <JsonRow
              key={key}
              label={isArray ? null : key}
              value={child}
              depth={depth + 1}
              trailingComma={index < entries.length - 1}
              expandDepth={Math.max(0, expandDepth - 1)}
            />
          ))}
          <div className="text-fg-muted">
            {closeBrace}
            {trailingComma ? "," : ""}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Collapsible JSON inspector.
 *
 * Used for retrieval metadata, trace payloads and pipeline configs — the places
 * where a developer needs to read the raw shape rather than a formatted view.
 */
export function JSONViewer({
  data,
  title,
  defaultExpandDepth = 1,
  maxHeight = "20rem",
  className,
}: {
  data: unknown;
  title?: string;
  /** Depth at which nested containers start collapsed. */
  defaultExpandDepth?: number;
  maxHeight?: string;
  className?: string;
}) {
  const { copied, copy } = useCopyToClipboard();
  const serialized = React.useMemo(() => JSON.stringify(data, null, 2), [data]);

  return (
    <div className={cn("overflow-hidden rounded-lg border border-line bg-surface-inset", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line-subtle px-3 py-1.5">
        <span className="truncate text-xs text-fg-secondary">{title ?? "JSON"}</span>
        <IconButton
          label={copied ? "Copied" : "Copy JSON"}
          size="xs"
          variant="ghost"
          onClick={() => void copy(serialized)}
        >
          {copied ? <Check className="text-success" /> : <Copy />}
        </IconButton>
      </div>
      <div className="overflow-auto p-3 scrollbar-thin" style={{ maxHeight }}>
        <div className="technical text-xs leading-5">
          <JsonRow
            label={null}
            value={data as JsonValue}
            depth={0}
            trailingComma={false}
            expandDepth={defaultExpandDepth}
          />
        </div>
      </div>
    </div>
  );
}
