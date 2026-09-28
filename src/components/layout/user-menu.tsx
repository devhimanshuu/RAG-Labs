"use client";

import {
  BookOpen,
  ChevronsUpDown,
  LifeBuoy,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { CURRENT_USER } from "@/lib/constants/app";
import { useToastStore } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

/**
 * Account menu. Rendered in two placements — the top bar and the sidebar footer
 * — which is why the trigger presentation is parameterised rather than the
 * menu contents.
 */
export function UserMenu({
  variant = "compact",
  collapsed = false,
}: {
  /** `compact` is the avatar-only top bar trigger. */
  variant?: "compact" | "full";
  collapsed?: boolean;
}) {
  const pushToast = useToastStore((state) => state.push);
  const router = useRouter();

  const trigger =
    variant === "compact" ? (
      <button
        type="button"
        aria-label="Account menu"
        className="rounded-full transition-opacity hover:opacity-85 focus-ring"
      >
        <Avatar initials={CURRENT_USER.initials} alt={CURRENT_USER.name} size="md" />
      </button>
    ) : (
      <button
        type="button"
        aria-label="Account menu"
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md px-1.5 text-left transition-colors hover:bg-surface-hover focus-ring",
          collapsed && "justify-center px-0",
        )}
      >
        <Avatar initials={CURRENT_USER.initials} alt={CURRENT_USER.name} size="sm" />
        {!collapsed ? (
          <>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-medium leading-tight text-fg">
                {CURRENT_USER.name}
              </span>
              <span className="truncate text-[10px] leading-tight text-fg-muted">
                {CURRENT_USER.email}
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
          </>
        ) : null}
      </button>
    );

  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip side="right" content={CURRENT_USER.name}>
          {trigger}
        </Tooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent align={variant === "compact" ? "end" : "start"} className="w-60">
        <DropdownMenuLabel>Signed in</DropdownMenuLabel>
        <div className="flex items-center gap-2.5 px-2 pb-2 pt-0.5">
          <Avatar initials={CURRENT_USER.initials} alt={CURRENT_USER.name} size="lg" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-fg">{CURRENT_USER.name}</span>
            <span className="truncate text-2xs text-fg-muted">{CURRENT_USER.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={User}
          onSelect={() =>
            pushToast({
              title: "Profile",
              description: "Account settings arrive in Phase 2.",
              tone: "info",
            })
          }
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem icon={Settings} onSelect={() => router.push("/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={BookOpen}
          onSelect={() =>
            pushToast({
              title: "Documentation",
              description: "The docs site is not part of Phase 1.",
              tone: "info",
            })
          }
        >
          Documentation
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={LifeBuoy}
          onSelect={() =>
            pushToast({
              title: "Support",
              description: "Support tooling arrives after Phase 1.",
              tone: "info",
            })
          }
        >
          Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={LogOut}
          shortcut="⇧⌘Q"
          onSelect={() =>
            pushToast({
              title: "Sign out",
              description: "Authentication is not implemented in Phase 1.",
              tone: "warning",
            })
          }
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
