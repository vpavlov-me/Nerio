"use client";

import * as React from "react";
import { densities, modes } from "@nerio-ui/tokens";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FileText,
  ListTree,
  MessageCircle,
  PanelLeft,
  Plus,
  Settings,
  Sparkles,
  Wrench,
  X,
} from "@nerio-ui/adapters/icons";
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, Textarea } from "@nerio-ui/ui";
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  DialogFooter,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  Input,
  Progress,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Skeleton,
  ToastProvider,
  ToastViewport,
  Tooltip,
  useToastManager,
} from "@nerio-ui/ui/client";
import {
  defaultAppearance,
  persistAppearanceAxis,
  readAppearanceFromRoot,
  type Appearance,
} from "../../../lib/appearance";
import styles from "./view.module.css";

type Section = "research" | "threads" | "sources" | "settings";
type RunState = "idle" | "running" | "completed" | "interrupted" | "failed";
type AttachmentStatus = "Processing" | "Ready" | "Failed";

type Source = {
  id: string;
  title: string;
  publisher: string;
  excerpt: string;
  relevance: string;
  type: "Report" | "Interview" | "Documentation";
};

const sources: readonly Source[] = [
  {
    id: "retention-report",
    title: "Retention patterns in collaborative tools",
    publisher: "Northstar Research",
    excerpt:
      "Teams that reach a shared artifact in the first session retain more reliably than teams that begin with configuration.",
    relevance: "Supports the activation sequence and first-session recommendation.",
    type: "Report",
  },
  {
    id: "onboarding-interviews",
    title: "Eight onboarding interviews",
    publisher: "Research archive",
    excerpt:
      "Participants consistently described the empty workspace as the moment where they were least certain what to do next.",
    relevance: "Direct qualitative evidence for guided workspace creation.",
    type: "Interview",
  },
  {
    id: "event-model",
    title: "Workspace event model",
    publisher: "Developer portal",
    excerpt:
      "A workspace_created event is emitted after the first persistent artifact and can anchor the activation funnel.",
    relevance: "Defines a measurable activation event and implementation boundary.",
    type: "Documentation",
  },
] as const;

const savedThreads = [
  {
    id: "activation",
    title: "Activation opportunity brief",
    detail: "3 sources · Updated 8 minutes ago",
    status: "Active",
  },
  {
    id: "competitive",
    title: "Competitive workflow scan",
    detail: "6 sources · Yesterday",
    status: "Complete",
  },
  {
    id: "interviews",
    title: "Interview synthesis",
    detail: "8 transcripts · Jul 22",
    status: "Complete",
  },
  {
    id: "measurement",
    title: "Activation measurement plan",
    detail: "2 sources · Jul 20",
    status: "Draft",
  },
] as const;

const navItems = [
  ["research", "Research", MessageCircle],
  ["threads", "Saved threads", ListTree],
  ["sources", "Sources", BookOpen],
  ["settings", "Settings", Settings],
] as const;

