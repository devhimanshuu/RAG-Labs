import { ArrowRight, Check, Crosshair, RotateCw } from "lucide-react";

import { Section, SectionHeader } from "@/components/landing/section";
import { AnimatedBar } from "@/components/visualizations/animated-bar";
import { landingFeatures, type FeatureItem } from "@/lib/mock-data/landing";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Micro-visual primitives                                                    */
/* -------------------------------------------------------------------------- */

type BarTone = "accent" | "success" | "info" | "warning" | "muted";

function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "technical text-[10px] uppercase tracking-[0.14em] text-fg-disabled",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Rows({
  values,
  tone = "accent",
  className,
}: {
  values: number[];
  tone?: BarTone;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {values.map((value, index) => (
        <AnimatedBar key={index} value={value} tone={tone} delayMs={index * 50} />
      ))}
    </div>
  );
}

function Chip({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent";
}) {
  return (
    <span
      className={cn(
        "technical truncate rounded-xs border px-1.5 py-1 text-[10px]",
        tone === "accent"
          ? "border-accent-line bg-accent-muted text-accent"
          : "border-line bg-surface-inset text-fg-muted",
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Per-feature visuals                                                        */
/* -------------------------------------------------------------------------- */

/** Two retrievers, one fused ranking. */
function RetrievalVisual() {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <Caption>dense</Caption>
          <Rows values={[0.88, 0.62]} tone="accent" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Caption>bm25</Caption>
          <Rows values={[0.74, 0.44]} tone="muted" />
        </div>
      </div>

      <ArrowRight className="size-3.5 shrink-0 text-fg-disabled" aria-hidden />

      <div className="flex flex-col gap-1.5">
        <Caption>rrf fusion</Caption>
        <Rows values={[0.94, 0.86, 0.71, 0.55]} tone="accent" />
      </div>
    </div>
  );
}

/** One question becomes several retrievable phrasings. */
function TransformVisual() {
  return (
    <div className="flex w-full items-center gap-3">
      <Chip>why?</Chip>
      <ArrowRight className="size-3.5 shrink-0 text-fg-disabled" aria-hidden />
      <div className="flex min-w-0 flex-col gap-1.5">
        <Chip tone="accent">revenue drivers</Chip>
        <Chip>what grew in 2025</Chip>
        <Chip>margin expansion</Chip>
      </div>
    </div>
  );
}

/** Candidates scored jointly, then cut to the top five. */
function RerankVisual() {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <div className="flex flex-col gap-1.5">
        <Caption>20 candidates</Caption>
        <Rows values={[0.91, 0.58, 0.77, 0.42]} tone="muted" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Caption className="text-accent">keep 5</Caption>
        <Rows values={[0.95, 0.92, 0.84, 0.66]} tone="accent" />
      </div>
      <div className="col-span-2 flex items-center gap-1.5">
        <Crosshair className="size-3 text-fg-disabled" aria-hidden />
        <span className="technical text-[10px] text-fg-disabled">
          cross-encoder · 241ms
        </span>
      </div>
    </div>
  );
}

/** Passages packed into a prompt budget. */
function ContextVisual() {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <div className="h-3 rounded-xs border border-line bg-surface-inset" />
        <div className="h-3 rounded-xs border border-line bg-surface-inset" />
        <div className="h-3 rounded-xs border border-dashed border-line-strong bg-transparent" />
      </div>
      <div className="flex items-center gap-2">
        <AnimatedBar value={0.27} tone="accent" className="h-1.5 flex-1" />
        <span className="technical text-[10px] text-fg-muted">2,184 / 8,192</span>
      </div>
      <span className="technical text-[10px] text-fg-disabled">1 duplicate dropped</span>
    </div>
  );
}

/** Retrieval as a tool the model calls in a loop. */
function AgenticVisual() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <Chip>plan</Chip>
        <ArrowRight className="size-3 shrink-0 text-fg-disabled" aria-hidden />
        <Chip tone="accent">search</Chip>
        <ArrowRight className="size-3 shrink-0 text-fg-disabled" aria-hidden />
        <Chip>fetch</Chip>
      </div>
      <div className="flex items-center gap-2">
        <RotateCw className="size-3 text-accent" aria-hidden />
        <span className="technical text-[10px] text-fg-secondary">hop 3 of 6</span>
        <span className="technical text-[10px] text-fg-disabled">· max 6</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <AnimatedBar value={0.5} tone="accent" delayMs={0} />
        <AnimatedBar value={0.3} tone="muted" delayMs={60} />
      </div>
    </div>
  );
}

