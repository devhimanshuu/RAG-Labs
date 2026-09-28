"use client";

import { Copy, ExternalLink, KeyRound, Lock, Plug, RefreshCw, Zap } from "lucide-react";
import * as React from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { Field, FieldDescription, FieldRow, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Panel, PanelActions, PanelBody, PanelFooter, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { PROVIDER_STATUS_META } from "@/lib/constants/status";
import { mockModels, mockProviders, timeAgo } from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import { cn, formatNumber, pluralize } from "@/lib/utils";
import type { ModelKind, ProviderId } from "@/types";

const CHAT_MODELS = mockModels.filter((model) => model.kind === "chat");
const EMBEDDING_MODELS = mockModels.filter((model) => model.kind === "embedding");
const RERANK_MODELS = mockModels.filter((model) => model.kind === "rerank");

/**
 * Credential preview.
 *
 * A stored key is never rendered in full — showing the masked prefix is the
 * honest representation of what the UI can display. Phase 2 populates the
 * prefix from the API and adds a rotate flow.
 */
function MaskedKey({ hint }: { hint?: string }) {
  if (!hint) {
    return (
      <span className="flex items-center gap-1.5 text-2xs text-fg-disabled">
        <Lock className="size-3" aria-hidden />
        No credential stored
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <Lock className="size-3 text-fg-disabled" aria-hidden />
      <span className="technical text-2xs text-fg-secondary">{hint}</span>
      <IconButton
        label="Copy key reference"
        size="xs"
        variant="ghost"
        onClick={() => {
          void navigator.clipboard?.writeText(hint);
          toast.success("Key reference copied", "Only the masked prefix is available.");
        }}
      >
        <Copy />
      </IconButton>
    </span>
  );
}

export function ProvidersView() {
  const [testingId, setTestingId] = React.useState<string | null>(null);
  const [defaults, setDefaults] = React.useState({
    generator: "gpt-4.1",
    embedding: "text-embedding-3-large",
    reranker: "bge-reranker-v2-m3",
  });

  const testConnection = (providerId: string, name: string) => {
    setTestingId(providerId);
    // Simulated round trip so the pending state is visible.
    window.setTimeout(() => {
      setTestingId(null);
      const provider = mockProviders.find((entry) => entry.id === providerId);
      if (provider?.status === "error") {
        toast.danger(
          `${name} is unreachable`,
          "Connection refused at 127.0.0.1:11434. Start the local daemon and retry.",
        );
      } else {
        toast.success(`${name} responded`, "Credential accepted in 84ms.");
      }
    }, 700);
  };

  const connected = mockProviders.filter((provider) => provider.status === "connected").length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Providers"
        description="Upstream connections, endpoints and credential state for every model provider this workspace can call."
        actions={
          <Button
            variant="secondary"
            onClick={() => toast.info("Re-checking all providers", "Pinging four endpoints…")}
          >
            <RefreshCw />
            Re-check all
          </Button>
        }
        meta={
          <>
            <span className="technical text-2xs text-fg-muted">
              {connected}/{mockProviders.length} connected
            </span>
            <span className="technical text-2xs text-fg-muted">
              {pluralize(mockModels.length, "model")} available
            </span>
          </>
        }
      />

      {mockProviders.some((provider) => provider.status === "error") ? (
        <Alert
          tone="danger"
          title="Ollama is unreachable"
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => testConnection("ollama", "Ollama")}
            >
              Retry
            </Button>
          }
        >
          The self-hosted endpoint refused the last 4 connections. Local models and the
          default reranker are unavailable until the daemon is running.
        </Alert>
      ) : null}

      <section aria-label="Provider connections" className="grid gap-3 lg:grid-cols-2">
        {mockProviders.map((provider) => {
          const meta = PROVIDER_STATUS_META[provider.status];
          const testing = testingId === provider.id;

          return (
            <Panel key={provider.id}>
              <PanelHeader>
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-line bg-surface-inset">
                    <Plug className="size-3.5 text-fg-muted" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-fg">{provider.name}</span>
                      <Badge tone={meta.tone} mono>
                        <StatusIndicator tone={meta.tone} size="xs" />
                        {meta.label}
                      </Badge>
                    </span>
                    <span className="truncate text-2xs text-fg-muted">
                      {provider.description}
                    </span>
                  </span>
                </span>
                <PanelActions>
                  <IconButton
                    label={`Open ${provider.name} documentation`}
                    size="sm"
                    onClick={() =>
                      toast.info(
                        `${provider.name} docs`,
                        "Documentation links are external and open outside RAGLab.",
                      )
                    }
                  >
                    <ExternalLink />
                  </IconButton>
                </PanelActions>
              </PanelHeader>

              <PanelBody className="flex flex-col gap-0 py-0">
                <dl className="divide-y divide-line-subtle">
                  <div className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-xs text-fg-muted">Base URL</dt>
                    <dd className="technical max-w-[60%] truncate text-2xs text-fg-secondary">
                      {provider.baseUrl}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-xs text-fg-muted">API key</dt>
                    <dd>
                      <MaskedKey hint={provider.apiKeyHint} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-xs text-fg-muted">Models</dt>
                    <dd className="technical text-2xs text-fg-secondary">
                      {formatNumber(provider.modelCount)} registered
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-xs text-fg-muted">Last checked</dt>
                    <dd className="technical text-2xs text-fg-secondary">
                      {timeAgo(provider.lastCheckedAt)}
                    </dd>
                  </div>
                </dl>
              </PanelBody>

              <PanelFooter>
                <span className="technical text-2xs text-fg-disabled">{provider.id}</span>
                <span className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={testing}
                    onClick={() => testConnection(provider.id, provider.name)}
                  >
                    <Zap className={cn(testing && "animate-pulse")} />
                    {testing ? "Testing…" : "Test connection"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast.info(
                        `Configure ${provider.name}`,
                        "Credential editing arrives in Phase 2; this is a visual placeholder.",
                      )
                    }
                  >
                    <KeyRound />
                    Configure
                  </Button>
                </span>
              </PanelFooter>
            </Panel>
          );
        })}
      </section>

      <Panel>
        <PanelHeader>
          <PanelTitle icon={KeyRound}>Default models</PanelTitle>
          <PanelActions>
            <span className="technical text-2xs text-fg-muted">
              used by new pipelines and experiments
            </span>
          </PanelActions>
        </PanelHeader>
        <PanelBody className="divide-y divide-line-subtle py-0">
          <FieldRow
            label="Generator"
            htmlFor="default-generator"
            description="Chat model used for answer synthesis when a pipeline does not override it."
          >
            <Select
              value={defaults.generator}
              onValueChange={(value) => {
                setDefaults((current) => ({ ...current, generator: value }));
                toast.success("Default generator updated", value);
              }}
            >
              <SelectTrigger id="default-generator" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHAT_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldRow>

          <FieldRow
            label="Embedding model"
            htmlFor="default-embedding"
            description="Applied to new datasets; changing it requires a full re-index of existing corpora."
          >
            <Select
              value={defaults.embedding}
              onValueChange={(value) => {
                setDefaults((current) => ({ ...current, embedding: value }));
                toast.success("Default embedding model updated", value);
              }}
            >
              <SelectTrigger id="default-embedding" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMBEDDING_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldRow>

          <FieldRow
            label="Reranker"
            htmlFor="default-reranker"
            description="Cross-encoder used by pipelines that enable the reranking stage."
          >
            <Select
              value={defaults.reranker}
              onValueChange={(value) => {
                setDefaults((current) => ({ ...current, reranker: value }));
                toast.success("Default reranker updated", value);
              }}
            >
              <SelectTrigger id="default-reranker" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RERANK_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldRow>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader>
          <PanelTitle icon={Plug}>Add a provider</PanelTitle>
          <PanelActions>
            <Badge tone="neutral" mono>
              placeholder
            </Badge>
          </PanelActions>
        </PanelHeader>
        <PanelBody className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <Label htmlFor="provider-name">Provider</Label>
              <Select defaultValue="openai">
                <SelectTrigger id="provider-name">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PROVIDER_STATUS_META) as ProviderId[]).map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="provider-model-kind">Model kind</Label>
              <Select defaultValue="chat">
                <SelectTrigger id="provider-model-kind">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["chat", "embedding", "rerank"] as ModelKind[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <Label htmlFor="provider-base-url">Base URL</Label>
            <Input id="provider-base-url" placeholder="https://api.example.com/v1" />
            <FieldDescription>
              OpenAI-compatible endpoints are supported. Custom headers arrive in Phase 2.
            </FieldDescription>
          </Field>
        </PanelBody>
        <PanelFooter>
          <span className="text-2xs text-fg-muted">
            Credentials are never stored in Phase 1.
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              toast.info(
                "Provider connections",
                "Persisting provider configuration arrives in Phase 2.",
              )
            }
          >
            Add provider
          </Button>
        </PanelFooter>
      </Panel>
    </div>
  );
}
