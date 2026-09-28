"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { AlertTriangle, CheckCircle2, Info, OctagonAlert, X } from "lucide-react";
import * as React from "react";

import { IconButton } from "@/components/ui/button";
import { useToastStore } from "@/lib/store/toast";
import { cn } from "@/lib/utils";
import type { ToastTone } from "@/types";

const TONES: Record<ToastTone, { icon: typeof Info; color: string; bar: string }> = {
  info: { icon: Info, color: "text-info", bar: "bg-info" },
  success: { icon: CheckCircle2, color: "text-success", bar: "bg-success" },
  warning: { icon: AlertTriangle, color: "text-warning", bar: "bg-warning" },
  danger: { icon: OctagonAlert, color: "text-danger", bar: "bg-danger" },
};

/**
 * Global toast viewport. Mounted once in the app shell; individual components
 * fire toasts through the `toast` helper rather than rendering their own.
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={5000}>
      {toasts.map((toastRecord) => {
        const { icon: Icon, color, bar } = TONES[toastRecord.tone];

        return (
          <ToastPrimitive.Root
            key={toastRecord.id}
            duration={toastRecord.duration}
            onOpenChange={(open) => {
              if (!open) dismiss(toastRecord.id);
            }}
            className={cn(
              "relative flex w-80 items-start gap-2.5 overflow-hidden rounded-lg border border-line bg-surface-elevated p-3 shadow-lg",
              "data-[state=open]:animate-fade-up data-[state=closed]:animate-fade-out",
              "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
              "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-fade-out",
            )}
          >
            <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.5", bar)} />
            <Icon className={cn("mt-0.5 size-4 shrink-0", color)} aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <ToastPrimitive.Title className="text-sm font-medium text-fg">
                {toastRecord.title}
              </ToastPrimitive.Title>
              {toastRecord.description ? (
                <ToastPrimitive.Description className="text-xs leading-relaxed text-fg-secondary">
                  {toastRecord.description}
                </ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close asChild>
              <IconButton label="Dismiss notification" size="xs" variant="ghost">
                <X />
              </IconButton>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        );
      })}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-100 flex max-h-screen w-full flex-col-reverse gap-2 p-4 outline-none sm:max-w-sm" />
    </ToastPrimitive.Provider>
  );
}
