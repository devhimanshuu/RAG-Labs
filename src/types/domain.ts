/**
 * RAGLab domain model.
 *
 * These types describe the shapes the Phase 2+ backend is expected to return.
 * Phase 1 components only ever read them from the mock-data layer, so swapping
 * mocks for API responses is a data-source change, not a component change.
 */

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                          */
/* -------------------------------------------------------------------------- */

export type RagStrategy = "naive" | "hybrid" | "hyde" | "multi-query" | "crag";

export type RunStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type HealthStatus = "healthy" | "degraded" | "unavailable";

export type Trend = "up" | "down" | "flat";

/** Retrieval and generation metrics are always normalised to a 0..1 ratio. */
export interface MetricDefinition {
  id: string;
  label: string;
  /** Raw value; interpretation depends on `unit`. */
  value: number;
  unit: "ratio" | "duration" | "count" | "currency";
  /** Signed delta against the comparison window, as a 0..1 ratio. */
  delta?: number;
  /** Whether an increase should be read as a good outcome. Defaults to true. */
  higherIsBetter?: boolean;
  description?: string;
  /** Recent values, oldest first, rendered as a sparkline. */
  series?: number[];
}

/** Side-by-side strategy performance, used by the Evaluation comparison chart. */
export interface StrategyComparison {
  strategy: RagStrategy;
  label: string;
  faithfulness: number;
  answerRelevance: number;
  contextRecall: number;
  contextPrecision: number;
  latencyMs: number;
  tokens: number;
}

/** Recall curve for the retrieval quality chart. */
export interface RecallCurvePoint {
  k: number;
  hybrid: number;
  hyde: number;
  naive: number;
}

/* -------------------------------------------------------------------------- */
/* Datasets                                                                   */
/* -------------------------------------------------------------------------- */

export type IndexStatus = "ready" | "indexing" | "stale" | "failed";

export interface DatasetDocument {
  id: string;
  name: string;
  pages: number;
  sizeBytes: number;
  chunks: number;
  status: "indexed" | "processing" | "failed";
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  chunkCount: number;
  tokenCount: number;
  embeddingModel: string;
  embeddingDimensions: number;
  indexStatus: IndexStatus;
  updatedAt: string;
  createdAt: string;
  tags: string[];
  /** Populated for the dataset detail table. */
  documents: DatasetDocument[];
}

/* -------------------------------------------------------------------------- */
/* Experiments                                                                */
/* -------------------------------------------------------------------------- */

export interface ExperimentMetrics {
  faithfulness: number;
  answerRelevance: number;
  contextRecall: number;
  contextPrecision: number;
  /** Mean end-to-end latency in milliseconds. */
  latencyMs: number;
  /** Mean tokens per sample. */
  tokens: number;
  costUsd: number;
}

export interface Experiment {
  id: string;
  name: string;
  datasetId: string;
  datasetName: string;
  strategy: RagStrategy;
  status: RunStatus;
  model: string;
  /** 0..1 completion ratio. Only meaningful while queued or running. */
  progress: number;
  sampleCount: number;
  durationMs: number;
  createdAt: string;
  updatedAt: string;
  author: string;
  metrics: ExperimentMetrics;
  /** Optional per-run metric history used by the evaluation charts. */
  trend?: EvaluationTrendPoint[];
}

/** One evaluation run's scores, plotted over time on the Evaluation page. */
export interface EvaluationTrendPoint {
  run: string;
  runIndex: number;
  faithfulness: number;
  answerRelevance: number;
  contextRecall: number;
  contextPrecision: number;
  latencyMs: number;
  tokens: number;
}

export interface LatencyBucket {
  bucket: string;
  count: number;
}

export interface TokenSpendPoint {
  label: string;
  input: number;
  output: number;
}

/* -------------------------------------------------------------------------- */
/* Retrieval                                                                  */
/* -------------------------------------------------------------------------- */

export interface RetrievalResult {
  id: string;
  /** 1-based position in the final ranked list. */
  rank: number;
  /** Fused / final score used for ordering. */
  score: number;
  /** Present when a reranker stage ran. */
  rerankScore?: number;
  denseScore?: number;
  sparseScore?: number;
  content: string;
  documentName: string;
  page: number;
  chunkId: string;
  tokens: number;
  /** Whether the chunk was kept after reranking. */
  kept: boolean;
}

/* -------------------------------------------------------------------------- */
/* Traces                                                                     */
/* -------------------------------------------------------------------------- */

export type TraceStepKind =
  | "rewrite"
  | "retrieval"
  | "rerank"
  | "fusion"
  | "generation"
  | "guardrail";

export interface TraceStep {
  id: string;
  name: string;
  kind: TraceStepKind;
  /** Offset from the trace start, used to draw the waterfall. */
  offsetMs: number;
  durationMs: number;
  status: "ok" | "warning" | "error";
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  /** Short human-readable note shown under the step title. */
  detail?: string;
}

export interface Trace {
  id: string;
  query: string;
  strategy: RagStrategy;
  datasetId: string;
  datasetName: string;
  model: string;
  status: "ok" | "error";
  latencyMs: number;
  /** Time to first token, in milliseconds. */
  ttftMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  createdAt: string;
  steps: TraceStep[];
  retrievalResults: RetrievalResult[];
  answer: string;
}

/* -------------------------------------------------------------------------- */
/* Pipelines                                                                  */
/* -------------------------------------------------------------------------- */

export type PipelineNodeKind =
  | "input"
  | "rewrite"
  | "retrieval"
  | "fusion"
  | "rerank"
  | "generation"
  | "evaluation";

export interface PipelineNodeConfig {
  label: string;
  value: string;
}

export interface PipelineNode {
  id: string;
  kind: PipelineNodeKind;
  title: string;
  subtitle?: string;
  config: PipelineNodeConfig[];
  status: RunStatus | "idle";
  latencyMs?: number;
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  strategy: RagStrategy;
  isDefault: boolean;
  updatedAt: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

/* -------------------------------------------------------------------------- */
/* Providers & models                                                         */
/* -------------------------------------------------------------------------- */

export type ProviderId = "openai" | "anthropic" | "google" | "ollama";

export type ProviderStatus = "connected" | "disconnected" | "error";

export interface Provider {
  id: ProviderId;
  name: string;
  description: string;
  status: ProviderStatus;
  modelCount: number;
  baseUrl: string;
  apiKeyConfigured: boolean;
  /** Masked key preview, e.g. "sk-…9a91". Never a real secret. */
  apiKeyHint?: string;
  lastCheckedAt: string;
  docsUrl: string;
}

export type ModelCapability =
  | "chat"
  | "embedding"
  | "rerank"
  | "vision"
  | "reasoning"
  | "tools"
  | "json";

export type ModelKind = "chat" | "embedding" | "rerank";

export interface Model {
  id: string;
  name: string;
  providerId: ProviderId;
  providerName: string;
  kind: ModelKind;
  contextWindow: number;
  maxOutputTokens?: number;
  inputCostPerMillion: number;
  outputCostPerMillion: number;
  /** Embedding vector size; only set for embedding models. */
  dimensions?: number;
  capabilities: ModelCapability[];
  status: HealthStatus;
  releasedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Workspace-level activity                                                   */
/* -------------------------------------------------------------------------- */

export type ActivityKind = "experiment" | "dataset" | "trace" | "pipeline" | "provider";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  actor: string;
  createdAt: string;
  status?: RunStatus | IndexStatus | ProviderStatus;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  tone: "info" | "success" | "warning" | "danger";
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  initials: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  initials: string;
  lastActiveAt: string;
}
