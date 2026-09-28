"use client";

import { ArrowDown } from "lucide-react";
import * as React from "react";

import { PipelineNode } from "@/components/pipelines/pipeline-node";
import { cn } from "@/lib/utils";
import type { Pipeline, PipelineNode as PipelineNodeModel } from "@/types";

/**
 * Pipeline canvas.
 *
 * Renders the graph as a vertical spine with labelled branch connectors. It is
 * intentionally free of layout engine concerns: when `@xyflow/react` is
 * introduced in Phase 2, this component becomes the `<ReactFlow>` wrapper, the
 * node array becomes `nodes` (using `PipelineNode` as the custom node type) and
 * `edges` becomes the edge array. Nothing in `PipelineNode` needs to change.
 */
export function PipelineCanvas({
  pipeline,
  selectedNodeId,
  onSelectNode,
  className,
}: {
  pipeline: Pipeline;
  selectedNodeId?: string | null;
  onSelectNode?: (node: PipelineNodeModel) => void;
  className?: string;
}) {
  const outgoing = React.useMemo(() => {
    const map = new Map<string, Pipeline["edges"]>();
    for (const edge of pipeline.edges) {
      const bucket = map.get(edge.source);
      if (bucket) bucket.push(edge);
      else map.set(edge.source, [edge]);
    }
    return map;
  }, [pipeline.edges]);

  return (
    <div
      className={cn(
        "dot-backdrop relative flex flex-col items-center overflow-y-auto rounded-lg border border-line bg-surface-inset px-4 py-6 scrollbar-thin",
        className,
      )}
    >
      {pipeline.nodes.map((node, index) => {
        const branches = (outgoing.get(node.id) ?? []).filter(
          (edge) => edge.target !== pipeline.nodes[index + 1]?.id,
        );

        return (
          <React.Fragment key={node.id}>
            <PipelineNode
              node={node}
              selected={selectedNodeId === node.id}
              onSelect={onSelectNode}
              showConfig={false}
              className="max-w-56"
            />

            {index < pipeline.nodes.length - 1 ? (
              <div className="relative flex h-11 items-center justify-center" aria-hidden>
                <span className="h-full w-px bg-line-strong" />
                <ArrowDown className="absolute bottom-0 size-3 translate-y-[3px] text-line-strong" />
                {branches.length > 0 ? (
                  <span className="absolute left-full ml-2 flex flex-col gap-0.5">
                    {branches.map((edge) => {
                      const target = pipeline.nodes.find((entry) => entry.id === edge.target);
                      return (
                        <span
                          key={edge.id}
                          className="technical whitespace-nowrap text-2xs text-fg-disabled"
                        >
                          {edge.label ? `${edge.label} → ` : ""}
                          {target?.title ?? edge.target}
                        </span>
                      );
                    })}
                  </span>
                ) : null}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      <p className="mt-5 max-w-sm text-center text-2xs leading-relaxed text-fg-disabled">
        Node editing, draggable layout and live execution are Phase 2. The canvas
        is already the mount point for the graph renderer.
      </p>
    </div>
  );
}
