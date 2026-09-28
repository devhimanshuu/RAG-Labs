"use client";

import { MoreHorizontal, Pencil, RefreshCw, Trash2 } from "lucide-react";
import * as React from "react";

import { Badge, Tag } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { INDEX_STATUS_META } from "@/lib/constants/status";
import { timeAgo } from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import type { Dataset } from "@/types";

/**
 * Dataset card.
 *
 * Chunk and token counts are the numbers that decide whether an index is
 * affordable, so they get the technical type treatment and sit above the fold.
 */
export function DatasetCard({
  dataset,
  onOpen,
}: {
  dataset: Dataset;
  onOpen: (dataset: Dataset) => void;
}) {
  const status = INDEX_STATUS_META[dataset.indexStatus];

  return (
    <article className="group relative flex flex-col rounded-lg border border-line bg-surface transition-colors hover:border-line-strong">
      <button
        type="button"
        onClick={() => onOpen(dataset)}
        className="flex flex-1 flex-col rounded-lg p-3.5 text-left focus-ring"
        aria-label={`Open ${dataset.name}`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate text-sm font-medium text-fg">{dataset.name}</h3>
          <Badge tone={status.tone} mono className="shrink-0">
            <StatusIndicator tone={status.tone} pulse={status.pulse} size="xs" />
            {status.label}
          </Badge>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-fg-muted">
          {dataset.description}
        </p>

        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line-subtle pt-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-2xs text-fg-muted">Documents</dt>
            <dd className="technical text-sm text-fg">{formatNumber(dataset.documentCount)}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-2xs text-fg-muted">Chunks</dt>
            <dd className="technical text-sm text-fg">{formatNumber(dataset.chunkCount)}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-2xs text-fg-muted">Tokens</dt>
            <dd className="technical text-sm text-fg">
              {formatCompactNumber(dataset.tokenCount)}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {dataset.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-line-subtle px-3 py-2">
        <span className="flex min-w-0 flex-col">
          <span className="technical truncate text-2xs text-fg-secondary">
            {dataset.embeddingModel}
          </span>
          <span className="technical text-2xs text-fg-disabled">
            {formatNumber(dataset.embeddingDimensions)} dims · updated {timeAgo(dataset.updatedAt)}
          </span>
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton label={`Actions for ${dataset.name}`} size="sm">
              <MoreHorizontal />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              icon={Pencil}
              onSelect={() => toast.info("Rename dataset", "Editing arrives in Phase 2.")}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={RefreshCw}
              onSelect={() =>
                toast.info(
                  "Re-index requested",
                  `Queued a full re-embed of ${dataset.name}.`,
                )
              }
            >
              Re-index
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              icon={Trash2}
              className="text-danger data-[highlighted]:text-danger"
              onSelect={() =>
                toast.warning(
                  "Deleting datasets is disabled",
                  "Index mutation is not available in Phase 1.",
                )
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
