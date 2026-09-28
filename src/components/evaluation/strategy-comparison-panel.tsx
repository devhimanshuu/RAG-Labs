"use client";

import { BarChart3 } from "lucide-react";
import * as React from "react";

import {
  StrategyComparisonChart,
  StrategyComparisonTable,
} from "@/components/charts/strategy-comparison-chart";
import { Panel, PanelActions, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStrategyComparison } from "@/lib/mock-data";

type ComparisonMetric = "faithfulness" | "answerRelevance" | "contextRecall" | "latencyMs";

const METRICS: Array<{ id: ComparisonMetric; label: string }> = [
  { id: "faithfulness", label: "Faithfulness" },
  { id: "answerRelevance", label: "Relevance" },
  { id: "contextRecall", label: "Recall" },
  { id: "latencyMs", label: "Latency" },
];

/**
 * Strategy comparison with a single-metric focus. The selector lives here rather
 * than in the chart so the panel controls both the bar chart and its table.
 */
export function StrategyComparisonPanel() {
  const [metric, setMetric] = React.useState<ComparisonMetric>("faithfulness");

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle icon={BarChart3}>Strategy comparison</PanelTitle>
        <PanelActions>
          <Tabs value={metric} onValueChange={(value) => setMetric(value as ComparisonMetric)}>
            <TabsList variant="pill">
              {METRICS.map((entry) => (
                <TabsTrigger key={entry.id} value={entry.id} variant="pill">
                  {entry.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </PanelActions>
      </PanelHeader>
      <PanelBody padded={false}>
        <div className="px-3.5 pt-3">
          <StrategyComparisonChart data={mockStrategyComparison} metric={metric} height={188} />
        </div>
        <div className="mt-2 border-t border-line-subtle">
          <StrategyComparisonTable data={mockStrategyComparison} />
        </div>
      </PanelBody>
    </Panel>
  );
}
