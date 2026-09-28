import {
  Activity,
  Boxes,
  Database,
  FlaskConical,
  LayoutDashboard,
  Plug,
  Settings,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

import type { AppPath, NavGroup } from "@/types";

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Workspace health, recent runs and live metrics",
        shortcut: "G D",
      },
      {
        label: "Playground",
        href: "/playground",
        icon: Sparkles,
        description: "Run a query through any retrieval strategy",
        shortcut: "G P",
      },
      {
        label: "Datasets",
        href: "/datasets",
        icon: Database,
        description: "Manage corpora, documents and indexes",
        shortcut: "G A",
      },
      {
        label: "Experiments",
        href: "/experiments",
        icon: FlaskConical,
        description: "Compare retrieval strategies across runs",
        shortcut: "G E",
      },
      {
        label: "Evaluation",
        href: "/evaluation",
        icon: Target,
        description: "Faithfulness, relevance and context quality",
        shortcut: "G V",
      },
      {
        label: "Pipelines",
        href: "/pipelines",
        icon: Workflow,
        description: "Compose retrieval and generation stages",
        shortcut: "G L",
      },
      {
        label: "Traces",
        href: "/traces",
        icon: Activity,
        description: "Inspect request-level timing and retrieval",
        shortcut: "G R",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        label: "Models",
        href: "/models",
        icon: Boxes,
        description: "Available chat, embedding and rerank models",
        shortcut: "G M",
      },
      {
        label: "Providers",
        href: "/providers",
        icon: Plug,
        description: "Provider connections and API configuration",
        shortcut: "G O",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Workspace, appearance and notifications",
        shortcut: "G S",
      },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

export interface RouteMeta {
  /** Page title, echoed in the top bar breadcrumb. */
  title: string;
  description: string;
}

export const ROUTE_META: Record<AppPath, RouteMeta> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Workspace health, retrieval quality and recent activity.",
  },
  "/playground": {
    title: "Playground",
    description: "Run a query end-to-end and inspect every retrieved chunk.",
  },
  "/datasets": {
    title: "Datasets",
    description: "Corpora available for retrieval, with chunk and token counts.",
  },
  "/experiments": {
    title: "Experiments",
    description: "Strategy configurations evaluated against a fixed dataset.",
  },
  "/evaluation": {
    title: "Evaluation",
    description: "RAG quality metrics aggregated across completed runs.",
  },
  "/pipelines": {
    title: "Pipelines",
    description: "Stage-by-stage composition of the retrieval and generation graph.",
  },
  "/traces": {
    title: "Traces",
    description: "Request-level timing, retrieval decisions and token usage.",
  },
  "/models": {
    title: "Models",
    description: "Models available to plays, pipelines and evaluators.",
  },
  "/providers": {
    title: "Providers",
    description: "Upstream connections, endpoints and credential state.",
  },
  "/settings": {
    title: "Settings",
    description: "Workspace preferences, appearance and integrations.",
  },
};

/** Resolves the deepest matching route so nested paths still show a title. */
export function getRouteMeta(pathname: string): RouteMeta | undefined {
  const match = (Object.keys(ROUTE_META) as AppPath[])
    .filter((path) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0];

  return match ? ROUTE_META[match] : undefined;
}
