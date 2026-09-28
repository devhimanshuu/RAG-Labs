import type { LucideIcon } from "lucide-react";

/** Every navigable route in the application. Keeps links type-checked. */
export type AppPath =
  | "/dashboard"
  | "/playground"
  | "/datasets"
  | "/experiments"
  | "/evaluation"
  | "/pipelines"
  | "/traces"
  | "/models"
  | "/providers"
  | "/settings";

export interface NavItem {
  label: string;
  href: AppPath;
  icon: LucideIcon;
  /** One-line explanation, reused by tooltips and the command palette. */
  description: string;
  /** Display hint such as "G P". */
  shortcut?: string;
  /** Renders a count/pill on the right edge of the sidebar row. */
  badge?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export type ToastTone = "info" | "success" | "warning" | "danger";

/** Shared semantic tone used by status dots, badges and alerts. */
export type StatusTone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface ToastRecord {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  /** Auto-dismiss delay in milliseconds; 0 keeps the toast until dismissed. */
  duration: number;
}

export interface CommandGroupMeta {
  id: string;
  label: string;
}

export type ThemePreference = "dark" | "light" | "system";

export type Density = "comfortable" | "compact";
