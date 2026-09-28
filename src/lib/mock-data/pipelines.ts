import type { Pipeline, PipelineNode } from "@/types";

import { ago } from "./clock";

function node(node: Omit<PipelineNode, "status"> & { status?: PipelineNode["status"] }): PipelineNode {
  return { status: "idle", ...node };
}

export const mockPipelines: Pipeline[] = [
  {
    id: "pl_hybrid_rerank",
    name: "Hybrid + Rerank",
    description:
      "Dense and sparse retrieval fused with RRF, then cross-encoder reranking before generation.",
    strategy: "hybrid",
    isDefault: true,
    updatedAt: ago({ hours: 2 }),
    nodes: [
      node({
        id: "query",
        kind: "input",
        title: "Query",
        subtitle: "User input",
        config: [{ label: "Entry", value: "playground" }],
      }),
      node({
        id: "rewrite",
        kind: "rewrite",
        title: "Query Rewrite",
        subtitle: "Normalise and expand",
        config: [
          { label: "Model", value: "gpt-4.1-mini" },
          { label: "Temperature", value: "0.2" },
          { label: "Max tokens", value: "128" },
        ],
        latencyMs: 182,
      }),
      node({
        id: "retrieval",
        kind: "retrieval",
        title: "Hybrid Retrieval",
        subtitle: "Dense + sparse",
        config: [
          { label: "Top K", value: "10" },
          { label: "Dense", value: "text-embedding-3-large" },
          { label: "Sparse", value: "BM25" },
          { label: "Alpha", value: "0.6" },
        ],
        latencyMs: 94,
      }),
      node({
        id: "fusion",
        kind: "fusion",
        title: "RRF Fusion",
        subtitle: "Merge ranked lists",
        config: [
          { label: "k", value: "60" },
          { label: "Weights", value: "1.0 / 1.0" },
        ],
        latencyMs: 41,
      }),
      node({
        id: "rerank",
        kind: "rerank",
        title: "Reranker",
        subtitle: "Cross-encoder",
        config: [
          { label: "Model", value: "bge-reranker-v2-m3" },
          { label: "Rerank", value: "5" },
          { label: "Min score", value: "0.35" },
        ],
        latencyMs: 241,
      }),
      node({
        id: "generation",
        kind: "generation",
        title: "Generator",
        subtitle: "Answer synthesis",
        config: [
          { label: "Model", value: "gpt-4.1" },
          { label: "Temperature", value: "0.1" },
          { label: "Max tokens", value: "1024" },
        ],
        latencyMs: 903,
      }),
    ],
    edges: [
      { id: "e1", source: "query", target: "rewrite" },
      { id: "e2", source: "rewrite", target: "retrieval" },
      { id: "e3", source: "retrieval", target: "fusion" },
      { id: "e4", source: "fusion", target: "rerank" },
      { id: "e5", source: "rerank", target: "generation" },
    ],
  },
  {
    id: "pl_naive",
    name: "Naive Baseline",
    description: "Single dense retrieval pass with no reranking. The control condition.",
    strategy: "naive",
    isDefault: false,
    updatedAt: ago({ days: 16 }),
    nodes: [
      node({
        id: "query",
        kind: "input",
        title: "Query",
        subtitle: "User input",
        config: [{ label: "Entry", value: "playground" }],
      }),
      node({
        id: "retrieval",
        kind: "retrieval",
        title: "Dense Retrieval",
        subtitle: "Vector only",
        config: [
          { label: "Top K", value: "5" },
          { label: "Dense", value: "text-embedding-3-small" },
          { label: "Index", value: "ivfflat" },
        ],
        latencyMs: 62,
      }),
      node({
        id: "generation",
        kind: "generation",
        title: "Generator",
        subtitle: "Answer synthesis",
        config: [
          { label: "Model", value: "gpt-4.1-mini" },
          { label: "Temperature", value: "0.2" },
          { label: "Max tokens", value: "768" },
        ],
        latencyMs: 648,
      }),
    ],
    edges: [
      { id: "e1", source: "query", target: "retrieval" },
      { id: "e2", source: "retrieval", target: "generation" },
    ],
  },
  {
    id: "pl_crag",
    name: "CRAG Corrective",
    description:
      "Grades retrieved context and triggers corrective retrieval when passages are weak.",
    strategy: "crag",
    isDefault: false,
    updatedAt: ago({ hours: 20 }),
    nodes: [
      node({
        id: "query",
        kind: "input",
        title: "Query",
        subtitle: "User input",
        config: [{ label: "Entry", value: "playground" }],
      }),
      node({
        id: "rewrite",
        kind: "rewrite",
        title: "Query Rewrite",
        subtitle: "Normalise",
        config: [{ label: "Model", value: "gpt-4.1-mini" }],
        latencyMs: 196,
      }),
      node({
        id: "retrieval",
        kind: "retrieval",
        title: "Retrieval",
        subtitle: "Hybrid",
        config: [
          { label: "Top K", value: "16" },
          { label: "Alpha", value: "0.6" },
        ],
        latencyMs: 102,
      }),
      node({
        id: "grade",
        kind: "evaluation",
        title: "Grade Context",
        subtitle: "Correct / ambiguous / incorrect",
        config: [
          { label: "Grader", value: "gpt-4.1-mini" },
          { label: "Threshold", value: "0.55" },
        ],
        latencyMs: 318,
      }),
      node({
        id: "correct",
        kind: "retrieval",
        title: "Corrective Retrieval",
        subtitle: "Triggered when ambiguous",
        config: [
          { label: "Extra K", value: "3" },
          { label: "Fallback", value: "web search" },
        ],
        latencyMs: 241,
      }),
      node({
        id: "generation",
        kind: "generation",
        title: "Generator",
        subtitle: "Answer synthesis",
        config: [
          { label: "Model", value: "claude-sonnet-4.5" },
          { label: "Max tokens", value: "1024" },
        ],
        latencyMs: 1884,
      }),
    ],
    edges: [
      { id: "e1", source: "query", target: "rewrite" },
      { id: "e2", source: "rewrite", target: "retrieval" },
      { id: "e3", source: "retrieval", target: "grade" },
      { id: "e4", source: "grade", target: "correct", label: "ambiguous" },
      { id: "e5", source: "correct", target: "generation" },
      { id: "e6", source: "grade", target: "generation", label: "correct" },
    ],
  },
  {
    id: "pl_multi_query",
    name: "Multi Query Expansion",
    description: "Expands the query into several variants and merges the ranked lists.",
    strategy: "multi-query",
    isDefault: false,
    updatedAt: ago({ days: 1, hours: 3 }),
    nodes: [
      node({
        id: "query",
        kind: "input",
        title: "Query",
        subtitle: "User input",
        config: [{ label: "Entry", value: "playground" }],
      }),
      node({
        id: "expand",
        kind: "rewrite",
        title: "Query Expansion",
        subtitle: "4 variants",
        config: [
          { label: "Model", value: "gpt-4.1-mini" },
          { label: "Variants", value: "4" },
        ],
        latencyMs: 268,
      }),
      node({
        id: "retrieval",
        kind: "retrieval",
        title: "Multi Retrieval",
        subtitle: "4 × top-k 12",
        config: [
          { label: "Top K", value: "12" },
          { label: "Alpha", value: "0.5" },
        ],
        latencyMs: 176,
      }),
      node({
        id: "fusion",
        kind: "fusion",
        title: "RRF Fusion",
        subtitle: "Merge ranked lists",
        config: [{ label: "k", value: "60" }],
        latencyMs: 41,
      }),
      node({
        id: "rerank",
        kind: "rerank",
        title: "Reranker",
        subtitle: "Cross-encoder",
        config: [
          { label: "Model", value: "bge-reranker-v2-m3" },
          { label: "Rerank", value: "6" },
        ],
        latencyMs: 212,
      }),
      node({
        id: "generation",
        kind: "generation",
        title: "Generator",
        subtitle: "Answer synthesis",
        config: [
          { label: "Model", value: "gpt-4.1-mini" },
          { label: "Max tokens", value: "768" },
        ],
        latencyMs: 283,
      }),
    ],
    edges: [
      { id: "e1", source: "query", target: "expand" },
      { id: "e2", source: "expand", target: "retrieval" },
      { id: "e3", source: "retrieval", target: "fusion" },
      { id: "e4", source: "fusion", target: "rerank" },
      { id: "e5", source: "rerank", target: "generation" },
    ],
  },
  {
    id: "pl_hyde",
    name: "HyDE",
    description:
      "Generates a hypothetical answer document and embeds it in place of the raw query.",
    strategy: "hyde",
    isDefault: false,
    updatedAt: ago({ days: 4, hours: 7 }),
    nodes: [
      node({
        id: "query",
        kind: "input",
        title: "Query",
        subtitle: "User input",
        config: [{ label: "Entry", value: "playground" }],
      }),
      node({
        id: "hypo",
        kind: "rewrite",
        title: "Hypothetical Document",
        subtitle: "Synthetic passage",
        config: [
          { label: "Model", value: "gpt-4.1-mini" },
          { label: "Length", value: "~200 tokens" },
        ],
        latencyMs: 612,
      }),
      node({
        id: "retrieval",
        kind: "retrieval",
        title: "Dense Retrieval",
        subtitle: "On synthetic embedding",
        config: [
          { label: "Top K", value: "12" },
          { label: "Index", value: "hnsw" },
        ],
        latencyMs: 88,
      }),
      node({
        id: "rerank",
        kind: "rerank",
        title: "Reranker",
        subtitle: "Cross-encoder",
        config: [
          { label: "Model", value: "bge-reranker-v2-m3" },
          { label: "Rerank", value: "4" },
        ],
        latencyMs: 233,
      }),
      node({
        id: "generation",
        kind: "generation",
        title: "Generator",
        subtitle: "Answer synthesis",
        config: [
          { label: "Model", value: "gpt-4.1" },
          { label: "Max tokens", value: "1024" },
        ],
        latencyMs: 927,
      }),
    ],
    edges: [
      { id: "e1", source: "query", target: "hypo" },
      { id: "e2", source: "hypo", target: "retrieval" },
      { id: "e3", source: "retrieval", target: "rerank" },
      { id: "e4", source: "rerank", target: "generation" },
    ],
  },
];

export const mockDefaultPipeline = mockPipelines[0];

export function getPipelineById(id: string): Pipeline | undefined {
  return mockPipelines.find((pipeline) => pipeline.id === id);
}

/**
 * Compact stage list for the playground header strip. Derived from the default
 * pipeline so the two views cannot drift apart.
 */
export function getPipelineStageSummary(pipelineId: string): Array<{
  id: string;
  title: string;
  kind: PipelineNode["kind"];
  latencyMs?: number;
}> {
  const pipeline = getPipelineById(pipelineId) ?? mockDefaultPipeline;
  return pipeline.nodes
    .filter((pipelineNode) => pipelineNode.kind !== "input")
    .map((pipelineNode) => ({
      id: pipelineNode.id,
      title: pipelineNode.title,
      kind: pipelineNode.kind,
      latencyMs: pipelineNode.latencyMs,
    }));
}
