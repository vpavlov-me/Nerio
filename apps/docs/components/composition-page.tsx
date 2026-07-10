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
  Field,
  FormGroup,
  Heading,
  Input,
  KeyValue,
  Link,
  List,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Stat,
  Switch,
  Tabs,
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
} from "@nerio/ui/client";
import { CodeExample } from "./code-example";

type Composition = {
  title: string;
  lede: string;
  purpose: string;
  components: string[];
  accessibility: string;
  responsive: string;
  notes: string;
  code: string;
  Preview: React.ComponentType;
};

const authComponents = ["Card", "Field", "Input", "Button", "Link", "Alert"];

function AuthPreview({ kind }: { kind: "login" | "register" | "forgot" }) {
  const [submitted, setSubmitted] = React.useState(false);
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
        {submitted && !invalid ? (
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
          }}
        >
          {kind === "register" ? (
            <Field label="Full name">
              <Input placeholder="Alex Morgan" />
            </Field>
          ) : null}
          <Field
            label="Email"
            invalid={invalid}
            message={invalid ? "Enter a valid email address." : undefined}
          >
            <Input
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              placeholder="you@company.com"
            />
          </Field>
          {kind !== "forgot" ? (
            <Field label="Password">
              <Input type="password" placeholder="At least 8 characters" />
            </Field>
          ) : null}
          <Button loading={submitted && !invalid}>{copy.action}</Button>
          {kind === "login" ? (
            <Link href="/docs/blocks/forgot-password">Forgot your password?</Link>
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

function SettingsPreview() {
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
      <Separator />
      <section>
        <h3>Preferences</h3>
        <FormGroup title="Notifications" description="Choose how updates reach you.">
          <label className="composition-choice">
            <Checkbox defaultChecked /> Product updates
          </label>
          <label className="composition-choice">
            <Checkbox /> Weekly digest
          </label>
        </FormGroup>
        <RadioGroup
          label="Default view"
          defaultValue="board"
          options={[
            { label: "Board", value: "board" },
            { label: "List", value: "list" },
          ]}
        />
        <Select
          label="Time zone"
          defaultValue="utc"
          options={[
            { label: "UTC", value: "utc" },
            { label: "Tbilisi", value: "tbilisi" },
          ]}
        />
      </section>
      <Separator />
      <section>
        <h3>Security</h3>
        <label className="composition-switch">
          <span>
            Require two-factor authentication<small>Applies to every member.</small>
          </span>
          <Switch aria-label="Require two-factor authentication" />
        </label>
      </section>
      <section className="composition-danger">
        <h3>Danger zone</h3>
        <p>Deleting a workspace cannot be undone.</p>
        <Dialog
          trigger={<Button variant="danger">Delete workspace</Button>}
          title="Delete workspace"
          description="This permanently removes all workspace data."
        >
          <p>Type the workspace name in a real product before enabling this action.</p>
          <Button variant="danger">Delete workspace</Button>
        </Dialog>
      </section>
      <div className="composition-save-bar">
        <span>{saved ? "Changes saved." : "Unsaved changes"}</span>
        <Button type="submit" loading={false}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function TableToolbarPreview() {
  const [query, setQuery] = React.useState("");
  const rows = ["Aster", "Canvas", "Luma"].filter((row) =>
    row.toLowerCase().includes(query.toLowerCase()),
  );
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
      <div className="composition-bulk">
        <span>{rows.length} selected</span>
        <Button size="sm" variant="ghost">
          Archive
        </Button>
        <Button size="sm" variant="ghost">
          Assign owner
        </Button>
      </div>
      {rows.length ? (
        <TableContainer label="Projects">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row}>
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
        <EmptyState
          title="No projects found"
          description="Try another search term or clear the filter."
          action={
            <Button variant="secondary" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        />
      )}
      <Pagination
        pages={[
          { label: "1", href: "#projects", current: true },
          { label: "2", href: "#projects" },
        ]}
        nextHref="#projects"
      />
    </div>
  );
}

function ProfilePreview() {
  return (
    <div className="composition-profile">
      <Card>
        <CardContent>
          <div className="composition-profile-head">
            <Avatar name="Alex Morgan" />
            <div>
              <h3>Alex Morgan</h3>
              <p>Product designer · Northstar</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="composition-stat-grid">
            <Stat label="Projects" value="12" />
            <Stat label="Followers" value="248" />
          </div>
          <dl className="composition-key-values">
            <KeyValue label="Location" value="Tbilisi, GE" />
            <KeyValue label="Member since" value="May 2024" />
          </dl>
          <div className="composition-actions">
            <Button>Edit profile</Button>
            <Dialog
              trigger={<Button variant="secondary">Message</Button>}
              title="Message Alex"
              description="Start a focused conversation."
            >
              <Field label="Message">
                <Textarea placeholder="Write a message" />
              </Field>
              <Button>Send message</Button>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <section>
        <h3>Recent activity</h3>
        <List
          items={[
            {
              title: "Updated the design brief",
              description: "Today at 10:42",
              meta: <Badge>Design</Badge>,
            },
            {
              title: "Joined the research project",
              description: "Yesterday",
              meta: <Badge variant="info">Team</Badge>,
            },
          ]}
        />
      </section>
    </div>
  );
}

function EmptyStatesPreview() {
  const states: Array<[string, string]> = [
    ["No data", "Create the first record to begin."],
    ["No search results", "Try a broader search term."],
    ["No notifications", "You are all caught up."],
    ["No projects", "Start a project for your team."],
    ["Offline", "Reconnect to update this view."],
    ["Permission denied", "Ask an owner for access."],
  ];
  return (
    <div className="composition-empty-grid">
      {states.map(([title, description]) => (
        <EmptyState
          key={title}
          title={title}
          description={description}
          action={<Button size="sm">Primary action</Button>}
          secondaryAction={
            <Button size="sm" variant="ghost">
              Learn more
            </Button>
          }
        />
      ))}
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
          <Spinner aria-label="Uploading" />
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
          { label: "Blocks", href: "/docs/blocks/login" },
          { label: "Navigation patterns" },
        ]}
      />
      <nav aria-label="Composition sections" className="composition-top-nav">
        <Link href="#overview">Overview</Link>
        <Link href="#live-preview">Preview</Link>
        <Link href="#notes">Notes</Link>
      </nav>
      <Tabs
        tabs={[
          {
            label: "Overview",
            value: "overview",
            content: <p>Use tabs for peer sections, not application navigation.</p>,
          },
          {
            label: "Activity",
            value: "activity",
            content: <p>Activity is a small, related view.</p>,
          },
        ]}
      />
      <div className="composition-sidebar-preview">
        <nav aria-label="Section navigation">
          <Link href="#overview">Overview</Link>
          <Link href="#components-used">Components used</Link>
          <Link href="#accessibility">Accessibility</Link>
        </nav>
        <p>Local sidebar composition, not a reusable sidebar product component.</p>
      </div>
      <Pagination
        pages={[
          { label: "1", href: "#overview", current: true },
          { label: "2", href: "#overview" },
          { label: "3", href: "#overview" },
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

const compositions: Record<string, Composition> = {
  login: {
    title: "Login",
    lede: "A compact authentication composition that tests form hierarchy without becoming a product screen.",
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
  register: {
    title: "Register",
    lede: "A registration composition that checks multi-field rhythm, inline help, and success feedback.",
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
  "forgot-password": {
    title: "Forgot password",
    lede: "A recovery composition for testing a focused, success-oriented single-field form.",
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
  "settings-form": {
    title: "Settings form",
    lede: "A large, sectioned form that exercises Core choices, help text, destructive confirmation, and a save bar.",
    purpose:
      "Stress-tests long-form hierarchy and the distinction between immediate settings and saved fields.",
    components: [
      "Field",
      "FormGroup",
      "Checkbox",
      "RadioGroup",
      "Select",
      "Textarea",
      "Switch",
      "Dialog",
      "Button",
      "Alert",
    ],
    accessibility:
      "FormGroup uses fieldset semantics, every switch has an accessible name, and destructive action opens a labelled dialog.",
    responsive:
      "Sections collapse naturally to one column; the save bar wraps instead of compressing controls.",
    notes:
      "This is a documentation-local composition. A reusable settings layout, permissions model, or billing workflow would be Pro.",
    code: '<FormGroup title="Notifications"><Checkbox /><Checkbox /></FormGroup>\n<Dialog title="Delete workspace">...</Dialog>',
    Preview: SettingsPreview,
  },
  "table-toolbar": {
    title: "Table toolbar",
    lede: "A basic table workflow with search, a small filter menu, selected-row actions, pagination, and an empty result.",
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
  "user-profile": {
    title: "User profile",
    lede: "A composed profile view that pairs identity, lightweight metrics, metadata, activity, and a focused dialog action.",
    purpose:
      "Checks whether display primitives form a calm profile without implying a dashboard system.",
    components: ["Card", "Avatar", "Stat", "KeyValue", "List", "Badge", "Button", "Dialog"],
    accessibility:
      "Avatar text fallback is derived from the person’s name; metadata uses a definition list and the dialog provides a labelled interaction.",
    responsive:
      "Statistics move into a single column and actions wrap while profile identity stays visually first.",
    notes:
      "A complete activity feed, profile permissions, or dashboard layout would be a Pro product pattern.",
    code: '<Avatar name="Alex Morgan" />\n<Stat label="Projects" value="12" />\n<KeyValue label="Location" value="Tbilisi, GE" />',
    Preview: ProfilePreview,
  },
  "empty-states": {
    title: "Empty states",
    lede: "Six realistic absence states that test concise explanation, clear actions, and neutral visual hierarchy.",
    purpose:
      "Compares repeated EmptyState compositions across expected, filtered, offline, and permission-limited situations.",
    components: ["EmptyState", "Button"],
    accessibility:
      "Each state is structured with an explicit heading and descriptive text; the decorative mark remains hidden from assistive technology.",
    responsive:
      "Cards remain usable in a single column and action pairs wrap without reducing tap targets.",
    notes:
      "Product-specific illustrations, recovery flows, and permission requests belong to the app or a future Pro template—not Core.",
    code: '<EmptyState title="No projects" description="Start a project for your team." action={<Button>Create project</Button>} />',
    Preview: EmptyStatesPreview,
  },
  feedback: {
    title: "Feedback",
    lede: "A shared feedback surface for inline outcomes, progress, loading placeholders, a spinner, and a toast.",
    purpose: "Tests how persistent and temporary feedback coexist without competing for attention.",
    components: ["Alert", "Toast", "Progress", "Skeleton", "Spinner", "Button"],
    accessibility:
      "Critical inline feedback uses clear text; progress has a name; managed toasts include a dismiss action and status semantics.",
    responsive:
      "Feedback stacks vertically and preserves reading order; transient toast placement remains independent from the content column.",
    notes:
      "Core owns feedback primitives. Cross-product notification centres and workflow orchestration remain out of scope.",
    code: '<Alert tone="success" title="Changes saved" />\n<Progress value={64} />\n<ToastViewport />',
    Preview: FeedbackPreview,
  },
  "overlay-playground": {
    title: "Overlay playground",
    lede: "A focused stress test for modal, contextual, and menu overlays—including a nested overlay and long content.",
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
    title: "Navigation patterns",
    lede: "A small documentation-oriented composition of breadcrumbs, top links, tabs, a local sidebar, and pagination.",
    purpose:
      "Tests hierarchy between peer navigation patterns without creating a reusable documentation shell component.",
    components: ["Breadcrumbs", "Link", "Tabs", "Pagination"],
    accessibility:
      "Every navigation region has an accessible label, breadcrumbs expose an ordered path, and tabs follow their Base UI keyboard contract.",
    responsive:
      "Top links scroll or wrap as needed, local navigation remains a short list, and pagination preserves labelled controls.",
    notes:
      "This is local docs scaffolding. A production documentation shell, TOC system, and global search pattern are Pro-level products.",
    code: "<Breadcrumbs items={items} />\n<Tabs tabs={tabs} />\n<Pagination pages={pages} />",
    Preview: NavigationPreview,
  },
  "dense-form": {
    title: "Dense form",
    lede: "A 42-control stress test for compact spacing, labels, focus order, and responsive readability.",
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
};

export function CompositionPage({ slug }: { slug: string }) {
  const composition = compositions[slug];
  if (!composition) return null;
  const { Preview } = composition;
  return (
    <article className="doc-page composition-page">
      <header>
        <p className="doc-kicker">Composition Gallery</p>
        <h1>{composition.title}</h1>
        <p className="doc-lede">{composition.lede}</p>
      </header>
      <section className="doc-section">
        <h2 id="overview">Overview</h2>
        <p>{composition.purpose}</p>
      </section>
      <section className="doc-section">
        <h2 id="live-preview">Live Preview</h2>
        <div className="composition-preview">
          <Preview />
        </div>
      </section>
      <section className="doc-section">
        <h2 id="code">Code</h2>
        <CodeExample code={composition.code} label={`${composition.title} composition`} />
      </section>
      <section className="doc-section">
        <h2 id="components-used">Components Used</h2>
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
        <h2 id="notes">Notes</h2>
        <p>{composition.notes}</p>
      </section>
    </article>
  );
}
