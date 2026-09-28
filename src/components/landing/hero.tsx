import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

import { Eyebrow } from "@/components/landing/section";
import { HeroPipeline } from "@/components/landing/hero-pipeline";
import { Button } from "@/components/ui/button";
import { showcaseExperiment } from "@/lib/mock-data/landing";
import { formatDuration, formatPercent } from "@/lib/utils";

/**
 * Run summary shown under the CTAs.
 *
 * Built from the same fixture the pipeline diagram below it renders, so the
 * numbers on this page can never disagree with each other.
 */
const runSummary = showcaseExperiment.metrics.map((metric) => ({
  id: metric.id,
  label: metric.label,
  value:
    metric.format === "duration"
      ? formatDuration(metric.value)
      : metric.format === "currency"
        ? `$${metric.value.toFixed(3)}`
        : formatPercent(metric.value),
}));

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow-accent absolute inset-x-0 -top-56 h-[42rem] opacity-70" />
        <div className="fade-top grid-backdrop absolute inset-x-0 top-0 h-[38rem] opacity-40" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <Eyebrow className="justify-center">The laboratory for RAG engineering</Eyebrow>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
            Build RAG systems you can actually understand.
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-fg-secondary sm:text-lg">
            Experiment with retrieval, reranking, query transformation, context
            engineering and agentic loops — then benchmark every one of them on the
            same dataset, with each stage of the pipeline visible and measured.
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/playground">
                Start experiment
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#techniques">
                <Compass />
                Explore techniques
              </Link>
            </Button>
          </div>

          <p className="technical text-2xs uppercase tracking-[0.14em] text-fg-disabled">
            No black-box RAG — inspect every step
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line-subtle sm:mt-16 sm:grid-cols-4">
          {runSummary.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col gap-1 bg-surface px-4 py-3.5"
            >
              <dt className="technical text-2xs uppercase tracking-[0.14em] text-fg-muted">
                {metric.label}
              </dt>
              <dd className="technical text-lg font-medium text-fg">{metric.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <HeroPipeline />
        </div>

        <p className="mt-4 text-center text-xs text-fg-disabled">
          Sample pipeline and metrics — illustrative data for a hybrid reranking
          architecture.
        </p>
      </div>
    </section>
  );
}