function subscribeToMobileViewport(callback: () => void) {
  const media = window.matchMedia("(max-width: 920px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMobileViewport() {
  return React.useSyncExternalStore(
    subscribeToMobileViewport,
    () => window.matchMedia("(max-width: 920px)").matches,
    () => false,
  );
}

function ResearchNavigation({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (section: Section) => void;
}) {
  return (
    <nav className={styles.navigation} aria-label="AI research workspace">
      {navItems.map(([value, label, icon]) => (
        <Button
          key={value}
          className={styles["navigation-item"]}
          leadingIcon={icon}
          variant="ghost"
          data-state={active === value ? "active" : undefined}
          aria-current={active === value ? "page" : undefined}
          onClick={() => onSelect(value)}
        >
          {label}
        </Button>
      ))}
    </nav>
  );
}

function ResearchWorkspaceApp() {
  const isMobile = useMobileViewport();
  const toasts = useToastManager();
  const [section, setSection] = React.useState<Section>("research");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [promptError, setPromptError] = React.useState("");
  const [runState, setRunState] = React.useState<RunState>("idle");
  const [sourceId, setSourceId] = React.useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = React.useState(false);
  const [threadQuery, setThreadQuery] = React.useState("");
  const [attachments, setAttachments] = React.useState<
    { id: string; name: string; status: AttachmentStatus }[]
  >([
    { id: "brief", name: "activation-brief.pdf", status: "Ready" },
    { id: "notes", name: "interview-notes.txt", status: "Failed" },
  ]);
  const [appearance, setAppearance] = React.useState<Appearance>(defaultAppearance);
  const [direction, setDirection] = React.useState("ltr");
  const runTimerRef = React.useRef<number | null>(null);
  const sourceTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const initialDirection = root.getAttribute("dir");
    setAppearance(readAppearanceFromRoot(root));
    return () => {
      if (initialDirection) root.setAttribute("dir", initialDirection);
      else root.removeAttribute("dir");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  React.useEffect(
    () => () => {
      if (runTimerRef.current !== null) window.clearTimeout(runTimerRef.current);
    },
    [],
  );

  const selectedSource = sources.find((source) => source.id === sourceId) ?? sources[0]!;
  const visibleThreads = savedThreads.filter((thread) =>
    thread.title.toLowerCase().includes(threadQuery.trim().toLowerCase()),
  );

  function selectSection(next: Section) {
    setSection(next);
    setMobileNavOpen(false);
  }

  function startRun() {
    if (!prompt.trim() && runState === "idle") {
      setPromptError("Describe what you want to research.");
      return;
    }
    if (runTimerRef.current !== null) window.clearTimeout(runTimerRef.current);
    setPromptError("");
    setRunState("running");
    runTimerRef.current = window.setTimeout(() => {
      runTimerRef.current = null;
      setRunState("completed");
      setPrompt("");
    }, 900);
  }

  function interruptRun() {
    if (runTimerRef.current !== null) {
      window.clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }
    setRunState("interrupted");
  }

  function simulateFailure() {
    if (runTimerRef.current !== null) {
      window.clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }
    setRunState("failed");
  }

  function startNewResearch() {
    if (runTimerRef.current !== null) {
      window.clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }
    setSection("research");
    setRunState("idle");
    setPrompt("");
    setPromptError("");
  }

  function inspectSource(source: Source, trigger: HTMLButtonElement) {
    sourceTriggerRef.current = trigger;
    setSourceId(source.id);
    setSourceOpen(true);
  }

  function addAttachment() {
    if (attachments.some((item) => item.id === "dataset")) return;
    setAttachments((current) => [
      ...current,
      { id: "dataset", name: "activation-events.csv", status: "Processing" },
    ]);
  }

  function updateAttachment(id: string, status: AttachmentStatus) {
    setAttachments((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((item) => item.id !== id));
  }

  function updateAppearance<K extends keyof Appearance>(axis: K, value: Appearance[K]) {
    setAppearance((current) => ({ ...current, [axis]: value }));
    persistAppearanceAxis(document.documentElement, axis, value);
  }

  return (
    <div className={styles.shell}>
      <SidebarProvider sidebarId="ai-research-sidebar">
        {!isMobile ? (
          <Sidebar aria-label="AI Research sidebar">
            <SidebarHeader>
              <div className={styles.brand}>
                <span>
                  <Sparkles aria-hidden />
                </span>
                <div>
                  <strong>Northstar Research</strong>
                  <small>Evidence workspace</small>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <ResearchNavigation active={section} onSelect={selectSection} />
            </SidebarContent>
            <SidebarFooter>
              <div className={styles["workspace-note"]}>
                <Badge variant="success">Local only</Badge>
                <span>No prompt or source leaves this preview.</span>
              </div>
            </SidebarFooter>
            <SidebarRail label="Toggle AI Research sidebar" />
          </Sidebar>
        ) : null}

        <SidebarInset className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles["topbar-title"]}>
              {isMobile ? (
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                  <Tooltip label="Open research navigation">
                    <SheetTrigger
                      render={
                        <Button
                          icon={PanelLeft}
                          aria-label="Open research navigation"
                          tooltip={false}
                          variant="secondary"
                        />
                      }
                    />
                  </Tooltip>
                  <SheetContent side="left" size="sm">
                    <SheetHeader>
                      <SheetTitle>Research navigation</SheetTitle>
                      <SheetDescription>Move between research workspace areas.</SheetDescription>
                    </SheetHeader>
                    <SheetBody>
                      <ResearchNavigation active={section} onSelect={selectSection} />
                    </SheetBody>
                  </SheetContent>
                </Sheet>
              ) : (
                <SidebarTrigger label="Toggle AI Research sidebar" />
              )}
              <div>
                <p>Northstar Research</p>
                <h1>{navItems.find(([value]) => value === section)?.[1]}</h1>
              </div>
            </div>
            <Button leadingIcon={Plus} onClick={startNewResearch}>
              New research
            </Button>
          </header>

          {section === "research" ? (
            <ResearchSection
              attachments={attachments}
              prompt={prompt}
              promptError={promptError}
              runState={runState}
              onAddAttachment={addAttachment}
              onInspectSource={inspectSource}
              onInterrupt={interruptRun}
              onPromptChange={setPrompt}
              onRemoveAttachment={removeAttachment}
              onRetry={startRun}
              onSimulateFailure={simulateFailure}
              onStart={startRun}
              onUpdateAttachment={updateAttachment}
            />
          ) : null}
          {section === "threads" ? (
            <ThreadsSection
              query={threadQuery}
              threads={visibleThreads}
              onOpenThread={() => setSection("research")}
              onQueryChange={setThreadQuery}
            />
          ) : null}
          {section === "sources" ? <SourcesSection onInspectSource={inspectSource} /> : null}
          {section === "settings" ? (
            <SettingsSection
              appearance={appearance}
              direction={direction}
              onChange={updateAppearance}
              onDirectionChange={setDirection}
            />
          ) : null}
        </SidebarInset>
      </SidebarProvider>

      <Dialog
        open={sourceOpen}
        onOpenChange={(open) => {
          setSourceOpen(open);
          if (!open) window.requestAnimationFrame(() => sourceTriggerRef.current?.focus());
        }}
        trigger={<button className={styles["dialog-trigger"]} tabIndex={-1} aria-hidden />}
        title={selectedSource.title}
        description={`${selectedSource.type} · ${selectedSource.publisher}`}
      >
        <div className={styles["source-detail"]}>
          <Badge variant="info">Cited in synthesis</Badge>
          <blockquote>{selectedSource.excerpt}</blockquote>
          <div>
            <strong>Why it matters</strong>
            <p>{selectedSource.relevance}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              setSourceOpen(false);
              toasts.add({
                title: "Source added to notes",
                description: "The local research note now references this source.",
                data: { tone: "success" },
              });
            }}
          >
            Add to notes
          </Button>
        </DialogFooter>
      </Dialog>
      <ToastViewport />
    </div>
  );
}

