"use client";

import * as React from "react";
import { densities, modes } from "@nerio-ui/tokens";
import {
  Boxes,
  Check,
  FileText,
  Layers,
  LayoutDashboard,
  Monitor,
  PackageOpen,
  PanelLeft,
  Plus,
  Rows3,
  Settings,
  X,
} from "@nerio-ui/adapters/icons";
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, Textarea } from "@nerio-ui/ui";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
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

type Section = "library" | "collections" | "imports" | "settings";
type ViewMode = "grid" | "list";
type AssetStatus = "Published" | "Draft" | "Archived";
type ImportStatus = "Queued" | "Importing" | "Completed" | "Failed";

type Asset = {
  id: string;
  title: string;
  kind: "Image" | "Video" | "Document";
  status: AssetStatus;
  collection: string;
  tags: readonly string[];
  dimensions: string;
  size: string;
  updated: string;
  description: string;
  artwork: "paper" | "signal" | "studio" | "field" | "fallback" | "motion";
};

const assets: readonly Asset[] = [
  {
    id: "launch-notes",
    title: "Launch notes cover",
    kind: "Image",
    status: "Published",
    collection: "Summer release",
    tags: ["campaign", "editorial"],
    dimensions: "2400 × 1600",
    size: "3.8 MB",
    updated: "12 minutes ago",
    description: "Editorial cover used across the Summer release launch story.",
    artwork: "paper",
  },
  {
    id: "product-loop",
    title: "Product loop",
    kind: "Video",
    status: "Draft",
    collection: "Product stories",
    tags: ["motion", "product"],
    dimensions: "1920 × 1080",
    size: "18.4 MB",
    updated: "Today, 09:42",
    description: "Short product walkthrough prepared for the feature overview.",
    artwork: "motion",
  },
  {
    id: "studio-portrait",
    title: "Studio portrait",
    kind: "Image",
    status: "Published",
    collection: "People",
    tags: ["portrait", "press"],
    dimensions: "1800 × 2400",
    size: "4.1 MB",
    updated: "Yesterday",
    description: "Press-ready portrait with neutral crop and accessible alt text.",
    artwork: "studio",
  },
  {
    id: "research-brief",
    title: "Research brief",
    kind: "Document",
    status: "Draft",
    collection: "Research",
    tags: ["brief", "insight"],
    dimensions: "12 pages",
    size: "1.2 MB",
    updated: "Jul 22",
    description: "Customer research summary for the next product narrative.",
    artwork: "fallback",
  },
  {
    id: "field-recording",
    title: "Field recording still",
    kind: "Image",
    status: "Archived",
    collection: "Archive",
    tags: ["field", "documentary"],
    dimensions: "2200 × 1467",
    size: "5.6 MB",
    updated: "Jul 19",
    description: "Documentary still retained for reference but no longer in circulation.",
    artwork: "field",
  },
  {
    id: "signal-study",
    title: "Signal study",
    kind: "Image",
    status: "Published",
    collection: "Visual studies",
    tags: ["abstract", "system"],
    dimensions: "2048 × 2048",
    size: "2.7 MB",
    updated: "Jul 18",
    description: "Abstract local artwork used to explore system-led campaign directions.",
    artwork: "signal",
  },
] as const;

const collections = [
  { name: "Summer release", count: 18, description: "Launch campaign and editorial material." },
  { name: "Product stories", count: 12, description: "Product walkthroughs, demos, and stills." },
  { name: "People", count: 24, description: "Portraits and approved team imagery." },
  { name: "Research", count: 9, description: "Briefs, transcripts, and visual references." },
] as const;

const initialImports: { id: string; name: string; status: ImportStatus; progress: number }[] = [
  { id: "campaign-set", name: "campaign-set.zip", status: "Queued", progress: 0 },
  { id: "interview-stills", name: "interview-stills", status: "Importing", progress: 62 },
  { id: "press-kit", name: "press-kit.zip", status: "Completed", progress: 100 },
  { id: "legacy-export", name: "legacy-export.zip", status: "Failed", progress: 31 },
];

const navItems = [
  ["library", "Library", LayoutDashboard],
  ["collections", "Collections", Layers],
  ["imports", "Imports", PackageOpen],
  ["settings", "Settings", Settings],
] as const;

