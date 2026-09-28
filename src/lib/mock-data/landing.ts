/**
 * Landing page content.
 *
 * Every number, label and pipeline stage rendered on the marketing page comes
 * from here — no section invents its own sample data. Phase 2 can replace these
 * fixtures with real benchmark output without touching the components.
 */

/* -------------------------------------------------------------------------- */
/* Hero pipeline                                                              */
/* -------------------------------------------------------------------------- */

export type PipelineStageKind =
  | "input"
  | "transform"
  | "vector"
  | "sparse"
  | "rerank"
  | "context"
  | "generation";

export interface PipelineGraphNode {
  id: string;
  label: string;
  /** Technical eyebrow, rendered in mono uppercase. */
  kind: string;
  summary: string;
  detail: string;
  config: Array<{ label: string; value: string }>;
  latencyMs?: number;
  score?: number;
  /** Stage kinds share an icon and accent colour. */
  stageKind: PipelineStageKind;
}

export const heroPipelineNodes: PipelineGraphNode[] = [
  {
    id: "hybrid",
    label: "Hybrid Retrieval",
    kind: "Retrieval",
    stageKind: "vector",
    summary: "Dense + sparse, two candidate sets",
    detail:
      "Dense and lexical retrieval are genuinely different signals: embeddings capture meaning, BM25 captures exact tokens. Hybrid runs both and fuses the ranked lists, which is why it beats either alone.",
    config: [
      { label: "Retrievers", value: "2" },
      { label: "Top K each", value: "50" },
      { label: "Fusion", value: "RRF (k=60)" },
    ],
    latencyMs: 84,
    score: 0.86,
  },
  {
    id: "query",
    label: "User Query",
    kind: "Request",
    stageKind: "input",
    summary: "Why did revenue increase in 2025?",
    detail:
      "The raw request. Queries are captured verbatim so every downstream transformation can be diffed against the original.",
    config: [
      { label: "Tokens", value: "12" },
      { label: "Language", value: "en" },
      { label: "Source", value: "playground" },
    ],
  },
  {
    id: "transform",
    label: "Query Transform",
    kind: "Rewrite",
    stageKind: "transform",
    summary: "Rewrite · expand · normalise",
    detail:
      "Transforms the query before retrieval: rewriting for clarity, expanding into variants, or generating a hypothetical answer to embed in its place.",
    config: [
      { label: "Strategy", value: "HyDE" },
      { label: "Model", value: "gpt-4.1-mini" },
      { label: "Variants", value: "1" },
    ],
    latencyMs: 182,
  },
  {
    id: "vector",
    label: "Vector Search",
    kind: "Dense retriever",
    stageKind: "vector",
    summary: "ANN over embeddings",
    detail:
      "Approximate nearest-neighbour search over the dense index. Strong on paraphrase and semantics, weaker on exact identifiers and rare tokens.",
    config: [
      { label: "Top K", value: "50" },
      { label: "Index", value: "HNSW" },
      { label: "Metric", value: "cosine" },
    ],
    latencyMs: 84,
  },
  {
    id: "bm25",
    label: "BM25",
    kind: "Sparse retriever",
    stageKind: "sparse",
    summary: "Lexical keyword match",
    detail:
      "Lexical scoring over the inverted index. Catches exact terms, product codes and acronyms that embeddings routinely miss.",
    config: [
      { label: "Top K", value: "50" },
      { label: "k1", value: "1.2" },
      { label: "b", value: "0.75" },
    ],
    latencyMs: 31,
  },
  {
    id: "rerank",
    label: "Reranker",
    kind: "Cross-encoder",
    stageKind: "rerank",
    summary: "Score every candidate",
    detail:
      "A cross-encoder scores each (query, passage) pair jointly, which is far more accurate than comparing independent embeddings — and far more expensive.",
    config: [
      { label: "Candidates", value: "20" },
      { label: "Selected", value: "5" },
      { label: "Model", value: "bge-reranker-v2-m3" },
    ],
    latencyMs: 241,
    score: 0.942,
  },
  {
    id: "context",
    label: "Context",
    kind: "Assembly",
    stageKind: "context",
    summary: "Deduplicate and pack",
    detail:
      "Kept passages are deduplicated, ordered and packed into the prompt budget. Context precision here predicts faithfulness downstream.",
    config: [
      { label: "Chunks", value: "5" },
      { label: "Tokens", value: "2,184" },
      { label: "Budget", value: "8,192" },
    ],
    latencyMs: 12,
  },
  {
    id: "llm",
    label: "Generator",
    kind: "Completion",
    stageKind: "generation",
    summary: "Grounded answer + citations",
    detail:
      "Generates the answer strictly from the assembled context, emitting citations back to the source chunk of every claim.",
    config: [
      { label: "Model", value: "gpt-4.1" },
      { label: "Temperature", value: "0.1" },
      { label: "Output", value: "396 tokens" },
    ],
    latencyMs: 1_210,
  },
];