function ResearchSection({
  attachments,
  prompt,
  promptError,
  runState,
  onAddAttachment,
  onInspectSource,
  onInterrupt,
  onPromptChange,
  onRemoveAttachment,
  onRetry,
  onSimulateFailure,
  onStart,
  onUpdateAttachment,
}: {
  attachments: readonly { id: string; name: string; status: AttachmentStatus }[];
  prompt: string;
  promptError: string;
  runState: RunState;
  onAddAttachment: () => void;
  onInspectSource: (source: Source, trigger: HTMLButtonElement) => void;
  onInterrupt: () => void;
  onPromptChange: (value: string) => void;
  onRemoveAttachment: (id: string) => void;
  onRetry: () => void;
  onSimulateFailure: () => void;
  onStart: () => void;
  onUpdateAttachment: (id: string, status: AttachmentStatus) => void;
}) {
  return (
    <main className={styles["research-layout"]}>
      <section className={styles.thread} aria-labelledby="thread-heading">
        <header className={styles["thread-heading"]}>
          <div>
            <Badge>Product research</Badge>
            <h2 id="thread-heading">Activation opportunity brief</h2>
            <p>
              Build a recommendation from interviews, product events, and internal documentation.
            </p>
          </div>
          <Badge variant={runState === "failed" ? "danger" : "success"}>
            {runState === "running" ? "Researching" : "Evidence grounded"}
          </Badge>
        </header>

        <div className={styles.messages} aria-live="polite">
          <article className={styles.message} data-author="user">
            <div className={styles.avatar}>VP</div>
            <div>
              <strong>You</strong>
              <p>
                Synthesize the strongest activation opportunity and show which evidence supports the
                recommendation.
              </p>
            </div>
          </article>
          <article className={styles.message} data-author="assistant">
            <div className={styles.avatar}>
              <Sparkles aria-hidden />
            </div>
            <div>
              <strong>Research assistant</strong>
              <p>
                The strongest opportunity is to guide a new team toward one shared artifact before
                configuration. Interviews identify the empty workspace as the highest-uncertainty
                moment, while retention evidence links first-session collaboration with stronger
                return behavior.
              </p>
              <ol className={styles.recommendations}>
                <li>
                  Start with a reusable workspace brief instead of an empty canvas.
                  <button onClick={(event) => onInspectSource(sources[1]!, event.currentTarget)}>
                    [1]
                  </button>
                </li>
                <li>
                  Measure activation at the first persistent shared artifact.
                  <button onClick={(event) => onInspectSource(sources[2]!, event.currentTarget)}>
                    [2]
                  </button>
                </li>
                <li>
                  Defer advanced setup until collaborators have a reason to return.
                  <button onClick={(event) => onInspectSource(sources[0]!, event.currentTarget)}>
                    [3]
                  </button>
                </li>
              </ol>
              <div className={styles["code-note"]}>
                <Code2 aria-hidden />
                <code>activation = workspace_created + collaborator_invited</code>
              </div>
            </div>
          </article>

          {runState !== "idle" ? (
            <RunStatus
              state={runState}
              onInterrupt={onInterrupt}
              onRetry={onRetry}
              onSimulateFailure={onSimulateFailure}
            />
          ) : null}
        </div>

        <div className={styles.composer}>
          <Field
            label="Research prompt"
            message={promptError || undefined}
            invalid={Boolean(promptError)}
          >
            <Textarea
              value={prompt}
              onChange={(event) => onPromptChange(event.currentTarget.value)}
              placeholder="Ask a follow-up or request another evidence pass…"
              aria-invalid={Boolean(promptError)}
            />
          </Field>
          <AttachmentList
            attachments={attachments}
            onAdd={onAddAttachment}
            onRemove={onRemoveAttachment}
            onUpdate={onUpdateAttachment}
          />
          <div className={styles["composer-actions"]}>
            <span>Model: Northstar Research · Local fixture</span>
            <Button
              leadingIcon={runState === "running" ? X : ArrowRight}
              onClick={runState === "running" ? onInterrupt : onStart}
            >
              {runState === "running" ? "Stop response" : "Run research"}
            </Button>
          </div>
        </div>
      </section>

      <aside className={styles["source-rail"]} aria-label="Evidence sources">
        <header>
          <div>
            <p>Evidence set</p>
            <h2>Sources</h2>
          </div>
          <Badge>{sources.length}</Badge>
        </header>
        {sources.map((source, index) => (
          <Card key={source.id} className={styles["source-card"]}>
            <span>{index + 1}</span>
            <div>
              <strong>{source.title}</strong>
              <p>{source.publisher}</p>
              <small>{source.relevance}</small>
            </div>
            <Button
              variant="secondary"
              onClick={(event) => onInspectSource(source, event.currentTarget)}
            >
              Inspect
            </Button>
          </Card>
        ))}
      </aside>
    </main>
  );
}

