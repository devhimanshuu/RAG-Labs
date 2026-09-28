"use client";

import { Boxes, RefreshCw, SearchX } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toolbar, ToolbarCount, ToolbarSearch, ToolbarSpacer } from "@/components/ui/toolbar";
import { HEALTH_STATUS_META } from "@/lib/constants/status";
import { mockModels, mockProviders, timeAgo } from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import {
  formatCompactNumber,
  formatCostPerMillion,
  formatNumber,
  pluralize,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { HealthStatus, Model, ModelKind, ProviderId } from "@/types";

/** Muted text for the common healthy case; semantic colour only when it matters. */
const STATUS_TEXT: Record<HealthStatus, string> = {
  healthy: "text-fg-secondary",
  degraded: "text-warning",
  unavailable: "text-danger",
};

const KIND_TABS: Array<{ value: ModelKind | "all"; label: string }> = [
  { value: "all", label: "All models" },
  { value: "chat", label: "Chat" },
  { value: "embedding", label: "Embedding" },
  { value: "rerank", label: "Rerank" },
];

export function ModelsView() {
  const [search, setSearch] = React.useState("");
  const [kind, setKind] = React.useState<ModelKind | "all">("all");
  const [providerId, setProviderId] = React.useState<ProviderId | "all">("all");

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return mockModels.filter((model) => {
      if (kind !== "all" && model.kind !== kind) return false;
      if (providerId !== "all" && model.providerId !== providerId) return false;
      if (!term) return true;
      return (
        model.name.toLowerCase().includes(term) ||
        model.providerName.toLowerCase().includes(term) ||
        model.capabilities.some((capability) => capability.includes(term))
      );
    });
  }, [kind, providerId, search]);

  const chatModels = mockModels.filter((model) => model.kind === "chat");
  const largestContext = chatModels.reduce(
    (max, model) => Math.max(max, model.contextWindow),
    0,
  );

  const columns: Array<Column<Model>> = [
    {
      id: "name",
      header: "Model",
      cell: (row) => (
        <span className="flex min-w-0 flex-col">
          <span className="technical truncate text-xs font-medium text-fg">{row.name}</span>
          <span className="truncate text-2xs text-fg-muted">
            {row.capabilities.join(" · ")}
          </span>
        </span>
      ),
      sortValue: (row) => row.name,
      cellClassName: "max-w-[17rem]",
    },
    {
      id: "provider",
      header: "Provider",
      cell: (row) => <span className="truncate text-xs text-fg-secondary">{row.providerName}</span>,
      sortValue: (row) => row.providerName,
    },
    {
      id: "kind",
      header: "Kind",
      cell: (row) => (
        <Badge tone="neutral" mono>
          {row.kind}
        </Badge>
      ),
      sortValue: (row) => row.kind,
      hideBelow: "sm",
    },
    {
      id: "context",
      header: "Context",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs text-fg-secondary">
          {formatCompactNumber(row.contextWindow)}
        </span>
      ),
      sortValue: (row) => row.contextWindow,
    },
    {
      id: "dimensions",
      header: "Dims",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs text-fg-secondary">
          {row.dimensions ? formatNumber(row.dimensions) : "—"}
        </span>
      ),
      sortValue: (row) => row.dimensions ?? 0,
      hideBelow: "lg",
    },
    {
      id: "inputCost",
      header: "Input / 1M",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs text-fg-secondary">
          {formatCostPerMillion(row.inputCostPerMillion)}
        </span>
      ),
      sortValue: (row) => row.inputCostPerMillion,
    },
    {
      id: "outputCost",
      header: "Output / 1M",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs text-fg-secondary">
          {formatCostPerMillion(row.outputCostPerMillion)}
        </span>
      ),
      sortValue: (row) => row.outputCostPerMillion,
      hideBelow: "md",
    },
    {
      id: "status",
      header: "Status",
      align: "right",
      cell: (row) => {
        const meta = HEALTH_STATUS_META[row.status];
        return (
          // Fifteen identical green badges would be noise; only a degraded or
          // unavailable model earns a colour here.
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-2xs",
              STATUS_TEXT[row.status],
            )}
          >
            <StatusIndicator tone={meta.tone} size="xs" />
            {meta.label}
          </span>
        );
      },
      sortValue: (row) => row.status,
    },
    {
      id: "released",
      header: "Added",
      align: "right",
      cell: (row) => (
        <span className="technical text-2xs text-fg-muted">{timeAgo(row.releasedAt)}</span>
      ),
      sortValue: (row) => new Date(row.releasedAt).getTime(),
      hideBelow: "2xl",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Models"
        description="Chat, embedding and rerank models available to plays, pipelines and evaluators."
        actions={
          <>
            <Button variant="secondary" asChild>
              <Link href="/providers">Manage providers</Link>
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                toast.info(
                  "Catalogue refreshed",
                  "Re-read model metadata from each connected provider.",
                )
              }
            >
              <RefreshCw />
              Refresh catalogue
            </Button>
          </>
        }
        meta={
          <>
            <span className="technical text-2xs text-fg-muted">
              {pluralize(mockModels.length, "model")} across{" "}
              {pluralize(mockProviders.length, "provider")}
            </span>
            <span className="technical text-2xs text-fg-muted">
              largest context {formatCompactNumber(largestContext)}
            </span>
          </>
        }
      />

      <Tabs value={kind} onValueChange={(value) => setKind(value as ModelKind | "all")}>
        <TabsList>
          {KIND_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="technical text-2xs text-fg-muted">
                {tab.value === "all"
                  ? mockModels.length
                  : mockModels.filter((model) => model.kind === tab.value).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Toolbar>
        <ToolbarSearch
          value={search}
          onValueChange={setSearch}
          placeholder="Search models, capabilities…"
          label="Search models"
        />

        <Select
          value={providerId}
          onValueChange={(value) => setProviderId(value as ProviderId | "all")}
        >
          <SelectTrigger className="w-40" aria-label="Filter by provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All providers</SelectItem>
            {mockProviders.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToolbarSpacer />
        <ToolbarCount shown={filtered.length} total={mockModels.length} noun="models" />
      </Toolbar>

      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(row) => row.id}
          initialSort={{ columnId: "context", direction: "desc" }}
          emptyState={
            <tr>
              <td colSpan={columns.length} className="p-0">
                <EmptyState
                  icon={mockModels.length === 0 ? Boxes : SearchX}
                  title="No models match those filters"
                  description="Try a different provider, kind or search term."
                  actions={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setKind("all");
                        setProviderId("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  }
                  bordered={false}
                  className="py-14"
                />
              </td>
            </tr>
          }
          minWidth="72rem"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tag>Pricing is per million tokens</Tag>
        <Tag>Ollama models run locally at zero marginal cost</Tag>
        <Tag>Embedding dimensions are fixed per model</Tag>
      </div>
    </div>
  );
}