function subscribeToMobileViewport(callback: () => void) {
  const media = window.matchMedia("(max-width: 900px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMobileViewport() {
  return React.useSyncExternalStore(
    subscribeToMobileViewport,
    () => window.matchMedia("(max-width: 900px)").matches,
    () => false,
  );
}

function statusTone(status: AssetStatus | ImportStatus) {
  if (status === "Published" || status === "Completed") return "success" as const;
  if (status === "Failed" || status === "Archived") return "danger" as const;
  if (status === "Importing") return "info" as const;
  return "neutral" as const;
}

function Artwork({ asset, compact = false }: { asset: Asset; compact?: boolean }) {
  return (
    <div
      className={styles.artwork}
      data-artwork={asset.artwork}
      data-compact={compact ? "" : undefined}
      role="img"
      aria-label={
        asset.artwork === "fallback"
          ? `Document fallback for ${asset.title}`
          : `Local artwork preview for ${asset.title}`
      }
    >
      {asset.artwork === "fallback" ? (
        <span>
          <FileText aria-hidden />
          PDF
        </span>
      ) : (
        <>
          <i />
          <b />
          <em />
        </>
      )}
    </div>
  );
}

function LibraryNavigation({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (section: Section) => void;
}) {
  return (
    <nav className={styles.navigation} aria-label="Content library">
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

function ContentLibraryApp() {
  const isMobile = useMobileViewport();
  const toasts = useToastManager();
  const [section, setSection] = React.useState<Section>("library");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [query, setQuery] = React.useState("");
  const [kind, setKind] = React.useState("All types");
  const [status, setStatus] = React.useState("All statuses");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [previewId, setPreviewId] = React.useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [titleError, setTitleError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [imports, setImports] = React.useState(initialImports);
  const [appearance, setAppearance] = React.useState<Appearance>(defaultAppearance);
  const [direction, setDirection] = React.useState("ltr");
  const previewTriggerRef = React.useRef<HTMLButtonElement | null>(null);

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

  const selectedAsset = assets.find((asset) => asset.id === previewId) ?? assets[0]!;
  const filteredAssets = assets.filter((asset) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      [asset.title, asset.collection, ...asset.tags].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    const matchesKind = kind === "All types" || asset.kind === kind;
    const matchesStatus = status === "All statuses" || asset.status === status;
    return matchesQuery && matchesKind && matchesStatus;
  });

  function selectSection(next: Section) {
    setSection(next);
    setMobileNavOpen(false);
  }

  function openPreview(asset: Asset, trigger: HTMLButtonElement) {
    previewTriggerRef.current = trigger;
    setPreviewId(asset.id);
    setTitle(asset.title);
    setDescription(asset.description);
    setTitleError("");
    setEditing(false);
    setPreviewOpen(true);
  }

  function toggleSelection(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((candidate) => candidate !== id) : [...current, id],
    );
  }

  function clearFilters() {
    setQuery("");
    setKind("All types");
    setStatus("All statuses");
  }

  function saveMetadata() {
    if (!title.trim()) {
      setTitleError("Add a title before saving.");
      return;
    }
    setTitleError("");
    setEditing(false);
    toasts.add({
      title: "Metadata saved",
      description: `${title.trim()} was updated locally.`,
      data: { tone: "success" },
    });
  }

  function bulkArchive() {
    const count = selectedIds.length;
    setSelectedIds([]);
    toasts.add({
      title: `${count} ${count === 1 ? "asset" : "assets"} archived`,
      description: "The local selection was cleared.",
      data: { tone: "success" },
    });
  }

  function updateImport(id: string, next: ImportStatus) {
    setImports((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: next,
              progress: next === "Completed" ? 100 : next === "Importing" ? 48 : item.progress,
            }
          : item,
      ),
    );
  }

  function updateAppearance<K extends keyof Appearance>(axis: K, value: Appearance[K]) {
    setAppearance((current) => ({ ...current, [axis]: value }));
    persistAppearanceAxis(document.documentElement, axis, value);
  }

  return (
    <div className={styles.shell}>
      <SidebarProvider sidebarId="content-library-sidebar">
        {!isMobile ? (
          <Sidebar aria-label="Content Library sidebar">
            <SidebarHeader>
              <div className={styles.brand}>
                <span>
                  <Boxes aria-hidden />
                </span>
                <div>
                  <strong>Northstar Library</strong>
                  <small>Creative workspace</small>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <LibraryNavigation active={section} onSelect={selectSection} />
            </SidebarContent>
            <SidebarFooter>
              <div className={styles["storage-note"]}>
                <span>Workspace storage</span>
                <strong>74.2 GB of 100 GB</strong>
                <Progress value={74} aria-label="Workspace storage, 74 percent used" />
              </div>
            </SidebarFooter>
            <SidebarRail label="Toggle library sidebar" />
          </Sidebar>
        ) : null}

        <SidebarInset className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles["topbar-title"]}>
              {isMobile ? (
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                  <Tooltip label="Open library navigation">
                    <SheetTrigger
                      render={
                        <Button
                          icon={PanelLeft}
                          aria-label="Open library navigation"
                          tooltip={false}
                          variant="secondary"
                        />
                      }
                    />
                  </Tooltip>
                  <SheetContent side="left" size="sm">
                    <SheetHeader>
                      <SheetTitle>Library navigation</SheetTitle>
                      <SheetDescription>Move between workspace areas.</SheetDescription>
                    </SheetHeader>
                    <SheetBody>
                      <LibraryNavigation active={section} onSelect={selectSection} />
                    </SheetBody>
                  </SheetContent>
                </Sheet>
              ) : (
                <SidebarTrigger label="Toggle library sidebar" />
              )}
              <div>
                <p>Northstar Library</p>
                <h1>{navItems.find(([value]) => value === section)?.[1]}</h1>
              </div>
            </div>
            <Button
              leadingIcon={Plus}
              onClick={() => {
                setSection("imports");
                updateImport("campaign-set", "Importing");
              }}
            >
              Import assets
            </Button>
          </header>

          {section === "library" ? (
            <LibrarySection
              assets={filteredAssets}
              kind={kind}
              loading={loading}
              query={query}
              selectedIds={selectedIds}
              status={status}
              viewMode={isMobile ? "list" : viewMode}
              onClearFilters={clearFilters}
              onKindChange={setKind}
              onLoadingChange={() => setLoading((value) => !value)}
              onOpenPreview={openPreview}
              onQueryChange={setQuery}
              onSelect={toggleSelection}
              onStatusChange={setStatus}
              onViewModeChange={setViewMode}
            />
          ) : null}
          {section === "collections" ? (
            <CollectionsSection onOpenLibrary={() => setSection("library")} />
          ) : null}
          {section === "imports" ? (
            <ImportsSection imports={imports} onUpdate={updateImport} />
          ) : null}
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

      {selectedIds.length ? (
        <aside className={styles["selection-bar"]} aria-live="polite">
          <strong>{selectedIds.length} selected</strong>
          <Button variant="secondary" onClick={() => setSelectedIds([])}>
            Clear
          </Button>
          <Button onClick={bulkArchive}>Archive selection</Button>
        </aside>
      ) : null}

      <Dialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) {
            setEditing(false);
            setTitleError("");
            window.requestAnimationFrame(() => previewTriggerRef.current?.focus());
          }
        }}
        trigger={<button className={styles["dialog-trigger"]} tabIndex={-1} aria-hidden />}
        title={editing ? "Edit metadata" : selectedAsset.title}
        description={`${selectedAsset.kind} · ${selectedAsset.collection}`}
        className={styles["preview-dialog"]}
      >
        <div className={styles["preview-layout"]}>
          <Artwork asset={selectedAsset} />
          {editing ? (
            <div className={styles["editor-fields"]}>
              <Field label="Title" message={titleError || undefined} invalid={Boolean(titleError)}>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                  aria-invalid={Boolean(titleError)}
                />
              </Field>
              <Field label="Description and alt text">
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.currentTarget.value)}
                />
              </Field>
              <Select
                label="Collection"
                defaultValue={selectedAsset.collection}
                options={collections.map((collection) => ({
                  label: collection.name,
                  value: collection.name,
                }))}
              />
              <Select
                label="Status"
                defaultValue={selectedAsset.status}
                options={["Published", "Draft", "Archived"].map((value) => ({
                  label: value,
                  value,
                }))}
              />
            </div>
          ) : (
            <dl className={styles.metadata}>
              <div>
                <dt>Description</dt>
                <dd>{selectedAsset.description}</dd>
              </div>
              <div>
                <dt>Dimensions</dt>
                <dd>{selectedAsset.dimensions}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{selectedAsset.size}</dd>
              </div>
              <div>
                <dt>Tags</dt>
                <dd>{selectedAsset.tags.join(", ")}</dd>
              </div>
            </dl>
          )}
        </div>
        <DialogFooter>
          {editing ? (
            <>
              <Button variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveMetadata}>Save metadata</Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit metadata</Button>
          )}
        </DialogFooter>
      </Dialog>
      <ToastViewport />
    </div>
  );
}