/** Groundedness measured, not assumed. */
function EvaluationVisual() {
  return (
    <div className="flex w-full flex-col gap-2.5">
      {[
        { label: "faith", value: 0.94 },
        { label: "relevance", value: 0.92 },
        { label: "precision", value: 0.93 },
      ].map((metric, index) => (
        <div key={metric.label} className="flex items-center gap-2.5">
          <Caption className="w-20 shrink-0">{metric.label}</Caption>
          <AnimatedBar value={metric.value} tone="accent" delayMs={index * 60} />
          <span className="technical w-9 shrink-0 text-right text-[10px] text-fg-secondary">
            {(metric.value * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/** Where the milliseconds actually went. */
function ObservabilityVisual() {
  const segments = [
    { id: "retrieval", label: "84ms", width: "9%", tone: "bg-accent" },
    { id: "rerank", label: "241ms", width: "17%", tone: "bg-info" },
    { id: "generate", label: "1.09s", width: "74%", tone: "bg-success" },
  ];

  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
        {segments.map((segment) => (
          <span
            key={segment.id}
            className={cn("h-full", segment.tone)}
            style={{ width: segment.width }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {segments.map((segment) => (
          <span key={segment.id} className="flex items-center gap-1.5">
            <span aria-hidden className={cn("size-1.5 rounded-full", segment.tone)} />
            <span className="technical text-[10px] text-fg-muted">{segment.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Same question, two architectures, one diff. */
function ComparisonVisual() {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <div className="flex flex-col gap-1.5">
        <Caption>run a</Caption>
        <Rows values={[0.71, 0.79, 0.81]} tone="muted" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Caption className="text-accent">run b</Caption>
        <Rows values={[0.91, 0.94, 0.89]} tone="accent" />
      </div>
      <div className="col-span-2 flex items-center gap-1.5">
        <Check className="size-3 text-success" aria-hidden />
        <span className="technical text-[10px] text-success">+8.2% recall@5</span>
        <span className="technical text-[10px] text-fg-disabled">/ +400ms</span>
      </div>
    </div>
  );
}

const VISUALS: Record<FeatureItem["visual"], () => React.ReactElement> = {
  retrieval: RetrievalVisual,
  transform: TransformVisual,
  rerank: RerankVisual,
  context: ContextVisual,
  agentic: AgenticVisual,
  evaluation: EvaluationVisual,
  observability: ObservabilityVisual,
  comparison: ComparisonVisual,
};

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Cell spans per item index.
 *
 * Two wide cells lead the grid, then three-across rows — a bento rhythm instead
 * of eight identical cards. Mobile falls back to a single column.
 */
const CELL_SPANS = [
  "sm:col-span-2 lg:col-span-3",
  "sm:col-span-2 lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

export function FeatureSection() {
  return (
    <Section id="capabilities" width="wide">
      <SectionHeader
        eyebrow="Capabilities"
        title="Everything between the query and the answer."
        description="RAGLabs covers the whole pipeline, not just the prompt. Each capability below is a stage you can swap, configure and measure independently."
      />

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line-subtle sm:grid-cols-2 lg:grid-cols-6">
        {landingFeatures.map((feature, index) => {
          const Visual = VISUALS[feature.visual];
          const wide = index < 2;

          return (
            <article
              key={feature.id}
              className={cn(
                "flex flex-col gap-5 bg-surface p-5 transition-colors hover:bg-surface-hover",
                wide ? "lg:flex-row lg:items-center lg:gap-8" : "justify-between",
                CELL_SPANS[index],
              )}
            >
              <div className={cn("flex flex-col gap-1.5", wide && "lg:max-w-xs")}>
                <span className="technical text-2xs text-fg-disabled">{feature.index}</span>
                <h3 className="text-sm font-medium text-fg">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-fg-muted">{feature.description}</p>
              </div>

              <div
                className={cn(
                  "flex items-center rounded-lg border border-line-subtle bg-surface-inset px-3.5 py-3.5",
                  wide ? "lg:flex-1" : "",
                )}
              >
                <Visual />
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
