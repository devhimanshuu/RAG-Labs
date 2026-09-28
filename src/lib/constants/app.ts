import type { RagStrategy } from "@/types";

export const APP_NAME = "RAGLabs";
export const APP_TAGLINE = "Retrieval experimentation lab";
export const APP_VERSION = "0.1.0";

/**
 * Keyboard shortcuts, declared once so the command palette, sidebar tooltips
 * and handlers can never drift apart.
 */
export const SHORTCUTS = {
  commandPalette: { label: "⌘K", aria: "Command K" },
  toggleSidebar: { label: "⌘B", aria: "Command B" },
  help: { label: "⌘/", aria: "Command Slash" },
  runQuery: { label: "⌘↵", aria: "Command Enter" },
  newExperiment: { label: "⌘⇧E", aria: "Command Shift E" },
  newDataset: { label: "⌘⇧D", aria: "Command Shift D" },
  search: { label: "⌘F", aria: "Command F" },
} as const;

/** RAG strategy presentation metadata. Order defines the selector order. */
export const RAG_STRATEGIES: Array<{
  id: RagStrategy;
  label: string;
  short: string;
  description: string;
}> = [
  {
    id: "naive",
    label: "Naive",
    short: "Naive",
    description: "Single dense retrieval pass straight into the generator.",
  },
  {
    id: "hybrid",
    label: "Hybrid",
    short: "Hybrid",
    description: "Dense and sparse retrieval fused with reciprocal rank fusion.",
  },
  {
    id: "hyde",
    label: "HyDE",
    short: "HyDE",
    description: "Generates a hypothetical answer and embeds it as the query.",
  },
  {
    id: "multi-query",
    label: "Multi Query",
    short: "Multi",
    description: "Expands the query into several variants and merges the hits.",
  },
  {
    id: "crag",
    label: "CRAG",
    short: "CRAG",
    description: "Grades retrieved context and corrects weak retrievals.",
  },
];

export const STRATEGY_LABELS: Record<RagStrategy, string> = RAG_STRATEGIES.reduce(
  (acc, strategy) => {
    acc[strategy.id] = strategy.label;
    return acc;
  },
  {} as Record<RagStrategy, string>,
);

export const WORKSPACE = {
  id: "ws_raglab_research",
  name: "Acme Research",
  plan: "Team",
  initials: "AR",
} as const;

export const CURRENT_USER = {
  name: "Himanshu Rao",
  email: "himanshu@acme.dev",
  role: "Owner",
  initials: "HR",
} as const;

export const SUPPORTED_FILE_TYPES = [".pdf", ".md", ".txt", ".docx", ".html", ".csv"];

export const EMBEDDING_DIMENSIONS = [384, 768, 1024, 1536, 3072];
