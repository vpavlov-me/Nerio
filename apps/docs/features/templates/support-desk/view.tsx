"use client";

import * as React from "react";
import { densities, modes } from "@nerio-ui/tokens";
import {
  ArrowLeft,
  Bell,
  Check,
  CircleAlert,
  Info,
  Mail,
  MessageCircle,
  PanelLeft,
  Settings,
  TriangleAlert,
  UserPlus,
} from "@nerio-ui/adapters/icons";
import { Textarea } from "@nerio-ui/ui";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogFooter,
  DropdownMenu,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  Input,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsPanels,
  TabsTrigger,
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

type TicketStatus = "Unread" | "Assigned" | "Pending" | "Escalated" | "Resolved";
type QueueState = "ready" | "loading" | "error" | "empty";
type SavedView = "mine" | "priority" | "pending" | "resolved";

type Message = {
  id: string;
  author: string;
  role: "customer" | "agent" | "note";
  time: string;
  body: string;
};

type Ticket = {
  id: string;
  subject: string;
  preview: string;
  customer: string;
  company: string;
  status: TicketStatus;
  priority: "Low" | "Normal" | "High" | "Urgent";
  assignee: string;
  updated: string;
  locale: string;
  messages: readonly Message[];
};

const tickets: readonly Ticket[] = [
  {
    id: "4821",
    subject: "Team invitations expire before acceptance",
    preview: "Two teammates see an expired-link message even after I send a fresh invitation.",
    customer: "Maya Chen",
    company: "Lumen Works",
    status: "Unread",
    priority: "High",
    assignee: "You",
    updated: "4m",
    locale: "English · US",
    messages: [
      {
        id: "m1",
        author: "Maya Chen",
        role: "customer",
        time: "09:42",
        body: "Hi team — two colleagues see an expired-link message even when I generate a fresh invitation. We are onboarding our research group today, so I would appreciate a quick check.",
      },
      {
        id: "m2",
        author: "Northstar assistant",
        role: "note",
        time: "09:43",
        body: "Account diagnostics show five available seats and no organization-level invitation restriction.",
      },
      {
        id: "m3",
        author: "Maya Chen",
        role: "customer",
        time: "09:47",
        body: "The affected addresses use our new lumen-research.com domain. Existing lumen.works invitations still open normally.",
      },
    ],
  },
  {
    id: "4819",
    subject: "Invoice needs a purchase order reference",
    preview: "Could you add PO-7714 to the July invoice before our payment run?",
    customer: "Noah Williams",
    company: "Meridian Studio",
    status: "Assigned",
    priority: "Normal",
    assignee: "You",
    updated: "18m",
    locale: "English · UK",
    messages: [
      {
        id: "m1",
        author: "Noah Williams",
        role: "customer",
        time: "09:18",
        body: "Could you add PO-7714 to the July invoice before our payment run? Our finance team needs the reference in the invoice header.",
      },
    ],
  },
  {
    id: "4812",
    subject: "No puedo exportar el informe mensual",
    preview: "La exportación se queda en Preparando archivo y nunca termina.",
    customer: "Lucía Torres",
    company: "Claro Norte",
    status: "Escalated",
    priority: "Urgent",
    assignee: "Priya",
    updated: "37m",
    locale: "Español · ES",
    messages: [
      {
        id: "m1",
        author: "Lucía Torres",
        role: "customer",
        time: "08:59",
        body: "Hola. La exportación se queda en «Preparando archivo» y nunca termina. El informe contiene datos de doce espacios de trabajo y lo necesitamos para la reunión de esta tarde.",
      },
      {
        id: "m2",
        author: "Priya Nair",
        role: "agent",
        time: "09:11",
        body: "Gracias, Lucía. He escalado el caso con el identificador de exportación. Te avisaré aquí en cuanto tengamos el archivo o una alternativa segura.",
      },
    ],
  },
  {
    id: "4808",
    subject: "Sandbox webhook retries",
    preview: "We receive the same test event after returning a successful response.",
    customer: "Eli Okafor",
    company: "Fieldnote",
    status: "Pending",
    priority: "Normal",
    assignee: "Morgan",
    updated: "1h",
    locale: "English · NG",
    messages: [
      {
        id: "m1",
        author: "Eli Okafor",
        role: "customer",
        time: "08:31",
        body: "We receive the same sandbox event after returning HTTP 204. Can you confirm the expected retry window?",
      },
    ],
  },
  {
    id: "4797",
    subject: "Workspace recovery completed",
    preview: "Everything is visible again. Thank you for the careful follow-up.",
    customer: "Ari Kim",
    company: "Common Thread",
    status: "Resolved",
    priority: "Low",
    assignee: "You",
    updated: "Yesterday",
    locale: "English · CA",
    messages: [
      {
        id: "m1",
        author: "Ari Kim",
        role: "customer",
        time: "Yesterday",
        body: "Everything is visible again. Thank you for the careful follow-up.",
      },
    ],
  },
] as const;

