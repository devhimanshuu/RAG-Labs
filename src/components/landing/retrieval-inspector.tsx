import { FileText, MessageSquareQuote, SlidersHorizontal, Trash2 } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { Section, SectionHeader } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { AnimatedBar } from "@/components/visualizations/animated-bar";
import { inspectorChunks, inspectorQuery } from "@/lib/mock-data/landing";
import { cn, formatNumber, formatScore } from "@/lib/utils";

const kept = inspectorChunks.filter((chunk) => chunk.kept).length;

const inspectorQuestions = [
  {
    icon: MessageSquareQuote,
    title: "Which chunk actually answered?",
    description: "Ranked passages with the score that earned them their position.",
  },
  {
    icon: SlidersHorizontal,
    title: "Did dense or sparse win?",
    description: "Per-retriever contributions shown side by side on every candidate.",
  },
  {
    icon: Trash2,
    title: "What got thrown away?",
    description: "Discarded chunks stay visible, with the reason they were dropped.",
  },
];

/**
 * Retrieval inspector.
 *
 * The product's core argument in one panel: the answer is the least interesting
 * artefact of a RAG run — the evidence behind it is what tells you whether the
 * system is right for the right reasons.
 */
export function RetrievalInspector() {
  return (
    <Section width="wide">
      <SectionHeader
        eyebrow="Retrieval inspector"
        title="See what your RAG system actually retrieved."
        description="Don't just read the answer. Inspect the evidence behind it — every candidate, its score, its source, and the retrieval path that found it."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex flex-col gap-2 border-b border-line-subtle px-4 py-4 sm:px-5">
            <span className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
              Query
            </span>
            <p className="text-lg font-medium leading-snug text-fg sm:text-xl">
              {inspectorQuery}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <Badge size="sm" mono tone="outline">
                hybrid-rerank
              </Badge>
              <span className="technical text-2xs text-fg-muted">
                {inspectorChunks.length} retrieved
              </span>
              <span aria-hidden className="h-3 w-px bg-line" />
              <span className="technical text-2xs text-success">{kept} kept</span>
              <span className="technical text-2xs text-fg-disabled">
                {inspectorChunks.length - kept} discarded
              </span>
            </div>
          </div>

          <ul className="divide-y divide-line-subtle">
            {inspectorChunks.map((chunk, index) => (
              <Reveal as="li" key={chunk.id} delayMs={index * 50}>
                <div
                  className={cn(
                    "group grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 px-4 py-4 transition-colors hover:bg-surface-hover sm:gap-x-4 sm:px-5",
                    !chunk.kept && "opacity-50",
                  )}
                >
                  <span className="technical pt-0.5 text-2xs text-fg-disabled">
                    #{String(chunk.rank).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <AnimatedBar
                        value={chunk.score}
                        tone={chunk.kept ? "accent" : "muted"}
                        className="max-w-64"
                        label={`Relevance score ${formatScore(chunk.score)}`}
                      />
                      <span
                        className={cn(
                          "technical shrink-0 text-xs font-medium",
                          chunk.kept ? "text-fg" : "text-fg-muted",
                        )}
                      >
                        {formatScore(chunk.score)}
                      </span>
                      {chunk.kept ? null : (
                        <Badge size="sm" mono tone="outline" className="shrink-0">
                          discarded
                        </Badge>
                      )}
                    </div>

                    <p className="mt-2.5 text-pretty text-xs leading-relaxed text-fg-secondary sm:text-sm">
                      {chunk.content}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="technical flex items-center gap-1.5 text-2xs text-fg-muted">
                        <FileText className="size-3 shrink-0" aria-hidden />
                        {chunk.source} · {chunk.page}
                      </span>
                      <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
                      <span className="technical text-2xs text-fg-disabled">
                        dense {formatScore(chunk.dense)}
                      </span>
                      <span className="technical text-2xs text-fg-disabled">
                        bm25 {formatScore(chunk.sparse)}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-subtle px-4 py-3 sm:px-5">
            <span className="technical text-2xs text-fg-muted">
              context {formatNumber(2184)} tokens
            </span>
            <span aria-hidden className="h-3 w-px bg-line" />
            <span className="technical text-2xs text-fg-muted">
              reranker bge-reranker-v2-m3
            </span>
            <span aria-hidden className="h-3 w-px bg-line" />
            <span className="technical text-2xs text-fg-muted">
              fusion rrf k=60
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-px overflow-hidden rounded-xl border border-line bg-line-subtle">
            {inspectorQuestions.map((item) => (
              <li key={item.title} className="flex gap-3 bg-surface px-4 py-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-line bg-surface-inset">
                  <item.icon className="size-3.5 text-accent" aria-hidden />
                </span>
                <div>
                  <h3 className="text-xs font-medium text-fg">{item.title}</h3>
                  <p className="mt-1 text-2xs leading-relaxed text-fg-muted">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-line bg-surface-inset px-4 py-4">
            <p className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
              Why it matters
            </p>
            <p className="mt-2 text-xs leading-relaxed text-fg-secondary">
              A confident answer built on the wrong passage looks identical to a
              correct one from the outside. Inspecting retrieved context is the only
              way to tell them apart — and the fastest way to find the one stage that
              is holding the whole pipeline back.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
