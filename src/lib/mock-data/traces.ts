import type { RagStrategy, RetrievalResult, Trace, TraceStep, TraceStepKind } from "@/types";

import { ago } from "./clock";
import {
  mockEngineeringRetrievalResults,
  mockResearchRetrievalResults,
  mockRetrievalResults,
  mockSupportRetrievalResults,
} from "./retrieval";

const RESULTS_BY_DATASET: Record<string, RetrievalResult[]> = {
  ds_finance_reports: mockRetrievalResults,
  ds_engineering_docs: mockEngineeringRetrievalResults,
  ds_support_tickets: mockSupportRetrievalResults,
  ds_research_papers: mockResearchRetrievalResults,
};

interface StageSpec {
  name: string;
  kind: TraceStepKind;
  durationMs: number;
  detail?: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  status?: TraceStep["status"];
}

interface TraceSpec {
  id: string;
  query: string;
  strategy: RagStrategy;
  datasetId: string;
  datasetName: string;
  model: string;
  status?: Trace["status"];
  ttftMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  createdAt: string;
  stages: StageSpec[];
  answer: string;
}

/**
 * Builds a trace from its stage list. Offsets are accumulated rather than
 * hand-written so the waterfall chart can never disagree with the total.
 */
function buildTrace(spec: TraceSpec): Trace {
  let cursor = 0;
  const steps: TraceStep[] = spec.stages.map((stage, index) => {
    const step: TraceStep = {
      id: `${spec.id}-${index + 1}`,
      name: stage.name,
      kind: stage.kind,
      offsetMs: cursor,
      durationMs: stage.durationMs,
      status: stage.status ?? "ok",
      detail: stage.detail,
      model: stage.model,
      inputTokens: stage.inputTokens,
      outputTokens: stage.outputTokens,
    };
    cursor += stage.durationMs;
    return step;
  });

  return {
    id: spec.id,
    query: spec.query,
    strategy: spec.strategy,
    datasetId: spec.datasetId,
    datasetName: spec.datasetName,
    model: spec.model,
    status: spec.status ?? "ok",
    latencyMs: cursor,
    ttftMs: spec.ttftMs,
    inputTokens: spec.inputTokens,
    outputTokens: spec.outputTokens,
    costUsd: spec.costUsd,
    createdAt: spec.createdAt,
    steps,
    retrievalResults: RESULTS_BY_DATASET[spec.datasetId] ?? [],
    answer: spec.answer,
  };
}

const SHORT_ANSWER =
  "Based on the retrieved context, the relevant passages are cited below. Expand the retrieval panel to inspect which chunks were kept after reranking.";

