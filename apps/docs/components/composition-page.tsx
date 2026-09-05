"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Box,
  Check,
  CircleAlert,
  EllipsisVertical,
  ExternalLink,
  FileText,
  PackageOpen,
  RefreshCw,
  Save,
  Settings,
  Type,
  Upload,
  UserPlus,
  X,
} from "@nerio-ui/adapters/icons";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  Checkbox,
  Dialog,
  DialogFooter,
  DropdownMenu,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  FileInput,
  FormGroup,
  Heading,
  Icon,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  KeyValue,
  Label,
  LabelContent,
  LabelRow,
  Pagination,
  Popover,
  Progress,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  Text,
  ToastProvider,
  ToastViewport,
  Tooltip,
  useToastManager,
} from "@nerio-ui/ui/client";
import { internalBlockFixtures } from "../features/blocks/catalog";

type Composition = {
  purpose: string;
  components: string[];
  accessibility: string;
  responsive: string;
  notes: string;
  code: string;
  Preview: React.ComponentType;
};

const authComponents = ["Card", "Field", "Input", "Button", "Alert"];

function AuthPreview({ kind }: { kind: "login" | "forgot" }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const invalid = submitted && !email.includes("@");
  const copy = {
    login: {
      title: "Login to your account",
      action: "Login",
      description: "Enter your email below to login to your account.",
    },
    forgot: {
      title: "Reset your password",
      action: "Send reset link",
      description: "Enter the email associated with your account and we’ll send you a reset link.",
    },
  }[kind];

  return (
    <Card className="composition-auth-card">
      <CardHeader>
        <Heading as="h2" size="lg">
          {copy.title}
        </Heading>
        <Text tone="secondary">{copy.description}</Text>
      </CardHeader>
      <CardContent>
        {completed ? (
          <Alert
            tone="success"
            title={kind === "forgot" ? "Check your inbox" : "Ready to continue"}
          >
            {kind === "forgot"
              ? "A reset link has been sent."
              : "The form is valid and ready to submit."}
          </Alert>
        ) : null}
        <form
          className="composition-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            setCompleted(false);
            if (email.includes("@")) {
              setBusy(true);
              window.setTimeout(() => {
                setBusy(false);
                setCompleted(true);
              }, 400);
            }
          }}
        >
          <Field
            label="Email"
            invalid={invalid}
            message={invalid ? "Enter a valid email address." : undefined}
          >
            <Input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              placeholder={kind === "login" ? "m@example.com" : "nerio@vpavlov.com"}
            />
          </Field>
          {kind === "login" ? (
            <div className="composition-auth-password">
              <LabelRow className="composition-auth-password__label">
                <LabelContent>
                  <Label htmlFor="sign-in-password">Password</Label>
                </LabelContent>
                <Button nativeButton={false} render={<span />} variant="link">
                  Forgot your password?
                </Button>
              </LabelRow>
              <Input id="sign-in-password" autoComplete="current-password" type="password" />
            </div>
          ) : null}
          <Button className="composition-auth-submit" loading={busy} type="submit">
            {copy.action}
          </Button>
          {kind === "login" ? (
            <Text className="composition-auth-switch" tone="secondary">
              Don&apos;t have an account?{" "}
              <Button nativeButton={false} render={<span />} variant="link">
                Sign up
              </Button>
            </Text>
          ) : (
            <Text className="composition-auth-switch" tone="secondary">
              Remembered your password?{" "}
              <Button nativeButton={false} render={<span />} variant="link">
                Sign in
              </Button>
            </Text>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function CreateAccountPreview() {
  return (
    <div className="composition-create-account">
      <div className="composition-auth-brand">
        <span className="composition-auth-brand__mark">
          <Icon icon={Box} />
        </span>
        <Heading as="h2" size="lg">
          Acme Inc.
        </Heading>
      </div>

      <Card className="composition-auth-card composition-create-account__card">
        <CardHeader className="composition-create-account__header">
          <Heading as="h3" size="xl">
            Create your account
          </Heading>
          <Text tone="secondary">Enter your email below to create your account.</Text>
        </CardHeader>
        <CardContent>
          <form className="composition-form">
            <Field label="Full name">
              <Input autoComplete="name" placeholder="Vladimir Pavlov" />
            </Field>
            <Field label="Email">
              <Input autoComplete="email" placeholder="nerio@vpavlov.com" type="email" />
            </Field>
            <div className="composition-create-account__passwords">
              <Field label="Password">
                <Input autoComplete="new-password" type="password" />
              </Field>
              <Field label="Confirm password">
                <Input autoComplete="new-password" type="password" />
              </Field>
            </div>
            <Text className="composition-create-account__helper" tone="secondary">
              Must be at least 8 characters long.
            </Text>
            <Button className="composition-auth-submit" type="button">
              Create account
            </Button>
            <Text className="composition-auth-switch" tone="secondary">
              Already have an account?{" "}
              <Button nativeButton={false} render={<span />} variant="link">
                Sign in
              </Button>
            </Text>
          </form>
        </CardContent>
      </Card>

      <Text className="composition-create-account__legal" tone="secondary">
        By clicking continue, you agree to our{" "}
        <Button nativeButton={false} render={<span />} variant="link">
          Terms of Service
        </Button>{" "}
        and{" "}
        <Button nativeButton={false} render={<span />} variant="link">
          Privacy Policy
        </Button>
        .
      </Text>
    </div>
  );
}

function ProfileSettingsPreview() {
  return (
    <Card className="composition-profile-settings-card">
      <CardHeader>
        <Heading as="h2" size="lg">
          Profile settings
        </Heading>
        <Text tone="secondary">Manage how you appear across Nerio.</Text>
      </CardHeader>
      <CardContent>
        <form className="composition-profile-settings">
          <Item size="lg" variant="outline">
            <ItemMedia>
              <Avatar
                alt="Vladimir Pavlov profile photo"
                name="Vladimir Pavlov"
                size="lg"
                src="/avatars/lucas-moreau.png"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Vladimir Pavlov</ItemTitle>
              <ItemDescription>nerio@vpavlov.com</ItemDescription>
            </ItemContent>
          </Item>

          <Field label="Profile photo" description="PNG or JPG up to 2 MB.">
            <FileInput accept="image/jpeg,image/png" />
          </Field>
          <Field label="Display name">
            <Input defaultValue="Vladimir Pavlov" />
          </Field>
          <Field label="Bio">
            <Textarea defaultValue="Designing and maintaining Nerio for product teams." />
          </Field>

          <Separator />

          <Switch
            data-preview-interaction="allowed"
            defaultChecked
            label="Show profile in workspace"
            description="Let workspace members view your name, photo, and bio."
          />

          <div className="composition-save-bar">
            <span>All changes saved</span>
            <Button disabled type="button" variant="primary">
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function NotificationPreferencesPreview() {
  const initialPreferences = {
    mentions: true,
    projectUpdates: true,
    workspaceActivity: false,
    productAnnouncements: false,
    digestFrequency: "weekly",
  };
  const [preferences, setPreferences] = React.useState(initialPreferences);
  const [savedPreferences, setSavedPreferences] = React.useState(initialPreferences);
  const [saved, setSaved] = React.useState(false);
  const hasUnsavedChanges = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);
  const digestDescription =
    preferences.digestFrequency === "never"
      ? "You won’t receive summary emails."
      : preferences.digestFrequency === "daily"
        ? "Daily digests arrive every morning at 9:00 AM."
        : "Weekly digests arrive every Monday at 9:00 AM.";

  function updatePreference<Key extends keyof typeof preferences>(
    key: Key,
    value: (typeof preferences)[Key],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function savePreferences() {
    setSavedPreferences(preferences);
    setSaved(true);
  }

  return (
    <Card className="composition-notification-preferences-card">
      <CardHeader>
        <Heading as="h2" size="lg">
          Notification preferences
        </Heading>
        <Text tone="secondary">Choose how Nerio keeps you informed about workspace activity.</Text>
      </CardHeader>
      <CardContent>
        <form
          className="composition-notification-preferences"
          onSubmit={(event) => {
            event.preventDefault();
            savePreferences();
          }}
        >
          <FormGroup
            title="Activity notifications"
            description="Stay informed about work that needs your attention."
          >
            <Item className="composition-notification-preferences__item" size="lg">
              <ItemContent>
                <ItemTitle>Mentions and assignments</ItemTitle>
                <ItemDescription>When someone mentions you or assigns work to you.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  aria-label="Mentions and assignments"
                  checked={preferences.mentions}
                  data-preview-interaction="allowed"
                  onCheckedChange={(checked) => updatePreference("mentions", checked)}
                />
              </ItemActions>
            </Item>

            <Item className="composition-notification-preferences__item" size="lg">
              <ItemContent>
                <ItemTitle>Project updates</ItemTitle>
                <ItemDescription>
                  Status changes and important activity in projects you follow.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  aria-label="Project updates"
                  checked={preferences.projectUpdates}
                  data-preview-interaction="allowed"
                  onCheckedChange={(checked) => updatePreference("projectUpdates", checked)}
                />
              </ItemActions>
            </Item>

            <Item className="composition-notification-preferences__item" size="lg">
              <ItemContent>
                <ItemTitle>Workspace activity</ItemTitle>
                <ItemDescription>
                  New comments, approvals, and changes from your team.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  aria-label="Workspace activity"
                  checked={preferences.workspaceActivity}
                  data-preview-interaction="allowed"
                  onCheckedChange={(checked) => updatePreference("workspaceActivity", checked)}
                />
              </ItemActions>
            </Item>
          </FormGroup>

          <Separator />

          <FormGroup
            title="Nerio updates"
            description="Occasional news about the product and its development."
          >
            <Item className="composition-notification-preferences__item" size="lg">
              <ItemContent>
                <ItemTitle>Product announcements</ItemTitle>
                <ItemDescription>New features, improvements, and release notes.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Switch
                  aria-label="Product announcements"
                  checked={preferences.productAnnouncements}
                  data-preview-interaction="allowed"
                  onCheckedChange={(checked) => updatePreference("productAnnouncements", checked)}
                />
              </ItemActions>
            </Item>
          </FormGroup>

          <Separator />

          <Item className="composition-notification-preferences__item" size="lg">
            <ItemContent>
              <ItemTitle>Email digest</ItemTitle>
              <ItemDescription>{digestDescription}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Select
                className="composition-notification-preferences__select"
                data-preview-interaction="allowed"
                label={<span className="sr-only">Email digest</span>}
                value={preferences.digestFrequency}
                onValueChange={(value) => updatePreference("digestFrequency", value)}
                options={[
                  { label: "Daily", value: "daily" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Never", value: "never" },
                ]}
              />
            </ItemActions>
          </Item>

          {saved ? (
            <Alert role="status" tone="success" title="Preferences saved">
              Future workspace updates will use these choices.
            </Alert>
          ) : null}

          <div className="composition-save-bar">
            <span>{hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}</span>
            <Button
              data-preview-interaction="allowed"
              disabled={!hasUnsavedChanges}
              onClick={savePreferences}
              type="button"
            >
              Save preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SecuritySettingsPreview() {
  return (
    <Card className="composition-security-settings-card">
      <CardHeader>
        <Heading as="h2" size="lg">
          Security settings
        </Heading>
        <Text tone="secondary">Manage sign-in protection and active sessions.</Text>
      </CardHeader>
      <CardContent className="composition-security-settings">
        <Item className="composition-security-settings__item" size="lg">
          <ItemContent>
            <ItemTitle>Password</ItemTitle>
            <ItemDescription>Last changed 3 months ago.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button type="button" variant="secondary">
              Change password
            </Button>
          </ItemActions>
        </Item>

        <Item className="composition-security-settings__item" size="lg">
          <ItemContent>
            <ItemTitle>Two-factor authentication</ItemTitle>
            <ItemDescription>Add an extra verification step when signing in.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button type="button" variant="secondary">
              Set up
            </Button>
          </ItemActions>
        </Item>

        <Item className="composition-security-settings__item" size="lg">
          <ItemContent>
            <ItemTitle>Active sessions</ItemTitle>
            <ItemDescription>You’re signed in on 2 devices.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button type="button" variant="secondary">
              Review sessions
            </Button>
          </ItemActions>
        </Item>
      </CardContent>
    </Card>
  );
}

function TableToolbarPreview() {
  const projects = [
    { id: "aster", name: "Aster", status: "active", owner: "Alex Morgan" },
    { id: "canvas", name: "Canvas", status: "active", owner: "Maya Chen" },
    { id: "luma", name: "Luma", status: "archived", owner: "Jordan Lee" },
    { id: "northstar", name: "Northstar", status: "active", owner: "Sam Rivera" },
    { id: "orbit", name: "Orbit", status: "archived", owner: "Taylor Kim" },
    { id: "atlas", name: "Atlas", status: "active", owner: "Rowan Patel" },
  ] as const;
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState<"all" | "active" | "archived">("all");
  const filteredProjects = projects.filter(
    (project) =>
      (status === "all" || project.status === status) &&
      project.name.toLowerCase().includes(query.toLowerCase()),
  );
  const visibleProjects = filteredProjects.slice(0, 4);
  const visibleProjectIds = visibleProjects.map((project) => project.id);
  const visibleSelected = visibleProjects.filter((project) => selected.includes(project.id));
  const allVisibleSelected =
    visibleProjects.length > 0 && visibleProjects.every((project) => selected.includes(project.id));
  const someVisibleSelected = visibleSelected.length > 0 && !allVisibleSelected;
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / 4));

  function updateStatus(nextStatus: string | null) {
    if (nextStatus !== "all" && nextStatus !== "active" && nextStatus !== "archived") {
      return;
    }
    setStatus(nextStatus);
    setSelected([]);
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setSelected([]);
  }

  function toggleAllVisible(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      visibleProjectIds.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return [...next];
    });
  }

  return (
    <Card className="composition-table-card">
      <CardHeader>
        <div className="composition-table-header">
          <div>
            <Heading as="h2" size="lg">
              Projects
            </Heading>
            <Text tone="secondary">Manage active and archived workspace projects.</Text>
          </div>
          <Input
            aria-label="Search projects"
            placeholder="Search projects"
            value={query}
            onChange={(event) => updateQuery(event.currentTarget.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="composition-table">
        <div className="composition-table-toolbar">
          <Tabs
            data-preview-interaction="allowed"
            onValueChange={updateStatus}
            size="sm"
            value={status}
            variant="segmented"
          >
            <TabsList aria-label="Project status">
              <TabsTrigger badge={<Badge size="sm">6</Badge>} value="all">
                All
              </TabsTrigger>
              <TabsTrigger badge={<Badge size="sm">4</Badge>} value="active">
                Active
              </TabsTrigger>
              <TabsTrigger badge={<Badge size="sm">2</Badge>} value="archived">
                Archived
              </TabsTrigger>
              <TabsIndicator />
            </TabsList>
          </Tabs>
          {visibleSelected.length ? (
            <div className="composition-table-actions">
              <Button leadingIcon={PackageOpen} size="sm" type="button" variant="secondary">
                Archive
              </Button>
              <Button leadingIcon={UserPlus} size="sm" type="button" variant="secondary">
                Assign owner
              </Button>
              <Button
                data-preview-interaction="allowed"
                leadingIcon={X}
                onClick={() => setSelected([])}
                size="sm"
                type="button"
                variant="secondary"
              >
                Clear
              </Button>
            </div>
          ) : null}
        </div>

        <div className="composition-table-frame">
          {filteredProjects.length ? (
            <TableContainer
              aria-label="Projects"
              className="composition-table-frame__container"
              focusable
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        aria-label="Select all projects"
                        checked={allVisibleSelected}
                        data-preview-interaction="allowed"
                        indeterminate={someVisibleSelected}
                        onCheckedChange={toggleAllVisible}
                        parent
                      />
                    </TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleProjects.map((project) => {
                    const isSelected = selected.includes(project.id);
                    return (
                      <TableRow data-selected={isSelected ? "" : undefined} key={project.id}>
                        <TableCell>
                          <Checkbox
                            aria-label={`Select ${project.name}`}
                            checked={isSelected}
                            data-preview-interaction="allowed"
                            onCheckedChange={(checked) =>
                              setSelected((current) =>
                                checked
                                  ? [...current, project.id]
                                  : current.filter((item) => item !== project.id),
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>
                          <Badge tone={project.status === "active" ? "success" : "neutral"}>
                            {project.status === "active" ? "Active" : "Archived"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="composition-table-owner">
                            <Avatar name={project.owner} size="sm" />
                            <span>{project.owner}</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu
                            trigger={
                              <Button
                                aria-label={`Actions for ${project.name}`}
                                data-preview-interaction="allowed"
                                icon={EllipsisVertical}
                                size="sm"
                                variant="ghost"
                              />
                            }
                            items={[
                              { label: "Open project", leadingIcon: ExternalLink },
                              { label: "Rename", leadingIcon: Type },
                              {
                                destructive: project.status === "active",
                                label: project.status === "active" ? "Archive" : "Delete",
                                leadingIcon: project.status === "active" ? PackageOpen : X,
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyState role="status" size="sm">
              <EmptyStateHeader>
                <EmptyStateTitle>No projects found</EmptyStateTitle>
                <EmptyStateDescription>
                  Try another search term or choose a different status.
                </EmptyStateDescription>
              </EmptyStateHeader>
              <EmptyStateActions>
                <Button
                  data-preview-interaction="allowed"
                  onClick={() => updateQuery("")}
                  variant="secondary"
                >
                  Clear search
                </Button>
              </EmptyStateActions>
            </EmptyState>
          )}
        </div>
        {filteredProjects.length ? (
          <div className="composition-table-footer" role="status">
            <span>
              {visibleSelected.length
                ? `${visibleSelected.length} ${
                    visibleSelected.length === 1 ? "project" : "projects"
                  } selected`
                : `1–${visibleProjects.length} of ${filteredProjects.length} projects`}
            </span>
            <Pagination
              aria-label="Projects pagination"
              nextHref={totalPages > 1 ? "#projects" : undefined}
              pages={Array.from({ length: totalPages }, (_, index) => ({
                current: index === 0,
                href: "#projects",
                key: String(index + 1),
                label: String(index + 1),
              }))}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function AccountSummaryPreview() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <Card className="composition-account-summary-card">
      <CardHeader>
        <Heading as="h2" size="lg">
          Account summary
        </Heading>
        <Text tone="secondary">Profile and workspace membership details.</Text>
      </CardHeader>
      <CardContent className="composition-account-summary">
        <Item className="composition-account-summary__identity" size="lg" variant="outline">
          <ItemMedia>
            <Avatar
              alt="Vladimir Pavlov profile photo"
              name="Vladimir Pavlov"
              size="lg"
              src="/avatars/lucas-moreau.png"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Vladimir Pavlov</ItemTitle>
            <ItemDescription>Product designer at Northstar</ItemDescription>
          </ItemContent>
          <ItemActions className="composition-account-summary__badges">
            <Badge tone="success">Active</Badge>
            <Badge>Member</Badge>
          </ItemActions>
        </Item>

        <Separator />

        <dl className="composition-account-summary__metadata">
          <KeyValue label="Email" value="nerio@vpavlov.com" />
          <KeyValue label="Location" value="Tbilisi, Georgia" />
          <KeyValue label="Time zone" value="GMT+4" />
          <KeyValue label="Member since" value="May 2024" />
          <KeyValue label="Workspace role" value="Member" />
          <KeyValue label="Last active" value="Today at 10:42 AM" />
        </dl>

        <Separator />

        <div className="composition-account-summary__footer">
          <Text tone="secondary">Account details are visible to workspace members.</Text>
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            trigger={
              <Button
                data-preview-interaction="allowed"
                leadingIcon={Settings}
                type="button"
                variant="secondary"
              >
                Edit account
              </Button>
            }
            title="Edit account"
            description="Update the profile details shown to workspace members."
          >
            <div className="composition-account-summary__form">
              <Field label="Display name">
                <Input defaultValue="Vladimir Pavlov" />
              </Field>
              <Field label="Job title">
                <Input defaultValue="Product designer" />
              </Field>
              <Field label="Location">
                <Input defaultValue="Tbilisi, Georgia" />
              </Field>
              <Field label="About">
                <Textarea defaultValue="Designing product experiences for the Northstar workspace." />
              </Field>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setDialogOpen(false)}>
                Save changes
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function FileUploadStatePreview() {
  return (
    <Card className="composition-upload-card">
      <CardHeader>
        <div>
          <Heading as="h2" size="lg">
            Upload files
          </Heading>
          <Text tone="secondary">Review files being added to the Northstar workspace.</Text>
        </div>
        <CardAction>
          <Button leadingIcon={Upload} type="button" variant="secondary">
            Upload
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ItemGroup aria-label="Upload queue" className="composition-upload-list">
          <Item size="lg" variant="outline">
            <ItemMedia variant="icon">
              <Icon icon={Upload} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>project-brief.pdf</ItemTitle>
              <ItemDescription>Ready to upload · 2.4 MB</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Tooltip label="Delete file">
                <Button
                  aria-label="Delete project-brief.pdf"
                  icon={X}
                  size="sm"
                  type="button"
                  variant="secondary"
                />
              </Tooltip>
            </ItemActions>
          </Item>

          <Item size="lg" variant="outline">
            <ItemMedia variant="icon">
              <Spinner decorative size="sm" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>design-system.zip</ItemTitle>
              <ItemDescription>Uploading · 64%</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Tooltip label="Delete file">
                <Button
                  aria-label="Delete design-system.zip"
                  icon={X}
                  size="sm"
                  type="button"
                  variant="secondary"
                />
              </Tooltip>
            </ItemActions>
          </Item>

          <Item size="lg" variant="outline">
            <ItemMedia variant="icon">
              <Icon icon={FileText} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>market-research.pdf</ItemTitle>
              <ItemDescription>Processing document</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Tooltip label="Delete file">
                <Button
                  aria-label="Delete market-research.pdf"
                  icon={X}
                  size="sm"
                  type="button"
                  variant="secondary"
                />
              </Tooltip>
            </ItemActions>
          </Item>

          <Item className="composition-upload-item--failed" size="lg" variant="outline">
            <ItemMedia className="composition-upload-item__media--danger" variant="icon">
              <Icon icon={CircleAlert} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>financial-model.xlsx</ItemTitle>
              <ItemDescription className="composition-upload-item__description--danger">
                Upload failed. Try again.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Tooltip label="Retry file">
                <Button
                  aria-label="Retry financial-model.xlsx"
                  icon={RefreshCw}
                  size="sm"
                  type="button"
                  variant="secondary"
                />
              </Tooltip>
              <Tooltip label="Delete file">
                <Button
                  aria-label="Delete financial-model.xlsx"
                  icon={X}
                  size="sm"
                  type="button"
                  variant="secondary"
                />
              </Tooltip>
            </ItemActions>
          </Item>

          <Item size="lg" variant="outline">
            <ItemMedia variant="icon">
              <Icon icon={Check} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>uploaded-report.pdf</ItemTitle>
              <ItemDescription>Uploaded · 1.8 MB</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Tooltip label="Delete file">
                <Button
                  aria-label="Delete uploaded-report.pdf"
                  icon={X}
                  size="sm"
                  type="button"
                  variant="secondary"
                />
              </Tooltip>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>

      <CardFooter className="composition-upload-footer">
        <div className="composition-upload-footer__actions">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button disabled leadingIcon={Save} type="button">
            Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function FeedbackContent() {
  const toasts = useToastManager();
  return (
    <div className="composition-feedback">
      <Alert tone="success" title="Changes saved">
        Your workspace preferences are up to date.
      </Alert>
      <Alert tone="danger" title="Upload failed">
        The file is too large. Try a smaller export.
      </Alert>
      <div>
        <div className="composition-inline-status">
          <span>Uploading assets</span>
          <Spinner label="Uploading" />
        </div>
        <Progress value={64} aria-label="Upload progress" />
        <p>64% complete</p>
      </div>
      <div className="composition-skeleton-row">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
      <Button
        variant="secondary"
        onClick={() =>
          toasts.add({
            title: "Invite sent",
            description: "Alex will receive an email shortly.",
            data: { tone: "success" },
          })
        }
      >
        Show toast
      </Button>
    </div>
  );
}
function FeedbackPreview() {
  return (
    <ToastProvider>
      <FeedbackContent />
      <ToastViewport />
    </ToastProvider>
  );
}

function OverlayPreview() {
  return (
    <div className="composition-overlays">
      <p>Use Tab, Enter, Escape, and arrow keys to inspect the Base UI overlay behavior.</p>
      <Dialog
        trigger={<Button>Open dialog</Button>}
        title="Long review notes"
        description="The dialog keeps focus contained while long content scrolls."
      >
        <div className="composition-long-copy">
          <p>
            Review the current changes before publishing. This is deliberately long enough to
            demonstrate a scrollable dialog body.
          </p>
          <p>
            Keyboard focus returns to the trigger after closing the dialog. Nested controls remain
            reachable without losing the modal boundary.
          </p>
          <Popover
            trigger={<Button variant="secondary">Open nested popover</Button>}
            title="Review context"
          >
            <p>Contextual content stays near its trigger.</p>
          </Popover>
        </div>
      </Dialog>
      <Popover trigger={<Button variant="secondary">Open popover</Button>} title="Share settings">
        <label className="composition-choice">
          <Checkbox /> Notify collaborators
        </label>
      </Popover>
      <DropdownMenu
        trigger={<Button variant="secondary">More actions</Button>}
        items={[
          { label: "Duplicate" },
          { label: "Archive" },
          { label: "Delete", destructive: true },
        ]}
      />
      <Tooltip label="Short, non-essential guidance">
        <Button variant="ghost">What is this?</Button>
      </Tooltip>
    </div>
  );
}

function NavigationPreview() {
  return (
    <div className="composition-navigation">
      <Breadcrumbs
        items={[
          { label: "Docs", href: "/docs" },
          { label: "Blocks", href: "/blocks" },
          { label: "Navigation patterns" },
        ]}
      />
      <nav aria-label="Composition sections" className="composition-top-nav">
        <Button nativeButton={false} render={<a href="#overview" />} variant="link">
          Overview
        </Button>
        <Button nativeButton={false} render={<a href="#live-preview" />} variant="link">
          Preview
        </Button>
        <Button nativeButton={false} render={<a href="#notes" />} variant="link">
          Notes
        </Button>
      </nav>
      <Tabs defaultValue="overview">
        <TabsList aria-label="Local composition sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsPanels>
          <TabsContent value="overview">
            <p>Use tabs for peer sections, not application navigation.</p>
          </TabsContent>
          <TabsContent value="activity">
            <p>Activity is a small, related view.</p>
          </TabsContent>
        </TabsPanels>
      </Tabs>
      <div className="composition-sidebar-preview">
        <nav aria-label="Section navigation">
          <Button nativeButton={false} render={<a href="#overview" />} variant="link">
            Overview
          </Button>
          <Button nativeButton={false} render={<a href="#components-used" />} variant="link">
            Components used
          </Button>
          <Button nativeButton={false} render={<a href="#accessibility" />} variant="link">
            Accessibility
          </Button>
        </nav>
        <p>Local sidebar composition, not a reusable sidebar product component.</p>
      </div>
      <Pagination
        pages={[
          { key: "1", label: "1", href: "#overview", current: true },
          { key: "2", label: "2", href: "#overview" },
          { key: "3", label: "3", href: "#overview" },
        ]}
        nextHref="#overview"
      />
    </div>
  );
}

function DenseFormPreview() {
  const controls = Array.from({ length: 42 }, (_, index) => index + 1);
  return (
    <FormGroup className="composition-dense-form" layout="grid" title="Compact controls">
      {controls.map((control) => (
        <Field key={control} label={`Control ${control}`}>
          <Input
            defaultValue={control % 5 === 0 ? "Needs review" : ""}
            placeholder={`Value ${control}`}
          />
        </Field>
      ))}
      <div className="composition-save-bar">
        <span>42 controls · compact density stress test</span>
        <Button>Save form</Button>
      </div>
    </FormGroup>
  );
}

const blocks: Record<string, Composition> = {
  "sign-in": {
    purpose:
      "Combines the smallest authentication layout from Core building blocks, including credentials and recovery context.",
    components: authComponents,
    accessibility:
      "Fields retain visible labels, while link-styled text and submission remain intentionally inert in the preview.",
    responsive:
      "The card stays single-column, keeps 32px controls, and uses page padding rather than shrinking touch targets.",
    notes:
      "Core supplies the fields and feedback. SSO routing, account recovery policy, and workspace selection would be product logic or Pro-ready workflows.",
    code: '<Card><Field label="Email"><Input /></Field><Button>Sign in</Button></Card>',
    Preview: () => <AuthPreview kind="login" />,
  },
  "create-account": {
    purpose:
      "Tests a complete account-creation layout with identity, credentials, confirmation, and policy context.",
    components: ["Card", "Heading", "Text", "Field", "Input", "Button", "Icon"],
    accessibility:
      "Every input keeps a visible label, password confirmation remains explicit, and visual links stay non-interactive in the preview.",
    responsive:
      "Password fields share a row when space allows and stack into one column on narrow viewports.",
    notes:
      "Core covers the primitives only. Invitation systems, entitlement checks, and account provisioning remain outside this gallery.",
    code: '<Field label="Full name"><Input /></Field><Field label="Email"><Input /></Field><Field label="Password"><Input /></Field><Field label="Confirm password"><Input /></Field>',
    Preview: CreateAccountPreview,
  },
  "reset-password": {
    purpose: "Tests a compact recovery layout without adding application-owned delivery behavior.",
    components: authComponents,
    accessibility:
      "The form has one clear labelled input and a visible submit action that remains inert.",
    responsive:
      "The narrow card uses readable copy and never creates a horizontal action row on small screens.",
    notes:
      "Password policy, email delivery, and secure tokens are application concerns—not Core components.",
    code: '<Alert tone="success" title="Check your inbox" /><Field label="Email"><Input /></Field>',
    Preview: () => <AuthPreview kind="forgot" />,
  },
  "profile-settings": {
    purpose:
      "Keeps avatar upload, personal details, and profile visibility in one bounded settings card.",
    components: [
      "Card",
      "Avatar",
      "FileInput",
      "Field",
      "Input",
      "Item",
      "Textarea",
      "Switch",
      "Separator",
      "Button",
    ],
    accessibility:
      "Every editable control has a visible label, the avatar exposes the account name, and the visibility switch includes its own description.",
    responsive:
      "The photo group, fields, preference, and actions remain one readable column while the save row wraps on narrow screens.",
    notes:
      "The application still owns the settings route, persistence, navigation, and permission model.",
    code: '<Card><Item variant="outline"><ItemMedia><Avatar name="Vladimir Pavlov" src="/avatars/lucas-moreau.png" /></ItemMedia><ItemContent>...</ItemContent></Item><Field label="Profile photo"><FileInput /></Field><Field label="Display name"><Input /></Field><Field label="Bio"><Textarea /></Field><Switch label="Show profile in workspace" /><Button disabled>Save changes</Button></Card>',
    Preview: ProfileSettingsPreview,
  },
  "security-settings": {
    purpose: "Combines credential, two-factor, and session controls in one bounded settings card.",
    components: ["Card", "Item", "Button"],
    accessibility:
      "Each security control has a named action and supporting context without prescribing a sensitive confirmation pattern.",
    responsive:
      "The bounded card remains one readable column while item actions wrap without changing source order.",
    notes:
      "Authorization, reauthentication, audit history, session revocation, and sensitive confirmation policy remain product responsibilities.",
    code: "<Card><Item><ItemContent>Password</ItemContent><ItemActions><Button>Change password</Button></ItemActions></Item><Item><ItemContent>Two-factor authentication</ItemContent><ItemActions><Button>Set up</Button></ItemActions></Item><Item><ItemContent>Active sessions</ItemContent><ItemActions><Button>Review sessions</Button></ItemActions></Item></Card>",
    Preview: SecuritySettingsPreview,
  },
  "notification-preferences": {
    purpose:
      "Presents workspace activity, product update, and digest preferences in a bounded settings card.",
    components: ["Card", "FormGroup", "Item", "Switch", "Separator", "Select", "Alert", "Button"],
    accessibility:
      "Related switches use FormGroup semantics and accessible names, the digest control includes contextual help, and save feedback is announced politely.",
    responsive:
      "The bounded card stays in one readable column while item actions and the save row wrap at narrow widths.",
    notes:
      "Delivery infrastructure, consent rules, product-specific channels, and granular project subscriptions remain application policy.",
    code: '<Card><FormGroup title="Activity notifications"><Item><ItemContent>Mentions and assignments</ItemContent><ItemActions><Switch /></ItemActions></Item></FormGroup><Select label="Email digest" /></Card>',
    Preview: NotificationPreferencesPreview,
  },
  "table-toolbar": {
    purpose:
      "Demonstrates a bounded project table with status tabs, search, contextual bulk actions, row menus, selection state, and visual pagination.",
    components: [
      "Card",
      "Tabs",
      "Input",
      "Checkbox",
      "Avatar",
      "DropdownMenu",
      "Button",
      "Table",
      "Badge",
      "EmptyState",
      "Pagination",
    ],
    accessibility:
      "Status filters use tabs, search has an explicit name, select-all exposes checked and indeterminate states, table headers use column scope, and row menus remain keyboard navigable.",
    responsive:
      "Tabs and search wrap before their target size changes, while the table remains a labelled, focusable horizontal scroll region.",
    notes:
      "Saved views, filter builders, column management, and virtualized grids are intentionally Pro territory.",
    code: '<Card><Input aria-label="Search projects" /><Tabs variant="segmented">...</Tabs><Table><TableHeader><Checkbox aria-label="Select all projects" /></TableHeader>...</Table><Pagination /></Card>',
    Preview: TableToolbarPreview,
  },
  "account-summary": {
    purpose:
      "Combines identity, workspace membership, and account metadata in a bounded summary rather than a full profile page.",
    components: [
      "Card",
      "Avatar",
      "Item",
      "KeyValue",
      "Badge",
      "Button",
      "Dialog",
      "Field",
      "Input",
      "Textarea",
      "Separator",
    ],
    accessibility:
      "The profile photo has a descriptive alternative, metadata uses a definition list, status is named in text, and editing opens a labelled dialog.",
    responsive:
      "Identity and actions wrap while the account name remains first in reading order, and the metadata grid collapses to one column on narrow screens.",
    notes:
      "Activity feeds, social metrics, profile permissions, and a dashboard layout are intentionally excluded.",
    code: '<Card><Item variant="outline"><Avatar name="Vladimir Pavlov" src="/avatars/lucas-moreau.png" />...</Item><KeyValue label="Email" value="nerio@vpavlov.com" /><Dialog title="Edit account">...</Dialog></Card>',
    Preview: AccountSummaryPreview,
  },
  "file-upload-state": {
    purpose:
      "Frames queued, uploading, processing, failed, and completed files as one bounded batch operation.",
    components: ["Card", "Item", "Icon", "Spinner", "Button", "Tooltip"],
    accessibility:
      "Every file has a visible text status, progress has a file-specific accessible name, and icon-only actions name both the operation and file.",
    responsive:
      "File metadata and item actions reflow inside Item while the batch footer wraps without changing action order.",
    notes:
      "Selection, transport, retries, file persistence, and server error semantics remain application concerns.",
    code: '<Card><CardHeader>Upload files<CardAction><Button leadingIcon={Upload}>Upload</Button></CardAction></CardHeader><CardContent><ItemGroup><Item><ItemMedia><Spinner /></ItemMedia><ItemContent>design-system.zip</ItemContent><ItemActions><Tooltip label="Delete file"><Button icon={X} variant="secondary" /></Tooltip></ItemActions></Item>...</ItemGroup></CardContent><CardFooter><Button variant="secondary">Cancel</Button><Button disabled>Save</Button></CardFooter></Card>',
    Preview: FileUploadStatePreview,
  },
};

const internalFixtures: Record<keyof typeof internalBlockFixtures, Composition> = {
  "overlay-playground": {
    purpose:
      "Validates focus management, keyboard navigation, layering, scrolling, and return focus using existing Base UI-backed Core primitives.",
    components: ["Dialog", "Popover", "DropdownMenu", "Tooltip", "Button", "Checkbox"],
    accessibility:
      "Dialog traps focus and returns it on close; menus support arrow-key navigation; tooltip content is non-essential.",
    responsive:
      "Overlays size within the viewport and dialog body scrolls rather than exceeding available space.",
    notes:
      "This tests primitives in context. An app command centre or complex workflow drawer remains a future Pro composition.",
    code: '<Dialog title="Long review notes"><Popover trigger={<Button>More context</Button>}>...</Popover></Dialog>',
    Preview: OverlayPreview,
  },
  "navigation-patterns": {
    purpose:
      "Tests hierarchy between peer navigation patterns without creating a reusable documentation shell component.",
    components: ["Breadcrumbs", "Button", "Tabs", "Pagination"],
    accessibility:
      "Every navigation region has an accessible label, breadcrumbs expose an ordered path, and tabs follow their Base UI keyboard contract.",
    responsive:
      "Top links scroll or wrap as needed, local navigation remains a short list, and pagination preserves labelled controls.",
    notes:
      "This is local docs scaffolding. A production documentation shell, TOC system, and global search pattern are Pro-level products.",
    code: '<Breadcrumbs items={items} />\n<Tabs defaultValue="overview"><TabsList aria-label="Local sections"><TabsTrigger value="overview">Overview</TabsTrigger><TabsIndicator /></TabsList><TabsPanels><TabsContent value="overview">...</TabsContent></TabsPanels></Tabs>\n<Pagination pages={pages} />',
    Preview: NavigationPreview,
  },
  "dense-form": {
    purpose: "Intentionally pushes Core field rhythm before a real enterprise workflow is built.",
    components: ["Field", "Input", "Button"],
    accessibility:
      "Every control has a visible programmatic label and follows source-order tab navigation through the full form.",
    responsive:
      "The compact grid progressively reduces columns to keep controls readable and preserve touch targets.",
    notes:
      "This validates density tokens, not a reusable enterprise form framework. Conditional logic and advanced validation flows would be product or Pro work.",
    code: "{Array.from({ length: 42 }, (_, index) => <Field label={`Control ${index + 1}`}><Input /></Field>)}",
    Preview: DenseFormPreview,
  },
  feedback: {
    purpose:
      "Exercises the complete feedback family without presenting it as one copyable product task.",
    components: ["Alert", "Toast", "Progress", "Skeleton", "Spinner", "Button"],
    accessibility:
      "Critical feedback uses text, progress has a name, and managed toasts preserve status and dismissal semantics.",
    responsive:
      "The fixture stacks vertically and preserves reading order while the Toast viewport remains independent.",
    notes: "This is deterministic component-family regression evidence, not a public Block.",
    code: '<Alert />\n<Progress aria-label="Upload progress" />\n<ToastViewport />',
    Preview: FeedbackPreview,
  },
};

function preventBlockPreviewAction(event: React.SyntheticEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const action = target.closest("a, button");
  if (
    !action ||
    action.closest('[data-preview-interaction="allowed"]') ||
    action.closest('[role="dialog"]')
  ) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
}

export function BlockPreview({ slug }: { slug: string }) {
  const block = blocks[slug];
  if (!block) return null;
  const { Preview } = block;
  return (
    <main className="block-view">
      <Button
        className="block-view__back"
        leadingIcon={ArrowLeft}
        nativeButton={false}
        render={<Link href="/blocks" />}
        size="sm"
        variant="secondary"
      >
        Back to Blocks
      </Button>
      <div
        className="block-view__content"
        data-preview-interactions="disabled"
        onAuxClickCapture={preventBlockPreviewAction}
        onClickCapture={preventBlockPreviewAction}
        onSubmitCapture={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <Preview />
      </div>
    </main>
  );
}

export function InternalBlockFixture({ slug }: { slug: keyof typeof internalBlockFixtures }) {
  const fixture = internalFixtures[slug];
  const metadata = internalBlockFixtures[slug];
  if (!fixture || !metadata) return null;
  const { Preview } = fixture;
  return (
    <main className="block-view block-view--internal">
      <header>
        <p className="doc-kicker">Internal deterministic fixture</p>
        <h1>{metadata.title}</h1>
        <p>{metadata.description}</p>
      </header>
      <div className="composition-preview">
        <Preview />
      </div>
    </main>
  );
}
