import { Plus } from "lucide-react";

import { Section, SectionHeader } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { AnimatedBar } from "@/components/visualizations/animated-bar";
import { PipelineConnector } from "@/components/visualizations/pipeline-connector";
import { StageIcon } from "@/components/visualizations/stage-visuals";
import { showcasePipeline, showcasePipelineConfig } from "@/lib/mock-data/landing";
import { cn } from "@/lib/utils";

const SELECTED_STAGE = "hybrid";

/**
 * Pipeline builder showcase.
 *
 * The hero diagram shows a pipeline being *inspected*; this one shows a pipeline
 * being *built* — same node language, but with an open configuration panel and a
 * canvas surface, so the two sections read as two modes of one product.
 */
export function PipelineShowcase() {
  return (
    <Section width="wide">
      <SectionHeader
        eyebrow="Pipeline builder"
        title="Build the pipeline. Don't just configure it."
        description="Drop stages onto a canvas, wire them together and configure each one inline. A pipeline is a first-class artefact — versioned, diffable and rerunnable on any dataset."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-6">
        <div className="relative overflow-hidden rounded-xl border border-line bg-surface-inset">
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" aria-hidden />

          <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-subtle px-4 py-2.5">
            <span className="technical whitespace-nowrap text-2xs uppercase tracking-[0.16em] text-fg-muted">
              Canvas
            </span>
            <span className="technical truncate text-2xs text-accent">multi-query · hybrid-rerank</span>
            <span className="technical ml-auto whitespace-nowrap text-2xs text-fg-disabled">
              {showcasePipeline.length} stages
            </span>
          </div>

          <div className="relative flex flex-col items-center px-4 py-6 sm:px-8 sm:py-8">
            {showcasePipeline.map((stage, index) => {
              const isSelected = stage.id === SELECTED_STAGE;

              return (
                <div key={stage.id} className="flex w-full max-w-xs flex-col items-stretch">
                  <div
                    className={cn(
                      "relative rounded-lg border p-2.5 transition-colors",
                      isSelected
                        ? "border-accent-line bg-accent-muted"
                        : "border-line bg-surface hover:border-line-strong hover:bg-surface-hover",
                    )}
                  >
                    {/* Canvas connection ports */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1/2 -left-[3px] size-1.5 -translate-y-1/2 rounded-full border",
                        isSelected ? "border-accent-line bg-accent" : "border-line-strong bg-surface",
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1/2 -right-[3px] size-1.5 -translate-y-1/2 rounded-full border",
                        isSelected ? "border-accent-line bg-accent" : "border-line-strong bg-surface",
                      )}
                    />

                    <div className="flex items-center gap-2">
                      <StageIcon kind={stage.stageKind} size="sm" />
                      <span className="truncate text-xs font-medium text-fg">
                        {stage.label}
                      </span>
                      {isSelected ? (
                        <span className="ml-auto">
                          <Badge size="sm" mono tone="accent">
                            editing
                          </Badge>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {index < showcasePipeline.length - 1 ? (
                    <PipelineConnector size="sm" active={isSelected} />
                  ) : null}
                </div>
              );
            })}

            <button
              type="button"
              className="mt-2 flex items-center gap-1.5 rounded-sm border border-dashed border-line-strong px-3 py-1.5 text-2xs text-fg-muted transition-colors hover:border-accent-line hover:text-accent focus-ring"
            >
              <Plus className="size-3" aria-hidden />
              Add stage
            </button>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-center gap-2.5 border-b border-line-subtle px-4 py-3">
            <StageIcon kind="vector" size="sm" />
            <span className="truncate text-xs font-medium text-fg">
              {showcasePipelineConfig.title}
            </span>
            <span className="technical ml-auto shrink-0 text-2xs text-fg-disabled">node 03</span>
          </div>

          <div className="flex flex-col gap-5 p-4">
            <div className="flex flex-col gap-3.5">
              {showcasePipelineConfig.weights.map((weight, index) => (
                <div key={weight.id} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-2xs text-fg-muted">{weight.label}</span>
                    <span className="technical text-2xs text-fg">{weight.value}%</span>
                  </div>
                  <AnimatedBar
                    value={weight.value / 100}
                    tone={index === 0 ? "accent" : "muted"}
                    delayMs={index * 80}
                    className="h-1.5"
                    label={`${weight.label} ${weight.value} percent`}
                  />
                </div>
              ))}
            </div>

            <dl className="flex flex-col gap-2.5 border-t border-line-subtle pt-4">
              {showcasePipelineConfig.fields.map((field) => (
                <div key={field.label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-2xs text-fg-muted">{field.label}</dt>
                  <dd className="technical truncate text-2xs text-fg-secondary">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-auto border-t border-line-subtle px-4 py-3 text-2xs leading-relaxed text-fg-disabled">
            Every parameter is addressable from the config file, so a pipeline built by
            hand and a pipeline defined in YAML stay the same object.
          </p>
        </div>
      </div>
    </Section>
  );
}
