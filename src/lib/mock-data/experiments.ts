import type { Experiment, EvaluationTrendPoint } from "@/types";

import { ago } from "./clock";
import { createRandom } from "./random";

interface TrendSeed {
  faithfulness: number;
  answerRelevance: number;
  contextRecall: number;
  contextPrecision: number;
  latencyMs: number;
  tokens: number;
}

const TREND_LABELS = [
  "Sep 01",
  "Sep 04",
  "Sep 07",
  "Sep 10",
  "Sep 13",
  "Sep 16",
  "Sep 19",
  "Sep 22",
  "Sep 24",
  "Sep 25",
  "Sep 26",
  "Sep 27",
];

/**
 * Deterministic metric history. Seeded so charts render identically on the
 * server and the client, and so a refresh does not reshuffle the curves.
 */
function buildTrend(seed: number, base: TrendSeed): EvaluationTrendPoint[] {
  const random = createRandom(seed);

  return TREND_LABELS.map((run, index) => {
    // Scores drift upward as the experiment matures, with bounded noise.
    const progress = index / (TREND_LABELS.length - 1);
    const drift = 0.86 + progress * 0.14;
    const jitter = () => (random() - 0.5) * 0.03;

    return {
      run,
      runIndex: index + 1,
      faithfulness: clamp(base.faithfulness * drift + jitter()),
      answerRelevance: clamp(base.answerRelevance * drift + jitter()),
      contextRecall: clamp(base.contextRecall * drift + jitter()),
      contextPrecision: clamp(base.contextPrecision * drift + jitter()),
      latencyMs: Math.round(base.latencyMs * (1.18 - progress * 0.18) + (random() - 0.5) * 90),
      tokens: Math.round(base.tokens * (1.06 - progress * 0.06) + (random() - 0.5) * 140),
    };
  });
}

function clamp(value: number): number {
  return Math.min(0.999, Math.max(0.4, value));
}