function LibrarySection({
  assets: visibleAssets,
  kind,
  loading,
  query,
  selectedIds,
  status,
  viewMode,
  onClearFilters,
  onKindChange,
  onLoadingChange,
  onOpenPreview,
  onQueryChange,
  onSelect,
  onStatusChange,
  onViewModeChange,
}: {
  assets: readonly Asset[];
  kind: string;
  loading: boolean;
  query: string;
  selectedIds: readonly string[];
  status: string;
  viewMode: ViewMode;
  onClearFilters: () => void;
  onKindChange: (value: string) => void;
  onLoadingChange: () => void;
  onOpenPreview: (asset: Asset, trigger: HTMLButtonElement) => void;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
  onStatusChange: (value: string) => void;
  onViewModeChange: (value: ViewMode) => void;
}) {
  return (
    <main className={styles.content}>
      <section className={styles.hero} aria-labelledby="library-heading">
        <div>
          <p>Creative workspace</p>
          <h2 id="library-heading">Everything your team can publish</h2>
          <span>86 assets across 12 collections · 3 imports need attention</span>
        </div>
        <div className={styles["recent-strip"]} aria-label="Recent assets">
          {assets.slice(0, 3).map((asset) => (
            <Artwork key={asset.id} asset={asset} compact />
          ))}
        </div>
      </section>

      <section className={styles.toolbar} aria-label="Library controls">
        <Field label="Search library" className={styles.search}>
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.currentTarget.value)}
            placeholder="Search assets, tags, collections"
          />
        </Field>
        <Select
          label="Asset type"
          value={kind}
          onValueChange={(value) => onKindChange(value)}
          options={["All types", "Image", "Video", "Document"].map((value) => ({
            label: value,
            value,
          }))}
        />
        <Select
          label="Publishing status"
          value={status}
          onValueChange={(value) => onStatusChange(value)}
          options={["All statuses", "Published", "Draft", "Archived"].map((value) => ({
            label: value,
            value,
          }))}
        />
        <div className={styles["toolbar-actions"]}>
          <Tooltip label={loading ? "Show assets" : "Simulate loading"}>
            <Button
              icon={loading ? Check : Monitor}
              aria-label={loading ? "Show assets" : "Simulate loading"}
              tooltip={false}
              variant="secondary"
              onClick={onLoadingChange}
            />
          </Tooltip>
          <div className={styles["view-switch"]} aria-label="View style">
            <Button
              icon={Boxes}
              aria-label="Grid view"
              tooltip="Grid view"
              variant={viewMode === "grid" ? "primary" : "secondary"}
              aria-pressed={viewMode === "grid"}
              onClick={() => onViewModeChange("grid")}
            />
            <Button
              icon={Rows3}
              aria-label="List view"
              tooltip="List view"
              variant={viewMode === "list" ? "primary" : "secondary"}
              aria-pressed={viewMode === "list"}
              onClick={() => onViewModeChange("list")}
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className={styles["loading-grid"]} role="status" aria-label="Loading assets">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index}>
              <Skeleton className={styles["artwork-skeleton"]} />
              <Skeleton />
              <Skeleton />
            </Card>
          ))}
        </div>
      ) : visibleAssets.length ? (
        <div className={styles[viewMode]} aria-label={`${viewMode} asset view`}>
          {visibleAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              selected={selectedIds.includes(asset.id)}
              viewMode={viewMode}
              onOpenPreview={(trigger) => onOpenPreview(asset, trigger)}
              onSelect={() => onSelect(asset.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateHeader>
            <EmptyStateTitle>No assets found</EmptyStateTitle>
            <EmptyStateDescription>
              Try a broader search or reset the current type and status filters.
            </EmptyStateDescription>
          </EmptyStateHeader>
          <EmptyStateActions>
            <Button onClick={onClearFilters}>Reset filters</Button>
          </EmptyStateActions>
        </EmptyState>
      )}
    </main>
  );
}

