"use client";

import * as React from "react";

import { Section, SectionHeader } from "@/components/landing/section";
import { PipelineConnector } from "@/components/visualizations/pipeline-connector";
import { StageIcon } from "@/components/visualizations/stage-visuals";
import {
  techniqueCategories,
  type Technique,
  type TechniqueCategory,
} from "@/lib/mock-data/landing";
import { cn } from "@/lib/utils";

const DEFAULT_CATEGORY = techniqueCategories[0];
const DEFAULT_TECHNIQUE = DEFAULT_CATEGORY.techniques[1] ?? DEFAULT_CATEGORY.techniques[0];

/** Vertical mini-flow for the currently selected technique. */
function TechniqueFlow({ technique }: { technique: Technique }) {
  return (
    <ol className="flex flex-col items-stretch">
      {technique.steps.map((step, index) => {
        const isLast = index === technique.steps.length - 1;

        return (
          <React.Fragment key={`${step.label}-${index}`}>
            <li
              className={cn(
                "flex items-center gap-2.5 rounded-md border px-2.5 py-2",
                isLast
                  ? "border-accent-line bg-accent-muted"
                  : "border-line bg-surface-inset",
              )}
            >
              <StageIcon kind={step.kind} size="sm" />
              <span
                className={cn(
                  "truncate text-xs",
                  isLast ? "font-medium text-accent" : "text-fg-secondary",
                )}
              >
                {step.label}
              </span>
              <span className="technical ml-auto shrink-0 text-2xs text-fg-disabled">
                {String(index + 1).padStart(2, "0")}
              </span>
            </li>
            {isLast ? null : <PipelineConnector size="sm" active />}
          </React.Fragment>
        );
      })}
    </ol>
  );
}

function TechniqueButton({
  technique,
  selected,
  onSelect,
}: {
  technique: Technique;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-colors focus-ring",
        selected
          ? "border-accent-line bg-accent-muted text-accent"
          : "border-line bg-surface text-fg-secondary hover:border-line-strong hover:bg-surface-hover hover:text-fg",
      )}
    >
      {technique.name}
    </button>
  );
}

function CategoryGroup({
  category,
  selectedId,
  onSelect,
}: {
  category: TechniqueCategory;
  selectedId: string;
  onSelect: (technique: Technique) => void;
}) {
  return (
    <div className="border-t border-line-subtle pt-5 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="technical text-2xs uppercase tracking-[0.16em] text-fg">
          {category.label}
        </h3>
        <p className="text-2xs text-fg-disabled">{category.description}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {category.techniques.map((technique) => (
          <TechniqueButton
            key={technique.id}
            technique={technique}
            selected={technique.id === selectedId}
            onSelect={() => onSelect(technique)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Technique explorer.
 *
 * Three families of technique, one selection, and a live preview of the flow
 * that technique implies. Selection is local state rather than a route because
 * the value here is the side-by-side comparison of the flows, not deep links.
 */
export function TechniqueExplorer() {
  const [selected, setSelected] = React.useState<Technique>(DEFAULT_TECHNIQUE);
  const category =
    techniqueCategories.find((entry) =>
      entry.techniques.some((technique) => technique.id === selected.id),
    ) ?? DEFAULT_CATEGORY;

  return (
    <Section id="techniques" width="wide">
      <SectionHeader
        eyebrow="Technique explorer"
        title="Pick a technique. See exactly what it changes."
        description="Retrieval, query and reasoning techniques are independent variables. RAGLabs renders the flow each one implies so you can reason about the architecture before you spend a token on it."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-5">
          {techniqueCategories.map((entry) => (
            <CategoryGroup
              key={entry.id}
              category={entry}
              selectedId={selected.id}
              onSelect={setSelected}
            />
          ))}

          <p className="mt-1 border-t border-line-subtle pt-4 text-2xs text-fg-disabled">
            Each technique is a pipeline stage you can drop into any experiment and
            diff against the baseline.
          </p>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface-inset lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-subtle px-4 py-3">
            <span className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
              {category.label}
            </span>
            <span className="technical text-2xs text-accent">{selected.id}</span>
            <span className="technical ml-auto text-2xs text-fg-disabled">
              {selected.steps.length} stages
            </span>
          </div>

          {/* Keyed on the technique so switching replays the entrance animation. */}
          <div key={selected.id} className="flex flex-col gap-4 p-4 animate-fade-in sm:p-5">
            <div>
              <h3 className="text-base font-medium text-fg">{selected.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-fg-secondary">
                {selected.summary}
              </p>
            </div>

            <TechniqueFlow technique={selected} />

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line-subtle">
              {selected.config.map((entry) => (
                <div key={entry.label} className="flex flex-col gap-1 bg-surface px-3 py-2.5">
                  <dt className="text-2xs text-fg-muted">{entry.label}</dt>
                  <dd className="technical text-xs text-fg">{entry.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
