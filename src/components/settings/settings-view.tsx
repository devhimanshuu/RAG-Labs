"use client";

import { Bell, Building2, KeyRound, Monitor, Moon, Palette, Plug, Settings2, Sun, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import * as React from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-table";
import { Field, FieldDescription, FieldRow, Label } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Panel, PanelActions, PanelBody, PanelFooter, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RAG_STRATEGIES } from "@/lib/constants/app";
import { PROVIDER_STATUS_META } from "@/lib/constants/status";
import { mockDatasets, mockMembers, mockProviders, mockWorkspaceStats, timeAgo } from "@/lib/mock-data";
import { toast } from "@/lib/store/toast";
import { useUIStore } from "@/lib/store/ui";
import { formatNumber } from "@/lib/utils";
import type { Density, ThemePreference } from "@/types";

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Moon;
}> = [
  {
    value: "dark",
    label: "Dark",
    description: "The flagship RAGLabs experience, tuned for long sessions.",
    icon: Moon,
  },
  {
    value: "light",
    label: "Light",
    description: "High-contrast daylight theme for presentations and printing.",
    icon: Sun,
  },
  {
    value: "system",
    label: "System",
    description: "Follows the operating system appearance setting.",
    icon: Monitor,
  },
];

function SectionPanel({
  title,
  description,
  icon,
  actions,
  children,
  footer,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Panel>
      <PanelHeader>
        <span className="flex min-w-0 flex-col">
          <PanelTitle icon={icon}>{title}</PanelTitle>
          {description ? (
            <span className="mt-0.5 text-2xs text-fg-muted">{description}</span>
          ) : null}
        </span>
        {actions ? <PanelActions>{actions}</PanelActions> : null}
      </PanelHeader>
      <PanelBody className="divide-y divide-line-subtle py-0">{children}</PanelBody>
      {footer ? <PanelFooter>{footer}</PanelFooter> : null}
    </Panel>
  );
}

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const density = useUIStore((state) => state.density);
  const setDensity = useUIStore((state) => state.setDensity);
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);

  const [workspaceName, setWorkspaceName] = React.useState("Acme Research");
  const [workspaceDescription, setWorkspaceDescription] = React.useState(
    "Retrieval quality research for the finance, support and engineering corpora.",
  );
  const [telemetry, setTelemetry] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    experimentCompleted: true,
    experimentFailed: true,
    indexFinished: true,
    providerErrors: true,
    weeklyDigest: false,
    productUpdates: false,
  });

  const toggleNotification = (key: keyof typeof notifications, value: boolean) =>
    setNotifications((current) => ({ ...current, [key]: value }));

  const updateTheme = (value: string) => {
    setTheme(value);
    toast.success("Appearance updated", `Theme set to ${value}.`);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Settings"
        description="Workspace preferences, appearance, providers and notification routing. Nothing here is persisted in Phase 1."
        actions={
          <Button
            variant="primary"
            onClick={() =>
              toast.success("Preferences saved", "Stored locally for this session only.")
            }
          >
            Save changes
          </Button>
        }
      />

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="api-keys">API keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-col gap-4">
          {/* General */}
          <TabsContent value="general" className="flex flex-col gap-4">
            <SectionPanel
              title="Workspace defaults"
              description="Applied to new experiments, datasets and pipelines."
              icon={Settings2}
            >
              <FieldRow
                label="Default dataset"
                htmlFor="settings-default-dataset"
                description="Pre-selected when opening the playground."
              >
                <Select defaultValue={mockDatasets[0].id}>
                  <SelectTrigger id="settings-default-dataset" className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDatasets.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>

              <FieldRow
                label="Default retrieval strategy"
                htmlFor="settings-default-strategy"
                description="Used by the playground and by new experiment templates."
              >
                <Select defaultValue="hybrid">
                  <SelectTrigger id="settings-default-strategy" className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RAG_STRATEGIES.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        {strategy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>

              <FieldRow
                label="Telemetry"
                description="Share anonymous latency and quality metrics to improve ranking defaults."
              >
                <Switch
                  checked={telemetry}
                  onCheckedChange={(value) => setTelemetry(value)}
                  aria-label="Share anonymous telemetry"
                />
              </FieldRow>

              <FieldRow
                label="Auto-save playground runs"
                description="Persist every playground run as an inspectable trace."
              >
                <Switch
                  checked={autoSave}
                  onCheckedChange={(value) => setAutoSave(value)}
                  aria-label="Auto-save playground runs"
                />
              </FieldRow>
            </SectionPanel>

            <SectionPanel
              title="Workspace details"
              description="Visible to every member of this workspace."
              icon={Building2}
              footer={
                <>
                  <span className="technical text-2xs text-fg-disabled">
                    workspace id: ws_raglab_research
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toast.success("Workspace details saved")}
                  >
                    Save
                  </Button>
                </>
              }
            >
              <FieldRow
                label="Workspace name"
                htmlFor="settings-workspace-name"
                description="Shown in the top bar and on exported reports."
              >
                <Input
                  id="settings-workspace-name"
                  value={workspaceName}
                  onChange={(event) => setWorkspaceName(event.target.value)}
                  className="w-64"
                />
              </FieldRow>

              <div className="py-3.5">
                <Field>
                  <Label htmlFor="settings-workspace-description" className="text-sm text-fg">
                    Description
                  </Label>
                  <Textarea
                    id="settings-workspace-description"
                    rows={2}
                    value={workspaceDescription}
                    onChange={(event) => setWorkspaceDescription(event.target.value)}
                  />
                  <FieldDescription>
                    A short summary helps teammates understand what this workspace is evaluating.
                  </FieldDescription>
                </Field>
              </div>
            </SectionPanel>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="flex flex-col gap-4">
            <Panel>
              <PanelHeader>
                <PanelTitle icon={Palette}>Theme</PanelTitle>
                <PanelActions>
                  <Badge tone="accent" mono>
                    dark is primary
                  </Badge>
                </PanelActions>
              </PanelHeader>
              <PanelBody className="flex flex-col gap-3">
                <RadioGroup value={theme ?? "dark"} onValueChange={updateTheme}>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {THEME_OPTIONS.map((option) => (
                      <RadioCard
                        key={option.value}
                        id={`theme-${option.value}`}
                        value={option.value}
                        title={option.label}
                        description={option.description}
                        icon={option.icon}
                      />
                    ))}
                  </div>
                </RadioGroup>
              </PanelBody>
            </Panel>

            <SectionPanel title="Layout" description="How much density the interface uses." icon={Palette}>
              <div className="py-3.5">
                <Field>
                  <Label>Table and list density</Label>
                  <RadioGroup value={density} onValueChange={(value) => setDensity(value as Density)}>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <RadioCard
                        id="density-comfortable"
                        value="comfortable"
                        title="Comfortable"
                        description="Default row height, easier scanning on large displays."
                      />
                      <RadioCard
                        id="density-compact"
                        value="compact"
                        title="Compact"
                        description="Tighter rows for high-volume trace and chunk tables."
                      />
                    </div>
                  </RadioGroup>
                </Field>
              </div>

              <FieldRow
                label="Sidebar collapsed by default"
                description="Start every session with the icon-only navigation rail."
              >
                <Switch
                  checked={sidebarCollapsed}
                  onCheckedChange={setSidebarCollapsed}
                  aria-label="Collapse sidebar by default"
                />
              </FieldRow>

              <div className="py-3.5">
                <Field>
                  <Label>Motion</Label>
                  <div className="mt-1 flex flex-col gap-2.5">
                    <CheckboxField
                      id="settings-reduced-motion"
                      label="Reduce motion"
                      description="Disables transitions and animated indicators. The operating system preference is always respected."
                      checked={reducedMotion}
                      onCheckedChange={(checked) => setReducedMotion(checked === true)}
                    />
                    <CheckboxField
                      id="settings-sparklines"
                      label="Show metric sparklines"
                      description="Inline trend lines on dashboard and evaluation metric cards."
                      defaultChecked
                    />
                  </div>
                </Field>
              </div>
            </SectionPanel>
          </TabsContent>

          {/* Workspace */}
          <TabsContent value="workspace" className="flex flex-col gap-4">
            <Panel>
              <PanelHeader>
                <PanelTitle icon={Building2}>Members</PanelTitle>
                <PanelActions>
                  <span className="technical text-2xs text-fg-muted">
                    {mockMembers.length} members
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      toast.info("Invite members", "Invitations arrive in Phase 2.")
                    }
                  >
                    <UserPlus />
                    Invite
                  </Button>
                </PanelActions>
              </PanelHeader>
              <PanelBody padded={false}>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Member</TableHead>
                      <TableHead className="hidden sm:table-cell">Role</TableHead>
                      <TableHead align="right">Last active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <span className="flex items-center gap-2.5">
                            <Avatar initials={member.initials} alt={member.name} size="sm" />
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate text-xs text-fg">{member.name}</span>
                              <span className="truncate text-2xs text-fg-muted">
                                {member.email}
                              </span>
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge tone={member.role === "Owner" ? "accent" : "neutral"} mono>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell align="right">
                          <span className="technical text-2xs text-fg-muted">
                            {timeAgo(member.lastActiveAt)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PanelBody>
            </Panel>

            <SectionPanel
              title="Plan and usage"
              description="Mocked limits for the current billing period."
              icon={Building2}
              footer={
                <>
                  <span className="text-2xs text-fg-muted">
                    Billing integration arrives with the Phase 2 backend.
                  </span>
                  <Button variant="secondary" size="sm">
                    Upgrade plan
                  </Button>
                </>
              }
            >
              <FieldRow label="Plan" description="Team plan with 5 seats included.">
                <Badge tone="accent" mono>
                  Team
                </Badge>
              </FieldRow>
              <FieldRow label="Datasets" description="Six datasets are indexed in this workspace.">
                <span className="technical text-xs text-fg-secondary">
                  {formatNumber(mockWorkspaceStats.datasets)} / 25
                </span>
              </FieldRow>
              <FieldRow
                label="Indexed vectors"
                description="Across every dataset and embedding model."
              >
                <span className="technical text-xs text-fg-secondary">
                  24.6M / 40M
                </span>
              </FieldRow>
            </SectionPanel>
          </TabsContent>

          {/* Providers */}
          <TabsContent value="providers" className="flex flex-col gap-4">
            <SectionPanel
              title="Connected providers"
              description="Manage endpoints and credentials on the Providers page."
              icon={Plug}
              actions={
                <Button variant="ghost" size="xs" asChild>
                  <Link href="/providers">Open providers</Link>
                </Button>
              }
            >
              {mockProviders.map((provider) => {
                const meta = PROVIDER_STATUS_META[provider.status];
                return (
                  <FieldRow
                    key={provider.id}
                    label={
                      <span className="flex items-center gap-2">
                        {provider.name}
                        <Badge tone={meta.tone} mono>
                          <StatusIndicator tone={meta.tone} size="xs" />
                          {meta.label}
                        </Badge>
                      </span>
                    }
                    description={provider.baseUrl}
                  >
                    <span className="technical text-2xs text-fg-muted">
                      {provider.modelCount} models
                    </span>
                  </FieldRow>
                );
              })}
            </SectionPanel>
          </TabsContent>

          {/* API keys */}
          <TabsContent value="api-keys" className="flex flex-col gap-4">
            <Panel>
              <PanelHeader>
                <PanelTitle icon={KeyRound}>Stored credentials</PanelTitle>
                <PanelActions>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      toast.info("Add credential", "Secure storage arrives in Phase 2.")
                    }
                  >
                    Add key
                  </Button>
                </PanelActions>
              </PanelHeader>
              <PanelBody padded={false}>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Provider</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead className="hidden md:table-cell">Scope</TableHead>
                      <TableHead align="right">Added</TableHead>
                      <TableHead align="right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProviders.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="text-xs text-fg">{provider.name}</TableCell>
                        <TableCell>
                          <span className="technical text-2xs text-fg-secondary">
                            {provider.apiKeyHint ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell className="technical hidden text-2xs text-fg-muted md:table-cell">
                          production
                        </TableCell>
                        <TableCell align="right">
                          <span className="technical text-2xs text-fg-muted">
                            {timeAgo(provider.lastCheckedAt)}
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          <span className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() =>
                                toast.info(
                                  `Rotate ${provider.name} key`,
                                  "Key rotation arrives in Phase 2.",
                                )
                              }
                            >
                              Rotate
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              className="text-danger hover:bg-danger-muted hover:text-danger"
                              onClick={() =>
                                toast.warning(
                                  "Revoking is disabled",
                                  "Credential mutation is not available in Phase 1.",
                                )
                              }
                            >
                              Revoke
                            </Button>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PanelBody>
              <PanelFooter>
                <span className="text-2xs text-fg-muted">
                  Keys are never rendered in full, and are not stored in Phase 1.
                </span>
              </PanelFooter>
            </Panel>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="flex flex-col gap-4">
            <SectionPanel
              title="Events"
              description="Choose which workspace events produce a notification."
              icon={Bell}
            >
              <FieldRow label="Experiment completed" description="When an evaluation run finishes.">
                <Switch
                  checked={notifications.experimentCompleted}
                  onCheckedChange={(value) => toggleNotification("experimentCompleted", value)}
                  aria-label="Notify when an experiment completes"
                />
              </FieldRow>
              <FieldRow label="Experiment failed" description="When a run aborts before finishing.">
                <Switch
                  checked={notifications.experimentFailed}
                  onCheckedChange={(value) => toggleNotification("experimentFailed", value)}
                  aria-label="Notify when an experiment fails"
                />
              </FieldRow>
              <FieldRow label="Index finished" description="When a dataset finishes embedding.">
                <Switch
                  checked={notifications.indexFinished}
                  onCheckedChange={(value) => toggleNotification("indexFinished", value)}
                  aria-label="Notify when indexing finishes"
                />
              </FieldRow>
              <FieldRow
                label="Provider errors"
                description="Connection failures and credential rejections."
              >
                <Switch
                  checked={notifications.providerErrors}
                  onCheckedChange={(value) => toggleNotification("providerErrors", value)}
                  aria-label="Notify about provider errors"
                />
              </FieldRow>
              <FieldRow label="Weekly digest" description="A Monday summary of retrieval quality.">
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(value) => toggleNotification("weeklyDigest", value)}
                  aria-label="Send a weekly digest"
                />
              </FieldRow>
              <FieldRow
                label="Product updates"
                description="Release notes for new RAGLabs capabilities."
              >
                <Switch
                  checked={notifications.productUpdates}
                  onCheckedChange={(value) => toggleNotification("productUpdates", value)}
                  aria-label="Notify about product updates"
                />
              </FieldRow>
            </SectionPanel>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
