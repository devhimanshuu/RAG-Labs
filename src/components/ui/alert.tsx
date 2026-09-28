import {
  AlertTriangle,
  CheckCircle2,
  Info,
  OctagonAlert,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "danger";

const TONES: Record<AlertTone, { wrapper: string; icon: LucideIcon; iconColor: string }> = {
  info: {
    wrapper: "border-info-line bg-info-muted",
    icon: Info,
    iconColor: "text-info",
  },
  success: {
    wrapper: "border-success-line bg-success-muted",
    icon: CheckCircle2,
    iconColor: "text-success",
  },
  warning: {
    wrapper: "border-warning-line bg-warning-muted",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  danger: {
    wrapper: "border-danger-line bg-danger-muted",
    icon: OctagonAlert,
    iconColor: "text-danger",
  },
};

export function Alert({
  tone = "info",
  title,
  children,
  actions,
  className,
  ...props
}: {
  tone?: AlertTone;
  title: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { wrapper, icon: Icon, iconColor } = TONES[tone];

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-md border px-3 py-2.5", wrapper, className)}
      {...props}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconColor)} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-medium text-fg">{title}</p>
        {children ? <div className="text-xs text-fg-secondary">{children}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
    </div>
  );
}
