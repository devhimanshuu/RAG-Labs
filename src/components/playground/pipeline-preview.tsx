"use client";

import { ArrowRight, Workflow } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { PipelineStageChip } from "@/components/pipelines/pipeline-node";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelActions, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { STRATEGY_LABELS } from "@/lib/constants/app";
import { getPipelineById, mockDefaultPipeline } from "@/lib/mock-data";
import { formatDuration } from "@/lib/utils";

/**
 * Read-only rendering of the pipeline the current strategy will execute.
 *
 * The chips animate as the mock run progresses so the stage order is legible
 * even before Phase 2 wires up real execution.
 */
export function PipelinePreview({
  pipelineId,
  activeStageId,
  className,
}: {
  pipelineId: string;
  /** Stage currently executing; null once the run completes. */
  activeStageId?: string | null;
  className?: string;
}) {
  const pipeline = getPipelineById(pipelineId) ?? mockDefaultPipeline;
  const stages = pipeline.nodes.filter((node) => node.kind !== "input");
  const estimatedMs = stages.reduce((total, node) => total + (node.latencyMs ?? 0), 0);

  return (
    <Panel className={className}>
      <PanelHeader>
        <PanelTitle icon={Workflow}>{pipeline.name}</PanelTitle>
        <PanelActions>
          <Badge tone="accent" mono>
            {STRATEGY_LABELS[pipeline.strategy]}
          </Badge>
          <span className="technical text-2xs text-fg-muted">
            est. {formatDuration(estimatedMs)}
          </span>
          <Link
            href="/pipelines"
            className="text-2xs text-accent transition-colors hover:text-accent-hover"
          >
            Open pipeline
          </Link>
        </PanelActions>
      </PanelHeader>
      <PanelBody padded={false}>
        <ol className="flex items-center gap-1.5 overflow-x-auto px-3.5 py-3 scrollbar-thin">
          <li className="shrink-0">
            <PipelineStageChip title="Query" kind="input" index={0} active={activeStageId === "query"} />
          </li>
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <li aria-hidden className="shrink-0">
                <ArrowRight className="size-3.5 text-fg-disabled" />
              </li>
              <li className="shrink-0">
                <PipelineStageChip
                  title={stage.title}
                  kind={stage.kind}
                  latencyMs={stage.latencyMs}
                  index={index + 1}
                  active={activeStageId === stage.id}
                />
              </li>
            </React.Fragment>
          ))}
        </ol>
      </PanelBody>
    </Panel>
  );
}
