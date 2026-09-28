"use client";

import { FileSearch, LayoutGrid, Plus, Rows3 } from "lucide-react";
import * as React from "react";

import { DatasetCard } from "@/components/datasets/dataset-card";
import { DatasetDetailSheet } from "@/components/datasets/dataset-detail-sheet";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toolbar, ToolbarCount, ToolbarGroup, ToolbarSearch, ToolbarSpacer } from "@/components/ui/toolbar";
import { INDEX_STATUS_META } from "@/lib/constants/status";
import { timeAgo, mockDatasets } from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import type { Dataset, IndexStatus } from "@/types";

type SortKey = "updated" | "name" | "documents" | "chunks";

const SORT_LABELS: Record<SortKey, string> = {
  updated: "Recently updated",
  name: "Name (A–Z)",
  documents: "Most documents",
  chunks: "Most chunks",
};

function sortDatasets(datasets: Dataset[], sort: SortKey): Dataset[] {
  const copy = [...datasets];
  switch (sort) {
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "documents":
      return copy.sort((a, b) => b.documentCount - a.documentCount);
    case "chunks":
      return copy.sort((a, b) => b.chunkCount - a.chunkCount);
    case "updated":
    default:
      return copy.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }
}

export function DatasetsView() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<IndexStatus | "all">("all");
  const [sort, setSort] = React.useState<SortKey>("updated");
  const [view, setView] = React.useState<"grid" | "table">("grid");
  const [selected, setSelected] = React.useState<Dataset | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    const matched = mockDatasets.filter((dataset) => {
      if (statusFilter !== "all" && dataset.indexStatus !== statusFilter) return false;
      if (!term) return true;
      return (
        dataset.name.toLowerCase().includes(term) ||
        dataset.description.toLowerCase().includes(term) ||
        dataset.tags.some((tag) => tag.includes(term))
      );
    });

    return sortDatasets(matched, sort);
  }, [search, sort, statusFilter]);

  const openDataset = React.useCallback((dataset: Dataset) => {
    setSelected(dataset);
    setSheetOpen(true);
  }, []);

  const totalDocuments = mockDatasets.reduce((total, dataset) => total + dataset.documentCount, 0);
  const totalChunks = mockDatasets.reduce((total, dataset) => total + dataset.chunkCount, 0);

  const columns: Array<Column<Dataset>> = [
    {
      id: "name",
      header: "Dataset",
      cell: (row) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-medium text-fg">{row.name}</span>
          <span className="truncate text-2xs text-fg-muted">{row.description}</span>
        </span>
      ),
      sortValue: (row) => row.name,
    },
    {
      id: "documents",
      header: "Documents",
      align: "right",
      cell: (row) => <span className="technical text-xs">{formatNumber(row.documentCount)}</span>,
      sortValue: (row) => row.documentCount,
    },
    {
      id: "chunks",
      header: "Chunks",
      align: "right",
      cell: (row) => <span className="technical text-xs">{formatNumber(row.chunkCount)}</span>,
      sortValue: (row) => row.chunkCount,
    },
    {
      id: "tokens",
      header: "Tokens",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs">{formatCompactNumber(row.tokenCount)}</span>
      ),
      sortValue: (row) => row.tokenCount,
      hideBelow: "sm",
    },
    {
      id: "model",
      header: "Embedding model",
      cell: (row) => (
        <span className="technical truncate text-xs text-fg-secondary">{row.embeddingModel}</span>
      ),
      hideBelow: "md",
    },
    {
      id: "status",
      header: "Status",
      align: "right",
      cell: (row) => {
        const meta = INDEX_STATUS_META[row.indexStatus];
        return (
          <Badge tone={meta.tone} mono>
            <StatusIndicator tone={meta.tone} pulse={meta.pulse} size="xs" />
            {meta.label}
          </Badge>
        );
      },
      sortValue: (row) => row.indexStatus,
    },
    {
      id: "updated",
      header: "Updated",
      align: "right",
      cell: (row) => (
        <span className="technical text-2xs text-fg-muted">{timeAgo(row.updatedAt)}</span>
      ),
      sortValue: (row) => new Date(row.updatedAt).getTime(),
      hideBelow: "lg",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Datasets"
        description="Corpora available for retrieval, with their chunk, token and embedding configuration."
        actions={
          <Button
            variant="primary"
            onClick={() =>
              toast.info(
                "Create dataset",
                "Document ingestion and index building arrive in Phase 2.",
              )
            }
          >
            <Plus />
            New dataset
          </Button>
        }
        meta={
          <>
            <span className="technical text-2xs text-fg-muted">
              {mockDatasets.length} datasets
            </span>
            <span className="technical text-2xs text-fg-muted">
              {formatNumber(totalDocuments)} documents
            </span>
            <span className="technical text-2xs text-fg-muted">
              {formatNumber(totalChunks)} chunks
            </span>
          </>
        }
      />

      <Toolbar>
        <ToolbarSearch
          value={search}
          onValueChange={setSearch}
          placeholder="Search datasets, descriptions, tags…"
          label="Search datasets"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as IndexStatus | "all")}
        >
          <SelectTrigger className="w-40" aria-label="Filter by index status" size="md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(INDEX_STATUS_META) as IndexStatus[]).map((status) => (
              <SelectItem key={status} value={status}>
                {INDEX_STATUS_META[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
          <SelectTrigger className="w-44" aria-label="Sort datasets">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <SelectItem key={key} value={key}>
                {SORT_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToolbarSpacer />

        <ToolbarGroup>
          <ToolbarCount shown={filtered.length} total={mockDatasets.length} noun="datasets" />
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && setView(value as "grid" | "table")}
            aria-label="View mode"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <Rows3 />
            </ToggleGroupItem>
          </ToggleGroup>
        </ToolbarGroup>
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="No datasets match those filters"
          description="Adjust the search term or reset the status filter to see all datasets."
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : view === "grid" ? (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((dataset) => (
            <li key={dataset.id}>
              <DatasetCard dataset={dataset} onOpen={openDataset} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <DataTable
            columns={columns}
            rows={filtered}
            getRowId={(row) => row.id}
            onRowClick={openDataset}
            initialSort={{ columnId: "chunks", direction: "desc" }}
            emptyState={
              <tr>
                <td colSpan={columns.length} className="px-3 py-12 text-center text-xs text-fg-muted">
                  No datasets match those filters.
                </td>
              </tr>
            }
            minWidth="56rem"
          />
        </div>
      )}

      <DatasetDetailSheet
        dataset={selected}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelected(null);
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Tag>Embedding dimensions supported: 384 · 768 · 1024 · 1536 · 3072</Tag>
        <Tag>Cosine similarity</Tag>
        <Tag>HNSW + ivfflat</Tag>
      </div>
    </div>
  );
}