function AssetCard({
  asset,
  selected,
  viewMode,
  onOpenPreview,
  onSelect,
}: {
  asset: Asset;
  selected: boolean;
  viewMode: ViewMode;
  onOpenPreview: (trigger: HTMLButtonElement) => void;
  onSelect: () => void;
}) {
  return (
    <Card className={styles.asset} data-view={viewMode} data-selected={selected ? "" : undefined}>
      <div className={styles["asset-select"]}>
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          aria-label={`Select ${asset.title}`}
        />
      </div>
      <Artwork asset={asset} compact={viewMode === "list"} />
      <div className={styles["asset-copy"]}>
        <div>
          <strong>{asset.title}</strong>
          <span>{asset.collection}</span>
        </div>
        <div className={styles.tags}>
          <Badge size="sm" variant={statusTone(asset.status)}>
            {asset.status}
          </Badge>
          <Badge size="sm">{asset.kind}</Badge>
        </div>
        <small>
          {asset.size} · {asset.updated}
        </small>
      </div>
      <Button variant="secondary" onClick={(event) => onOpenPreview(event.currentTarget)}>
        Preview
      </Button>
    </Card>
  );
}

function CollectionsSection({ onOpenLibrary }: { onOpenLibrary: () => void }) {
  const [visible, setVisible] = React.useState(true);

  return (
    <main className={styles.content}>
      <header className={styles["section-heading"]}>
        <div>
          <p>Organize once, reuse everywhere</p>
          <h2>Collections</h2>
        </div>
        <Button leadingIcon={Plus} onClick={() => setVisible(true)}>
          New collection
        </Button>
      </header>
      {visible ? (
        <div className={styles["collection-grid"]}>
          {collections.map((collection) => (
            <Card key={collection.name} className={styles.collection}>
              <span className={styles["collection-icon"]}>
                <Layers aria-hidden />
              </span>
              <div>
                <strong>{collection.name}</strong>
                <p>{collection.description}</p>
              </div>
              <Badge>{collection.count} assets</Badge>
              <Button variant="secondary" onClick={onOpenLibrary}>
                Open collection
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateHeader>
            <EmptyStateTitle>No collections yet</EmptyStateTitle>
            <EmptyStateDescription>
              Create a collection to group campaign and product assets.
            </EmptyStateDescription>
          </EmptyStateHeader>
        </EmptyState>
      )}
      <Button
        className={styles["state-toggle"]}
        variant="ghost"
        onClick={() => setVisible(!visible)}
      >
        {visible ? "Show empty collection state" : "Restore collections"}
      </Button>
    </main>
  );
}

function ImportsSection({
  imports,
  onUpdate,
}: {
  imports: readonly { id: string; name: string; status: ImportStatus; progress: number }[];
  onUpdate: (id: string, status: ImportStatus) => void;
}) {
  const [showQueue, setShowQueue] = React.useState(true);

  return (
    <main className={styles.content}>
      <header className={styles["section-heading"]}>
        <div>
          <p>Local deterministic import queue</p>
          <h2>Imports</h2>
        </div>
        <Button leadingIcon={Plus} onClick={() => setShowQueue(true)}>
          Add files
        </Button>
      </header>
      {showQueue ? (
        <div className={styles["import-list"]}>
          {imports.map((item) => (
            <Card key={item.id} className={styles.import}>
              <span className={styles["import-icon"]}>
                {item.status === "Failed" ? <X aria-hidden /> : <PackageOpen aria-hidden />}
              </span>
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.status === "Queued"
                    ? "Waiting for an available import slot"
                    : item.status === "Failed"
                      ? "Metadata manifest could not be read"
                      : item.status === "Completed"
                        ? "Added to Northstar Library"
                        : `${item.progress}% · Processing local files`}
                </span>
                {item.status === "Importing" ? (
                  <Progress value={item.progress} aria-label={`${item.name}, ${item.progress}%`} />
                ) : null}
              </div>
              <Badge variant={statusTone(item.status)}>{item.status}</Badge>
              {item.status === "Queued" ? (
                <Button variant="secondary" onClick={() => onUpdate(item.id, "Importing")}>
                  Start
                </Button>
              ) : null}
              {item.status === "Importing" ? (
                <Button variant="secondary" onClick={() => onUpdate(item.id, "Completed")}>
                  Finish
                </Button>
              ) : null}
              {item.status === "Failed" ? (
                <Button variant="secondary" onClick={() => onUpdate(item.id, "Importing")}>
                  Retry
                </Button>
              ) : null}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateHeader>
            <EmptyStateTitle>Import queue is empty</EmptyStateTitle>
            <EmptyStateDescription>
              Drop files here or add a local archive to start an import.
            </EmptyStateDescription>
          </EmptyStateHeader>
          <EmptyStateActions>
            <Button onClick={() => setShowQueue(true)}>Restore sample queue</Button>
          </EmptyStateActions>
        </EmptyState>
      )}
      <Button
        className={styles["state-toggle"]}
        variant="ghost"
        onClick={() => setShowQueue(!showQueue)}
      >
        {showQueue ? "Clear sample queue" : "Show sample queue"}
      </Button>
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
          <p>Preview the same library under supported runtime axes</p>
          <h2>Appearance</h2>
        </div>
      </header>
      <Card className={styles["settings-card"]}>
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
        <Alert tone="info" title="Template-local settings">
          These controls exercise Nerio runtime axes without introducing a media-specific Core API.
        </Alert>
      </Card>
    </main>
  );
}

export function ContentLibraryView() {
  return (
    <ToastProvider>
      <ContentLibraryApp />
    </ToastProvider>
  );
}
