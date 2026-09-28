"use client";

import { FlaskConical, Plus, SearchX } from "lucide-react";
import * as React from "react";

import { ExperimentBadge, ExperimentProgress } from "@/components/experiments/experiment-badge";
import { ExperimentDetailSheet } from "@/components/experiments/experiment-detail-sheet";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ScoreBadge } from "@/components/ui/score-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toolbar, ToolbarCount, ToolbarSearch, ToolbarSpacer } from "@/components/ui/toolbar";
import { RAG_STRATEGIES, STRATEGY_LABELS } from "@/lib/constants/app";
import { RUN_STATUS_META } from "@/lib/constants/status";
import { mockExperiments, mockMembers, timeAgo } from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import { formatDuration, formatNumber } from "@/lib/utils";
import type { Experiment, RagStrategy, RunStatus } from "@/types";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ExperimentsView() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<RunStatus | "all">("all");
  const [strategyFilter, setStrategyFilter] = React.useState<RagStrategy | "all">("all");
  const [selected, setSelected] = React.useState<Experiment | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return mockExperiments.filter((experiment) => {
      if (statusFilter !== "all" && experiment.status !== statusFilter) return false;
      if (strategyFilter !== "all" && experiment.strategy !== strategyFilter) return false;
      if (!term) return true;
      return (
        experiment.name.toLowerCase().includes(term) ||
        experiment.datasetName.toLowerCase().includes(term) ||
        experiment.model.toLowerCase().includes(term)
      );
    });
  }, [search, statusFilter, strategyFilter]);

  const running = mockExperiments.filter((experiment) => experiment.status === "running").length;
  const completed = mockExperiments.filter((experiment) => experiment.status === "completed").length;

  const columns: Array<Column<Experiment>> = [
    {
      id: "name",
      header: "Experiment",
      cell: (row) => (
        <span className="flex min-w-0 flex-col">
          <span className="flex items-center gap-2">
            <span className="truncate text-xs font-medium text-fg">{row.name}</span>
            <span className="technical shrink-0 text-2xs text-fg-disabled">{row.id}</span>
          </span>
          <span className="truncate text-2xs text-fg-muted">
            {row.model} · {formatNumber(row.sampleCount)} samples
          </span>
        </span>
      ),
      sortValue: (row) => row.name,
      cellClassName: "max-w-[22rem]",
    },
    {
      id: "dataset",
      header: "Dataset",
      cell: (row) => <span className="truncate text-xs text-fg-secondary">{row.datasetName}</span>,
      sortValue: (row) => row.datasetName,
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
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <span className="flex flex-col items-start gap-1.5">
          <ExperimentBadge status={row.status} />
          {row.status === "running" || row.status === "queued" ? (
            <ExperimentProgress
              status={row.status}
              progress={row.progress}
              sampleCount={row.sampleCount}
              className="min-w-28"
            />
          ) : null}
        </span>
      ),
      sortValue: (row) => RUN_STATUS_META[row.status].label,
      cellClassName: "py-2",
    },
    {
      id: "faithfulness",
      header: "Faith.",
      align: "right",
      cell: (row) =>
        row.status === "queued" ? (
          <span className="technical text-xs text-fg-disabled">—</span>
        ) : (
          <ScoreBadge score={row.metrics.faithfulness} digits={3} />
        ),
      sortValue: (row) => row.metrics.faithfulness,
      hideBelow: "sm",
    },
    {
      id: "recall",
      header: "Recall",
      align: "right",
      cell: (row) =>
        row.status === "queued" ? (
          <span className="technical text-xs text-fg-disabled">—</span>
        ) : (
          <ScoreBadge score={row.metrics.contextRecall} digits={3} />
        ),
      sortValue: (row) => row.metrics.contextRecall,
      hideBelow: "md",
    },
    {
      id: "latency",
      header: "Latency",
      align: "right",
      cell: (row) => (
        <span className="technical text-xs">
          {row.metrics.latencyMs === 0 ? "—" : formatDuration(row.metrics.latencyMs)}
        </span>
      ),
      sortValue: (row) => row.metrics.latencyMs,
      hideBelow: "lg",
    },
    {
      id: "author",
      header: "Owner",
      align: "right",
      cell: (row) => {
        const member = mockMembers.find((entry) => entry.name === row.author);
        return (
          <span className="flex items-center justify-end gap-2">
            <Avatar
              initials={member?.initials ?? initialsOf(row.author)}
              alt={row.author}
              size="xs"
            />
            <span className="hidden truncate text-2xs text-fg-secondary xl:inline">
              {row.author}
            </span>
          </span>
        );
      },
      sortValue: (row) => row.author,
      hideBelow: "lg",
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
        title="Experiments"
        description="Strategy configurations evaluated against a fixed dataset, with per-metric scores and full run history."
        actions={
          <Button
            variant="primary"
            onClick={() =>
              toast.info(
                "Create experiment",
                "The experiment builder arrives in Phase 2.",
              )
            }
          >
            <Plus />
            New experiment
          </Button>
        }
        meta={
          <>
            <span className="technical text-2xs text-fg-muted">
              {mockExperiments.length} total
            </span>
            <span className="technical text-2xs text-accent">{running} running</span>
            <span className="technical text-2xs text-fg-muted">{completed} complete</span>
          </>
        }
      />

      <Toolbar>
        <ToolbarSearch
          value={search}
          onValueChange={setSearch}
          placeholder="Search experiments, datasets, models…"
          label="Search experiments"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as RunStatus | "all")}
        >
          <SelectTrigger className="w-36" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(RUN_STATUS_META) as RunStatus[]).map((status) => (
              <SelectItem key={status} value={status}>
                {RUN_STATUS_META[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

        <ToolbarSpacer />
        <ToolbarCount shown={filtered.length} total={mockExperiments.length} noun="experiments" />
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
          initialSort={{ columnId: "updated", direction: "desc" }}
          emptyState={
            <tr>
              <td colSpan={columns.length} className="p-0">
                <EmptyState
                  icon={mockExperiments.length === 0 ? FlaskConical : SearchX}
                  title={
                    mockExperiments.length === 0
                      ? "No experiments yet"
                      : "No experiments match those filters"
                  }
                  description={
                    mockExperiments.length === 0
                      ? "Create an experiment to evaluate a retrieval strategy against a dataset."
                      : "Try a different search term, status or strategy."
                  }
                  actions={
                    mockExperiments.length === 0 ? (
                      <Button variant="primary" size="sm">
                        <Plus />
                        New experiment
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("all");
                          setStrategyFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    )
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

      <ExperimentDetailSheet
        experiment={selected}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