export const mockExperiments: Experiment[] = [
  {
    id: "exp_revenue_qa",
    name: "Revenue QA",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    strategy: "hybrid",
    status: "completed",
    model: "gpt-4.1",
    progress: 1,
    sampleCount: 240,
    durationMs: 341_000,
    createdAt: ago({ days: 12 }),
    updatedAt: ago({ hours: 2 }),
    author: "Himanshu Rao",
    metrics: {
      faithfulness: 0.914,
      answerRelevance: 0.892,
      contextRecall: 0.878,
      contextPrecision: 0.921,
      latencyMs: 1420,
      tokens: 2184,
      costUsd: 3.31,
    },
    trend: buildTrend(17, {
      faithfulness: 0.914,
      answerRelevance: 0.892,
      contextRecall: 0.878,
      contextPrecision: 0.921,
      latencyMs: 1420,
      tokens: 2184,
    }),
  },
  {
    id: "exp_rag_benchmark",
    name: "RAG Benchmark",
    datasetId: "ds_engineering_docs",
    datasetName: "Engineering Docs",
    strategy: "hyde",
    status: "running",
    model: "claude-sonnet-4.5",
    progress: 0.62,
    sampleCount: 512,
    durationMs: 0,
    createdAt: ago({ hours: 4 }),
    updatedAt: ago({ minutes: 3 }),
    author: "Priya Nair",
    metrics: {
      faithfulness: 0.881,
      answerRelevance: 0.864,
      contextRecall: 0.902,
      contextPrecision: 0.847,
      latencyMs: 2140,
      tokens: 2960,
      costUsd: 1.92,
    },
    trend: buildTrend(29, {
      faithfulness: 0.881,
      answerRelevance: 0.864,
      contextRecall: 0.902,
      contextPrecision: 0.847,
      latencyMs: 2140,
      tokens: 2960,
    }),
  },
  {
    id: "exp_support_qa",
    name: "Support QA",
    datasetId: "ds_support_tickets",
    datasetName: "Support Tickets",
    strategy: "crag",
    status: "failed",
    model: "gpt-4.1-mini",
    progress: 0.34,
    sampleCount: 300,
    durationMs: 128_000,
    createdAt: ago({ days: 2 }),
    updatedAt: ago({ hours: 20 }),
    author: "Himanshu Rao",
    metrics: {
      faithfulness: 0.742,
      answerRelevance: 0.798,
      contextRecall: 0.681,
      contextPrecision: 0.724,
      latencyMs: 2980,
      tokens: 3140,
      costUsd: 0.84,
    },
    trend: buildTrend(43, {
      faithfulness: 0.742,
      answerRelevance: 0.798,
      contextRecall: 0.681,
      contextPrecision: 0.724,
      latencyMs: 2980,
      tokens: 3140,
    }),
  },
  {
    id: "exp_naive_baseline",
    name: "Naive Baseline",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    strategy: "naive",
    status: "completed",
    model: "gpt-4.1-mini",
    progress: 1,
    sampleCount: 240,
    durationMs: 96_000,
    createdAt: ago({ days: 18 }),
    updatedAt: ago({ days: 16 }),
    author: "Priya Nair",
    metrics: {
      faithfulness: 0.838,
      answerRelevance: 0.812,
      contextRecall: 0.716,
      contextPrecision: 0.784,
      latencyMs: 640,
      tokens: 1480,
      costUsd: 0.42,
    },
    trend: buildTrend(61, {
      faithfulness: 0.838,
      answerRelevance: 0.812,
      contextRecall: 0.716,
      contextPrecision: 0.784,
      latencyMs: 640,
      tokens: 1480,
    }),
  },
  {
    id: "exp_multiquery_sweep",
    name: "Multi Query Sweep",
    datasetId: "ds_research_papers",
    datasetName: "Research Papers",
    strategy: "multi-query",
    status: "queued",
    model: "gpt-4.1",
    progress: 0,
    sampleCount: 180,
    durationMs: 0,
    createdAt: ago({ minutes: 22 }),
    updatedAt: ago({ minutes: 22 }),
    author: "Dana Okafor",
    metrics: {
      faithfulness: 0,
      answerRelevance: 0,
      contextRecall: 0,
      contextPrecision: 0,
      latencyMs: 0,
      tokens: 0,
      costUsd: 0,
    },
  },
  {
    id: "exp_chunk_512",
    name: "Chunk Size 512",
    datasetId: "ds_engineering_docs",
    datasetName: "Engineering Docs",
    strategy: "hybrid",
    status: "completed",
    model: "gpt-4.1",
    progress: 1,
    sampleCount: 320,
    durationMs: 268_000,
    createdAt: ago({ days: 8 }),
    updatedAt: ago({ days: 7, hours: 6 }),
    author: "Dana Okafor",
    metrics: {
      faithfulness: 0.872,
      answerRelevance: 0.851,
      contextRecall: 0.804,
      contextPrecision: 0.889,
      latencyMs: 1180,
      tokens: 1760,
      costUsd: 1.94,
    },
    trend: buildTrend(73, {
      faithfulness: 0.872,
      answerRelevance: 0.851,
      contextRecall: 0.804,
      contextPrecision: 0.889,
      latencyMs: 1180,
      tokens: 1760,
    }),
  },
  {
    id: "exp_chunk_1024",
    name: "Chunk Size 1024",
    datasetId: "ds_engineering_docs",
    datasetName: "Engineering Docs",
    strategy: "hybrid",
    status: "completed",
    model: "gpt-4.1",
    progress: 1,
    sampleCount: 320,
    durationMs: 301_000,
    createdAt: ago({ days: 7 }),
    updatedAt: ago({ days: 6, hours: 2 }),
    author: "Dana Okafor",
    metrics: {
      faithfulness: 0.906,
      answerRelevance: 0.878,
      contextRecall: 0.861,
      contextPrecision: 0.842,
      latencyMs: 1640,
      tokens: 2680,
      costUsd: 2.68,
    },
    trend: buildTrend(89, {
      faithfulness: 0.906,
      answerRelevance: 0.878,
      contextRecall: 0.861,
      contextPrecision: 0.842,
      latencyMs: 1640,
      tokens: 2680,
    }),
  },
  {
    id: "exp_rerank_ablation",
    name: "Reranker Ablation",
    datasetId: "ds_finance_reports",
    datasetName: "Finance Reports",
    strategy: "hybrid",
    status: "completed",
    model: "gpt-4.1",
    progress: 1,
    sampleCount: 240,
    durationMs: 214_000,
    createdAt: ago({ days: 5 }),
    updatedAt: ago({ days: 4, hours: 9 }),
    author: "Himanshu Rao",
    metrics: {
      faithfulness: 0.931,
      answerRelevance: 0.904,
      contextRecall: 0.897,
      contextPrecision: 0.948,
      latencyMs: 1580,
      tokens: 2240,
      costUsd: 3.02,
    },
    trend: buildTrend(101, {
      faithfulness: 0.931,
      answerRelevance: 0.904,
      contextRecall: 0.897,
      contextPrecision: 0.948,
      latencyMs: 1580,
      tokens: 2240,
    }),
  },
];

/**
 * Workspace-level evaluation history. Used by the Evaluation page's headline
 * charts rather than any single experiment's trend.
 */
export const mockEvaluationTrend: EvaluationTrendPoint[] = buildTrend(7, {
  faithfulness: 0.914,
  answerRelevance: 0.892,
  contextRecall: 0.878,
  contextPrecision: 0.921,
  latencyMs: 1420,
  tokens: 2184,
});

export function getExperimentById(id: string): Experiment | undefined {
  return mockExperiments.find((experiment) => experiment.id === id);
}
