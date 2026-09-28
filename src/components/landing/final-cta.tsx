import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import { Eyebrow } from "@/components/landing/section";
import { Button } from "@/components/ui/button";
import { repoUrl } from "@/lib/mock-data/landing";

/**
 * Closing call to action.
 *
 * One primary action and one quiet secondary — a second filled button here would
 * compete with the only decision the page is asking the visitor to make.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line-subtle">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="glow-accent-center absolute inset-x-0 top-0 h-full opacity-60" />
        <div className="dot-backdrop absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-5 py-24 text-center sm:px-8 sm:py-32">
        <Eyebrow className="justify-center">Start experimenting</Eyebrow>

        <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-4xl lg:text-5xl">
          Your next RAG experiment starts here.
        </h2>

        <p className="max-w-xl text-pretty text-sm leading-relaxed text-fg-secondary sm:text-base">
          Build a pipeline. Run the experiment. Inspect the result — then keep the
          architecture that earns its latency.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="/playground">
              Start experiment
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              <BookOpen />
              Read the docs
            </a>
          </Button>
        </div>

        <p className="technical text-2xs uppercase tracking-[0.14em] text-fg-disabled">
          Free workspace · no credit card · sample data included
        </p>
      </div>
    </section>
  );
}
