"use client";

import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import { CreateWorkspaceDialog } from "@/components/layout/create-workspace-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { SUPPORTED_FILE_TYPES, WORKSPACE } from "@/lib/constants/app";
import { useToastStore } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

/**
 * Phase 1 workspaces are fixtures; Phase 2 swaps this for the signed-in user's
 * workspace list. Only the workspace name differs between the collapsed and
 * expanded states, so both share one menu.
 */
const WORKSPACES = [
  { id: WORKSPACE.id, name: WORKSPACE.name, plan: WORKSPACE.plan, initials: WORKSPACE.initials },
  { id: "ws_personal", name: "Personal", plan: "Free", initials: "PE" },
  { id: "ws_labs_eval", name: "Labs · Eval", plan: "Team", initials: "LE" },
];

export function WorkspaceSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const [activeId, setActiveId] = React.useState<string>(WORKSPACE.id);
  const [createOpen, setCreateOpen] = React.useState(false);
  const pushToast = useToastStore((state) => state.push);
  const active = WORKSPACES.find((workspace) => workspace.id === activeId) ?? WORKSPACES[0];

  const trigger = (
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label="Switch workspace"
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md border border-line bg-surface px-2 text-left transition-colors hover:border-line-strong hover:bg-surface-hover focus-ring",
          collapsed && "justify-center px-0",
        )}
      >
        <span className="technical flex size-5 shrink-0 items-center justify-center rounded-xs border border-accent-line bg-accent-muted text-[10px] font-semibold text-accent">
          {active.initials}
        </span>
        {!collapsed ? (
          <>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-medium leading-tight text-fg">
                {active.name}
              </span>
              <span className="truncate text-[10px] leading-tight text-fg-muted">
                {active.plan} plan
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
          </>
        ) : null}
      </button>
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip side="right" content={`${active.name} · ${active.plan} plan`}>
          {trigger}
        </Tooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {WORKSPACES.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onSelect={() => {
              setActiveId(workspace.id);
              pushToast({
                title: `Switched to ${workspace.name}`,
                description: "Workspace switching is wired up in Phase 2.",
                tone: "info",
              });
            }}
          >
            <span className="technical flex size-4 shrink-0 items-center justify-center rounded-xs border border-line text-[9px] text-fg-muted">
              {workspace.initials}
            </span>
            <span className="flex-1 truncate">{workspace.name}</span>
            {workspace.id === active.id ? (
              <Check className="size-3.5 text-accent" aria-hidden />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={Plus}
          onSelect={() => setCreateOpen(true)}
          onMouseDown={(event) => event.preventDefault()}
        >
          Create workspace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-2xs text-fg-muted">
            Supported sources: {SUPPORTED_FILE_TYPES.join(" ")}
          </p>
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Building2 className="size-3.5 text-fg-muted" aria-hidden />
          <span className="technical text-2xs text-fg-disabled">{active.id}</span>
        </div>
      </DropdownMenuContent>

      {createOpen ? (
        <CreateWorkspaceDialog
          onClose={() => setCreateOpen(false)}
          onCreate={(name) => {
            setCreateOpen(false);
            pushToast({
              title: `“${name}” created`,
              description: "Workspace provisioning is mocked in Phase 1.",
              tone: "success",
            });
          }}
        />
      ) : null}
    </DropdownMenu>
  );
}
