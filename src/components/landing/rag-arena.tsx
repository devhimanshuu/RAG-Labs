"use client";

import { Trophy } from "lucide-react";
import * as React from "react";

import { Section, SectionHeader } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { AnimatedBar } from "@/components/visualizations/animated-bar";
import { AnimatedNumber, type NumberFormat } from "@/components/visualizations/animated-number";
import { arenaColumns, arenaRows, type ArenaRow } from "@/lib/mock-data/landing";
import { cn, formatDuration } from "@/lib/utils";

/** Metrics are stored as ratios; latency is stored in milliseconds. */
const ROW_FORMAT: Record<string, { format: NumberFormat; digits: number }> = {
  percent: { format: "percent", digits: 0 },
  duration: { format: "duration", digits: 2 },
};

/** The winning column for a row, or null when the row is a trade-off. */
function bestColumnId(row: ArenaRow): string | null {
  const entries = Object.entries(row.values);
  if (entries.length === 0) return null;

  return entries.reduce((best, entry) => {
    const better = row.higherIsBetter ? entry[1] > best[1] : entry[1] < best[1];
    return better ? entry : best;
  })[0];
}

/**
 * Bar length for a value, normalised so a longer bar is always the better
 * result — including on the latency row, where lower is better but a short bar
 * would read as "worse".
 */
function barValue(row: ArenaRow, value: number): number {
  if (row.higherIsBetter) return value;

  const values = Object.values(row.values);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 1;
  return 1 - (value - min) / (max - min);
}

function formatArenaValue(row: ArenaRow, value: number): React.ReactNode {
  const spec = ROW_FORMAT[row.format];
  if (row.format === "duration") return formatDuration(value);
  return (
    <AnimatedNumber
      value={value}
      format={spec.format}
      digits={spec.digits}
      className="tabular-nums"
    />
  );
}

const gridTemplate =
  "grid grid-cols-[minmax(7.5rem,1.1fr)_repeat(4,minmax(0,1fr))] items-center gap-x-3";

/**
 * RAG arena.
 *
 * A benchmark table, not a pricing table: no scroll-snap cards, no checkmarks.
 * Each row marks the architecture that wins on that metric, and the latency row
 * deliberately makes the trade-off — quality costs time — impossible to miss.
 */
export function RAGArena() {
  const winners = React.useMemo(
    () => Object.fromEntries(arenaRows.map((row) => [row.id, bestColumnId(row)])),
    [],
  );

  return (
    <Section id="arena" width="wide">
      <SectionHeader
        eyebrow="RAG arena"
        title="Same question. Different RAG."
        description="Four architectures, one dataset, the same hundred questions. RAGLab runs them back to back and reports quality, faithfulness and latency in a single comparable table."
      />

      <div className="mt-10 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-subtle px-4 py-3 sm:px-5">
          <span className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
            Benchmark
          </span>
          <span className="technical text-2xs text-fg-secondary">finance-qa · 100 queries</span>
          <span className="technical ml-auto text-2xs text-fg-disabled">
            run 2026-09-14 · seed 42
          </span>
        </div>

        {/* Desktop: benchmark table */}
        <div className="hidden px-4 py-4 sm:block sm:px-5">
          <div
            className={cn(
              gridTemplate,
              "border-b border-line-subtle pb-2.5",
            )}
          >
            <span className="technical text-2xs uppercase tracking-[0.16em] text-fg-disabled">
              Metric
            </span>
            {arenaColumns.map((column) => (
              <span
                key={column.id}
                className={cn(
                  "flex items-center justify-center gap-1.5 technical text-2xs uppercase tracking-[0.14em]",
                  column.featured ? "text-accent" : "text-fg-muted",
                )}
              >
                {column.label}
                {column.featured ? (
                  <span className="hidden lg:inline-flex">
                    <Badge size="sm" mono tone="accent">
                      default
                    </Badge>
                  </span>
                ) : null}
              </span>
            ))}
          </div>

          {arenaRows.map((row, rowIndex) => (
            <div
              key={row.id}
              className={cn(
                gridTemplate,
                "border-b border-line-subtle py-3.5 last:border-b-0",
              )}
            >
              <span className="text-xs font-medium text-fg-secondary">{row.label}</span>

              {arenaColumns.map((column) => {
                const value = row.values[column.id];
                const isWinner = winners[row.id] === column.id;

                return (
                  <div
                    key={column.id}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-sm px-2 py-1",
                      column.featured && "bg-accent-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "technical flex items-center gap-1 text-sm",
                        isWinner ? "font-medium text-fg" : "text-fg-muted",
                      )}
                    >
                      {isWinner ? (
                        <>
                          <Trophy className="size-3 text-accent" aria-hidden />
                          <span className="sr-only">best result</span>
                        </>
                      ) : null}
                      {formatArenaValue(row, value)}
                    </span>
                    <AnimatedBar
                      value={barValue(row, value)}
                      tone={isWinner ? "accent" : "muted"}
                      delayMs={rowIndex * 60}
                      className="max-w-20"
                      label={`${row.label} ${column.label}`}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          <p className="mt-3 text-2xs text-fg-disabled">
            Quality metrics are higher-is-better scores. Latency is median end-to-end
            response time. Bars are relative within a row.
          </p>
        </div>

        {/* Mobile: one card per architecture */}
        <div className="flex flex-col divide-y divide-line-subtle sm:hidden">
          {arenaColumns.map((column) => (
            <div key={column.id} className="px-4 py-4">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "technical text-2xs uppercase tracking-[0.16em]",
                    column.featured ? "text-accent" : "text-fg",
                  )}
                >
                  {column.label}
                </h3>
                {column.featured ? (
                  <Badge size="sm" mono tone="accent">
                    default
                  </Badge>
                ) : null}
              </div>

              <dl className="mt-3 flex flex-col gap-2.5">
                {arenaRows.map((row) => {
                  const value = row.values[column.id];
                  const isWinner = winners[row.id] === column.id;

                  return (
                    <div key={row.id} className="flex items-center gap-3">
                      <dt className="w-28 shrink-0 text-xs text-fg-muted">{row.label}</dt>
                      <dd className="flex flex-1 items-center gap-2.5">
                        <AnimatedBar
                          value={barValue(row, value)}
                          tone={isWinner ? "accent" : "muted"}
                          className="flex-1"
                        />
                        <span
                          className={cn(
                            "technical w-16 shrink-0 text-right text-xs",
                            isWinner ? "font-medium text-fg" : "text-fg-muted",
                          )}
                        >
                          {formatArenaValue(row, value)}
                        </span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>

        <div className="border-t border-line-subtle px-4 py-3 sm:px-5">
          <p className="technical text-2xs text-fg-disabled">
            CRAG wins on quality and costs 2.1× the latency of hybrid. That trade is a
            decision, not a default — measure it on your own corpus.
          </p>
        </div>
      </div>
    </Section>
  );
}
