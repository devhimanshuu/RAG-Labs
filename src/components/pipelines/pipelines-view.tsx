"use client";

import { Copy, Pencil, Plus, Star, Workflow, WorkflowIcon } from "lucide-react";
import * as React from "react";

import { PageHeader } from "@/components/layout/page-header";
import { PipelineCanvas } from "@/components/pipelines/pipeline-canvas";
import { NODE_KIND_META, PipelineNode } from "@/components/pipelines/pipeline-node";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { JSONViewer } from "@/components/ui/json-viewer";
import { Panel, PanelActions, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STRATEGY_LABELS } from "@/lib/constants/app";
import { mockPipelines, timeAgo } from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import { cn, formatDuration, pluralize } from "@/lib/utils";
import type { Pipeline, PipelineNode as PipelineNodeModel } from "@/types";

/**
 * Pipelines.
 *
 * Selecting a pipeline swaps the canvas and the stage inspector. Graph editing
 * is out of scope for Phase 1, but the data model, node component and canvas
 * are already in the shape the Phase 2 editor will consume.
 */
export function PipelinesView() {
  const [selectedId, setSelectedId] = React.useState(mockPipelines[0].id);
  const [selectedNode, setSelectedNode] = React.useState<PipelineNodeModel | null>(
    mockPipelines[0].nodes[1] ?? null,
  );

  const pipeline = mockPipelines.find((entry) => entry.id === selectedId) ?? mockPipelines[0];
  const estimate = pipeline.nodes.reduce((total, node) => total + (node.latencyMs ?? 0), 0);

  const selectPipeline = (next: Pipeline) => {
    setSelectedId(next.id);
    setSelectedNode(next.nodes[1] ?? next.nodes[0] ?? null);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Pipelines"
        description="Stage-by-stage composition of the retrieval and generation graph used by every run in this workspace."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                toast.info("Duplicate pipeline", "Copying pipelines arrives in Phase 2.")
              }
            >
              <Copy />
              Duplicate
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                toast.info("New pipeline", "The visual editor arrives in Phase 2.")
              }
            >
              <Plus />
              New pipeline
            </Button>
          </>
        }
        meta={
          <>
            <span className="technical text-2xs text-fg-muted">
              {pluralize(mockPipelines.length, "pipeline")}
            </span>
            <span className="technical text-2xs text-fg-muted">
              {pluralize(pipeline.nodes.length, "stage")} · est. {formatDuration(estimate)}
            </span>
            {pipeline.isDefault ? (
              <Badge tone="accent" mono>
                workspace default
              </Badge>
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[19rem_1fr_22rem]">
        {/* Pipeline list */}
        <Panel className="h-fit">
          <PanelHeader>
            <PanelTitle icon={Workflow}>Pipelines</PanelTitle>
            <PanelActions>
              <span className="technical text-2xs text-fg-muted">{mockPipelines.length}</span>
            </PanelActions>
          </PanelHeader>
          <PanelBody padded={false}>
            {mockPipelines.length === 0 ? (
              <EmptyState
                icon={WorkflowIcon}
                title="No pipelines yet"
                description="Compose retrieval and generation stages to define how queries are answered."
                bordered={false}
                className="py-12"
              />
            ) : (
              <ul className="flex flex-col gap-1 p-1.5">
                {mockPipelines.map((entry) => {
                  const active = entry.id === pipeline.id;
                  return (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => selectPipeline(entry)}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "flex w-full flex-col gap-1.5 rounded-md border px-2.5 py-2 text-left transition-colors focus-ring",
                          active
                            ? "border-accent-line bg-accent-muted"
                            : "border-transparent hover:bg-surface-hover",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "truncate text-xs font-medium",
                              active ? "text-accent" : "text-fg",
                            )}
                          >
                            {entry.name}
                          </span>
                          {entry.isDefault ? (
                            <Star className="size-3 shrink-0 text-accent" aria-label="Default" />
                          ) : null}
                        </span>
                        <span className="line-clamp-2 text-2xs leading-relaxed text-fg-muted">
                          {entry.description}
                        </span>
                        <span className="flex items-center gap-2">
                          <Badge tone="neutral" mono>
                            {STRATEGY_LABELS[entry.strategy]}
                          </Badge>
                          <span className="technical text-2xs text-fg-disabled">
                            {entry.nodes.length} stages · {timeAgo(entry.updatedAt)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </PanelBody>
        </Panel>

        {/* Canvas */}
        <Panel className="min-h-[36rem]">
          <PanelHeader>
            <PanelTitle icon={Workflow}>{pipeline.name}</PanelTitle>
            <PanelActions>
              <Badge tone="neutral" mono>
                {STRATEGY_LABELS[pipeline.strategy]}
              </Badge>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => toast.info("Edit pipeline", "The graph editor arrives in Phase 2.")}
              >
                <Pencil />
                Edit
              </Button>
            </PanelActions>
          </PanelHeader>
          <PanelBody padded={false} className="flex">
            <PipelineCanvas
              pipeline={pipeline}
              selectedNodeId={selectedNode?.id ?? null}
              onSelectNode={setSelectedNode}
              className="m-3.5 flex-1 rounded-lg"
            />
          </PanelBody>
        </Panel>

        {/* Stage inspector */}
        <Panel className="h-fit">
          <PanelHeader>
            <PanelTitle>Stage inspector</PanelTitle>
            <PanelActions>
              <Select
                value={selectedNode?.id ?? ""}
                onValueChange={(value) =>
                  setSelectedNode(pipeline.nodes.find((node) => node.id === value) ?? null)
                }
              >
                <SelectTrigger className="w-40" size="sm" aria-label="Selected stage">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {pipeline.nodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PanelActions>
          </PanelHeader>
          <PanelBody padded={false}>
            {selectedNode ? (
              <div className="flex flex-col gap-3 p-3.5">
                <PipelineNode node={selectedNode} className="max-w-none" />

                <div className="flex flex-col gap-1.5">
                  <span className="text-2xs font-medium uppercase tracking-wide text-fg-muted">
                    Stage type
                  </span>
                  <span className="text-xs text-fg-secondary">
                    {NODE_KIND_META[selectedNode.kind].label} · {selectedNode.status}
                  </span>
                </div>

                <JSONViewer
                  title="node"
                  defaultExpandDepth={2}
                  maxHeight="16rem"
                  data={{
                    id: selectedNode.id,
                    kind: selectedNode.kind,
                    title: selectedNode.title,
                    status: selectedNode.status,
                    latencyMs: selectedNode.latencyMs ?? null,
                    config: Object.fromEntries(
                      selectedNode.config.map((entry) => [entry.label, entry.value]),
                    ),
                  }}
                />

                <div className="flex flex-col gap-1.5">
                  <span className="text-2xs font-medium uppercase tracking-wide text-fg-muted">
                    Connections
                  </span>
                  <ul className="flex flex-col gap-1">
                    {pipeline.edges
                      .filter(
                        (edge) =>
                          edge.source === selectedNode.id || edge.target === selectedNode.id,
                      )
                      .map((edge) => {
                        const source = pipeline.nodes.find((node) => node.id === edge.source);
                        const target = pipeline.nodes.find((node) => node.id === edge.target);
                        return (
                          <li
                            key={edge.id}
                            className="flex items-center gap-1.5 text-2xs text-fg-secondary"
                          >
                            <span className="truncate">{source?.title ?? edge.source}</span>
                            <span aria-hidden className="text-fg-disabled">
                              →
                            </span>
                            <span className="truncate">{target?.title ?? edge.target}</span>
                            {edge.label ? (
                              <span className="technical text-fg-disabled">({edge.label})</span>
                            ) : null}
                          </li>
                        );
                      })}
                    {pipeline.edges.every(
                      (edge) =>
                        edge.source !== selectedNode.id && edge.target !== selectedNode.id,
                    ) ? (
                      <li className="text-2xs text-fg-disabled">Terminal stage</li>
                    ) : null}
                  </ul>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={WorkflowIcon}
                title="No stage selected"
                description="Select a node on the canvas to inspect its configuration."
                bordered={false}
                className="py-12"
              />
            )}
          </PanelBody>
        </Panel>
      </div>

      {/* Full graph definition, for developers who want the raw shape. */}
      <Panel>
        <PanelHeader>
          <PanelTitle icon={Workflow}>Graph definition</PanelTitle>
          <PanelActions>
            <IconButton
              label="Copy graph definition"
              size="sm"
              onClick={() => {
                void navigator.clipboard?.writeText(
                  JSON.stringify(
                    { nodes: pipeline.nodes, edges: pipeline.edges },
                    null,
                    2,
                  ),
                );
                toast.success("Graph definition copied");
              }}
            >
              <Copy />
            </IconButton>
          </PanelActions>
        </PanelHeader>
        <PanelBody padded={false}>
          <JSONViewer
            title={`${pipeline.id}.json`}
            defaultExpandDepth={1}
            maxHeight="18rem"
            className="rounded-none border-0"
            data={{ nodes: pipeline.nodes, edges: pipeline.edges }}
          />
        </PanelBody>
      </Panel>
    </div>
  );
}
