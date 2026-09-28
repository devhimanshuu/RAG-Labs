"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";

import { IconButton } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

/**
 * Monospaced code surface. Line numbers are opt-in because most RAGLabs code
 * blocks are short snippets or prompts where numbering adds noise.
 */
export function CodeBlock({
  code,
  language,
  title,
  lineNumbers = false,
  wrap = false,
  maxHeight,
  className,
  actions,
}: {
  code: string;
  /** Rendered as a label in the header; purely informational. */
  language?: string;
  title?: string;
  lineNumbers?: boolean;
  wrap?: boolean;
  /** CSS max-height, e.g. "24rem". Enables internal scrolling. */
  maxHeight?: string;
  className?: string;
  actions?: React.ReactNode;
}) {
  const { copied, copy } = useCopyToClipboard();
  const lines = React.useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const hasHeader = Boolean(title || language || actions);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-surface-inset",
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex items-center justify-between gap-3 border-b border-line-subtle px-3 py-1.5">
          <div className="flex min-w-0 items-center gap-2">
            {title ? <span className="truncate text-xs text-fg-secondary">{title}</span> : null}
            {language ? (
              <span className="technical shrink-0 text-2xs uppercase tracking-wide text-fg-muted">
                {language}
              </span>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {actions}
            <IconButton
              label={copied ? "Copied" : "Copy code"}
              size="xs"
              variant="ghost"
              onClick={() => void copy(code)}
            >
              {copied ? <Check className="text-success" /> : <Copy />}
            </IconButton>
          </div>
        </div>
      ) : null}
      <div
        className="overflow-auto scrollbar-thin"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <pre className="technical p-3 text-xs leading-5 text-fg-secondary">
          <code className="block">
            {lines.map((line, index) => (
              <span key={index} className={cn("block", wrap && "whitespace-pre-wrap break-words")}>
                {lineNumbers ? (
                  <span className="mr-3 inline-block w-6 select-none text-right text-fg-disabled">
                    {index + 1}
                  </span>
                ) : null}
                {line.length ? line : "\u00A0"}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