/** The dense and sparse retrievers run as one logical retrieval stage. */
export const heroPipelineGroup = {
  id: "hybrid",
  label: "Hybrid Retrieval",
  description: "Dense and sparse run in parallel, then fuse with reciprocal rank fusion.",
  nodeIds: ["vector", "bm25"],
};

/**
 * Vertical order of the hero diagram. A stage with `children` renders as a
 * labelled group containing those nodes side by side.
 */
export const heroFlow: Array<{ id: string; children?: string[]; edgeLabel?: string }> = [
  { id: "query" },
  { id: "transform", edgeLabel: "1 query" },
  { id: "hybrid", children: ["vector", "bm25"], edgeLabel: "2 retrievers" },
  { id: "rerank", edgeLabel: "20 candidates" },
  { id: "context", edgeLabel: "5 kept" },
  { id: "llm", edgeLabel: "2,184 tokens" },
];

export function getHeroNode(id: string): PipelineGraphNode | undefined {
  return heroPipelineNodes.find((node) => node.id === id);
}

/* -------------------------------------------------------------------------- */
/* RAG progression                                                            */
/* -------------------------------------------------------------------------- */

export interface RagEra {
  id: string;
  name: string;
  /** What changed relative to the previous rung. */
  delta: string;
  description: string;
  recallAt5: number;
  latencyMs: number;
}

export const ragProgression: RagEra[] = [
  {
    id: "naive",
    name: "Naive RAG",
    delta: "Baseline",
    description: "One dense retriever, top-k straight into the prompt.",
    recallAt5: 0.71,
    latencyMs: 1_200,
  },
  {
    id: "hybrid",
    name: "Hybrid RAG",
    delta: "+ sparse retriever",
    description: "Dense and BM25 fused with reciprocal rank fusion.",
    recallAt5: 0.86,
    latencyMs: 1_600,
  },
  {
    id: "hyde",
    name: "HyDE",
    delta: "+ query synthesis",
    description: "Embeds a generated hypothetical answer instead of the question.",
    recallAt5: 0.83,
    latencyMs: 2_100,
  },
  {
    id: "multi-query",
    name: "Multi-Query",
    delta: "+ query expansion",
    description: "Several query variants retrieved in parallel, then merged.",
    recallAt5: 0.88,
    latencyMs: 1_900,
  },
  {
    id: "crag",
    name: "CRAG",
    delta: "+ context grading",
    description: "Grades retrieved passages and corrects weak retrievals.",
    recallAt5: 0.91,
    latencyMs: 3_400,
  },
  {
    id: "self-rag",
    name: "Self-RAG",
    delta: "+ self-critique",
    description: "The model decides when to retrieve and critiques its own output.",
    recallAt5: 0.93,
    latencyMs: 3_900,
  },
  {
    id: "agentic",
    name: "Agentic RAG",
    delta: "+ tool loop",
    description: "Retrieval becomes a tool the model calls, repeatedly, with planning.",
    recallAt5: 0.95,
    latencyMs: 6_200,
  },
];