const specs: TraceSpec[] = [
  {
    id: "8fa21c4e",
    query: "Why did revenue increase in 2025?",
    strategy: "hybrid",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    model: "gpt-4.1",
    ttftMs: 640,
    inputTokens: 2184,
    outputTokens: 396,
    costUsd: 0.0138,
    createdAt: ago({ minutes: 6 }),
    stages: [
      { name: "Query Rewrite", kind: "rewrite", durationMs: 182, model: "gpt-4.1-mini" },
      {
        name: "Hybrid Retrieval",
        kind: "retrieval",
        durationMs: 94,
        detail: "top-k 24 · dense 12 / sparse 12",
      },
      { name: "Reranking", kind: "rerank", durationMs: 241, detail: "24 → 5 kept" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 903,
        model: "gpt-4.1",
        inputTokens: 2184,
        outputTokens: 396,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "91bd2a07",
    query: "Explain the EBITDA margin movement quarter over quarter",
    strategy: "hybrid",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    model: "claude-sonnet-4.5",
    ttftMs: 910,
    inputTokens: 3120,
    outputTokens: 542,
    costUsd: 0.0241,
    createdAt: ago({ minutes: 24 }),
    stages: [
      { name: "Query Rewrite", kind: "rewrite", durationMs: 204, model: "gpt-4.1-mini" },
      { name: "Hybrid Retrieval", kind: "retrieval", durationMs: 108, detail: "top-k 24" },
      { name: "Reranking", kind: "rerank", durationMs: 268, detail: "24 → 6 kept" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 1600,
        model: "claude-sonnet-4.5",
        inputTokens: 3120,
        outputTokens: 542,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "aa812f39",
    query: "Summarize the annual report for an investor",
    strategy: "multi-query",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    model: "gpt-4.1-mini",
    ttftMs: 390,
    inputTokens: 1620,
    outputTokens: 288,
    costUsd: 0.0044,
    createdAt: ago({ hours: 1, minutes: 12 }),
    stages: [
      { name: "Query Expansion", kind: "rewrite", durationMs: 268, detail: "4 variants" },
      {
        name: "Multi Retrieval",
        kind: "retrieval",
        durationMs: 176,
        detail: "4 × top-k 12",
      },
      { name: "Fusion (RRF)", kind: "fusion", durationMs: 41, detail: "k = 60" },
      { name: "Reranking", kind: "rerank", durationMs: 212, detail: "31 → 6 kept" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 283,
        model: "gpt-4.1-mini",
        inputTokens: 1620,
        outputTokens: 288,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "3c04be71",
    query: "How do I rotate an API key without downtime?",
    strategy: "naive",
    datasetId: "ds_support_tickets",
    datasetName: "Support Tickets",
    model: "gpt-4.1-mini",
    ttftMs: 310,
    inputTokens: 1420,
    outputTokens: 224,
    costUsd: 0.0031,
    createdAt: ago({ hours: 2, minutes: 40 }),
    stages: [
      { name: "Dense Retrieval", kind: "retrieval", durationMs: 62, detail: "top-k 5" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 648,
        model: "gpt-4.1-mini",
        inputTokens: 1420,
        outputTokens: 224,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "7d1e9062",
    query: "What changed in the pgvector migration?",
    strategy: "hyde",
    datasetId: "ds_engineering_docs",
    datasetName: "Engineering Docs",
    model: "gpt-4.1",
    ttftMs: 780,
    inputTokens: 2048,
    outputTokens: 372,
    costUsd: 0.0127,
    createdAt: ago({ hours: 3, minutes: 5 }),
    stages: [
      {
        name: "Hypothetical Document",
        kind: "rewrite",
        durationMs: 612,
        model: "gpt-4.1-mini",
        detail: "generated 214-token passage",
      },
      { name: "Dense Retrieval", kind: "retrieval", durationMs: 88 },
      { name: "Reranking", kind: "rerank", durationMs: 233, detail: "12 → 4 kept" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 927,
        model: "gpt-4.1",
        inputTokens: 2048,
        outputTokens: 372,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "5e88c1d3",
    query: "Why is ingestion lagging behind the landing bucket?",
    strategy: "crag",
    datasetId: "ds_engineering_docs",
    datasetName: "Engineering Docs",
    model: "claude-sonnet-4.5",
    ttftMs: 1180,
    inputTokens: 3640,
    outputTokens: 486,
    costUsd: 0.0279,
    createdAt: ago({ hours: 4, minutes: 18 }),
    stages: [
      { name: "Query Rewrite", kind: "rewrite", durationMs: 196, model: "gpt-4.1-mini" },
      { name: "Retrieval", kind: "retrieval", durationMs: 102, detail: "top-k 16" },
      {
        name: "Grade Context",
        kind: "guardrail",
        durationMs: 318,
        status: "warning",
        detail: "2 of 6 passages marked ambiguous",
      },
      { name: "Corrective Retrieval", kind: "retrieval", durationMs: 241, detail: "+3 passages" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 1884,
        model: "claude-sonnet-4.5",
        inputTokens: 3640,
        outputTokens: 486,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "b2f4590c",
    query: "List the SOC 2 controls covering tenant isolation",
    strategy: "hybrid",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    model: "gpt-4.1",
    status: "error",
    ttftMs: 0,
    inputTokens: 1980,
    outputTokens: 0,
    costUsd: 0.0049,
    createdAt: ago({ hours: 5, minutes: 2 }),
    stages: [
      { name: "Query Rewrite", kind: "rewrite", durationMs: 174, model: "gpt-4.1-mini" },
      { name: "Hybrid Retrieval", kind: "retrieval", durationMs: 121, detail: "0 passages above 0.60" },
      {
        name: "Reranking",
        kind: "rerank",
        durationMs: 96,
        status: "warning",
        detail: "empty candidate set",
      },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 214,
        status: "error",
        model: "gpt-4.1",
        detail: "aborted: insufficient context",
      },
    ],
    answer: "",
  },
  {
    id: "c41a7f88",
    query: "Compare Q2 and Q3 gross margin",
    strategy: "hybrid",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    model: "gpt-4.1",
    ttftMs: 690,
    inputTokens: 2410,
    outputTokens: 358,
    costUsd: 0.0143,
    createdAt: ago({ hours: 6, minutes: 45 }),
    stages: [
      { name: "Query Rewrite", kind: "rewrite", durationMs: 168, model: "gpt-4.1-mini" },
      { name: "Hybrid Retrieval", kind: "retrieval", durationMs: 97, detail: "top-k 24" },
      { name: "Reranking", kind: "rerank", durationMs: 246, detail: "24 → 5 kept" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 1119,
        model: "gpt-4.1",
        inputTokens: 2410,
        outputTokens: 358,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "9023de5a",
    query: "Refund policy for annual plans",
    strategy: "naive",
    datasetId: "ds_support_tickets",
    datasetName: "Support Tickets",
    model: "gpt-4.1-mini",
    ttftMs: 280,
    inputTokens: 1180,
    outputTokens: 186,
    costUsd: 0.0026,
    createdAt: ago({ hours: 8, minutes: 10 }),
    stages: [
      { name: "Dense Retrieval", kind: "retrieval", durationMs: 54, detail: "top-k 5" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 586,
        model: "gpt-4.1-mini",
        inputTokens: 1180,
        outputTokens: 186,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "6b77a104",
    query: "What is reciprocal rank fusion and when should I use it?",
    strategy: "hyde",
    datasetId: "ds_research_papers",
    datasetName: "Research Papers",
    model: "gpt-4.1",
    ttftMs: 720,
    inputTokens: 2260,
    outputTokens: 412,
    costUsd: 0.0131,
    createdAt: ago({ hours: 11, minutes: 32 }),
    stages: [
      {
        name: "Hypothetical Document",
        kind: "rewrite",
        durationMs: 534,
        model: "gpt-4.1-mini",
        detail: "generated 186-token passage",
      },
      { name: "Dense Retrieval", kind: "retrieval", durationMs: 76 },
      { name: "Reranking", kind: "rerank", durationMs: 219, detail: "12 → 3 kept" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 676,
        model: "gpt-4.1",
        inputTokens: 2260,
        outputTokens: 412,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "e37b5c11",
    query: "What are the context window limits by model?",
    strategy: "naive",
    datasetId: "ds_engineering_docs",
    datasetName: "Engineering Docs",
    model: "gpt-4.1-mini",
    ttftMs: 340,
    inputTokens: 1540,
    outputTokens: 262,
    costUsd: 0.0034,
    createdAt: ago({ hours: 14, minutes: 5 }),
    stages: [
      { name: "Dense Retrieval", kind: "retrieval", durationMs: 68, detail: "top-k 8" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 852,
        model: "gpt-4.1-mini",
        inputTokens: 1540,
        outputTokens: 262,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "18f6a2d9",
    query: "How has support ticket volume trended this quarter?",
    strategy: "crag",
    datasetId: "ds_support_tickets",
    datasetName: "Support Tickets",
    model: "claude-haiku-4.5",
    ttftMs: 960,
    inputTokens: 2980,
    outputTokens: 344,
    costUsd: 0.0098,
    createdAt: ago({ hours: 18, minutes: 46 }),
    stages: [
      { name: "Query Rewrite", kind: "rewrite", durationMs: 188, model: "gpt-4.1-mini" },
      { name: "Retrieval", kind: "retrieval", durationMs: 94, detail: "top-k 16" },
      {
        name: "Grade Context",
        kind: "guardrail",
        durationMs: 274,
        detail: "all passages correct",
      },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 1494,
        model: "claude-haiku-4.5",
        inputTokens: 2980,
        outputTokens: 344,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "4a29e680",
    query: "Which subprocessors appear in the standard DPA?",
    strategy: "naive",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    model: "gpt-4.1-mini",
    ttftMs: 300,
    inputTokens: 1320,
    outputTokens: 208,
    costUsd: 0.0029,
    createdAt: ago({ days: 1, hours: 2 }),
    stages: [
      { name: "Dense Retrieval", kind: "retrieval", durationMs: 58, detail: "top-k 5" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 772,
        model: "gpt-4.1-mini",
        inputTokens: 1320,
        outputTokens: 208,
      },
    ],
    answer: SHORT_ANSWER,
  },
  {
    id: "f10c3b92",
    query: "Install guide for v4 agents on Windows",
    strategy: "multi-query",
    datasetId: "ds_engineering_docs",
    datasetName: "Engineering Docs",
    model: "gpt-4.1-mini",
    ttftMs: 410,
    inputTokens: 1740,
    outputTokens: 302,
    costUsd: 0.0047,
    createdAt: ago({ days: 1, hours: 8 }),
    stages: [
      { name: "Query Expansion", kind: "rewrite", durationMs: 248, detail: "3 variants" },
      { name: "Multi Retrieval", kind: "retrieval", durationMs: 158, detail: "3 × top-k 10" },
      { name: "Fusion (RRF)", kind: "fusion", durationMs: 38, detail: "k = 60" },
      { name: "Reranking", kind: "rerank", durationMs: 204, detail: "22 → 5 kept" },
      {
        name: "Generation",
        kind: "generation",
        durationMs: 462,
        model: "gpt-4.1-mini",
        inputTokens: 1740,
        outputTokens: 302,
      },
    ],
    answer: SHORT_ANSWER,
  },
];

export const mockTraces: Trace[] = specs.map(buildTrace);

export function getTraceById(id: string): Trace | undefined {
  return mockTraces.find((trace) => trace.id === id);
}
