"use client";

import { CornerDownLeft, RotateCcw, Sparkles } from "lucide-react";
import * as React from "react";

import { Button, IconButton } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Panel, PanelBody, PanelFooter, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LabeledSlider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip } from "@/components/ui/tooltip";
import { RAG_STRATEGIES, SHORTCUTS } from "@/lib/constants/app";
import { mockDatasets, mockModels } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import type { RagStrategy } from "@/types";

export interface PlaygroundSettings {
  strategy: RagStrategy;
  topK: number;
  rerankCount: number;
  useRerank: boolean;
  model: string;
  temperature: number;
  citeSources: boolean;
}

export const DEFAULT_PLAYGROUND_SETTINGS: PlaygroundSettings = {
  strategy: "hybrid",
  topK: 10,
  rerankCount: 5,
  useRerank: true,
  model: "gpt-4.1",
  temperature: 0.1,
  citeSources: true,
};

const CHAT_MODELS = mockModels.filter((model) => model.kind === "chat");

export function QueryComposer({
  datasetId,
  onDatasetIdChange,
  query,
  onQueryChange,
  settings,
  onSettingsChange,
  status,
  onRun,
  onReset,
  className,
}: {
  datasetId: string;
  onDatasetIdChange: (id: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  settings: PlaygroundSettings;
  onSettingsChange: (patch: Partial<PlaygroundSettings>) => void;
  status: "idle" | "running" | "complete";
  onRun: () => void;
  onReset: () => void;
  className?: string;
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const activeStrategy = RAG_STRATEGIES.find((entry) => entry.id === settings.strategy);
  const estimatedTokens = Math.max(1, Math.round(query.trim().length / 4));

  return (
    <Panel className={className}>
      <PanelHeader>
        <PanelTitle icon={Sparkles}>Query</PanelTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Combobox
            aria-label="Dataset"
            triggerClassName="w-full sm:w-60"
            options={mockDatasets.map((dataset) => ({
              value: dataset.id,
              label: dataset.name,
              meta: `${formatNumber(dataset.chunkCount)} chunks`,
              group: "Datasets",
            }))}
            value={datasetId}
            onValueChange={onDatasetIdChange}
            searchPlaceholder="Search datasets…"
            emptyText="No datasets match."
          />
          <Tooltip content="Reset query and settings">
            <IconButton label="Reset playground" size="sm" onClick={onReset}>
              <RotateCcw />
            </IconButton>
          </Tooltip>
        </div>
      </PanelHeader>

      <PanelBody className="flex flex-col gap-3">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                onRun();
              }
            }}
            rows={3}
            aria-label="Query"
            placeholder="Ask a question about the selected dataset…"
            className="min-h-[76px] resize-y pr-24 text-sm"
          />
          <span className="pointer-events-none absolute bottom-2 right-2.5 flex items-center gap-1.5 text-2xs text-fg-disabled">
            <Kbd>⌘</Kbd>
            <Kbd>↵</Kbd>
            <span>to run</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-2xs text-fg-muted">
          <span className="technical">
            ~{formatNumber(estimatedTokens)} query tokens · {query.length} chars
          </span>
          <span className="technical">
            Retrieval and generation are mocked in Phase 1
          </span>
        </div>

        <div className="flex flex-col gap-2 border-t border-line-subtle pt-3">
          <span className="text-2xs font-medium uppercase tracking-wide text-fg-muted">
            RAG strategy
          </span>
          <ToggleGroup
            type="single"
            value={settings.strategy}
            onValueChange={(value) => {
              if (value) onSettingsChange({ strategy: value as RagStrategy });
            }}
            aria-label="RAG strategy"
          >
            {RAG_STRATEGIES.map((entry) => (
              <ToggleGroupItem key={entry.id} value={entry.id} aria-label={entry.label}>
                {entry.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {activeStrategy ? (
            <p className="text-2xs text-fg-muted">{activeStrategy.description}</p>
          ) : null}
        </div>

        <Collapsible defaultOpen={false} className="border-t border-line-subtle pt-1">
          <CollapsibleTrigger>Advanced retrieval settings</CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-x-6 gap-y-4 pt-3 sm:grid-cols-2">
              <LabeledSlider
                id="playground-top-k"
                label="Top K"
                value={settings.topK}
                min={2}
                max={50}
                step={1}
                onValueChange={(topK) => onSettingsChange({ topK })}
                formatValue={(value) => String(value)}
                description="Candidates fetched per retriever before fusion."
              />
              <LabeledSlider
                id="playground-rerank"
                label="Rerank to"
                value={settings.rerankCount}
                min={1}
                max={12}
                step={1}
                disabled={!settings.useRerank}
                onValueChange={(rerankCount) => onSettingsChange({ rerankCount })}
                formatValue={(value) => `${value} chunks`}
                description="Passages kept after cross-encoder reranking."
              />
              <LabeledSlider
                id="playground-temperature"
                label="Temperature"
                value={settings.temperature}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(temperature) => onSettingsChange({ temperature })}
                formatValue={(value) => value.toFixed(2)}
                description="Sampling temperature for the generator."
              />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="playground-model"
                  className="text-xs font-medium text-fg-secondary"
                >
                  Generator model
                </label>
                <Select value={settings.model} onValueChange={(model) => onSettingsChange({ model })}>
                  <SelectTrigger id="playground-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHAT_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <span className="flex w-full items-center justify-between gap-4">
                          <span className="truncate">{model.name}</span>
                          <span className="technical text-2xs text-fg-muted">
                            {model.providerName}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-2xs text-fg-muted">
                  Model pricing and availability live on the Models page.
                </p>
              </div>

              <CheckboxField
                id="playground-rerank-toggle"
                label="Rerank results"
                description="Run the cross-encoder stage before generation."
                checked={settings.useRerank}
                onCheckedChange={(checked) => onSettingsChange({ useRerank: checked === true })}
              />
              <CheckboxField
                id="playground-citations"
                label="Return citations"
                description="Attach document and page references to the answer."
                checked={settings.citeSources}
                onCheckedChange={(checked) => onSettingsChange({ citeSources: checked === true })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </PanelBody>

      <PanelFooter>
        <span className={cn("flex items-center gap-1.5 text-2xs text-fg-muted")}>
          <span className="technical uppercase text-fg-secondary">
            {mockDatasets.find((dataset) => dataset.id === datasetId)?.name ?? "—"}
          </span>
          <span aria-hidden className="text-fg-disabled">
            ·
          </span>
          {activeStrategy?.label}
        </span>
        <Button
          variant="primary"
          size="md"
          onClick={onRun}
          disabled={status === "running" || query.trim().length === 0}
        >
          {status === "running" ? (
            <>
              <span
                aria-hidden
                className="size-3 animate-spin rounded-full border-[1.5px] border-accent-fg/30 border-t-accent-fg"
              />
              Running…
            </>
          ) : (
            <>
              <CornerDownLeft />
              Run query
              <span className="technical ml-1 hidden text-2xs opacity-70 sm:inline">
                {SHORTCUTS.runQuery.label}
              </span>
            </>
          )}
        </Button>
      </PanelFooter>
    </Panel>
  );
}
