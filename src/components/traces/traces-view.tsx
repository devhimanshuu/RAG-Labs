"use client";

import { Activity, Download, SearchX } from "lucide-react";
import * as React from "react";

import { PageHeader } from "@/components/layout/page-header";
import { TraceDetailSheet } from "@/components/traces/trace-detail-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Toolbar, ToolbarCount, ToolbarSearch, ToolbarSpacer } from "@/components/ui/toolbar";
import { RAG_STRATEGIES, STRATEGY_LABELS } from "@/lib/constants/app";
import { mockTraces, timeAgo } from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import {
  cn,
  formatCostPerMillion,
  formatDuration,
  formatNumber,
  shortId,
} from "@/lib/utils";
import type { RagStrategy, Trace } from "@/types";

/** Nearest-rank percentile over an unsorted sample. */
function percentile(values: number[], fraction: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor(fraction * sorted.length));
  return sorted[index];
}

function LatencyCell({ value, max }: { value: number; max: number }) {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  // Anything past two seconds is the tail a developer is hunting for.
  const tone = value >= 2000 ? "bg-danger" : value >= 1200 ? "bg-warning" : "bg-accent";

  return (
    <span className="flex items-center justify-end gap-2">
      <span
        aria-hidden
        className="hidden h-1 w-16 overflow-hidden rounded-full bg-surface-hover lg:flex"
      >
        <span className={cn("h-full rounded-full", tone)} style={{ width: `${ratio * 100}%` }} />
      </span>
      <span className="technical w-12 text-right text-xs text-fg-secondary">
        {formatDuration(value)}
      </span>
    </span>
  );
}

function PercentileStat({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-2xs uppercase tracking-wide text-fg-muted">{label}</span>
      <span className="technical text-xs text-fg">{formatDuration(value)}</span>
    </span>
  );
}

export function TracesView() {
  const [search, setSearch] = React.useState("");
  const [strategyFilter, setStrategyFilter] = React.useState<RagStrategy | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "ok" | "error">("all");
  const [selected, setSelected] = React.useState<Trace | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return mockTraces.filter((trace) => {
      if (strategyFilter !== "all" && trace.strategy !== strategyFilter) return false;
      if (statusFilter !== "all" && trace.status !== (statusFilter === "ok" ? "ok" : "error")) {
        return false;
      }
      if (!term) return true;
      return (
        trace.query.toLowerCase().includes(term) ||
        trace.id.includes(term) ||
        shortId(trace.id).toLowerCase().includes(term) ||
        trace.datasetName.toLowerCase().includes(term) ||
        trace.model.toLowerCase().includes(term)
      );
    });
  }, [search, statusFilter, strategyFilter]);

  const latencies = mockTraces.map((trace) => trace.latencyMs);
  const maxLatency = Math.max(...latencies, 1);
  const errorCount = mockTraces.filter((trace) => trace.status === "error").length;

  const columns: Array<Column<Trace>> = [
    {
      id: "id",
      header: "Trace",
      cell: (row) => (
        <span className="flex items-center gap-2">
          <StatusIndicator
            tone={row.status === "error" ? "danger" : "success"}
            size="xs"
          />
          <span className="technical text-xs text-accent">#{shortId(row.id)}</span>
        </span>
      ),
      sortValue: (row) => row.id,
      width: "7rem",
    },
    {
      id: "query",
      header: "Query",
      cell: (row) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-xs text-fg">{row.query}</span>
          <span className="truncate text-2xs text-fg-muted">
            {row.datasetName} · {row.model}
          </span>
        </span>
      ),
      sortValue: (row) => row.query,
      cellClassName: "max-w-[26rem]",
    },
    {
      id: "strategy",
      header: "Strategy",
      cell: (row) => (
        <Badge tone="neutral" mono>
          {STRATEGY_LABELS[row.strategy]}
        </Badge>
      ),
      sortValue: (row) => row.strategy,
      hideBelow: "md",
    },
    {
      id: "steps",
      header: "Stages",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs text-fg-secondary">{row.steps.length}</span>
      ),
      sortValue: (row) => row.steps.length,
      hideBelow: "lg",
    },
    {
      id: "latency",
      header: "Latency",
      align: "right",
      cell: (row) => <LatencyCell value={row.latencyMs} max={maxLatency} />,
      sortValue: (row) => row.latencyMs,
    },
    {
      id: "tokens",
      header: "Tokens",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs text-fg-secondary">
          {formatNumber(row.inputTokens + row.outputTokens)}
        </span>
      ),
      sortValue: (row) => row.inputTokens + row.outputTokens,
      hideBelow: "sm",
    },
    {
      id: "cost",
      header: "Cost",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs text-fg-secondary">
          {formatCostPerMillion(row.costUsd)}
        </span>
      ),
      sortValue: (row) => row.costUsd,
      hideBelow: "xl",
    },
    {
      id: "created",
      header: "Time",
      align: "right",
      cell: (row) => (
        <span className="technical text-2xs text-fg-muted">{timeAgo(row.createdAt)}</span>
      ),
      sortValue: (row) => new Date(row.createdAt).getTime(),
      hideBelow: "md",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Traces"
        description="Request-level timing, retrieval decisions and token usage for every query the workspace has executed."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                toast.info("Export traces", "Trace export to JSONL arrives in Phase 2.")
              }
            >
              <Download />
              Export
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                toast.info(
                  "Live tail",
                  "Streaming traces requires the Phase 2 ingestion pipeline.",
                )
              }
            >
              <Activity />
              Live tail
            </Button>
          </>
        }
        meta={
          <>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <PercentileStat label="p50" value={percentile(latencies, 0.5)} />
              <PercentileStat label="p95" value={percentile(latencies, 0.95)} />
              <PercentileStat label="max" value={maxLatency} />
            </span>
            {errorCount > 0 ? (
              <span className="technical text-2xs text-danger">{errorCount} failed</span>
            ) : null}
          </>
        }
      />

      <Toolbar>
        <ToolbarSearch
          value={search}
          onValueChange={setSearch}
          placeholder="Search query, trace ID, dataset…"
          label="Search traces"
        />

        <Select
          value={strategyFilter}
          onValueChange={(value) => setStrategyFilter(value as RagStrategy | "all")}
        >
          <SelectTrigger className="w-40" aria-label="Filter by strategy">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All strategies</SelectItem>
            {RAG_STRATEGIES.map((strategy) => (
              <SelectItem key={strategy.id} value={strategy.id}>
                {strategy.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as "all" | "ok" | "error")}
        >
          <SelectTrigger className="w-32" aria-label="Filter by outcome">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All outcomes</SelectItem>
            <SelectItem value="ok">Succeeded</SelectItem>
            <SelectItem value="error">Failed</SelectItem>
          </SelectContent>
        </Select>

        <ToolbarSpacer />
        <ToolbarCount shown={filtered.length} total={mockTraces.length} noun="traces" />
      </Toolbar>

      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(row) => row.id}
          onRowClick={(row) => {
            setSelected(row);
            setSheetOpen(true);
          }}
          initialSort={{ columnId: "created", direction: "desc" }}
          emptyState={
            <tr>
              <td colSpan={columns.length} className="p-0">
                <EmptyState
                  icon={SearchX}
                  title="No traces match those filters"
                  description="Try a different query, strategy or outcome."
                  actions={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setStrategyFilter("all");
                        setStatusFilter("all");
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
          minWidth="68rem"
        />
      </div>

      <TraceDetailSheet
        trace={selected}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