function RunStatus({
  state,
  onInterrupt,
  onRetry,
  onSimulateFailure,
}: {
  state: Exclude<RunState, "idle">;
  onInterrupt: () => void;
  onRetry: () => void;
  onSimulateFailure: () => void;
}) {
  if (state === "running") {
    return (
      <Card className={styles["run-status"]} role="status">
        <span className={styles["run-icon"]}>
          <Wrench aria-hidden />
        </span>
        <div>
          <strong>Checking interview notes</strong>
          <p>Tool run 2 of 3 · Comparing claims against the evidence set.</p>
          <Progress value={58} aria-label="Research run, 58 percent" />
        </div>
        <Button variant="secondary" onClick={onSimulateFailure}>
          Simulate failure
        </Button>
        <Button variant="ghost" onClick={onInterrupt}>
          Stop
        </Button>
      </Card>
    );
  }

  if (state === "failed") {
    return (
      <Alert tone="danger" title="Source comparison failed">
        <p>The local tool fixture could not read one attachment.</p>
        <Button variant="secondary" onClick={onRetry}>
          Retry research
        </Button>
      </Alert>
    );
  }

  if (state === "interrupted") {
    return (
      <Alert tone="warning" title="Response interrupted">
        <p>The partial draft is still available. Retry to complete the evidence pass.</p>
        <Button variant="secondary" onClick={onRetry}>
          Continue research
        </Button>
      </Alert>
    );
  }

  return (
    <Alert tone="success" title="Evidence pass complete">
      Three sources were checked and the recommendation was updated.
    </Alert>
  );
}

