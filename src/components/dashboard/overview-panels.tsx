import {
  ArrowUpRight,
  Boxes,
  Database,
  FileStack,
  FlaskConical,
  Layers,
  Workflow,
} from "lucide-react";
import Link from "next/link";

import { ExperimentBadge } from "@/components/experiments/experiment-badge";
import { Badge } from "@/components/ui/badge";
import { CountBadge } from "@/components/ui/badge";
import { Panel, PanelActions, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { STRATEGY_LABELS } from "@/lib/constants/app";
import {
  mockActivity,
  mockExperiments,
  mockProviders,
  mockWorkspaceStats,
  timeAgo,
} from "@/lib/mock-data";
import { cn, formatDuration, formatNumber, shortId, truncate } from "@/lib/utils";
import type { ActivityEntry, ProviderStatus } from "@/types";

const PROVIDER_TONE: Record<ProviderStatus, "success" | "danger" | "neutral"> = {
  connected: "success",
  error: "danger",
  disconnected: "neutral",
};

/** Provider connection health, newest check first. */
export function ProviderHealthPanel() {
  const connected = mockProviders.filter((provider) => provider.status === "connected").length;

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle icon={Layers}>Provider health</PanelTitle>
        <PanelActions>
          <span className="technical text-2xs text-fg-muted">
            {connected}/{mockProviders.length} online
          </span>
          <Link
            href="/providers"
            className="flex items-center gap-0.5 text-2xs text-accent transition-colors hover:text-accent-hover"
          >
            Manage
            <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        </PanelActions>
      </PanelHeader>
      <PanelBody padded={false}>
        <ul className="divide-y divide-line-subtle">
          {mockProviders.map((provider) => (
            <li key={provider.id} className="flex items-center gap-3 px-3.5 py-2.5">
              <StatusIndicator tone={PROVIDER_TONE[provider.status]} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs text-fg">{provider.name}</span>
                <span className="technical block truncate text-2xs text-fg-muted">
                  {provider.baseUrl}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="technical block text-2xs text-fg-secondary">
                  {provider.modelCount} models
                </span>
                <span className="technical block text-2xs text-fg-disabled">
                  {timeAgo(provider.lastCheckedAt)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </PanelBody>
    </Panel>
  );
}

/** Most recently updated experiments, as a compact scannable list. */
export function RecentExperimentsPanel() {
  const recent = [...mockExperiments]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle icon={FlaskConical}>Recent experiments</PanelTitle>
        <PanelActions>
          <Link
            href="/experiments"
            className="flex items-center gap-0.5 text-2xs text-accent transition-colors hover:text-accent-hover"
          >
            All experiments
            <ArrowUpRight className="size-3" aria-hidden />
          </Link>
        </PanelActions>
      </PanelHeader>
      <PanelBody padded={false}>
        <ul className="divide-y divide-line-subtle">
          {recent.map((experiment) => (
            <li key={experiment.id}>
              <Link
                href="/experiments"
                className="flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-surface-hover focus-ring"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-xs font-medium text-fg">{experiment.name}</span>
                    <Badge tone="neutral" mono className="hidden sm:inline-flex">
                      {STRATEGY_LABELS[experiment.strategy]}
                    </Badge>
                  </span>
                  <span className="mt-0.5 block truncate text-2xs text-fg-muted">
                    {experiment.datasetName} · {experiment.sampleCount} samples ·{" "}
                    {formatDuration(experiment.metrics.latencyMs)}
                  </span>
                </span>
                <span className="hidden shrink-0 sm:block">
                  {experiment.status === "queued" ? (
                    <span className="block text-right text-2xs text-fg-disabled">
                      not scored
                    </span>
                  ) : (
                    <>
                      <span className="technical block text-right text-xs text-fg">
                        {experiment.metrics.faithfulness.toFixed(3)}
                      </span>
                      <span className="block text-right text-2xs text-fg-disabled">
                        faithfulness
                      </span>
                    </>
                  )}
                </span>
                <span className="shrink-0">
                  <ExperimentBadge status={experiment.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PanelBody>
    </Panel>
  );
}

const ACTIVITY_TONE: Record<string, "success" | "danger" | "warning" | "accent" | "neutral"> = {
  completed: "success",
  running: "accent",
  indexing: "accent",
  queued: "neutral",
  error: "danger",
  failed: "danger",
};

/** Workspace event feed. Mock-backed; Phase 2 streams it. */
export function ActivityFeed({ limit = 6 }: { limit?: number }) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle icon={FileStack}>Activity</PanelTitle>
        <PanelActions>
          <CountBadge>{mockActivity.length}</CountBadge>
        </PanelActions>
      </PanelHeader>
      <PanelBody padded={false}>
        <ol className="flex flex-col px-3.5 py-1">
          {mockActivity.slice(0, limit).map((entry: ActivityEntry, index) => {
            const tone = entry.status ? ACTIVITY_TONE[entry.status] ?? "neutral" : "neutral";
            const isLast = index === Math.min(limit, mockActivity.length) - 1;

            return (
              <li key={entry.id} className="flex gap-3">
                <span className="relative flex w-2.5 shrink-0 flex-col items-center">
                  <span className="mt-3">
                    <StatusIndicator tone={tone} size="xs" pulse={tone === "accent"} />
                  </span>
                  {!isLast ? <span aria-hidden className="w-px flex-1 bg-line-subtle" /> : null}
                </span>
                <div className="min-w-0 flex-1 pb-3 pt-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs text-fg">{entry.title}</span>
                    <span className="technical shrink-0 text-2xs text-fg-disabled">
                      {timeAgo(entry.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-2xs text-fg-muted" title={entry.description}>
                    {truncate(entry.description, 64)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </PanelBody>
    </Panel>
  );
}

/** Each entry carries a secondary line that adds information rather than
 * restating the number. */
const STAT_ITEMS = [
  {
    id: "datasets",
    label: "Datasets",
    value: mockWorkspaceStats.datasets,
    hint: "1 indexing",
    icon: Database,
  },
  {
    id: "documents",
    label: "Documents",
    value: mockWorkspaceStats.documents,
    hint: "+312 this week",
    icon: FileStack,
  },
  {
    id: "chunks",
    label: "Chunks",
    value: mockWorkspaceStats.chunks,
    hint: "avg 6.0 per document",
    icon: Boxes,
  },
  {
    id: "traces",
    label: "Traces",
    value: mockWorkspaceStats.traces,
    hint: "1.8K today",
    icon: Layers,
  },
  {
    id: "experiments",
    label: "Experiments",
    value: mockWorkspaceStats.experiments,
    hint: "1 running",
    icon: FlaskConical,
  },
  {
    id: "pipelines",
    label: "Pipelines",
    value: mockWorkspaceStats.pipelines,
    hint: "1 workspace default",
    icon: Workflow,
  },
];

/** Workspace totals, rendered as a single bordered strip rather than six cards. */
export function WorkspaceStatsStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 divide-line-subtle overflow-hidden rounded-lg border border-line bg-surface sm:grid-cols-3 lg:grid-cols-6 lg:divide-x",
        className,
      )}
    >
      {STAT_ITEMS.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-1 border-b border-line-subtle px-3.5 py-3 last:border-b-0 sm:border-b-0"
        >
          <span className="flex items-center gap-1.5 text-2xs uppercase tracking-wide text-fg-muted">
            <item.icon className="size-3" aria-hidden />
            {item.label}
          </span>
          <span className="technical text-base font-medium text-fg">
            {formatNumber(item.value)}
          </span>
          <span className="text-2xs text-fg-disabled">{item.hint}</span>
        </div>
      ))}
    </div>
  );
}

/** Compact trace preview used at the bottom of the dashboard. */
export function TraceVelocityStrip({ tracesPerHour }: { tracesPerHour: number }) {
  return (
    <span className="flex items-center gap-2">
      <StatusIndicator tone="accent" pulse />
      <span className="technical text-2xs text-fg-secondary">
        {formatNumber(tracesPerHour)} req/h
      </span>
      <span className="technical text-2xs text-fg-disabled">last 60 min</span>
    </span>
  );
}

/** Renders a trace short-id pill, matching the traces table. */
export function TraceIdPill({ id }: { id: string }) {
  return (
    <span className="technical rounded-xs border border-line bg-surface-inset px-1.5 text-2xs text-accent">
      #{shortId(id)}
    </span>
  );
}
