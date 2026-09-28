import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Renders generated answers.
 *
 * Phase 1 mock answers use only three constructs — paragraphs, numbered lists
 * and `**bold**` spans — so this handles exactly those rather than pulling in a
 * full markdown renderer. Phase 2 should swap this for a real markdown pipeline
 * with citation linking once answers come from the API.
 */

const BOLD_PATTERN = /\*\*([^*]+)\*\*/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  BOLD_PATTERN.lastIndex = 0;
  while ((match = BOLD_PATTERN.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    nodes.push(
      <strong key={`${keyPrefix}-b${index}`} className="font-medium text-fg">
        {match[1]}
      </strong>,
    );
    cursor = match.index + match[0].length;
    index += 1;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export function AnswerText({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = React.useMemo(() => groupBlocks(content), [content]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {blocks.map((block, blockIndex) => {
        if (block.type === "list") {
          return (
            <ol key={blockIndex} className="flex flex-col gap-2">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2.5">
                  <span className="technical mt-0.5 shrink-0 text-2xs text-accent">
                    {itemIndex + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-sm leading-relaxed text-fg-secondary">
                    {renderInline(item, `${blockIndex}-${itemIndex}`)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={blockIndex} className="text-sm leading-relaxed text-fg-secondary">
            {renderInline(block.text, String(blockIndex))}
          </p>
        );
      })}
    </div>
  );
}

type Block = { type: "paragraph"; text: string } | { type: "list"; items: string[] };

function groupBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  const lines = content.split("\n");
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ type: "list", items: listBuffer });
      listBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const listMatch = /^(?:\d+\.|[-*])\s+(.*)$/.exec(line);

    if (listMatch) {
      listBuffer.push(listMatch[1]);
      continue;
    }

    flushList();
    if (line.length > 0) blocks.push({ type: "paragraph", text: line });
  }

  flushList();
  return blocks;
}