/* -------------------------------------------------------------------------- */
/* Technique explorer                                                         */
/* -------------------------------------------------------------------------- */

export interface Technique {
  id: string;
  name: string;
  summary: string;
  /** Mini pipeline rendered in the preview pane. */
  steps: Array<{ label: string; kind: PipelineStageKind }>;
  config: Array<{ label: string; value: string }>;
}

export interface TechniqueCategory {
  id: string;
  label: string;
  description: string;
  techniques: Technique[];
}

export const techniqueCategories: TechniqueCategory[] = [
  {
    id: "retrieval",
    label: "Retrieval",
    description: "How candidates are found before anything is generated.",
    techniques: [
      {
        id: "vector",
        name: "Vector Search",
        summary: "Embed the query, walk the dense index. The default for semantic questions.",
        steps: [
          { label: "Query", kind: "input" },
          { label: "Embedding", kind: "transform" },
          { label: "ANN Lookup", kind: "vector" },
          { label: "Context", kind: "context" },
        ],
        config: [
          { label: "Recall@5", value: "0.74" },
          { label: "Latency", value: "84ms" },
        ],
      },
      {
        id: "hybrid",
        name: "Hybrid Search",
        summary: "Dense and lexical retrieval fused with reciprocal rank fusion.",
        steps: [
          { label: "Query", kind: "input" },
          { label: "Vector Search", kind: "vector" },
          { label: "BM25", kind: "sparse" },
          { label: "RRF Fusion", kind: "transform" },
          { label: "Context", kind: "context" },
        ],
        config: [
          { label: "Recall@5", value: "0.86" },
          { label: "Latency", value: "115ms" },
        ],
      },
      {
        id: "bm25",
        name: "BM25",
        summary: "Pure lexical scoring. Still the strongest baseline for exact identifiers.",
        steps: [
          { label: "Query", kind: "input" },
          { label: "Tokenize", kind: "transform" },
          { label: "Inverted Index", kind: "sparse" },
          { label: "Context", kind: "context" },
        ],
        config: [
          { label: "Recall@5", value: "0.69" },
          { label: "Latency", value: "31ms" },
        ],
      },
    ],
  },
  {
    id: "query",
    label: "Query",
    description: "The query is a variable, not a constant.",
    techniques: [
      {
        id: "hyde",
        name: "HyDE",
        summary: "Generate a hypothetical answer, embed that instead of the question.",
        steps: [
          { label: "Question", kind: "input" },
          { label: "Hypothetical Answer", kind: "transform" },
          { label: "Embedding", kind: "vector" },
          { label: "Vector Search", kind: "vector" },
          { label: "Context", kind: "context" },
        ],
        config: [
          { label: "Recall@5", value: "0.83" },
          { label: "Extra tokens", value: "214" },
        ],
      },
      {
        id: "multi-query",
        name: "Multi Query",
        summary: "Expand into several phrasings and merge the ranked lists.",
        steps: [
          { label: "Question", kind: "input" },
          { label: "Expansion", kind: "transform" },
          { label: "4 × Retrieval", kind: "vector" },
          { label: "RRF Fusion", kind: "transform" },
          { label: "Context", kind: "context" },
        ],
        config: [
          { label: "Recall@5", value: "0.88" },
          { label: "Variants", value: "4" },
        ],
      },
      {
        id: "rewrite",
        name: "Query Rewrite",
        summary: "Resolve pronouns and implicit references from conversation history.",
        steps: [
          { label: "History", kind: "input" },
          { label: "Rewrite", kind: "transform" },
          { label: "Standalone Query", kind: "input" },
          { label: "Retrieval", kind: "vector" },
          { label: "Context", kind: "context" },
        ],
        config: [
          { label: "Recall@5", value: "0.81" },
          { label: "Latency", value: "182ms" },
        ],
      },
    ],
  },
  {
    id: "reasoning",
    label: "Reasoning",
    description: "What the system does when retrieval is not good enough.",
    techniques: [
      {
        id: "crag",
        name: "CRAG",
        summary: "Grade each passage, then correct the retrieval when it is weak.",
        steps: [
          { label: "Question", kind: "input" },
          { label: "Retrieval", kind: "vector" },
          { label: "Grade Context", kind: "rerank" },
          { label: "Corrective Retrieval", kind: "vector" },
          { label: "Generation", kind: "generation" },
        ],
        config: [
          { label: "Recall@5", value: "0.91" },
          { label: "Latency", value: "3.4s" },
        ],
      },
      {
        id: "self-rag",
        name: "Self-RAG",
        summary: "Special tokens let the model decide when to retrieve and what to keep.",
        steps: [
          { label: "Question", kind: "input" },
          { label: "Retrieve?", kind: "transform" },
          { label: "Retrieval", kind: "vector" },
          { label: "Critique", kind: "rerank" },
          { label: "Generation", kind: "generation" },
        ],
        config: [
          { label: "Recall@5", value: "0.93" },
          { label: "Latency", value: "3.9s" },
        ],
      },
      {
        id: "agentic",
        name: "Agentic RAG",
        summary: "Retrieval becomes a tool inside a planning loop with multiple hops.",
        steps: [
          { label: "Task", kind: "input" },
          { label: "Plan", kind: "transform" },
          { label: "Tool: Search", kind: "vector" },
          { label: "Tool: Fetch", kind: "context" },
          { label: "Synthesise", kind: "generation" },
        ],
        config: [
          { label: "Recall@5", value: "0.95" },
          { label: "Max hops", value: "6" },
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Retrieval inspector                                                        */
/* -------------------------------------------------------------------------- */

export interface InspectorChunk {
  id: string;
  rank: number;
  score: number;
  dense: number;
  sparse: number;
  content: string;
  source: string;
  page: string;
  kept: boolean;
}

export const inspectorQuery = "Why did revenue increase?";

export const inspectorChunks: InspectorChunk[] = [
  {
    id: "ins_01",
    rank: 1,
    score: 0.942,
    dense: 0.891,
    sparse: 0.774,
    kept: true,
    content:
      "Revenue increased primarily due to the expansion of the enterprise segment, which grew 34% year over year to $412.6M, supported by a 22% increase in average contract value.",
    source: "annual-report.pdf",
    page: "p.47",
  },
  {
    id: "ins_02",
    rank: 2,
    score: 0.917,
    dense: 0.874,
    sparse: 0.712,
    kept: true,
    content:
      "International sales increased 31% in EMEA and 47% in APAC. Subscription revenue reached 86% of total revenue, up from 79%.",
    source: "annual-report.pdf",
    page: "p.51",
  },
  {
    id: "ins_03",
    rank: 3,
    score: 0.884,
    dense: 0.918,
    sparse: 0.418,
    kept: true,
    content:
      "Operating margin expanded 340 basis points to 78.2% as inference costs per active workload declined across the quarter.",
    source: "earnings-call.txt",
    page: "12:42",
  },
  {
    id: "ins_04",
    rank: 4,
    score: 0.612,
    dense: 0.803,
    sparse: 0.529,
    kept: false,
    content:
      "Operating expenses totalled $344.1M, of which research and development represented $151.8M, an increase of 19% year over year.",
    source: "annual-report.pdf",
    page: "p.61",
  },
];

/* -------------------------------------------------------------------------- */
/* RAG arena                                                                  */
/* -------------------------------------------------------------------------- */

export interface ArenaColumn {
  id: string;
  label: string;
  /** Marks the architecture the section is recommending as the default. */
  featured?: boolean;
}

export interface ArenaRow {
  id: string;
  label: string;
  /** Rendered with the technical type treatment. */
  format: "percent" | "duration";
  values: Record<string, number>;
  /** Whether a higher value is the better result. */
  higherIsBetter: boolean;
}

export const arenaColumns: ArenaColumn[] = [
  { id: "naive", label: "Naive" },
  { id: "hybrid", label: "Hybrid", featured: true },
  { id: "hyde", label: "HyDE" },
  { id: "crag", label: "CRAG" },
];

export const arenaRows: ArenaRow[] = [
  {
    id: "recall",
    label: "Recall@5",
    format: "percent",
    higherIsBetter: true,
    values: { naive: 0.71, hybrid: 0.86, hyde: 0.83, crag: 0.91 },
  },
  {
    id: "faithfulness",
    label: "Faithfulness",
    format: "percent",
    higherIsBetter: true,
    values: { naive: 0.79, hybrid: 0.91, hyde: 0.88, crag: 0.95 },
  },
  {
    id: "relevance",
    label: "Answer relevance",
    format: "percent",
    higherIsBetter: true,
    values: { naive: 0.81, hybrid: 0.89, hyde: 0.91, crag: 0.94 },
  },
  {
    id: "latency",
    label: "Latency",
    format: "duration",
    higherIsBetter: false,
    values: { naive: 1200, hybrid: 1600, hyde: 2100, crag: 3400 },
  },
];

/* -------------------------------------------------------------------------- */
/* Experiment showcase                                                        */
/* -------------------------------------------------------------------------- */

export const showcaseExperiment = {
  id: "EXP-042",
  name: "FinanceQA · Hybrid sweep",
  dataset: "FinanceQA",
  queries: 100,
  pipeline: ["Multi Query", "Hybrid", "Reranker", "GPT-4.1"],
  status: {
    label: "Completed",
    tone: "success" as const,
  },
  metrics: [
    { id: "faithfulness", label: "Faithfulness", value: 0.942, delta: 0.031 },
    { id: "recall", label: "Recall@5", value: 0.917, delta: 0.024 },
    { id: "latency", label: "Latency", value: 1800, format: "duration" as const },
    { id: "cost", label: "Cost / query", value: 0.004, format: "currency" as const },
  ],
  /** Score history plotted in the experiment card. */
  history: [0.82, 0.85, 0.84, 0.88, 0.9, 0.89, 0.92, 0.94],
};

/* -------------------------------------------------------------------------- */
/* Pipeline builder showcase                                                  */
/* -------------------------------------------------------------------------- */

export const showcasePipeline = [
  { id: "query", label: "Query", stageKind: "input" as PipelineStageKind },
  { id: "multi", label: "Multi Query", stageKind: "transform" as PipelineStageKind },
  { id: "hybrid", label: "Hybrid Retrieval", stageKind: "vector" as PipelineStageKind },
  { id: "rerank", label: "Reranker", stageKind: "rerank" as PipelineStageKind },
  { id: "compress", label: "Context Compression", stageKind: "context" as PipelineStageKind },
  { id: "generator", label: "Generator", stageKind: "generation" as PipelineStageKind },
];

export const showcasePipelineConfig = {
  title: "Hybrid Retrieval",
  weights: [
    { id: "vector", label: "Vector weight", value: 70 },
    { id: "bm25", label: "BM25 weight", value: 30 },
  ],
  fields: [
    { label: "Top K", value: "10" },
    { label: "Fusion", value: "RRF (k=60)" },
    { label: "Reranker", value: "bge-reranker-v2-m3" },
  ],
};

/* -------------------------------------------------------------------------- */
/* Evaluation showcase                                                        */
/* -------------------------------------------------------------------------- */

export const evaluationBars = [
  { id: "faithfulness", label: "Faithfulness", value: 0.942 },
  { id: "answer-relevance", label: "Answer relevance", value: 0.918 },
  { id: "context-recall", label: "Context recall", value: 0.887 },
  { id: "context-precision", label: "Context precision", value: 0.931 },
];

export const evaluationSystemMetrics = [
  { id: "latency", label: "Latency", value: "1.42s", hint: "p50, end to end" },
  { id: "tokens", label: "Tokens", value: "2,184", hint: "context + output" },
  { id: "cost", label: "Cost / query", value: "$0.004", hint: "gpt-4.1 pricing" },
];

/* -------------------------------------------------------------------------- */
/* Features                                                                   */
/* -------------------------------------------------------------------------- */

export interface FeatureItem {
  id: string;
  index: string;
  title: string;
  description: string;
  /** Small technical visual drawn by the feature grid. */
  visual: "retrieval" | "transform" | "rerank" | "context" | "agentic" | "evaluation" | "observability" | "comparison";
}

export const landingFeatures: FeatureItem[] = [
  {
    id: "retrieval",
    index: "01",
    title: "Multiple retrieval strategies",
    description: "Dense, sparse, hybrid and graph retrieval behind one interface.",
    visual: "retrieval",
  },
  {
    id: "query",
    index: "02",
    title: "Query transformation",
    description: "Rewrite, expand and synthesise queries, and measure the delta.",
    visual: "transform",
  },
  {
    id: "reranking",
    index: "03",
    title: "Reranking",
    description: "Swap cross-encoders and watch precision change per stage.",
    visual: "rerank",
  },
  {
    id: "context",
    index: "04",
    title: "Context engineering",
    description: "Compress, deduplicate and order passages within a token budget.",
    visual: "context",
  },
  {
    id: "agentic",
    index: "05",
    title: "Agentic RAG",
    description: "Multi-hop tool loops with planning, retries and hop limits.",
    visual: "agentic",
  },
  {
    id: "evaluation",
    index: "06",
    title: "RAG evaluation",
    description: "Faithfulness, relevance and context quality on every run.",
    visual: "evaluation",
  },
  {
    id: "observability",
    index: "07",
    title: "Observability",
    description: "Per-stage latency and token accounting down to a single chunk.",
    visual: "observability",
  },
  {
    id: "comparison",
    index: "08",
    title: "Experiment comparison",
    description: "Diff two architectures across quality, latency and cost.",
    visual: "comparison",
  },
];

/* -------------------------------------------------------------------------- */
/* Developer section                                                          */
/* -------------------------------------------------------------------------- */

export const developerPoints = [
  "Inspect every retrieval step, score and discarded chunk.",
  "Compare architectures on a fixed dataset and query set.",
  "Trace every model call with token and cost accounting.",
  "Measure quality, latency and spend in the same run.",
  "Promote a winning experiment into a reproducible pipeline.",
];

export const developerSnippet = `# raglab.yaml
pipeline: hybrid-rerank
retrieval:
  dense:  { model: text-embedding-3-large, top_k: 50 }
  sparse: { engine: bm25, k1: 1.2, b: 0.75 }
  fusion: { method: rrf, k: 60 }
rerank:  { model: bge-reranker-v2-m3, keep: 5 }
generate:
  model: gpt-4.1
  temperature: 0.1
evaluate:
  metrics: [faithfulness, answer_relevance, context_recall, context_precision]
  dataset: finance-qa
  samples: 240`;

/* -------------------------------------------------------------------------- */
/* Navigation & footer                                                        */
/* -------------------------------------------------------------------------- */

export const landingNav = [
  { id: "product", label: "Product", href: "#product" },
  { id: "techniques", label: "Techniques", href: "#techniques" },
  { id: "arena", label: "Benchmarks", href: "#arena" },
  { id: "developers", label: "Developers", href: "#developers" },
];

export const footerColumns = [
  {
    id: "product",
    label: "Product",
    links: [
      { label: "Playground", href: "/playground" },
      { label: "Experiments", href: "/experiments" },
      { label: "Evaluation", href: "/evaluation" },
      { label: "Pipelines", href: "/pipelines" },
      { label: "Traces", href: "/traces" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    links: [
      { label: "Documentation", href: "#developers" },
      { label: "Benchmarks", href: "#arena" },
      { label: "Techniques", href: "#techniques" },
      { label: "Datasets", href: "/datasets" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    links: [
      { label: "Models", href: "/models" },
      { label: "Providers", href: "/providers" },
      { label: "Settings", href: "/settings" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export const repoUrl = "https://github.com/raglab/raglab";