function AttachmentList({
  attachments,
  onAdd,
  onRemove,
  onUpdate,
}: {
  attachments: readonly { id: string; name: string; status: AttachmentStatus }[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, status: AttachmentStatus) => void;
}) {
  return (
    <div className={styles.attachments}>
      <div className={styles["attachment-heading"]}>
        <span>Attachments</span>
        <Button size="sm" variant="ghost" leadingIcon={Plus} onClick={onAdd}>
          Add sample
        </Button>
      </div>
      <div className={styles["attachment-list"]}>
        {attachments.map((attachment) => (
          <div key={attachment.id} className={styles.attachment}>
            <FileText aria-hidden />
            <div>
              <strong>{attachment.name}</strong>
              <span>{attachment.status}</span>
            </div>
            {attachment.status === "Processing" ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onUpdate(attachment.id, "Ready")}
              >
                Finish
              </Button>
            ) : null}
            {attachment.status === "Failed" ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onUpdate(attachment.id, "Ready")}
              >
                Retry
              </Button>
            ) : null}
            <Button
              size="sm"
              icon={X}
              aria-label={`Remove ${attachment.name}`}
              tooltip={`Remove ${attachment.name}`}
              variant="ghost"
              onClick={() => onRemove(attachment.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreadsSection({
  query,
  threads,
  onOpenThread,
  onQueryChange,
}: {
  query: string;
  threads: readonly (typeof savedThreads)[number][];
  onOpenThread: () => void;
  onQueryChange: (value: string) => void;
}) {
  return (
    <main className={styles.content}>
      <header className={styles["section-heading"]}>
        <div>
          <p>Return to previous evidence work</p>
          <h2>Saved threads</h2>
        </div>
      </header>
      <Field label="Search saved threads" className={styles["thread-search"]}>
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          placeholder="Search by title"
        />
      </Field>
      {threads.length ? (
        <div className={styles["thread-list"]}>
          {threads.map((thread) => (
            <Card key={thread.id} className={styles["thread-row"]}>
              <MessageCircle aria-hidden />
              <div>
                <strong>{thread.title}</strong>
                <span>{thread.detail}</span>
              </div>
              <Badge>{thread.status}</Badge>
              <Button variant="secondary" onClick={onOpenThread}>
                Open
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateHeader>
            <EmptyStateTitle>No saved threads found</EmptyStateTitle>
            <EmptyStateDescription>
              Try another title or clear the current search.
            </EmptyStateDescription>
          </EmptyStateHeader>
          <EmptyStateActions>
            <Button onClick={() => onQueryChange("")}>Clear search</Button>
          </EmptyStateActions>
        </EmptyState>
      )}
    </main>
  );
}

function SourcesSection({
  onInspectSource,
}: {
  onInspectSource: (source: Source, trigger: HTMLButtonElement) => void;
}) {
  const [loading, setLoading] = React.useState(false);

  return (
    <main className={styles.content}>
      <header className={styles["section-heading"]}>
        <div>
          <p>Trace every recommendation to local evidence</p>
          <h2>Source library</h2>
        </div>
        <Button variant="secondary" onClick={() => setLoading((value) => !value)}>
          {loading ? "Show sources" : "Simulate loading"}
        </Button>
      </header>
      {loading ? (
        <div className={styles["source-grid"]} role="status" aria-label="Loading sources">
          {sources.map((source) => (
            <Card key={source.id}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </Card>
          ))}
        </div>
      ) : (
        <div className={styles["source-grid"]}>
          {sources.map((source) => (
            <Card key={source.id} className={styles["source-library-card"]}>
              <Badge>{source.type}</Badge>
              <div>
                <strong>{source.title}</strong>
                <p>{source.excerpt}</p>
              </div>
              <Button
                variant="secondary"
                onClick={(event) => onInspectSource(source, event.currentTarget)}
              >
                Inspect source
              </Button>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

function SettingsSection({
  appearance,
  direction,
  onChange,
  onDirectionChange,
}: {
  appearance: Appearance;
  direction: string;
  onChange: <K extends keyof Appearance>(axis: K, value: Appearance[K]) => void;
  onDirectionChange: (value: string) => void;
}) {
  const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;

  return (
    <main className={styles.content}>
      <header className={styles["section-heading"]}>
        <div>
          <p>Workspace and model behavior remain local to this Template</p>
          <h2>Research settings</h2>
        </div>
      </header>
      <Card className={styles["settings-card"]}>
        <Select
          label="Model profile"
          defaultValue="balanced"
          options={[
            { label: "Balanced research", value: "balanced" },
            { label: "Fast evidence scan", value: "fast" },
            { label: "Deep synthesis", value: "deep" },
          ]}
        />
        <Select
          label="Mode"
          value={appearance.mode}
          onValueChange={(value) => onChange("mode", value as Appearance["mode"])}
          options={modes.map((value) => ({ label: runtimeLabel(value), value }))}
        />
        <Select
          label="Density"
          value={appearance.density}
          onValueChange={(value) => onChange("density", value as Appearance["density"])}
          options={densities.map((value) => ({ label: runtimeLabel(value), value }))}
        />
        <Select
          label="Direction"
          value={direction}
          onValueChange={onDirectionChange}
          options={[
            { label: "Left to right", value: "ltr" },
            { label: "Right to left", value: "rtl" },
          ]}
        />
        <Alert tone="info" title="No model connection">
          Prompts, tools, citations, and responses are deterministic fixtures for product review.
        </Alert>
      </Card>
    </main>
  );
}

export function AiResearchWorkspaceView() {
  return (
    <ToastProvider>
      <ResearchWorkspaceApp />
    </ToastProvider>
  );
}
