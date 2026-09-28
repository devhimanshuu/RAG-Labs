"use client";

import { Bell, CheckCheck } from "lucide-react";
import * as React from "react";

import { Button, IconButton } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusIndicator, type StatusTone } from "@/components/ui/status-indicator";
import { Tooltip } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/ui/empty-state";
import { mockNotifications, timeAgo } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { ToastTone } from "@/types";

const TONE_MAP: Record<ToastTone, StatusTone> = {
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
};

/** Notification inbox. State is local for Phase 1; Phase 2 streams from the API. */
export function NotificationMenu() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <Popover>
      <Tooltip content="Notifications">
        <PopoverTrigger asChild>
          <IconButton label={`Notifications${unread ? `, ${unread} unread` : ""}`} size="sm">
            <span className="relative">
              <Bell />
              {unread > 0 ? (
                <span
                  aria-hidden
                  className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-accent ring-2 ring-canvas"
                />
              ) : null}
            </span>
          </IconButton>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-line-subtle px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-fg">Notifications</span>
            {unread > 0 ? (
              <span className="technical rounded-full border border-accent-line bg-accent-muted px-1.5 text-2xs text-accent">
                {unread}
              </span>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="xs"
            disabled={unread === 0}
            onClick={() =>
              setNotifications((current) =>
                current.map((notification) => ({ ...notification, read: true })),
              )
            }
          >
            <CheckCheck />
            Mark all read
          </Button>
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="You're all caught up"
            description="Experiment and provider events will appear here."
            bordered={false}
            className="py-10"
          />
        ) : (
          <ul className="max-h-80 divide-y divide-line-subtle overflow-y-auto scrollbar-thin">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={cn(
                  "flex gap-2.5 px-3 py-2.5 transition-colors hover:bg-surface-hover",
                  !notification.read && "bg-surface-inset",
                )}
              >
                <StatusIndicator
                  tone={TONE_MAP[notification.tone]}
                  pulse={!notification.read}
                  className="mt-1.5"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-medium text-fg">
                      {notification.title}
                    </span>
                    <span className="technical shrink-0 text-2xs text-fg-muted">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-2xs leading-relaxed text-fg-secondary">
                    {notification.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-line-subtle px-3 py-2">
          <span className="text-2xs text-fg-muted">
            Realtime notifications arrive with the backend in Phase 2.
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
