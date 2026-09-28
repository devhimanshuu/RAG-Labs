import { Section, SectionHeader } from "@/components/landing/section";
import { AnimatedBar } from "@/components/visualizations/animated-bar";
import { AnimatedNumber } from "@/components/visualizations/animated-number";
import { evaluationBars, evaluationSystemMetrics } from "@/lib/mock-data/landing";

/**
 * Evaluation showcase.
 *
 * Deliberately restrained: four quality bars and three system numbers, no
 * decorative chart. The claim being made is that quality is measured, not
 * vibes — so the section shows the measurement, not an illustration of it.
 */
export function EvaluationShowcase() {
  return (
    <Section id="evaluation" width="wide">
      <SectionHeader
        eyebrow="Evaluation"
        title="Measure what actually matters."
        description="Faithfulness, answer relevance, context recall and context precision — scored on every run, against the same dataset, with latency and spend reported next to them."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-6">
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-subtle px-4 py-3 sm:px-5">
            <span className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
              RAG quality
            </span>
            <span className="technical ml-auto text-2xs text-fg-disabled">
              finance-qa · 100 queries · 3 samples each
            </span>
          </div>

          <div className="flex flex-col divide-y divide-line-subtle">
            {evaluationBars.map((bar, index) => (
              <div key={bar.id} className="flex flex-col gap-2 px-4 py-4 sm:px-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs font-medium text-fg-secondary">{bar.label}</span>
                  <span className="technical text-sm font-medium text-fg">
                    <AnimatedNumber
                      value={bar.value}
                      format="percent"
                      digits={1}
                      delayMs={index * 60}
                      className="tabular-nums"
                    />
                  </span>
                </div>
                <AnimatedBar
                  value={bar.value}
                  tone="accent"
                  delayMs={index * 60}
                  label={`${bar.label} ${(bar.value * 100).toFixed(1)} percent`}
                />
              </div>
            ))}
          </div>

          <p className="border-t border-line-subtle px-4 py-3 text-2xs text-fg-disabled sm:px-5">
            Scored by an LLM judge against the reference answer set, with the judge
            model pinned per experiment so scores stay comparable over time.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="border-b border-line-subtle px-4 py-3">
              <span className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
                System
              </span>
            </div>

            <dl className="divide-y divide-line-subtle">
              {evaluationSystemMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-baseline justify-between gap-3 px-4 py-3.5"
                >
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs text-fg-secondary">{metric.label}</dt>
                    <span className="text-2xs text-fg-disabled">{metric.hint}</span>
                  </div>
                  <dd className="technical text-base font-medium text-fg">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface-inset px-4 py-4">
            <p className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
              The point
            </p>
            <p className="text-xs leading-relaxed text-fg-secondary">
              A technique that raises recall by nine points while tripling latency is
              not automatically an improvement. RAGLabs reports quality and cost in the
              same view so the trade stays a decision you make on evidence.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