const savedViews: readonly [SavedView, string, number][] = [
  ["mine", "My open tickets", 3],
  ["priority", "Priority queue", 2],
  ["pending", "Waiting on customer", 1],
  ["resolved", "Recently resolved", 1],
];

const statusOptions = ["Unread", "Assigned", "Pending", "Escalated", "Resolved"].map((value) => ({
  value,
  label: value,
}));
const priorityOptions = ["Low", "Normal", "High", "Urgent"].map((value) => ({
  value,
  label: value,
}));
const assigneeOptions = ["You", "Priya", "Morgan", "Unassigned"].map((value) => ({
  value,
  label: value,
}));

function subscribeToMobileViewport(callback: () => void) {
  const media = window.matchMedia("(max-width: 860px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMobileViewport() {
  return React.useSyncExternalStore(
    subscribeToMobileViewport,
    () => window.matchMedia("(max-width: 860px)").matches,
    () => false,
  );
}

function statusTone(status: TicketStatus) {
  if (status === "Escalated") return "danger" as const;
  if (status === "Resolved") return "success" as const;
  if (status === "Pending") return "warning" as const;
  if (status === "Unread") return "info" as const;
  return "neutral" as const;
}

function SupportDeskApp() {
  const isMobile = useMobileViewport();
  const toasts = useToastManager();
  const [savedView, setSavedView] = React.useState<SavedView>("mine");
  const [query, setQuery] = React.useState("");
  const [queueState, setQueueState] = React.useState<QueueState>("ready");
  const [selectedId, setSelectedId] = React.useState(tickets[0]!.id);
  const [mobileDetailOpen, setMobileDetailOpen] = React.useState(false);
  const [reply, setReply] = React.useState("");
  const [replyError, setReplyError] = React.useState("");
  const [sentReplies, setSentReplies] = React.useState<Record<string, Message[]>>({});
  const [statusById, setStatusById] = React.useState<Record<string, TicketStatus>>({});
  const [priorityById, setPriorityById] = React.useState<Record<string, Ticket["priority"]>>({});
  const [assigneeById, setAssigneeById] = React.useState<Record<string, string>>({});
  const [contextOpen, setContextOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [resolveOpen, setResolveOpen] = React.useState(false);
  const [appearance, setAppearance] = React.useState<Appearance>(defaultAppearance);
  const [direction, setDirection] = React.useState("ltr");

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

  const visibleTickets = tickets.filter((ticket) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      `${ticket.subject} ${ticket.customer} ${ticket.company}`
        .toLowerCase()
        .includes(normalizedQuery);
    const currentStatus = statusById[ticket.id] ?? ticket.status;
    const matchesView =
      savedView === "mine"
        ? (assigneeById[ticket.id] ?? ticket.assignee) === "You" && currentStatus !== "Resolved"
        : savedView === "priority"
          ? currentStatus === "Escalated" || ticket.priority === "High"
          : savedView === "pending"
            ? currentStatus === "Pending"
            : currentStatus === "Resolved";
    return matchesQuery && matchesView;
  });

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0]!;
  const selectedStatus = statusById[selectedTicket.id] ?? selectedTicket.status;
  const selectedPriority = priorityById[selectedTicket.id] ?? selectedTicket.priority;
  const selectedAssignee = assigneeById[selectedTicket.id] ?? selectedTicket.assignee;
  const messages = [...selectedTicket.messages, ...(sentReplies[selectedTicket.id] ?? [])];
  const showQueue = !isMobile || !mobileDetailOpen;
  const showDetail = !isMobile || mobileDetailOpen;

  function selectTicket(id: string) {
    setSelectedId(id);
    setMobileDetailOpen(true);
    setReply("");
    setReplyError("");
    if ((statusById[id] ?? tickets.find((ticket) => ticket.id === id)?.status) === "Unread") {
      setStatusById((current) => ({ ...current, [id]: "Assigned" }));
    }
  }

  function sendReply() {
    if (!reply.trim()) {
      setReplyError("Write a reply before sending.");
      return;
    }
    const next: Message = {
      id: `reply-${selectedTicket.id}-${Date.now()}`,
      author: "Vladimir Pavlov",
      role: "agent",
      time: "Just now",
      body: reply.trim(),
    };
    setSentReplies((current) => ({
      ...current,
      [selectedTicket.id]: [...(current[selectedTicket.id] ?? []), next],
    }));
    setReply("");
    setReplyError("");
    setStatusById((current) => ({ ...current, [selectedTicket.id]: "Pending" }));
    toasts.add({
      title: "Reply sent",
      description: `Ticket #${selectedTicket.id} is now waiting on the customer.`,
      data: { tone: "success" },
    });
  }

  function updateStatus(value: string) {
    const status = value as TicketStatus;
    if (status === "Resolved") {
      setResolveOpen(true);
      return;
    }
    setStatusById((current) => ({ ...current, [selectedTicket.id]: status }));
    toasts.add({
      title: `Status changed to ${status}`,
      description: `Ticket #${selectedTicket.id} was updated locally.`,
    });
  }

  function confirmResolve() {
    setStatusById((current) => ({ ...current, [selectedTicket.id]: "Resolved" }));
    setResolveOpen(false);
    toasts.add({
      title: "Ticket resolved",
      description: `Ticket #${selectedTicket.id} moved to Recently resolved.`,
      data: { tone: "success" },
    });
  }

  function updateAppearance<K extends keyof Appearance>(axis: K, value: Appearance[K]) {
    setAppearance((current) => ({ ...current, [axis]: value }));
    persistAppearanceAxis(document.documentElement, axis, value);
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span>
            <MessageCircle aria-hidden />
          </span>
          <div>
            <strong>Northstar Support</strong>
            <small>Customer operations</small>
          </div>
        </div>
        <div className={styles["header-actions"]}>
          <Badge variant="success">All systems normal</Badge>
          <Tooltip label="Notifications">
            <Button
              aria-label="Notifications"
              icon={Bell}
              tooltip={false}
              variant="ghost"
              onClick={() =>
                toasts.add({
                  title: "No new notifications",
                  description: "All assigned tickets are represented in the current queues.",
                })
              }
            />
          </Tooltip>
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <Tooltip label="Open workspace settings">
              <SheetTrigger
                render={
                  <Button
                    aria-label="Open workspace settings"
                    icon={Settings}
                    tooltip={false}
                    variant="secondary"
                  />
                }
              />
            </Tooltip>
            <SheetContent side="right" size="sm">
              <SheetHeader>
                <SheetTitle>Workspace settings</SheetTitle>
                <SheetDescription>
                  Preview mode, density, and writing direction locally.
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <div className={styles["settings-fields"]}>
                  <fieldset className={styles["axis-control"]}>
                    <legend>Mode</legend>
                    <div>
                      {modes.map((value) => (
                        <Button
                          key={value}
                          size="sm"
                          variant={appearance.mode === value ? "primary" : "secondary"}
                          aria-pressed={appearance.mode === value}
                          onClick={() => updateAppearance("mode", value)}
                        >
                          {`${value[0]!.toUpperCase()}${value.slice(1)} mode`}
                        </Button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className={styles["axis-control"]}>
                    <legend>Density</legend>
                    <div>
                      {densities.map((value) => (
                        <Button
                          key={value}
                          size="sm"
                          variant={appearance.density === value ? "primary" : "secondary"}
                          aria-pressed={appearance.density === value}
                          onClick={() => updateAppearance("density", value)}
                        >
                          {`${value[0]!.toUpperCase()}${value.slice(1)} density`}
                        </Button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className={styles["axis-control"]}>
                    <legend>Direction</legend>
                    <div>
                      <Button
                        size="sm"
                        variant={direction === "ltr" ? "primary" : "secondary"}
                        aria-pressed={direction === "ltr"}
                        onClick={() => setDirection("ltr")}
                      >
                        Left to right direction
                      </Button>
                      <Button
                        size="sm"
                        variant={direction === "rtl" ? "primary" : "secondary"}
                        aria-pressed={direction === "rtl"}
                        onClick={() => setDirection("rtl")}
                      >
                        Right to left direction
                      </Button>
                    </div>
                  </fieldset>
                  <Alert tone="info">
                    Support data and workflow changes stay inside this deterministic preview.
                  </Alert>
                </div>
              </SheetBody>
            </SheetContent>
          </Sheet>
          <Avatar name="Vladimir Pavlov" size="sm" />
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.views} aria-label="Support queues">
          <div className={styles["views-heading"]}>
            <div>
              <p>Inbox</p>
              <strong>14 open</strong>
            </div>
            <Button
              aria-label="Create saved view"
              icon={UserPlus}
              tooltip={false}
              variant="ghost"
              onClick={() =>
                toasts.add({
                  title: "Saved view created",
                  description: "A local copy of the current queue filters is ready.",
                  data: { tone: "success" },
                })
              }
            />
          </div>
          <nav aria-label="Saved views">
            {savedViews.map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                aria-current={savedView === value ? "page" : undefined}
                data-state={savedView === value ? "active" : undefined}
                onClick={() => {
                  setSavedView(value);
                  setQueueState("ready");
                }}
              >
                <span>{label}</span>
                <Badge>{count}</Badge>
              </button>
            ))}
          </nav>
          <div className={styles["views-footer"]}>
            <span>First response target</span>
            <strong>Under 30 minutes</strong>
          </div>
        </aside>

        {showQueue ? (
          <section className={styles.queue} aria-labelledby="queue-heading">
            <div className={styles["queue-header"]}>
              <div>
                <p>Queue</p>
                <h1 id="queue-heading">{savedViews.find(([value]) => value === savedView)?.[1]}</h1>
              </div>
              <DropdownMenu
                trigger="Queue states"
                items={[
                  { label: "Show ready queue", onSelect: () => setQueueState("ready") },
                  { label: "Show loading", onSelect: () => setQueueState("loading") },
                  { label: "Show error", onSelect: () => setQueueState("error") },
                  { label: "Show empty queue", onSelect: () => setQueueState("empty") },
                ]}
              />
            </div>
            <div className={styles["queue-tools"]}>
              <Input
                aria-label="Search tickets"
                placeholder="Search tickets"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
              />
              <DropdownMenu
                trigger="Filters"
                items={savedViews.map(([value, label]) => ({
                  label,
                  onSelect: () => {
                    setSavedView(value);
                    setQueueState("ready");
                  },
                }))}
              />
            </div>
            <QueueContent
              query={query}
              queueState={queueState}
              tickets={visibleTickets}
              selectedId={selectedId}
              statusById={statusById}
              onRetry={() => setQueueState("ready")}
              onSelect={selectTicket}
              onClearQuery={() => setQuery("")}
            />
          </section>
        ) : null}

        {showDetail ? (
          <main className={styles.detail}>
            <header className={styles["detail-header"]}>
              <div className={styles["ticket-heading"]}>
                {isMobile ? (
                  <Button
                    aria-label="Back to ticket queue"
                    icon={ArrowLeft}
                    tooltip={false}
                    variant="ghost"
                    onClick={() => setMobileDetailOpen(false)}
                  />
                ) : null}
                <div>
                  <div className={styles["ticket-kicker"]}>
                    <span>Ticket #{selectedTicket.id}</span>
                    <Badge tone={statusTone(selectedStatus)}>{selectedStatus}</Badge>
                  </div>
                  <h2>{selectedTicket.subject}</h2>
                </div>
              </div>
              <div className={styles["detail-actions"]}>
                {isMobile ? (
                  <Sheet open={contextOpen} onOpenChange={setContextOpen}>
                    <SheetTrigger
                      render={
                        <Button variant="secondary" leadingIcon={Info}>
                          Customer
                        </Button>
                      }
                    />
                    <SheetContent side="right" size="sm">
                      <SheetHeader>
                        <SheetTitle>Customer context</SheetTitle>
                        <SheetDescription>
                          Account and ticket history for {selectedTicket.customer}.
                        </SheetDescription>
                      </SheetHeader>
                      <SheetBody>
                        <CustomerContext
                          ticket={selectedTicket}
                          onViewAccount={() => {
                            setContextOpen(false);
                            toasts.add({
                              title: "Account opened",
                              description: `${selectedTicket.company} is available in this local preview.`,
                            });
                          }}
                        />
                      </SheetBody>
                    </SheetContent>
                  </Sheet>
                ) : null}
                <DropdownMenu
                  trigger="More"
                  items={[
                    {
                      label: "Copy ticket link",
                      onSelect: () =>
                        toasts.add({
                          title: "Ticket link copied",
                          description: `Local link for #${selectedTicket.id} is ready.`,
                        }),
                    },
                    { label: "Merge ticket", disabled: true },
                    {
                      label: "Delete ticket",
                      destructive: true,
                      onSelect: () =>
                        toasts.add({
                          title: "Delete is unavailable",
                          description: "Destructive data actions are disabled in this preview.",
                          data: { tone: "danger" },
                        }),
                    },
                  ]}
                />
              </div>
            </header>

            <div className={styles["ticket-controls"]}>
              <Select
                label="Assignee"
                value={selectedAssignee}
                options={assigneeOptions}
                onChange={(value) => {
                  setAssigneeById((current) => ({ ...current, [selectedTicket.id]: value }));
                  toasts.add({ title: `Assigned to ${value}` });
                }}
              />
              <Select
                label="Priority"
                value={selectedPriority}
                options={priorityOptions}
                onChange={(value) =>
                  setPriorityById((current) => ({
                    ...current,
                    [selectedTicket.id]: value as Ticket["priority"],
                  }))
                }
              />
              <Select
                label="Status"
                value={selectedStatus}
                options={statusOptions}
                onChange={updateStatus}
              />
            </div>

            <section className={styles.conversation} aria-label="Ticket conversation">
              <div className={styles["conversation-date"]}>Today</div>
              {messages.map((message) => (
                <article key={message.id} data-role={message.role}>
                  <Avatar name={message.author} size="sm" />
                  <div>
                    <header>
                      <strong>{message.author}</strong>
                      <span>{message.time}</span>
                    </header>
                    <p>{message.body}</p>
                  </div>
                </article>
              ))}
            </section>

            <section className={styles.composer} aria-label="Reply composer">
              <div className={styles["composer-heading"]}>
                <strong>Reply to {selectedTicket.customer}</strong>
                <span>Public reply</span>
              </div>
              <Field
                label="Reply"
                message={replyError || undefined}
                invalid={Boolean(replyError)}
                description="Use Ctrl+Enter or the Send reply button."
              >
                <Textarea
                  aria-label="Reply"
                  placeholder="Write a helpful response…"
                  value={reply}
                  onChange={(event) => {
                    setReply(event.currentTarget.value);
                    if (replyError) setReplyError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.ctrlKey && event.key === "Enter") {
                      event.preventDefault();
                      sendReply();
                    }
                  }}
                />
              </Field>
              <div className={styles["composer-actions"]}>
                <span>Replies are deterministic and local.</span>
                <Button leadingIcon={Mail} onClick={sendReply}>
                  Send reply
                </Button>
              </div>
            </section>
          </main>
        ) : null}

        {!isMobile && showDetail ? (
          <aside className={styles.context} aria-label="Customer and activity">
            <CustomerContext
              ticket={selectedTicket}
              onViewAccount={() =>
                toasts.add({
                  title: "Account opened",
                  description: `${selectedTicket.company} is available in this local preview.`,
                })
              }
            />
          </aside>
        ) : null}
      </div>

      <Dialog
        open={resolveOpen}
        onOpenChange={setResolveOpen}
        trigger={<button className={styles["dialog-trigger"]} tabIndex={-1} aria-hidden />}
        title="Resolve this ticket?"
        description="The conversation remains available in Recently resolved."
      >
        <Alert tone="success">
          The customer will not receive an extra notification until you send a reply.
        </Alert>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setResolveOpen(false)}>
            Keep open
          </Button>
          <Button onClick={confirmResolve}>Resolve ticket</Button>
        </DialogFooter>
      </Dialog>
      <ToastViewport />
    </div>
  );
}

function QueueContent({
  query,
  queueState,
  tickets: visible,
  selectedId,
  statusById,
  onRetry,
  onSelect,
  onClearQuery,
}: {
  query: string;
  queueState: QueueState;
  tickets: readonly Ticket[];
  selectedId: string;
  statusById: Record<string, TicketStatus>;
  onRetry: () => void;
  onSelect: (id: string) => void;
  onClearQuery: () => void;
}) {
  if (queueState === "loading") {
    return (
      <div className={styles["queue-state"]} role="status" aria-label="Loading tickets">
        {Array.from({ length: 5 }, (_, index) => (
          <div className={styles["ticket-skeleton"]} key={index}>
            <Skeleton className={styles["avatar-skeleton"]} />
            <div>
              <Skeleton className={styles["skeleton-short"]} />
              <Skeleton className={styles["skeleton-long"]} />
              <Skeleton className={styles["skeleton-medium"]} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (queueState === "error") {
    return (
      <div className={styles["queue-state"]}>
        <Alert tone="danger" title="Tickets could not be loaded">
          The local queue fixture was interrupted. Retry to restore the deterministic data.
        </Alert>
        <Button onClick={onRetry}>Retry queue</Button>
      </div>
    );
  }

  if (queueState === "empty" || visible.length === 0) {
    const noResults = Boolean(query.trim()) && queueState !== "empty";
    return (
      <EmptyState>
        <EmptyStateHeader>
          <EmptyStateTitle>{noResults ? "No matching tickets" : "Queue is clear"}</EmptyStateTitle>
          <EmptyStateDescription>
            {noResults
              ? "Try another customer, company, or subject."
              : "There are no tickets in this saved view right now."}
          </EmptyStateDescription>
        </EmptyStateHeader>
        <EmptyStateActions>
          <Button onClick={noResults ? onClearQuery : onRetry}>
            {noResults ? "Clear search" : "Restore sample tickets"}
          </Button>
        </EmptyStateActions>
      </EmptyState>
    );
  }

  return (
    <div className={styles["ticket-list"]}>
      {visible.map((ticket) => {
        const status = statusById[ticket.id] ?? ticket.status;
        return (
          <button
            key={ticket.id}
            type="button"
            data-state={selectedId === ticket.id ? "active" : undefined}
            data-unread={status === "Unread" ? "true" : undefined}
            aria-label={`${ticket.subject}, ${ticket.customer}, ${status}`}
            onClick={() => onSelect(ticket.id)}
          >
            <Avatar name={ticket.customer} size="sm" />
            <div className={styles["ticket-copy"]}>
              <div>
                <strong>{ticket.customer}</strong>
                <span>{ticket.updated}</span>
              </div>
              <p>{ticket.subject}</p>
              <small>{ticket.preview}</small>
              <div className={styles["ticket-meta"]}>
                <Badge tone={statusTone(status)}>{status}</Badge>
                {ticket.priority === "Urgent" || ticket.priority === "High" ? (
                  <span data-priority={ticket.priority}>
                    <TriangleAlert aria-hidden />
                    {ticket.priority}
                  </span>
                ) : (
                  <span>{ticket.company}</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CustomerContext({ ticket, onViewAccount }: { ticket: Ticket; onViewAccount: () => void }) {
  return (
    <Tabs defaultValue="customer" size="sm">
      <TabsList aria-label="Ticket context" layout="fill">
        <TabsTrigger value="customer">Customer</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsPanels>
        <TabsContent value="customer">
          <div className={styles["context-content"]}>
            <div className={styles["customer-profile"]}>
              <Avatar name={ticket.customer} />
              <div>
                <strong>{ticket.customer}</strong>
                <span>{ticket.company}</span>
              </div>
            </div>
            <dl>
              <div>
                <dt>Plan</dt>
                <dd>Team · 24 seats</dd>
              </div>
              <div>
                <dt>Local time</dt>
                <dd>11:51</dd>
              </div>
              <div>
                <dt>Language</dt>
                <dd>{ticket.locale}</dd>
              </div>
              <div>
                <dt>Health</dt>
                <dd>
                  <Badge variant="success">Healthy</Badge>
                </dd>
              </div>
            </dl>
            <div className={styles["context-note"]}>
              <strong>Account note</strong>
              <p>Prefers concise updates with a clear next step and expected response time.</p>
            </div>
            <Button variant="secondary" onClick={onViewAccount}>
              View account
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <ol className={styles.activity}>
            <li>
              <span>
                <Check aria-hidden />
              </span>
              <div>
                <strong>Ticket created</strong>
                <p>Email channel · Today at 09:42</p>
              </div>
            </li>
            <li>
              <span>
                <CircleAlert aria-hidden />
              </span>
              <div>
                <strong>Priority detected</strong>
                <p>Onboarding language matched the response target.</p>
              </div>
            </li>
            <li>
              <span>
                <PanelLeft aria-hidden />
              </span>
              <div>
                <strong>Opened in My tickets</strong>
                <p>Assigned to the current agent.</p>
              </div>
            </li>
          </ol>
        </TabsContent>
      </TabsPanels>
    </Tabs>
  );
}

export function SupportDeskView() {
  return (
    <ToastProvider>
      <SupportDeskApp />
    </ToastProvider>
  );
}
