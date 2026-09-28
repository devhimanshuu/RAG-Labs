import { ArrowRight, ChevronRight, CircleCheck } from "lucide-react";

import { Section, SectionHeader } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/ui/sparkline";
import { AnimatedNumber } from "@/components/visualizations/animated-number";
import { showcaseExperiment } from "@/lib/mock-data/landing";
import { formatDuration, formatPercent } from "@/lib/utils";

/**
 * Renders a showcase metric.
 *
 * The landing page prints ratios as percentages at one decimal — the precision
 * an engineer actually quotes at a stand-up — rather than the raw ratio used by
 * the in-app tables.
 */
function MetricValue({ metric }: { metric: (typeof showcaseExperiment.metrics)[number] }) {
  if (metric.format === "duration") {
    return <>{formatDuration(metric.value)}</>;
  }

  if (metric.format === "currency") {
    return <>${metric.value.toFixed(3)}</>;
  }

  return (
    <AnimatedNumber
      value={metric.value}
      format="percent"
      digits={1}
      className="tabular-nums"
    />
  );
}

const history = showcaseExperiment.history;
const firstScore = history[0];
const lastScore = history[history.length - 1];

/** Experiment detail, rendered as the run artefact it would be in the app. */
export function ExperimentShowcase() {
  return (
    <Section id="experiments" width="wide">
      <SectionHeader
        eyebrow="Experiments"
        title="Stop guessing. Run experiments."
        description="Every run is a versioned artefact: dataset, pipeline, configuration, scores, tokens and cost. Compare any two of them later without rerunning anything."
      />

      <div className="mt-10 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line-subtle px-4 py-3 sm:px-5">
          <span className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
            Experiment
          </span>
          <span className="technical text-2xs font-medium text-accent">
            {showcaseExperiment.id}
          </span>
          <Badge size="sm" mono tone={showcaseExperiment.status.tone}>
            <CircleCheck aria-hidden />
            {showcaseExperiment.status.label}
          </Badge>
          <span className="ml-auto truncate text-xs text-fg-secondary">
            {showcaseExperiment.name}
          </span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
          <div className="flex flex-col gap-5 border-b border-line-subtle p-4 lg:border-r lg:border-b-0 sm:p-5">
            <dl className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-2xs text-fg-muted">Dataset</dt>
                <dd className="technical text-xs text-fg-secondary">
                  {showcaseExperiment.dataset}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-2xs text-fg-muted">Queries</dt>
                <dd className="technical text-xs text-fg-secondary">
                  {showcaseExperiment.queries}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-2xs text-fg-muted">Samples / query</dt>
                <dd className="technical text-xs text-fg-secondary">3</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-2xs text-fg-muted">Judge model</dt>
                <dd className="technical text-xs text-fg-secondary">gpt-4.1</dd>
              </div>
            </dl>

            <div className="border-t border-line-subtle pt-4">
              <p className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
                Pipeline
              </p>
              <ol className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1.5">
                {showcaseExperiment.pipeline.map((stage, index) => (
                  <li key={stage} className="flex items-center gap-1">
                    <span className="rounded-xs border border-line bg-surface-inset px-1.5 py-1 text-2xs text-fg-secondary">
                      {stage}
                    </span>
                    {index < showcaseExperiment.pipeline.length - 1 ? (
                      <ChevronRight className="size-3 text-fg-disabled" aria-hidden />
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-px bg-line-subtle">
              {showcaseExperiment.metrics.map((metric) => (
                <div key={metric.id} className="flex flex-col gap-1.5 bg-surface px-4 py-4">
                  <span className="text-2xs text-fg-muted">{metric.label}</span>
                  <span className="technical text-xl font-semibold leading-none tracking-tight text-fg">
                    <MetricValue metric={metric} />
                  </span>
                  {metric.delta === undefined ? null : (
                    <span className="technical text-2xs text-success">
                      +{formatPercent(metric.delta, 1)} vs. baseline
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-1 flex-col justify-end gap-2 border-t border-line-subtle p-4 sm:p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
                  Faithfulness across runs
                </span>
                <span className="technical text-2xs text-fg-secondary">
                  {formatPercent(firstScore, 0)} → {formatPercent(lastScore, 1)}
                </span>
              </div>
              <Sparkline
                values={history}
                tone="accent"
                area
                className="h-12"
                aria-label="Faithfulness across the last eight runs"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line-subtle px-4 py-3 sm:px-5">
          <span className="technical flex items-center gap-1.5 text-2xs text-accent">
            Promote to pipeline
            <ArrowRight className="size-3" aria-hidden />
          </span>
          <span aria-hidden className="h-3 w-px bg-line" />
          <span className="technical text-2xs text-fg-disabled">
            configuration pinned · reproducible by seed 42
          </span>
        </div>
      </div>
    </Section>
  );
}
