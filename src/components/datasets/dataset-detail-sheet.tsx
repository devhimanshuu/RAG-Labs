"use client";

import { Database, FileText } from "lucide-react";
import * as React from "react";

import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { JSONViewer } from "@/components/ui/json-viewer";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DOCUMENT_STATUS_META, INDEX_STATUS_META } from "@/lib/constants/status";
import { toast } from "@/lib/store/toast";
import {
  formatBytes,
  formatCompactNumber,
  formatNumber,
  formatTimestamp,
} from "@/lib/utils";
import type { Dataset, DatasetDocument } from "@/types";

const DOCUMENT_COLUMNS: Array<Column<DatasetDocument>> = [
  {
    id: "name",
    header: "Document",
    cell: (row) => (
      <span className="flex min-w-0 items-center gap-2">
        <FileText className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
        <span className="truncate text-xs text-fg">{row.name}</span>
      </span>
    ),
    sortValue: (row) => row.name,
  },
  {
    id: "pages",
    header: "Pages",
    align: "right",
    cell: (row) => <span className="technical text-xs">{formatNumber(row.pages)}</span>,
    sortValue: (row) => row.pages,
    hideBelow: "sm",
  },
  {
    id: "chunks",
    header: "Chunks",
    align: "right",
    cell: (row) => <span className="technical text-xs">{formatNumber(row.chunks)}</span>,
    sortValue: (row) => row.chunks,
  },
  {
    id: "size",
    header: "Size",
    align: "right",
    cell: (row) => <span className="technical text-xs">{formatBytes(row.sizeBytes)}</span>,
    sortValue: (row) => row.sizeBytes,
    hideBelow: "md",
  },
  {
    id: "status",
    header: "Status",
    align: "right",
    cell: (row) => {
      const meta = DOCUMENT_STATUS_META[row.status];
      return (
        <span className="inline-flex items-center gap-1.5 text-2xs text-fg-secondary">
          <StatusIndicator tone={meta.tone} pulse={meta.pulse} size="xs" />
          {meta.label}
        </span>
      );
    },
    sortValue: (row) => row.status,
  },
];

function DetailStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2.5">
      <span className="text-2xs uppercase tracking-wide text-fg-muted">{label}</span>
      <span className="technical text-sm text-fg">{value}</span>
      {hint ? <span className="technical text-2xs text-fg-disabled">{hint}</span> : null}
    </div>
  );
}

export function DatasetDetailSheet({
  dataset,
  open,
  onOpenChange,
}: {
  dataset: Dataset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!dataset) return null;
  const status = INDEX_STATUS_META[dataset.indexStatus];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full">
        <SheetHeader>
          <span className="flex items-center gap-2">
            <span className="technical text-2xs uppercase tracking-wide text-fg-muted">
              Dataset
            </span>
            <Badge tone={status.tone} mono>
              <StatusIndicator tone={status.tone} pulse={status.pulse} size="xs" />
              {status.label}
            </Badge>
          </span>
          <SheetTitle>{dataset.name}</SheetTitle>
          <SheetDescription>{dataset.description}</SheetDescription>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {dataset.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            <span className="technical text-2xs text-fg-disabled">{dataset.id}</span>
          </div>
        </SheetHeader>

        <div className="grid shrink-0 grid-cols-2 divide-line-subtle border-b border-line-subtle sm:grid-cols-4 sm:divide-x">
          <DetailStat label="Documents" value={formatNumber(dataset.documentCount)} />
          <DetailStat label="Chunks" value={formatNumber(dataset.chunkCount)} />
          <DetailStat label="Tokens" value={formatCompactNumber(dataset.tokenCount)} />
          <DetailStat
            label="Last updated"
            value={formatTimestamp(dataset.updatedAt)}
            hint={`created ${formatTimestamp(dataset.createdAt)}`}
          />
        </div>

        <Tabs defaultValue="documents" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="shrink-0 px-4 pt-2">
            <TabsTrigger value="documents">
              Documents
              <span className="technical text-2xs text-fg-muted">
                {dataset.documents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="index">Index configuration</TabsTrigger>
          </TabsList>

          <SheetBody className="p-4">
            <TabsContent value="documents">
              <div className="overflow-hidden rounded-lg border border-line bg-surface">
                <DataTable
                  columns={DOCUMENT_COLUMNS}
                  rows={dataset.documents}
                  getRowId={(row) => row.id}
                  initialSort={{ columnId: "chunks", direction: "desc" }}
                  emptyState={
                    <tr>
                      <td colSpan={DOCUMENT_COLUMNS.length} className="px-3 py-10 text-center text-xs text-fg-muted">
                        No documents in this dataset.
                      </td>
                    </tr>
                  }
                  minWidth="38rem"
                />
              </div>
              <p className="mt-2 text-2xs text-fg-muted">
                Showing {dataset.documents.length} of {formatNumber(dataset.documentCount)}{" "}
                documents. Parsing and chunk inspection arrive in Phase 2.
              </p>
            </TabsContent>

            <TabsContent value="index" className="flex flex-col gap-3">
              <JSONViewer
                title="index"
                defaultExpandDepth={3}
                data={{
                  id: dataset.id,
                  embedding: {
                    model: dataset.embeddingModel,
                    dimensions: dataset.embeddingDimensions,
                    normalize: true,
                  },
                  chunking: { strategy: "recursive", size: 1024, overlap: 128 },
                  index: { type: "hnsw", metric: "cosine", lists: 200, probes: 6 },
                  counts: { documents: dataset.documentCount, chunks: dataset.chunkCount },
                }}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.info("Re-index requested", `Queued ${dataset.name}.`)}
                >
                  <Database />
                  Re-index dataset
                </Button>
              </div>
            </TabsContent>
          </SheetBody>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
