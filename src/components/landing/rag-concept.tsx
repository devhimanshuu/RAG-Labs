import { Reveal } from "@/components/landing/reveal";
import { Section, SectionHeader } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { AnimatedBar } from "@/components/visualizations/animated-bar";
import { ragProgression } from "@/lib/mock-data/landing";
import { cn, formatDuration, formatPercent } from "@/lib/utils";

/**
 * "RAG is not one thing".
 *
 * Rendered as a single ladder rather than seven feature cards: each rung adds
 * exactly one idea to the rung above it, and the recall/latency pair makes the
 * trade-off it buys visible at the same time.
 */
export function RAGConcept() {
  return (
    <Section id="product" width="wide">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeader
            eyebrow="Architecture"
            title="RAG isn't a single architecture."
            description="Change the retriever. Change the query. Change the context. Change the reasoning strategy — the architecture changes the answer."
          />

          <p className="mt-6 max-w-md text-sm leading-relaxed text-fg-muted">
            Each step below adds one idea to the step above it. Some buy recall, some
            buy faithfulness, and every one of them costs latency. RAGLab exists to
            measure which is worth paying for on your data.
          </p>

          <dl className="mt-8 flex flex-col gap-2 border-t border-line-subtle pt-5">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="technical text-2xs uppercase tracking-[0.14em] text-fg-muted">
                Evaluated on
              </dt>
              <dd className="technical text-2xs text-fg-secondary">finance-qa · 100 queries</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="technical text-2xs uppercase tracking-[0.14em] text-fg-muted">
                Primary metric
              </dt>
              <dd className="technical text-2xs text-fg-secondary">recall@5</dd>
            </div>
          </dl>
        </div>

        <ol className="flex flex-col">
          {ragProgression.map((era, index) => {
            const isLast = index === ragProgression.length - 1;

            return (
              <Reveal as="li" key={era.id} delayMs={Math.min(index, 5) * 60}>
                <div className="group grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4">
                  {/* Timeline rail */}
                  <div className="relative flex flex-col items-center pt-1.5" aria-hidden>
                    <span
                      className={cn(
                        "size-2.5 rounded-full border transition-colors",
                        isLast
                          ? "border-accent-line bg-accent shadow-[0_0_0_3px_var(--accent-muted)]"
                          : "border-line-strong bg-surface group-hover:border-accent-line",
                      )}
                    />
                    {isLast ? null : (
                      <span className="mt-1 w-px flex-1 bg-gradient-to-b from-line-strong to-line-subtle" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "rounded-md px-3 py-3 transition-colors group-hover:bg-surface-hover",
                      isLast ? "pb-0" : "pb-6",
                    )}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="technical text-2xs text-fg-disabled">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-sm font-medium text-fg">{era.name}</h3>
                      <Badge size="sm" mono tone={isLast ? "accent" : "outline"}>
                        {era.delta}
                      </Badge>
                      <span className="technical ml-auto shrink-0 text-2xs text-fg-disabled">
                        {formatDuration(era.latencyMs)}
                      </span>
                    </div>

                    <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-fg-muted">
                      {era.description}
                    </p>

                    <div className="mt-2.5 flex items-center gap-3">
                      <AnimatedBar
                        value={era.recallAt5}
                        tone={isLast ? "accent" : "muted"}
                        delayMs={index * 60}
                        className="max-w-[9rem]"
                        label={`Recall@5 ${formatPercent(era.recallAt5, 0)}`}
                      />
                      <span className="technical text-2xs text-fg-secondary">
                        {formatPercent(era.recallAt5, 0)}
                        <span className="ml-1 text-fg-disabled">recall@5</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
