/**
 * Centralised mock-data layer.
 *
 * Phase 1 pages import everything they render from here — no component invents
 * its own sample data. Replacing this barrel with real query hooks is the
 * intended Phase 2 migration path.
 */

export { MOCK_NOW, MOCK_NOW_DATE, ago, timeAgo } from "./clock";
export { createRandom } from "./random";

export { mockDatasets, getDatasetById, DATASET_INDEX_STATUS_LABELS } from "./datasets";
export { mockEvaluationTrend, mockExperiments, getExperimentById } from "./experiments";
export {
  DEFAULT_PLAYGROUND_ANSWER,
  DEMO_QUERY,
  mockCandidateChunks,
  mockEngineeringRetrievalResults,
  mockResearchRetrievalResults,
  mockRetrievalResults,
  mockSupportRetrievalResults,
} from "./retrieval";
export { getTraceById, mockTraces } from "./traces";
export { mockModels, mockProviders, getModelsByProvider, getProviderById } from "./providers";
export {
  getPipelineById,
  getPipelineStageSummary,
  mockDefaultPipeline,
  mockPipelines,
} from "./pipelines";
export {
  mockDashboardMetrics,
  mockEvaluationMetrics,
  mockLatencyDistribution,
  mockOperationalMetrics,
  mockRecallCurve,
  mockStrategyComparison,
  mockTokenSpend,
} from "./metrics";
export { mockActivity, mockMembers, mockNotifications } from "./activity";

/* Marketing page fixtures — static copy and sample benchmarks. */
export {
  arenaColumns,
  arenaRows,
  developerPoints,
  developerSnippet,
  evaluationBars,
  evaluationSystemMetrics,
  footerColumns,
  getHeroNode,
  heroFlow,
  heroPipelineGroup,
  heroPipelineNodes,
  inspectorChunks,
  inspectorQuery,
  landingFeatures,
  landingNav,
  ragProgression,
  repoUrl,
  showcaseExperiment,
  showcasePipeline,
  showcasePipelineConfig,
  techniqueCategories,
} from "./landing";
export type {
  ArenaColumn,
  ArenaRow,
  FeatureItem,
  InspectorChunk,
  PipelineGraphNode,
  PipelineStageKind,
  RagEra,
  Technique,
  TechniqueCategory,
} from "./landing";

/** Convenience aggregates consumed by the dashboard. */
export const mockWorkspaceStats = {
  datasets: 6,
  documents: 8733,
  chunks: 52_384,
  traces: 18_402,
  experiments: 8,
  pipelines: 5,
} as const;
