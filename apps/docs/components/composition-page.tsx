"use client";

import * as React from "react";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DropdownMenu,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  FormGroup,
  Heading,
  Input,
  KeyValue,
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
import { CodeExample } from "./code-example";
import { getBlock, internalBlockFixtures } from "../features/blocks/catalog";

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

function AuthPreview({ kind }: { kind: "login" | "register" | "forgot" }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const invalid = submitted && !email.includes("@");
  const copy = {
    login: { title: "Welcome back", action: "Sign in", description: "Use your workspace email." },
    register: {
      title: "Create your account",
      action: "Create account",
      description: "Start with a secure workspace.",
    },
    forgot: {
      title: "Reset your password",
      action: "Send reset link",
      description: "We will email a recovery link.",
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
          {kind === "register" ? (
            <Field label="Full name">
              <Input autoComplete="name" placeholder="Alex Morgan" />
            </Field>
          ) : null}
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
              placeholder="you@company.com"
            />
          </Field>
          {kind !== "forgot" ? (
            <Field label="Password">
              <Input
                autoComplete={kind === "login" ? "current-password" : "new-password"}
                type="password"
                placeholder="At least 8 characters"
              />
            </Field>
          ) : null}
          <Button loading={busy}>{copy.action}</Button>
          {kind === "login" ? (
            <Button
              nativeButton={false}
              render={<a href="/blocks/reset-password" />}
              variant="link"
            >
              Forgot your password?
            </Button>
          ) : null}
          {kind === "register" ? (
            <Alert tone="info" title="Email verification">
              Use a work email to create a workspace.
            </Alert>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

function ProfileSettingsPreview() {
  const [saved, setSaved] = React.useState(false);
  return (
    <form
      className="composition-settings"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <section>
        <h3>Profile</h3>
        <Field label="Workspace name" description="Shown in shared areas.">
          <Input defaultValue="Northstar" />
        </Field>
        <Field label="About this workspace">
          <Textarea defaultValue="A focused product team." />
        </Field>
      </section>
      {saved ? (
        <Alert role="status" tone="success" title="Profile saved">
          Workspace details are up to date.
        </Alert>
      ) : null}
      <div className="composition-save-bar">
        <span>{saved ? "Changes saved." : "Unsaved changes"}</span>
        <Button type="submit" loading={false}>
          Save profile
        </Button>
      </div>
    </form>
  );
}

function NotificationPreferencesPreview() {
  const [saved, setSaved] = React.useState(false);
  return (
    <form
      className="composition-settings"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <section>
        <h3>Notification preferences</h3>
        <p>Choose which workspace updates should reach your inbox.</p>
        <FormGroup
          title="Email notifications"
          description="Select every update you want to receive."
        >
          <label className="composition-choice">
            <Checkbox defaultChecked /> Mentions and assignments
          </label>
          <label className="composition-choice">
            <Checkbox defaultChecked /> Project status changes
          </label>
          <label className="composition-choice">
            <Checkbox /> Product announcements
          </label>
        </FormGroup>
        <Select
          label="Digest frequency"
          defaultValue="weekly"
          options={[
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Never", value: "never" },
          ]}
        />
      </section>
      {saved ? (
        <Alert role="status" tone="success" title="Preferences saved">
          Future workspace updates will use these choices.
        </Alert>
      ) : null}
      <div className="composition-save-bar">
        <span>{saved ? "Up to date" : "Review your notification choices"}</span>
        <Button type="submit">Save preferences</Button>
      </div>
    </form>
  );
}

function SecuritySettingsPreview() {
  return (
    <div className="composition-settings">
      <section>
        <h3>Account security</h3>
        <label className="composition-switch">
          <span>
            Require two-factor authentication
            <small>Add a second verification step when signing in.</small>
          </span>
          <Switch aria-label="Require two-factor authentication" />
        </label>
      </section>
      <Separator />
      <section className="composition-danger">
        <h3>Delete account</h3>
        <p>Permanently remove this account and its personal data.</p>
        <Dialog
          trigger={<Button variant="danger">Delete account</Button>}
          title="Delete account"
          description="This action cannot be undone."
        >
          <Field label="Type DELETE to confirm">
            <Input autoComplete="off" />
          </Field>
          <Button variant="danger">Delete account</Button>
        </Dialog>
      </section>
    </div>
  );
}

function TableToolbarPreview() {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const rows = ["Aster", "Canvas", "Luma"].filter((row) =>
    row.toLowerCase().includes(query.toLowerCase()),
  );
  const visibleSelected = rows.filter((row) => selected.includes(row));
  return (
    <div className="composition-table">
      <div className="composition-toolbar">
        <div>
          <h3>Projects</h3>
          <p>Simple scanning and lightweight actions.</p>
        </div>
        <Input
          aria-label="Search projects"
          placeholder="Search projects"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <DropdownMenu
          trigger={<Button variant="secondary">Status filter</Button>}
          items={[{ label: "All projects" }, { label: "Active" }, { label: "Archived" }]}
        />
      </div>
      {visibleSelected.length ? (
        <div className="composition-bulk" role="status">
          <span>{visibleSelected.length} selected</span>
          <Button size="sm" variant="ghost">
            Archive
          </Button>
          <Button size="sm" variant="ghost">
            Assign owner
          </Button>
        </div>
      ) : null}
      {rows.length ? (
        <TableContainer aria-label="Projects">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="sr-only">Select</span>
                </TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row}>
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${row}`}
                      checked={selected.includes(row)}
                      onCheckedChange={(checked) =>
                        setSelected((current) =>
                          checked ? [...current, row] : current.filter((item) => item !== row),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{row}</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                  <TableCell>Alex Morgan</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyState role="status" size="sm">
          <EmptyStateHeader>
            <EmptyStateTitle>No projects found</EmptyStateTitle>
            <EmptyStateDescription>
              Try another search term or clear the filter.
            </EmptyStateDescription>
          </EmptyStateHeader>
          <EmptyStateActions>
            <Button variant="secondary" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </EmptyStateActions>
        </EmptyState>
      )}
      <Pagination
        pages={[
          { key: "1", label: "1", href: "#projects", current: true },
          { key: "2", label: "2", href: "#projects" },
        ]}
        nextHref="#projects"
      />
    </div>
  );
}

function AccountSummaryPreview() {
  return (
    <Card className="composition-profile">
      <CardContent>
        <div className="composition-profile-head">
          <Avatar name="Alex Morgan" />
          <div>
            <h3>Alex Morgan</h3>
            <p>Product designer · Northstar</p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
        <dl className="composition-key-values">
          <KeyValue label="Email" value="alex@northstar.example" />
          <KeyValue label="Location" value="Tbilisi, Georgia" />
          <KeyValue label="Member since" value="May 2024" />
        </dl>
        <div className="composition-actions">
          <Dialog
            trigger={<Button>Edit account</Button>}
            title="Edit account"
            description="Update the public account details shown to collaborators."
          >
            <Field label="About">
              <Textarea defaultValue="Product designer at Northstar." />
            </Field>
            <Button>Save changes</Button>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyProjectPreview() {
  return (
    <EmptyState size="sm">
      <EmptyStateHeader>
        <EmptyStateTitle>Create your first project</EmptyStateTitle>
        <EmptyStateDescription>
          Organize a delivery goal, invite collaborators, and keep progress visible in one place.
        </EmptyStateDescription>
      </EmptyStateHeader>
      <EmptyStateActions>
        <Button size="sm">Create project</Button>
        <Button
          nativeButton={false}
          size="sm"
          variant="ghost"
          render={<a href="/templates/operations-workspace" />}
        >
          See a project workspace
        </Button>
      </EmptyStateActions>
    </EmptyState>
  );
}

type UploadState = "uploading" | "complete" | "failed" | "cancelled";

function FileUploadStatePreview() {
  const [state, setState] = React.useState<UploadState>("uploading");
  const progress = state === "complete" ? 100 : state === "uploading" ? 64 : 0;
  return (
    <div className="composition-feedback">
      <div>
        <div className="composition-inline-status">
          <span>
            <strong>research-notes.pdf</strong>
            <small>{state === "uploading" ? "4.8 MB of 7.5 MB" : "7.5 MB"}</small>
          </span>
          {state === "uploading" ? <Spinner label="Uploading research-notes.pdf" /> : null}
        </div>
        {state === "uploading" || state === "complete" ? (
          <Progress value={progress} aria-label="File upload progress" />
        ) : null}
      </div>
      {state === "complete" ? (
        <Alert role="status" tone="success" title="Upload complete">
          research-notes.pdf is ready to use.
        </Alert>
      ) : null}
      {state === "failed" ? (
        <Alert role="alert" tone="danger" title="Upload failed">
          The connection was interrupted. Retry when you are ready.
        </Alert>
      ) : null}
      {state === "cancelled" ? (
        <Alert role="status" title="Upload cancelled">
          The file was not added to this project.
        </Alert>
      ) : null}
      <div className="composition-actions">
        {state === "uploading" ? (
          <>
            <Button variant="secondary" onClick={() => setState("complete")}>
              Complete upload
            </Button>
            <Button variant="ghost" onClick={() => setState("cancelled")}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => setState("uploading")}>
            {state === "failed" ? "Retry upload" : "Upload again"}
          </Button>
        )}
        <Button variant="ghost" onClick={() => setState("failed")}>
          Show failure
        </Button>
      </div>
    </div>
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
      "Combines the smallest authentication flow from Core building blocks, including validation, loading, and recovery navigation.",
    components: authComponents,
    accessibility:
      "Fields retain visible labels and error messages; native form submission supports Enter and the link remains a separate navigation target.",
    responsive:
      "The card stays single-column, keeps 32px controls, and uses page padding rather than shrinking touch targets.",
    notes:
      "Core supplies the fields and feedback. SSO routing, account recovery policy, and workspace selection would be product logic or Pro-ready workflows.",
    code: '<Card><Field label="Email"><Input /></Field><Button>Sign in</Button></Card>',
    Preview: () => <AuthPreview kind="login" />,
  },
  "create-account": {
    purpose:
      "Tests the relationship between a small account form, validation, and explanatory feedback.",
    components: authComponents,
    accessibility:
      "Each input is labelled through Field and inline feedback is associated with its control.",
    responsive:
      "The form remains one column on narrow widths so labels and validation copy stay readable.",
    notes:
      "Core covers the primitives only. Invitation systems, entitlement checks, and account provisioning remain outside this gallery.",
    code: '<Field label="Full name"><Input /></Field><Field label="Email"><Input /></Field>',
    Preview: () => <AuthPreview kind="register" />,
  },
  "reset-password": {
    purpose:
      "Validates how feedback changes a compact recovery action without changing page structure.",
    components: authComponents,
    accessibility:
      "The success state is announced inline and the form has one clear labelled input and submit action.",
    responsive:
      "The narrow card uses readable copy and never creates a horizontal action row on small screens.",
    notes:
      "Password policy, email delivery, and secure tokens are application concerns—not Core components.",
    code: '<Alert tone="success" title="Check your inbox" /><Field label="Email"><Input /></Field>',
    Preview: () => <AuthPreview kind="forgot" />,
  },
  "profile-settings": {
    purpose:
      "Keeps profile editing to one recognizable task rather than presenting a complete settings page.",
    components: ["Field", "Input", "Textarea", "Button", "Alert"],
    accessibility:
      "Every control has a visible label, native form submission supports Enter, and saved feedback uses a status message.",
    responsive:
      "The fields remain one column and the save row wraps instead of compressing its action.",
    notes:
      "The application still owns the settings route, persistence, navigation, and permission model.",
    code: '<form><Field label="Workspace name"><Input /></Field><Field label="About"><Textarea /></Field><Button type="submit">Save profile</Button></form>',
    Preview: ProfileSettingsPreview,
  },
  "security-settings": {
    purpose:
      "Pairs one immediate security preference with an appropriately separated destructive confirmation.",
    components: ["Switch", "Separator", "Dialog", "Field", "Input", "Button"],
    accessibility:
      "The switch has an explicit accessible name and deletion opens a labelled modal with focus restoration.",
    responsive:
      "The setting row and destructive action wrap without changing source order or shrinking controls.",
    notes:
      "Authorization, reauthentication, audit history, and deletion policy remain product responsibilities.",
    code: '<Switch aria-label="Require two-factor authentication" />\n<Dialog title="Delete account">...</Dialog>',
    Preview: SecuritySettingsPreview,
  },
  "notification-preferences": {
    purpose:
      "Collects a small set of related notification choices without becoming a product-wide preferences system.",
    components: ["FormGroup", "Checkbox", "Select", "Alert", "Button"],
    accessibility:
      "Related checkboxes use FormGroup semantics, the frequency control has a label, and save feedback is announced politely.",
    responsive:
      "Choices stay in a readable vertical sequence and the save row wraps at narrow widths.",
    notes:
      "Consent rules, delivery infrastructure, and available channels remain application policy.",
    code: '<FormGroup title="Email notifications"><Checkbox />...</FormGroup>\n<Select label="Digest frequency" />',
    Preview: NotificationPreferencesPreview,
  },
  "table-toolbar": {
    purpose:
      "Tests table density and simple operational actions while deliberately stopping before advanced data-grid features.",
    components: ["Input", "DropdownMenu", "Button", "Table", "Badge", "EmptyState", "Pagination"],
    accessibility:
      "Search has an explicit accessible name, table headers use column scope, and the menu remains keyboard navigable.",
    responsive:
      "Toolbar controls wrap before their target size changes; the basic table remains a scrollable data surface when necessary.",
    notes:
      "Saved views, filter builders, column management, and virtualized grids are intentionally Pro territory.",
    code: '<Input aria-label="Search projects" />\n<DropdownMenu items={filters} />\n<Table>...</Table>',
    Preview: TableToolbarPreview,
  },
  "account-summary": {
    purpose:
      "Combines identity and account metadata in a bounded summary rather than a full profile page.",
    components: ["Card", "Avatar", "KeyValue", "Badge", "Button", "Dialog", "Field", "Textarea"],
    accessibility:
      "Avatar fallback is derived from the person’s name, metadata uses a definition list, and editing opens a labelled dialog.",
    responsive: "Identity and actions wrap while the account name remains first in reading order.",
    notes:
      "Activity feeds, social metrics, profile permissions, and a dashboard layout are intentionally excluded.",
    code: '<Avatar name="Alex Morgan" />\n<KeyValue label="Email" value="alex@northstar.example" />\n<Dialog title="Edit account">...</Dialog>',
    Preview: AccountSummaryPreview,
  },
  "empty-project": {
    purpose:
      "Gives a genuinely empty collection one clear creation path and restrained supporting context.",
    components: ["EmptyState", "Button"],
    accessibility:
      "The state has an explicit heading, descriptive text, a primary action, and a separate navigation link.",
    responsive: "Actions wrap without reducing target size or changing their reading order.",
    notes:
      "Search, permission, offline, and failure cases need separate product-specific recovery language.",
    code: "<EmptyState><EmptyStateHeader><EmptyStateTitle>Create your first project</EmptyStateTitle></EmptyStateHeader><EmptyStateActions><Button>Create project</Button></EmptyStateActions></EmptyState>",
    Preview: EmptyProjectPreview,
  },
  "file-upload-state": {
    purpose: "Frames progress and outcome feedback around one recognizable file-upload operation.",
    components: ["Alert", "Progress", "Spinner", "Button"],
    accessibility:
      "Progress has a file-specific accessible name, failure is urgent, routine outcomes are polite, and every transition has text.",
    responsive: "Status, progress, and actions stack and wrap while preserving reading order.",
    notes:
      "File selection, transfer, retry policy, persistence, and server errors remain application responsibilities.",
    code: '<Progress aria-label="File upload progress" value={64} />\n<Alert tone="success" title="Upload complete" />',
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

export function BlockPreview({ slug }: { slug: string }) {
  const block = blocks[slug];
  if (!block) return null;
  const { Preview } = block;
  return (
    <main className="block-view">
      <div className="composition-preview">
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

export function BlockDetail({ slug }: { slug: string }) {
  const composition = blocks[slug];
  const block = getBlock(slug);
  if (!composition || !block) return null;
  return (
    <article className="doc-page composition-page">
      <header>
        <p className="doc-kicker">
          {block.category} · {block.status}
        </p>
        <h1>{block.title}</h1>
        <p className="doc-lede">{block.description}</p>
      </header>
      <section className="doc-section">
        <h2 id="overview">Overview</h2>
        <p>{composition.purpose}</p>
      </section>
      <section className="doc-section">
        <h2 id="live-preview">Live Preview</h2>
        <iframe
          className="block-preview-frame"
          src={block.previewRoute}
          title={`${block.title} preview`}
        />
      </section>
      <section className="doc-section">
        <h2 id="intended-use">Intended Use</h2>
        <p>{block.intendedUse}</p>
      </section>
      <section className="doc-section">
        <h2 id="code">Code</h2>
        <CodeExample code={composition.code} label={`${block.title} block`} />
      </section>
      <section className="doc-section">
        <h2 id="anatomy">Anatomy</h2>
        <p>This Block composes the following Nerio Core parts with block-local layout.</p>
        <div className="token-chip-row">
          {composition.components.map((component) => (
            <code key={component}>{component}</code>
          ))}
        </div>
      </section>
      <section className="doc-section">
        <h2 id="accessibility">Accessibility</h2>
        <p>{composition.accessibility}</p>
      </section>
      <section className="doc-section">
        <h2 id="responsive-behaviour">Responsive Behaviour</h2>
        <p>{composition.responsive}</p>
      </section>
      <section className="doc-section">
        <h2 id="boundaries">Boundaries</h2>
        <p>{composition.notes}</p>
        <ul>
          {block.boundaries.map((boundary) => (
            <li key={boundary}>{boundary}</li>
          ))}
        </ul>
      </section>
      <section className="doc-section">
        <h2 id="related-surfaces">Related Surfaces</h2>
        <ul>
          {block.relatedBlocks.map((relatedSlug) => {
            const related = getBlock(relatedSlug);
            return related ? (
              <li key={related.slug}>
                <a href={related.detailRoute}>{related.title} Block</a>
              </li>
            ) : null;
          })}
          {block.relatedTemplates.map((templateSlug) => (
            <li key={templateSlug}>
              <a href={`/templates/${templateSlug}`}>
                {templateSlug
                  .split("-")
                  .map((word) => word[0]?.toUpperCase() + word.slice(1))
                  .join(" ")}{" "}
                Template
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
