import type { HealthStatus, IndexStatus, ProviderStatus, RunStatus, StatusTone } from "@/types";

/**
 * One presentation contract for every status the app renders.
 *
 * Tables, badges, dashboards and detail panels all resolve colour and labelling
 * through these maps, which is what keeps "running" the same cyan everywhere and
 * removes any chance of an ad-hoc status colour creeping in.
 */
export interface StatusPresentation {
  label: string;
  tone: StatusTone;
  /** Whether the status represents live, in-progress work. */
  pulse: boolean;
}

export const RUN_STATUS_META: Record<RunStatus, StatusPresentation> = {
  queued: { label: "Queued", tone: "neutral", pulse: false },
  running: { label: "Running", tone: "accent", pulse: true },
  completed: { label: "Complete", tone: "success", pulse: false },
  failed: { label: "Failed", tone: "danger", pulse: false },
  cancelled: { label: "Cancelled", tone: "neutral", pulse: false },
};

export const INDEX_STATUS_META: Record<IndexStatus, StatusPresentation> = {
  ready: { label: "Ready", tone: "success", pulse: false },
  indexing: { label: "Indexing", tone: "accent", pulse: true },
  stale: { label: "Stale", tone: "warning", pulse: false },
  failed: { label: "Failed", tone: "danger", pulse: false },
};

export const HEALTH_STATUS_META: Record<HealthStatus, StatusPresentation> = {
  healthy: { label: "Available", tone: "success", pulse: false },
  degraded: { label: "Degraded", tone: "warning", pulse: false },
  unavailable: { label: "Unavailable", tone: "danger", pulse: false },
};

export const PROVIDER_STATUS_META: Record<ProviderStatus, StatusPresentation> = {
  connected: { label: "Connected", tone: "success", pulse: false },
  disconnected: { label: "Not configured", tone: "neutral", pulse: false },
  error: { label: "Connection failed", tone: "danger", pulse: false },
};

export const DOCUMENT_STATUS_META: Record<
  "indexed" | "processing" | "failed",
  StatusPresentation
> = {
  indexed: { label: "Indexed", tone: "success", pulse: false },
  processing: { label: "Processing", tone: "accent", pulse: true },
  failed: { label: "Failed", tone: "danger", pulse: false },
};

/** Pipeline stages reuse run semantics but add an idle state. */
export const PIPELINE_STATUS_META: Record<RunStatus | "idle", StatusPresentation> = {
  idle: { label: "Idle", tone: "neutral", pulse: false },
  queued: RUN_STATUS_META.queued,
  running: RUN_STATUS_META.running,
  completed: RUN_STATUS_META.completed,
  failed: RUN_STATUS_META.failed,
  cancelled: RUN_STATUS_META.cancelled,
};
