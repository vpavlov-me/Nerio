import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import {
  Avatar,
  Alert,
  Badge,
  ButtonGroup,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardVisual,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Field,
  Input,
  InputGroup,
  InputGroupAddon,
  Icon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Kbd,
  Label,
  LabelContent,
  LabelRequired,
  LabelRow,
  List,
  Pagination,
  Progress,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  Spinner,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/index";
import {
  Button,
  Checkbox,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  Dialog,
  DropdownMenu,
  LabelHint,
  Popover,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
  Tooltip,
  Toast,
  ToastProvider,
  ToastViewport,
  createToastManager,
  useToastManager,
} from "../../src/client";
import { ArrowRight, Bell, Check, type IconSvgProps } from "@nerio-ui/adapters/icons";
import { RouterLinkFixture } from "../fixtures/router-link";

const CustomSvgIcon = React.forwardRef<SVGSVGElement, IconSvgProps>(function CustomSvgIcon(
  { size, strokeWidth, ...props },
  ref,
) {
  return (
    <svg ref={ref} data-size={size} data-stroke-width={strokeWidth} viewBox="0 0 24 24" {...props}>
      <path d="M4 12h16" />
    </svg>
  );
});

function SheetExample({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Sheet
      defaultOpen={open === undefined ? undefined : false}
      onOpenChange={onOpenChange}
      open={open}
    >
      <SheetTrigger render={<button type="button">Open settings</button>} />
      <SheetContent side="left" size="lg">
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>Configure workspace defaults.</SheetDescription>
        </SheetHeader>
        <SheetBody>Settings content</SheetBody>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Compile-time public API contracts. These must fail if Button or Card modes regress.
// @ts-expect-error empty Button requires visible children or icon-only mode
const invalidEmptyButton = <Button />;
// @ts-expect-error icon-only Button requires an accessible name
const invalidUnnamedIconButton = <Button icon={Bell} />;
// @ts-expect-error meaningful standalone Icon requires a label.
const invalidUnnamedMeaningfulIcon = <Icon decorative={false} icon={Bell} />;
// @ts-expect-error Icon owns its non-focusable SVG contract.
const invalidFocusableIcon = <Icon focusable icon={Bell} />;
// @ts-expect-error Icon never exposes the SVG in the tab order.
const invalidTabIndexedIcon = <Icon icon={Bell} tabIndex={0} />;
// @ts-expect-error icon-only Button cannot include visible children
const invalidMixedIconButton = (
  <Button icon={Bell} aria-label="Notifications">
    Notifications
  </Button>
);
// @ts-expect-error icon-only Button cannot receive directional icon props
const invalidDirectionalIconButton = (
  <Button icon={Bell} aria-label="Notifications" leadingIcon={Bell} />
);
// @ts-expect-error Button shortcuts only accept text, numbers, or Nerio Kbd elements
const invalidButtonKbd = <Button kbd={<span>⌘K</span>}>Search</Button>;
// @ts-expect-error icon-only Button cannot include a Badge
const invalidIconButtonBadge = (
  <Button icon={Bell} aria-label="Notifications" badge={<Badge>2</Badge>} />
);
// @ts-expect-error linked Cards cannot also choose a surface root
const invalidLinkedCard = <Card href="/docs" as="article" />;
// @ts-expect-error Date inputs have a dedicated future component boundary.
const invalidInputType = <Input type="date" />;
// @ts-expect-error Native HTML size is exposed as htmlSize, not Input size.
const invalidNativeInputSize = <Input size={24} />;
// @ts-expect-error Input sizes are limited to the shared control scale.
const invalidInputScale = <Input size="xl" />;
// @ts-expect-error RadioGroup accepts either options or composition, not both.
const invalidMixedRadioGroup = (
  <RadioGroup label="Visibility" options={[{ label: "Team", value: "team" }]}>
    <RadioGroupItem value="private">Private</RadioGroupItem>
  </RadioGroup>
);
// @ts-expect-error standalone Spinner requires a localized label
const invalidUnnamedSpinner = <Spinner />;
// @ts-expect-error decorative Spinner must not expose a separate label
const invalidDecorativeSpinnerLabel = <Spinner decorative label="Loading" />;
// @ts-expect-error Spinner does not accept custom children
const invalidSpinnerChildren = <Spinner label="Loading">Loading</Spinner>;
// @ts-expect-error Progress requires an accessible name
const invalidUnnamedProgress = <Progress value={50} />;
// @ts-expect-error Progress uses exactly one naming strategy
const invalidConflictingProgressName = (
  <Progress aria-label="Upload progress" label="Upload" value={50} />
);
// @ts-expect-error Progress owns its anatomy and does not accept children
const invalidProgressChildren = <Progress aria-label="Upload progress">Upload</Progress>;
// @ts-expect-error Progress owns the normalized ARIA range
const invalidProgressRange = <Progress aria-label="Upload progress" aria-valuenow={50} />;
// @ts-expect-error Progress owns its semantic role
const invalidProgressRole = <Progress aria-label="Upload progress" role="meter" />;
// @ts-expect-error Progress does not expose outcome variants
const invalidProgressTone = <Progress aria-label="Upload progress" tone="success" />;
const validVisibleProgress = <Progress label="Upload" value={50} />;
const validAriaLabelProgress = <Progress aria-label="Upload progress" value={50} />;
const validAriaLabelledByProgress = <Progress aria-labelledby="upload-label" value={50} />;
const validComposedRadioGroup = (
  <RadioGroup label="Visibility">
    <RadioGroupItem value="team">Team</RadioGroupItem>
  </RadioGroup>
);
// @ts-expect-error Select accepts either options or curated item composition, not both.
const invalidMixedSelect = (
  <Select label="Status" options={[{ label: "Draft", value: "draft" }]}>
    <SelectItem value="published">Published</SelectItem>
  </Select>
);
const validComposedSelect = (
  <Select label="Status">
    <SelectItem value="draft">Draft</SelectItem>
  </Select>
);
void [
  invalidEmptyButton,
  invalidUnnamedIconButton,
  invalidUnnamedMeaningfulIcon,
  invalidFocusableIcon,
  invalidTabIndexedIcon,
  invalidMixedIconButton,
  invalidDirectionalIconButton,
  invalidButtonKbd,
  invalidIconButtonBadge,
  invalidLinkedCard,
  invalidInputType,
  invalidNativeInputSize,
  invalidInputScale,
  invalidMixedRadioGroup,
  invalidUnnamedSpinner,
  invalidDecorativeSpinnerLabel,
  invalidSpinnerChildren,
  invalidUnnamedProgress,
  invalidConflictingProgressName,
  invalidProgressChildren,
  invalidProgressRange,
  invalidProgressRole,
  invalidProgressTone,
  validVisibleProgress,
  validAriaLabelProgress,
  validAriaLabelledByProgress,
  validComposedRadioGroup,
  invalidMixedSelect,
  validComposedSelect,
];

describe("Core static contracts", () => {
  it("normalizes Lucide and custom SVG icons through one server-safe contract", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      const { container } = render(
        <>
          <Icon
            className="lucide-icon"
            icon={Bell}
            lucideAbsoluteStrokeWidth
            size={18}
            strokeWidth={1.5}
          />
          <Icon
            className="custom-icon"
            decorative={false}
            icon={CustomSvgIcon}
            label="Workspace activity"
            size={20}
            strokeWidth={1.25}
          />
        </>,
      );

      const [lucideIcon, customIcon] = Array.from(container.querySelectorAll("svg"));
      expect(lucideIcon).toHaveClass("n-icon", "lucide-icon");
      expect(lucideIcon).toHaveAttribute("aria-hidden", "true");
      expect(lucideIcon).toHaveAttribute("focusable", "false");
      expect(lucideIcon).toHaveAttribute("width", "18");
      expect(customIcon).toHaveClass("n-icon", "custom-icon");
      expect(customIcon).toHaveAttribute("role", "img");
      expect(customIcon).toHaveAttribute("aria-label", "Workspace activity");
      expect(customIcon).not.toHaveAttribute("aria-hidden");
      expect(customIcon).toHaveAttribute("focusable", "false");
      expect(customIcon).toHaveAttribute("data-size", "20");
      expect(customIcon).toHaveAttribute("data-stroke-width", "1.25");
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });

  it("keeps Icon and composeRefs available through the server-safe entrypoint", () => {
    const iconSource = readFileSync(resolve(process.cwd(), "src/components/icon.tsx"), "utf8");
    const composeRefsSource = readFileSync(
      resolve(process.cwd(), "src/lib/compose-refs.ts"),
      "utf8",
    );
    const indexSource = readFileSync(resolve(process.cwd(), "src/index.ts"), "utf8");

    expect(iconSource).not.toMatch(/^["']use client["'];/);
    expect(composeRefsSource).not.toMatch(/^["']use client["'];/);
    expect(indexSource).toContain('export { Icon } from "./components/icon"');
    expect(indexSource).toContain('export { composeRefs } from "./lib/compose-refs"');
    expect(indexSource).toContain("LucideIconProps");
  });

  it("keeps Icon-owned accessibility semantics ahead of unsafe runtime props", () => {
    const unsafeProps = {
      "aria-hidden": false,
      "aria-label": "Consumer override",
      focusable: true,
      role: "presentation",
      tabIndex: 0,
    } as Record<string, unknown>;
    const UnsafeIcon = Icon as React.ComponentType<Record<string, unknown>>;
    const { container } = render(
      <>
        <UnsafeIcon {...unsafeProps} icon={Bell} />
        <UnsafeIcon {...unsafeProps} decorative={false} icon={Bell} label="Workspace activity" />
      </>,
    );

    const [decorativeIcon, meaningfulIcon] = Array.from(container.querySelectorAll("svg"));
    expect(decorativeIcon).toHaveAttribute("aria-hidden", "true");
    expect(decorativeIcon).not.toHaveAttribute("aria-label");
    expect(decorativeIcon).not.toHaveAttribute("role");
    expect(decorativeIcon).toHaveAttribute("focusable", "false");
    expect(decorativeIcon).not.toHaveAttribute("tabindex");
    expect(meaningfulIcon).not.toHaveAttribute("aria-hidden");
    expect(meaningfulIcon).toHaveAttribute("aria-label", "Workspace activity");
    expect(meaningfulIcon).toHaveAttribute("role", "img");
    expect(meaningfulIcon).toHaveAttribute("focusable", "false");
    expect(meaningfulIcon).not.toHaveAttribute("tabindex");
  });

  it("rejects empty accessible labels for meaningful Icons", () => {
    expect(() => render(<Icon decorative={false} icon={Bell} label="  " />)).toThrow(
      /non-empty label/,
    );
  });

  it("keeps Item composition static by default and exposes stable slots", () => {
    const itemRef = React.createRef<HTMLDivElement>();
    render(
      <Item ref={itemRef} className="custom-item" data-selected variant="outline" size="lg">
        <ItemHeader>Workspace</ItemHeader>
        <ItemMedia variant="icon">W</ItemMedia>
        <ItemContent>
          <ItemTitle>Workspace settings</ItemTitle>
          <ItemDescription>Manage members, billing, and security.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <button type="button">Open</button>
        </ItemActions>
        <ItemFooter>Updated today</ItemFooter>
      </Item>,
    );

    const item = screen.getByText("Workspace settings").closest(".n-item");
    expect(item).toBe(itemRef.current);
    expect(item).toHaveClass("custom-item");
    expect(item).toHaveAttribute("data-slot", "item");
    expect(item).toHaveAttribute("data-variant", "outline");
    expect(item).toHaveAttribute("data-size", "lg");
    expect(item).toHaveAttribute("data-selected");
    expect(item?.tagName).toBe("DIV");
    expect(item).not.toHaveAttribute("tabindex");
    expect(item?.querySelector('[data-slot="item-header"]')).toHaveTextContent("Workspace");
    expect(item?.querySelector('[data-slot="item-media"]')).toHaveAttribute("data-variant", "icon");
    expect(item?.querySelector('[data-slot="item-content"]')).toBeInTheDocument();
    expect(item?.querySelector('[data-slot="item-description"]')).toHaveTextContent(
      "Manage members, billing, and security.",
    );
    expect(item?.querySelector('[data-slot="item-actions"]')).toBeInTheDocument();
    expect(item?.querySelector('[data-slot="item-footer"]')).toHaveTextContent("Updated today");
  });

  it("renders semantic Item roots, grouped separators, and preserves disabled semantics", () => {
    const linkRef = React.createRef<HTMLAnchorElement>();
    render(
      <ItemGroup aria-label="Workspace destinations">
        <Item ref={linkRef} render={<a href="/settings" />} size="sm">
          <ItemContent>
            <ItemTitle>Settings</ItemTitle>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item aria-disabled="true" data-loading variant="soft">
          <ItemContent>
            <ItemTitle>Synchronizing</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>,
    );

    const group = screen.getByLabelText("Workspace destinations");
    expect(group).toHaveAttribute("data-slot", "item-group");
    const link = screen.getByRole("link", { name: "Settings" });
    expect(linkRef.current).toBe(link);
    expect(link).toHaveAttribute("href", "/settings");
    expect(link).toHaveClass("n-item");
    expect(link).toHaveAttribute("data-size", "sm");
    expect(group.querySelector('[data-slot="item-separator"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    const loadingItem = screen.getByText("Synchronizing").closest(".n-item");
    expect(loadingItem).toHaveAttribute("aria-disabled", "true");
    expect(loadingItem).toHaveAttribute("data-loading");
  });

  it("composes render-element and forwarded Item refs without dropping either ref shape", () => {
    const renderObjectRef = React.createRef<HTMLAnchorElement>();
    const forwardedCallbackRef = vi.fn<(node: HTMLElement | null) => void>();
    const renderCallbackRef = vi.fn<(node: HTMLElement | null) => void>();
    const forwardedObjectRef = React.createRef<HTMLElement>();
    const renderOnlyRef = React.createRef<HTMLAnchorElement>();
    const forwardedOnlyRef = React.createRef<HTMLElement>();
    const groupRenderRef = React.createRef<HTMLElement>();
    const groupForwardedRef = vi.fn<(node: HTMLElement | null) => void>();

    render(
      <>
        <Item
          ref={forwardedCallbackRef}
          render={<a ref={renderObjectRef} href="/both-object-callback" />}
        >
          Both refs
        </Item>
        <Item ref={forwardedObjectRef} render={<a ref={renderCallbackRef} href="/both-callback" />}>
          Callback render ref
        </Item>
        <Item render={<a ref={renderOnlyRef} href="/render-only" />}>Render ref only</Item>
        <Item ref={forwardedOnlyRef}>Forwarded ref only</Item>
        <ItemGroup ref={groupForwardedRef} render={<section ref={groupRenderRef} />}>
          Group refs
        </ItemGroup>
      </>,
    );

    const bothLink = screen.getByRole("link", { name: "Both refs" });
    const callbackLink = screen.getByRole("link", { name: "Callback render ref" });
    expect(renderObjectRef.current).toBe(bothLink);
    expect(forwardedCallbackRef).toHaveBeenLastCalledWith(bothLink);
    expect(renderCallbackRef).toHaveBeenLastCalledWith(callbackLink);
    expect(forwardedObjectRef.current).toBe(callbackLink);
    expect(renderOnlyRef.current).toBe(screen.getByRole("link", { name: "Render ref only" }));
    expect(forwardedOnlyRef.current).toBe(screen.getByText("Forwarded ref only"));
    expect(groupRenderRef.current).toBe(screen.getByText("Group refs"));
    expect(groupForwardedRef).toHaveBeenLastCalledWith(screen.getByText("Group refs"));
  });

  it("groups related Buttons with named horizontal and vertical layouts", async () => {
    const user = userEvent.setup();
    render(
      <>
        <span id="document-actions-label">Document actions</span>
        <ButtonGroup aria-labelledby="document-actions-label">
          <Button render={<a href="/preview" />} variant="secondary">
            Preview
          </Button>
          <Button variant="secondary">Save</Button>
        </ButtonGroup>
        <div data-density="compact" dir="rtl">
          <ButtonGroup aria-label="Publishing actions" orientation="vertical">
            <Button loading variant="secondary">
              Publish
            </Button>
            <Button disabled variant="secondary">
              Archive
            </Button>
          </ButtonGroup>
        </div>
      </>,
    );
    const group = screen.getByRole("group", { name: "Document actions" });
    expect(group).toHaveAttribute("data-slot", "button-group");
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("link", { name: "Preview" })).toHaveAttribute("href", "/preview");
    const verticalGroup = screen.getByRole("group", { name: "Publishing actions" });
    expect(verticalGroup).toHaveAttribute("data-orientation", "vertical");
    expect(verticalGroup.parentElement).toHaveAttribute("data-density", "compact");
    expect(verticalGroup.parentElement).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("button", { name: "Publish" })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Archive" })).toBeDisabled();

    await user.tab();
    expect(screen.getByRole("link", { name: "Preview" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  });

  it("preserves every Button variant and composed content contract", () => {
    const variants = ["primary", "secondary", "outline", "ghost", "link", "danger"] as const;
    render(
      <>
        {variants.map((variant) => (
          <ButtonGroup key={variant} aria-label={`${variant} actions`}>
            <Button variant={variant}>{variant} one</Button>
            <Button variant={variant}>{variant} two</Button>
          </ButtonGroup>
        ))}
        <ButtonGroup aria-label="Composed actions">
          <Button badge={<Badge tone="info">3</Badge>} kbd={<Kbd>⌘K</Kbd>} variant="outline">
            Inspect
          </Button>
          <Button icon={Bell} aria-label="More composed actions" variant="outline" />
        </ButtonGroup>
      </>,
    );

    for (const variant of variants) {
      const group = screen.getByRole("group", { name: `${variant} actions` });
      expect(group.querySelectorAll(`[data-variant="${variant}"]`)).toHaveLength(2);
    }
    const composedGroup = screen.getByRole("group", { name: "Composed actions" });
    expect(composedGroup.querySelector('[data-slot="button-badge"]')).toHaveTextContent("3");
    expect(composedGroup.querySelector('[data-slot="button-kbd"]')).toHaveTextContent("⌘K");
    expect(screen.getByRole("button", { name: "More composed actions" })).toHaveAttribute(
      "data-icon-only",
      "true",
    );
  });

  it("keeps ButtonGroup attachment, focus layering, RTL, and density contracts in Tailwind", () => {
    const buttonGroupSource = readFileSync(
      resolve(process.cwd(), "src/components/button-group.tsx"),
      "utf8",
    );
    expect(buttonGroupSource).toContain("[&>.n-button+.n-button]:ms-");
    expect(buttonGroupSource).toContain("data-[orientation=vertical]:[&>.n-button+.n-button]:mt-");
    expect(buttonGroupSource).toContain(
      "rtl:data-[orientation=vertical]:[&>.n-button+.n-button::before]:translate-x-1/2",
    );
    expect(buttonGroupSource).toContain("[&>.n-button:first-child]:rounded-s-");
    expect(buttonGroupSource).toContain(
      "data-[orientation=vertical]:[&>.n-button:first-child]:rounded-b-none",
    );
    expect(buttonGroupSource).toContain("[&>.n-button:focus-visible]:z-2");
    expect(buttonGroupSource).toContain(
      "data-[orientation=vertical]:[&>.n-button:only-child]:rounded-(--n-button-radius)",
    );
    expect(buttonGroupSource).not.toContain("overflow-hidden");
  });

  it("renders decorative Badge icons on either side of its status label and supports loading", () => {
    const { rerender } = render(
      <Badge tone="success" leadingIcon={Check} trailingIcon={ArrowRight}>
        Published
      </Badge>,
    );
    const badge = screen.getByText("Published").closest(".n-badge");
    expect(badge).toHaveAttribute("data-tone", "success");
    expect(badge).toHaveAttribute("data-emphasis", "soft");
    expect(badge).toHaveAttribute("data-size", "md");
    expect(badge?.querySelector('[data-slot="leading-icon"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(badge?.querySelector('[data-slot="trailing-icon"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    rerender(
      <Badge loading leadingIcon={Bell}>
        Publishing
      </Badge>,
    );
    const loadingBadge = screen.getByText("Publishing").closest(".n-badge");
    expect(loadingBadge).toHaveAttribute("aria-busy", "true");
    expect(loadingBadge?.querySelector('[data-slot="leading-icon"] .n-spinner')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(loadingBadge?.querySelector("[role=status]")).not.toBeInTheDocument();

    rerender(
      <Badge tone="danger" emphasis="strong">
        Deployment blocked
      </Badge>,
    );
    expect(screen.getByText("Deployment blocked").closest(".n-badge")).toHaveAttribute(
      "data-emphasis",
      "strong",
    );

    rerender(
      <Badge icon={Bell} size="sm">
        Notifications
      </Badge>,
    );
    expect(
      screen
        .getByText("Notifications")
        .closest(".n-badge")
        ?.querySelector('[data-slot="leading-icon"]'),
    ).not.toBeNull();
    expect(screen.getByText("Notifications").closest(".n-badge")).toHaveAttribute(
      "data-size",
      "sm",
    );

    rerender(<Badge size="lg">Featured</Badge>);
    expect(screen.getByText("Featured").closest(".n-badge")).toHaveAttribute("data-size", "lg");
  });

  it("keeps Spinner semantics, anatomy, and forwarded DOM props intentional", () => {
    const ref = React.createRef<HTMLSpanElement>();
    const unsafeProps = {
      "aria-hidden": "false",
      "data-size": "lg",
      "data-slot": "consumer",
      role: "alert",
    } as React.ComponentPropsWithoutRef<"span">;
    render(
      <>
        <Spinner label="Loading activity" />
        <Spinner decorative data-testid="small-spinner" size="sm" />
        <Spinner decorative data-testid="decorative-spinner" size="lg" />
        <Spinner ref={ref} className="custom-spinner" label="Saving changes" {...unsafeProps} />
      </>,
    );

    const standalone = screen.getAllByRole("status")[0];
    expect(standalone).toHaveAttribute("data-slot", "root");
    expect(standalone).toHaveAttribute("data-size", "md");
    expect(standalone.querySelector('[data-slot="label"]')).toHaveTextContent("Loading activity");

    const decorative = screen.getByTestId("decorative-spinner");
    expect(screen.getByTestId("small-spinner")).toHaveAttribute("data-size", "sm");
    expect(decorative).toHaveAttribute("aria-hidden", "true");
    expect(decorative).not.toHaveAttribute("role");
    expect(decorative.querySelector('[data-slot="label"]')).not.toBeInTheDocument();
    expect(decorative).toHaveAttribute("data-size", "lg");

    expect(ref.current).toHaveClass("n-spinner", "custom-spinner");
    expect(ref.current).toHaveAttribute("data-slot", "root");
    expect(ref.current).toHaveAttribute("data-size", "md");
    expect(ref.current).toHaveAttribute("role", "status");
    expect(ref.current).not.toHaveAttribute("aria-hidden");
  });

  it("keeps Spinner animation independent from Button tokens and stops it for reduced motion", () => {
    const spinnerStyles = readFileSync(resolve(process.cwd(), "src/styles/spinner.css"), "utf8");
    const spinnerSource = readFileSync(
      resolve(process.cwd(), "src/components/spinner.tsx"),
      "utf8",
    );
    expect(spinnerStyles).not.toContain("--n-button-");
    expect(spinnerStyles).toContain("@keyframes n-spin");
    expect(spinnerSource).toContain("motion-reduce:animate-none");
  });

  it("renders Kbd with a native semantic element and a stable styling hook", () => {
    render(<Kbd>⌘S</Kbd>);
    const shortcut = screen.getByText("⌘S");
    expect(shortcut.tagName).toBe("KBD");
    expect(shortcut).toHaveClass("n-kbd");
    expect(shortcut).toHaveAttribute("data-slot", "kbd");

    const source = readFileSync(resolve(process.cwd(), "src/components/kbd.tsx"), "utf8");
    expect(source).toContain("inline-block");
    expect(source).toContain("align-baseline");
    expect(source).toContain("forced-colors:border-[CanvasText]");
  });

  it("keeps Progress semantics, root props, and protected anatomy intentional", () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();
    const unsafeProps = {
      "aria-valuemax": 999,
      "aria-valuemin": -999,
      "aria-valuenow": 999,
      "aria-valuetext": "Consumer value text",
      "data-slot": "consumer",
      "data-state": "consumer",
      role: "meter",
    } as React.ComponentPropsWithoutRef<"div">;
    render(
      <Progress
        ref={ref}
        aria-controls="upload-panel"
        aria-describedby="upload-help"
        className="custom-progress"
        data-consumer="progress"
        id="upload-progress"
        label="Uploading files"
        onClick={onClick}
        style={{ color: "red", "--n-progress-ratio": 0.2 } as React.CSSProperties}
        value={68}
        {...unsafeProps}
      />,
    );

    const progressbar = screen.getByRole("progressbar", { name: "Uploading files" });
    expect(ref.current).toBe(progressbar);
    expect(progressbar).toHaveClass("n-progress", "custom-progress");
    expect(progressbar).toHaveAttribute("data-slot", "root");
    expect(progressbar).toHaveAttribute("data-state", "progressing");
    expect(progressbar).toHaveAttribute("id", "upload-progress");
    expect(progressbar).toHaveAttribute("data-consumer", "progress");
    expect(progressbar).toHaveAttribute("aria-describedby", "upload-help");
    expect(progressbar).toHaveAttribute("aria-controls", "upload-panel");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "68");
    expect(progressbar).not.toHaveAttribute("aria-valuetext");
    fireEvent.click(progressbar);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(progressbar.style.getPropertyValue("--n-progress-ratio")).toBe("0.68");
    expect(progressbar.querySelector('[data-slot="track"]')).toHaveAttribute("aria-hidden", "true");
    expect(progressbar.querySelector('[data-slot="indicator"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps Progress naming and optional header slots explicit", () => {
    const { rerender } = render(<Progress label="Importing records" value={12} valueLabel="12%" />);
    const internalLabel = screen.getByText("Importing records");
    const progressbar = screen.getByRole("progressbar", { name: "Importing records" });
    expect(internalLabel).toHaveAttribute("data-slot", "label");
    expect(progressbar).toHaveAttribute("aria-labelledby", internalLabel.id);
    expect(screen.getByText("12%")).toHaveAttribute("data-slot", "value");
    expect(progressbar.querySelector('[data-slot="header"]')).toBeInTheDocument();

    rerender(
      <Progress aria-label="Synchronizing workspace" value={null} valueText="Synchronizing" />,
    );
    expect(screen.getByRole("progressbar", { name: "Synchronizing workspace" })).toHaveAttribute(
      "aria-valuetext",
      "Synchronizing",
    );
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-labelledby");
    expect(screen.getByRole("progressbar").querySelector('[data-slot="header"]')).toBeNull();

    rerender(
      <>
        <span id="external-progress-label">Exporting report</span>
        <Progress aria-labelledby="external-progress-label" value={40} />
      </>,
    );
    expect(screen.getByRole("progressbar", { name: "Exporting report" })).toHaveAttribute(
      "aria-labelledby",
      "external-progress-label",
    );
  });

  it("does not generate a hidden English Progress name at runtime", () => {
    const unsafeProps = { value: 50 } as unknown as React.ComponentProps<typeof Progress>;
    render(<Progress {...unsafeProps} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).not.toHaveAttribute("aria-label");
    expect(progressbar).not.toHaveAttribute("aria-labelledby");
  });

  it.each([
    [0, 0, "progressing"],
    [50, 50, "progressing"],
    [100, 100, "complete"],
    [-4, 0, "progressing"],
    [104, 100, "complete"],
  ])("clamps Progress value %s to %s", (value, expected, state) => {
    render(<Progress label="Upload progress" value={value} valueText={`${expected}% complete`} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", String(expected));
    expect(progressbar).toHaveAttribute("aria-valuetext", `${expected}% complete`);
    expect(progressbar).toHaveAttribute("data-state", state);
    expect(progressbar.style.getPropertyValue("--n-progress-ratio")).toBe(String(expected / 100));
  });

  it("normalizes custom, fractional, and invalid Progress ranges without invalid ARIA or CSS", () => {
    const { rerender } = render(
      <Progress label="Importing records" max={500} min={0} value={120} valueLabel="120 of 500" />,
    );
    let progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "120");
    expect(progressbar.style.getPropertyValue("--n-progress-ratio")).toBe("0.24");

    rerender(<Progress label="Fractional progress" max={3.5} min={1.5} value={2.25} />);
    progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemin", "1.5");
    expect(progressbar).toHaveAttribute("aria-valuemax", "3.5");
    expect(progressbar).toHaveAttribute("aria-valuenow", "2.25");
    expect(progressbar.style.getPropertyValue("--n-progress-ratio")).toBe("0.375");

    rerender(<Progress label="Invalid range" max={10} min={10} value={20} />);
    progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "20");
    expect(progressbar).toHaveAttribute("data-state", "progressing");
    expect(progressbar.style.getPropertyValue("--n-progress-ratio")).toBe("0.2");

    rerender(
      <Progress label="Non-finite range" max={Number.POSITIVE_INFINITY} min={0} value={50} />,
    );
    progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar.style.getPropertyValue("--n-progress-ratio")).toBe("0.5");
  });

  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "treats non-finite Progress value %s as indeterminate",
    (value) => {
      render(<Progress aria-label="Synchronizing" value={value} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).not.toHaveAttribute("aria-valuenow");
      expect(progressbar).not.toHaveAttribute("aria-valuetext");
      expect(progressbar).toHaveAttribute("data-state", "indeterminate");
      expect(progressbar.style.getPropertyValue("--n-progress-ratio")).toBe("0");
    },
  );

  it("keeps Progress styles isolated, transform-based, directional, and motion-safe", () => {
    const progressSource = readFileSync(
      resolve(process.cwd(), "src/components/progress.tsx"),
      "utf8",
    );
    const feedbackStyles = readFileSync(resolve(process.cwd(), "src/styles/feedback.css"), "utf8");
    expect(progressSource).toContain("scale-x-(--n-progress-ratio)");
    expect(progressSource).toContain(
      "data-[state=indeterminate]:[&_[data-slot=indicator]]:scale-x-100",
    );
    expect(progressSource).not.toContain("transition-[inline-size]");
    expect(progressSource).toContain("rtl:[&_[data-slot=indicator]]:origin-right");
    expect(progressSource).toContain("[animation-direction:reverse]");
    expect(progressSource).toContain("motion-reduce:data-[state=indeterminate]");
    expect(progressSource).toContain("--n-progress-indeterminate-reduced-position");
    expect(progressSource).toContain("forced-colors:");
    expect(progressSource).not.toMatch(/--n-(purple|blue|green|orange|red|gray)-/);
    expect(feedbackStyles).not.toContain(".n-progress");
  });

  it("allows deliberate Card and EmptyState heading semantics", () => {
    render(
      <>
        <Card as="article">
          <CardTitle as="h2">Overview</CardTitle>
        </Card>
        <EmptyState>
          <EmptyStateHeader>
            <EmptyStateTitle as="h4">No results</EmptyStateTitle>
            <EmptyStateDescription>Try another search.</EmptyStateDescription>
          </EmptyStateHeader>
        </EmptyState>
      </>,
    );
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Overview", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No results", level: 4 })).toBeInTheDocument();
  });

  it("renders linked secondary Cards as native interactive anchors", () => {
    render(
      <Card href="/docs/components/button" variant="secondary">
        Button documentation
      </Card>,
    );
    const card = screen.getByRole("link", { name: "Button documentation" });
    expect(card).toHaveAttribute("href", "/docs/components/button");
    expect(card).toHaveAttribute("data-variant", "secondary");
  });

  it("provides controlled visual and header-action Card anatomy", () => {
    render(
      <Card>
        <CardVisual>Workspace icon</CardVisual>
        <CardHeader>
          <div>
            <CardTitle>Workspace</CardTitle>
          </div>
          <CardAction>Active</CardAction>
        </CardHeader>
        <CardContent>Overview</CardContent>
      </Card>,
    );
    expect(screen.getByText("Workspace icon")).toHaveAttribute("data-slot", "card-visual");
    expect(screen.getByText("Workspace icon")).toHaveAttribute("data-placement", "inset");
    expect(screen.getByText("Active")).toHaveAttribute("data-slot", "card-action");
    expect(screen.getByText("Workspace")).toHaveAttribute("data-slot", "card-title");
  });

  it("supports a bleed CardVisual while protecting Card-owned anatomy", () => {
    render(
      <Card>
        <CardVisual
          placement="bleed"
          {...({ "data-slot": "consumer", "data-placement": "consumer" } as Record<string, string>)}
        >
          Preview
        </CardVisual>
      </Card>,
    );
    const visual = screen.getByText("Preview");
    expect(visual).toHaveAttribute("data-slot", "card-visual");
    expect(visual).toHaveAttribute("data-placement", "bleed");
  });

  it("keeps Card narrow layouts and high-contrast focus visible", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/card.tsx"), "utf8");
    expect(source).toContain(
      "max-[30rem]:has-[>[data-slot=card-action]]:grid-cols-[minmax(0,1fr)]",
    );
    expect(source).toContain("forced-colors:[&:is(a):focus-visible]:outline-[Highlight]");
  });

  it("resets Avatar fallback state when src changes and exposes intentional fallback names", () => {
    const { rerender } = render(<Avatar name="  Maya   Chen " />);
    expect(screen.getByText("MC")).toBeInTheDocument();
    rerender(<Avatar name="Иван Петров" src="/missing.png" />);
    fireEvent.error(screen.getByRole("img", { name: "Иван Петров" }));
    expect(screen.getByRole("img", { name: "Иван Петров" })).toHaveTextContent("ИП");
    rerender(<Avatar name="Иван Петров" src="/replacement.png" />);
    expect(screen.getByRole("img", { name: "Иван Петров" })).toHaveAttribute(
      "src",
      "/replacement.png",
    );
    rerender(<Avatar name="Иван Петров" src="/missing.png" />);
    expect(screen.getByRole("img", { name: "Иван Петров" })).toHaveAttribute("src", "/missing.png");
    rerender(<Avatar name="" fallback="Team" decorative />);
    expect(screen.getByText("Team")).toHaveAttribute("aria-hidden", "true");
  });

  it("supports Avatar alt overrides, one-word names, and every size", () => {
    const { rerender } = render(
      <Avatar name="Maya" size="sm" src="/maya.png" alt="Profile photo" />,
    );
    expect(screen.getByRole("img", { name: "Profile photo" }).closest("span")).toHaveAttribute(
      "data-size",
      "sm",
    );
    rerender(<Avatar name="Maya" size="lg" />);
    expect(screen.getByText("M").parentElement).toHaveAttribute("data-size", "lg");
  });

  it("keeps ordered lists visibly ordered and supports stable item IDs", () => {
    render(
      <List
        ordered
        items={[
          { id: "one", title: "First" },
          { id: "two", title: "Second" },
        ]}
      />,
    );
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("protects List destinations and anatomy while preserving safe link props", () => {
    render(
      <List
        items={[
          {
            id: "docs",
            title: "Documentation",
            href: "/docs",
            linkProps: {
              className: "custom-link",
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Open documentation",
              "data-source": "navigation",
              "data-slot": "consumer-slot",
            },
          },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: "Open documentation" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("n-list__link", "custom-link");
    expect(link).toHaveAttribute("data-slot", "link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveAttribute("data-source", "navigation");
  });

  it("adapts List destinations to a router element without losing native link contracts", () => {
    render(
      <List
        items={[
          {
            id: "router-docs",
            title: "Router documentation",
            href: "/docs/router",
            render: <RouterLinkFixture className="router-link" data-adapter="fixture" />,
            linkProps: { "aria-label": "Open router documentation", target: "_blank" },
          },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: "Open router documentation" });
    expect(link).toHaveAttribute("href", "/docs/router");
    expect(link).toHaveAttribute("data-router-path", "/docs/router");
    expect(link).toHaveAttribute("data-adapter", "fixture");
    expect(link).toHaveAttribute("data-slot", "link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveClass("n-list__link", "router-link");
  });

  it("renders link, button, ellipsis, current and disabled Pagination controls", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <Pagination
        previousHref="/previous"
        nextOnSelect={select}
        pages={[
          { key: "one", label: "1", href: "/one" },
          { key: "dots", type: "ellipsis" },
          { key: "two", label: "2", onSelect: select, current: true },
          { key: "three", label: "3", disabled: true },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/one");
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByLabelText("More pages")).toHaveTextContent("…");
    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(select).toHaveBeenCalledOnce();
    expect(screen.getByText("3")).toHaveAttribute("aria-disabled", "true");
  });

  it("allows router pagination rendering and preserves labels on disabled boundaries", () => {
    render(
      <Pagination
        previousAriaLabel="Older"
        nextAriaLabel="Newer"
        pages={[
          {
            key: "router",
            label: "Router",
            href: "/router",
            current: true,
            render: <RouterLinkFixture data-router-link="" />,
          },
        ]}
      />,
    );
    expect(screen.getByText("Router")).toHaveAttribute("data-router-link", "");
    expect(screen.getByText("Router")).toHaveAttribute("data-router-path", "/router");
    expect(screen.getByText("Router")).toHaveAttribute("data-slot", "page");
    expect(screen.getByText("Router")).toHaveAttribute("data-current", "");
    expect(screen.getByText("Router")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Previous")).toHaveAttribute("aria-label", "Older");
    expect(screen.getByText("Next")).toHaveAttribute("aria-label", "Newer");
  });

  it("preserves current-page styling for static Pagination pages", () => {
    render(<Pagination pages={[{ key: "current", label: "4", current: true }]} />);

    const currentPage = screen.getByText("4");
    expect(currentPage).toHaveAttribute("aria-current", "page");
    expect(currentPage).toHaveAttribute("aria-disabled", "true");
    expect(currentPage).toHaveAttribute("data-current", "");
    expect(currentPage).toHaveAttribute("data-disabled", "");
  });

  it("only creates a named keyboard scroll region for an explicitly focusable TableContainer", () => {
    const { rerender } = render(
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>A</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>,
    );
    const plainContainer = screen.getByText("A").closest("div");
    expect(plainContainer).not.toHaveAttribute("tabindex");
    expect(plainContainer).not.toHaveAttribute("role");
    expect(plainContainer).not.toHaveAttribute("data-focusable");
    rerender(
      <TableContainer aria-label="Project table">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>A</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>,
    );
    expect(screen.getByRole("region", { name: "Project table" })).not.toHaveAttribute("tabindex");
    rerender(
      <>
        <h2 id="project-table-title">Projects</h2>
        <TableContainer focusable aria-labelledby="project-table-title" data-viewport="narrow">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>A</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>,
    );
    const focusableContainer = screen.getByRole("region", { name: "Projects" });
    expect(focusableContainer).toHaveAttribute("tabindex", "0");
    expect(focusableContainer).toHaveAttribute("data-focusable", "");
    expect(focusableContainer).toHaveAttribute("data-viewport", "narrow");
  });

  it("rejects empty, whitespace-only, and malformed runtime TableContainer focus names", () => {
    const UnsafeTableContainer = TableContainer as React.ComponentType<
      React.HTMLAttributes<HTMLDivElement> & { focusable?: unknown }
    >;
    const { rerender } = render(
      <UnsafeTableContainer focusable aria-label="" role="application" tabIndex={4}>
        Empty label
      </UnsafeTableContainer>,
    );

    let container = screen.getByText("Empty label");
    expect(container).not.toHaveAttribute("role");
    expect(container).not.toHaveAttribute("tabindex");
    expect(container).not.toHaveAttribute("data-focusable");
    expect(container).not.toHaveAttribute("aria-label");

    rerender(
      <UnsafeTableContainer
        focusable
        aria-label="   "
        aria-labelledby={" \t "}
        data-focusable="consumer"
      >
        Whitespace label
      </UnsafeTableContainer>,
    );
    container = screen.getByText("Whitespace label");
    expect(container).not.toHaveAttribute("role");
    expect(container).not.toHaveAttribute("tabindex");
    expect(container).not.toHaveAttribute("data-focusable");
    expect(container).not.toHaveAttribute("aria-label");
    expect(container).not.toHaveAttribute("aria-labelledby");

    rerender(
      <UnsafeTableContainer focusable={"yes"} aria-label={42 as unknown as string}>
        Malformed name
      </UnsafeTableContainer>,
    );
    container = screen.getByText("Malformed name");
    expect(container).not.toHaveAttribute("role");
    expect(container).not.toHaveAttribute("tabindex");
    expect(container).not.toHaveAttribute("data-focusable");
  });

  it("keeps valid aria-labelledby focus regions owned and does not intercept scroll keys", () => {
    const { container } = render(
      <>
        <h2 id="owned-table-title">Owned table</h2>
        <TableContainer
          focusable
          aria-labelledby="owned-table-title"
          {...({ role: "application", tabIndex: 8, "data-focusable": "consumer" } as object)}
        >
          <Table />
        </TableContainer>
      </>,
    );
    const region = screen.getByRole("region", { name: "Owned table" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveAttribute("data-focusable", "");
    expect(fireEvent.keyDown(region, { key: "ArrowRight" })).toBe(true);
    expect(container.querySelectorAll('[role="region"]')).toHaveLength(1);
  });

  it("scopes Table row states to tbody and preserves responsive, RTL, density, and forced colors", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/table.tsx"), "utf8");
    const tokens = readFileSync(resolve(process.cwd(), "../tokens/src/styles.css"), "utf8");

    expect(source).toContain("max-w-full");
    expect(source).toContain("overflow-x-auto");
    expect(source).toContain("[&>.n-table]:min-w-max");
    expect(source).toContain("[&_:is(th,td)]:text-start");
    expect(source).toContain("[data-align=numeric]]:text-end");
    expect(source).toContain("[&_tbody>tr:hover>:is(th,td)]");
    expect(source).toContain("[&_tbody>tr:focus-within>:is(th,td)]");
    expect(source).toContain("[aria-current]:not([aria-current=false])");
    expect(source).not.toContain("[&_tr:hover");
    expect(source).not.toContain("[&_tr:focus-within");
    expect(source).toContain("forced-colors:data-focusable:focus-visible:outline-[Highlight]");
    expect(source).toContain("[border:var(--n-table-container-border)]");
    expect(tokens).toMatch(
      /:root\[data-density="compact"\][\s\S]*--n-table-cell-padding-y:[^;]+;[\s\S]*--n-table-row-min-height:[^;]+;/,
    );
  });

  it("preserves native Table anatomy and passthrough attributes", () => {
    render(
      <Table data-table="projects" dir="rtl">
        <TableCaption>Project delivery by owner</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} scope="colgroup">
              Identity
            </TableHead>
            <TableHead aria-sort="ascending">Updated</TableHead>
          </TableRow>
          <TableRow>
            <TableHead id="project-name">Name</TableHead>
            <TableHead id="project-owner">Owner</TableHead>
            <TableHead id="project-updated">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow aria-current="true" data-selected="">
            <TableHead id="roadmap" rowSpan={1} scope="row">
              Roadmap
            </TableHead>
            <TableCell headers="roadmap project-owner">Maya</TableCell>
            <TableCell data-align="numeric" headers="roadmap project-updated">
              12
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell data-tone="danger">12</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const table = screen.getByRole("table", { name: "Project delivery by owner" });
    expect(table).toHaveAttribute("data-table", "projects");
    expect(table).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("columnheader", { name: "Identity" })).toHaveAttribute(
      "scope",
      "colgroup",
    );
    expect(screen.getByRole("columnheader", { name: "Identity" })).toHaveAttribute("colspan", "2");
    expect(screen.getByRole("columnheader", { name: "Updated" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("scope", "col");
    expect(screen.getByRole("rowheader", { name: "Roadmap" })).toHaveAttribute("rowspan", "1");
    expect(screen.getByText("Maya")).toHaveAttribute("headers", "roadmap project-owner");
    expect(screen.getByText("Total").closest("tfoot")).not.toBeNull();
  });

  it("generates Field associations, preserves consumer IDs, and rejects multiple controls", () => {
    const { rerender } = render(
      <Field label="Email" description="Updates only" message="Required" invalid>
        <Input />
      </Field>,
    );
    const generated = screen.getByRole("textbox", { name: "Email" });
    expect(generated).toHaveAttribute("aria-invalid", "true");
    expect(generated.getAttribute("aria-describedby")).toContain("-description");
    rerender(
      <Field label="Project">
        <Input id="project-name" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Project" })).toHaveAttribute("id", "project-name");
    expect(() =>
      render(
        <Field label="Invalid">
          <Input />
          <Input />
        </Field>,
      ),
    ).toThrow("exactly one");
  });

  it("composes label requirements and hint context without nesting a control inside the label", async () => {
    const user = userEvent.setup();
    render(
      <>
        <LabelRow>
          <LabelContent>
            <Label htmlFor="project-name">Project name</Label>
            <LabelRequired />
            <LabelHint label="Visible to workspace members" />
          </LabelContent>
        </LabelRow>
        <Input id="project-name" required />
      </>,
    );

    expect(screen.getByText("*")).toHaveAttribute("data-slot", "required");
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("textbox", { name: "Project name" })).toBeRequired();
    expect(
      Array.from(document.querySelector("[data-slot=content]")!.children).map((child) =>
        child.getAttribute("data-slot"),
      ),
    ).toEqual(["root", "required", "hint"]);

    await user.hover(screen.getByLabelText("More information"));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Visible to workspace members");
  });

  it("keeps default Card and EmptyState semantics and forwards refs", () => {
    const cardRef = React.createRef<HTMLElement>();
    const emptyRef = React.createRef<HTMLDivElement>();
    render(
      <>
        <Card ref={cardRef}>Card</Card>
        <EmptyState ref={emptyRef}>
          <EmptyStateHeader>
            <EmptyStateTitle>Empty</EmptyStateTitle>
            <EmptyStateDescription>Nothing here</EmptyStateDescription>
          </EmptyStateHeader>
        </EmptyState>
      </>,
    );
    expect(cardRef.current?.tagName).toBe("SECTION");
    expect(emptyRef.current).toHaveAttribute("data-slot", "empty-state");
    expect(screen.getByRole("heading", { name: "Empty", level: 3 })).toBeInTheDocument();
  });

  it("composes optional EmptyState slots and preserves their public attributes", () => {
    const mediaRef = React.createRef<HTMLDivElement>();
    render(
      <EmptyState
        align="start"
        aria-label="No search results"
        className="custom-empty-state"
        data-testid="empty-state"
        size="lg"
      >
        <EmptyStateMedia ref={mediaRef} variant="illustration">
          <svg aria-hidden="true" />
        </EmptyStateMedia>
        <EmptyStateHeader className="custom-header">
          <EmptyStateTitle as="h2">No results</EmptyStateTitle>
          <EmptyStateDescription>Try a different query.</EmptyStateDescription>
        </EmptyStateHeader>
        <input aria-label="Search again" />
        <EmptyStateActions orientation="vertical" className="custom-actions">
          <button type="button">Clear filters</button>
          <a href="#help">Get help</a>
        </EmptyStateActions>
      </EmptyState>,
    );

    const root = screen.getByTestId("empty-state");
    expect(root).toHaveAttribute("data-slot", "empty-state");
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-align", "start");
    expect(root).toHaveAttribute("aria-label", "No search results");
    expect(root).toHaveClass("custom-empty-state");
    expect(root).not.toHaveAttribute("role");
    expect(mediaRef.current).toHaveAttribute("data-slot", "empty-state-media");
    expect(mediaRef.current).toHaveAttribute("data-variant", "illustration");
    expect(screen.getByText("No results").closest("[data-slot]")).toHaveAttribute(
      "data-slot",
      "empty-state-title",
    );
    expect(screen.getByText("Try a different query.")).toHaveAttribute(
      "data-slot",
      "empty-state-description",
    );
    expect(screen.getByRole("button", { name: "Clear filters" }).parentElement).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
    expect(screen.getByRole("link", { name: "Get help" })).toHaveAttribute("href", "#help");
  });

  it("stacks EmptyState actions at mobile widths without changing the composition API", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/empty-state.tsx"), "utf8");
    expect(source).toContain("max-[30rem]:w-full");
    expect(source).toContain("max-[30rem]:flex-col");
    expect(source).toContain("forced-colors:data-[variant=icon]:border-[CanvasText]");
  });

  it("renders Alert content and an optional trailing action slot", () => {
    render(
      <Alert action={<button type="button">Retry</button>} icon={Check} title="Upload failed">
        Try again after checking the connection.
      </Alert>,
    );

    expect(screen.getByText("Upload failed")).toHaveAttribute("data-slot", "title");
    expect(screen.getByText("Try again after checking the connection.")).toHaveAttribute(
      "data-slot",
      "description",
    );
    expect(screen.getByRole("button", { name: "Retry" }).parentElement).toHaveAttribute(
      "data-slot",
      "action",
    );
  });

  it("renders static Toast tone, title, and description without a dismiss control", () => {
    render(
      <>
        <Toast tone="success" title="Saved" description="Your changes are live." />
        <Toast priority="high" tone="danger" title="Connection lost" />
      </>,
    );
    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "success");
    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "danger");
    expect(screen.getByText("Saved")).toHaveAttribute("data-slot", "title");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders managed Toast actions and localized dismiss controls", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    function Trigger() {
      const manager = useToastManager();
      return (
        <button
          onClick={() =>
            manager.add({
              title: "Saved",
              data: { tone: "success", action: { label: "Undo", onClick: action } },
            })
          }
        >
          Show
        </button>
      );
    }
    render(
      <ToastProvider>
        <Trigger />
        <ToastViewport dismissLabel="Close notification" />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Show" }));
    const close = screen.getByLabelText("Close notification");
    expect(close).toHaveAttribute("data-slot", "close");
    expect(close).toHaveClass("n-button", "n-toast__close");
    expect(close.querySelector("svg")).not.toBeNull();
    const undo = await screen.findByRole("button", { name: "Undo" });
    expect(undo).toHaveClass("n-button", "n-toast__action");
    await user.click(undo);
    expect(action).toHaveBeenCalledOnce();
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("keeps independent providers isolated and resolves logical swipe directions for RTL", () => {
    const firstManager = createToastManager();
    const secondManager = createToastManager();
    render(
      <>
        <ToastProvider manager={firstManager}>
          <ToastViewport label="Primary notifications" />
        </ToastProvider>
        <ToastProvider manager={secondManager}>
          <ToastViewport direction="rtl" label="Secondary notifications" />
        </ToastProvider>
      </>,
    );

    act(() => {
      firstManager.add({ id: "first", title: "Primary toast" });
      secondManager.add({ id: "second", title: "Secondary toast" });
    });

    const primary = screen.getByRole("region", { name: "Primary notifications" });
    const secondary = screen.getByRole("region", { name: "Secondary notifications" });
    expect(within(primary).getByText("Primary toast")).toBeInTheDocument();
    expect(within(primary).queryByText("Secondary toast")).not.toBeInTheDocument();
    expect(within(secondary).getByText("Secondary toast")).toBeInTheDocument();
    expect(secondary).toHaveAttribute("dir", "rtl");
  });

  it("resolves inherited and explicit Toast directions on the initial client render", () => {
    const originalDirection = document.documentElement.dir;
    document.documentElement.dir = "rtl";

    try {
      render(
        <ToastProvider>
          <ToastViewport
            label="Inherited notifications"
            swipeDirection={["inline-start", "inline-end"]}
          />
          <ToastViewport
            direction="ltr"
            label="Explicit LTR notifications"
            swipeDirection={["inline-start", "inline-end"]}
          />
          <ToastViewport
            direction="rtl"
            label="Explicit RTL notifications"
            swipeDirection={["inline-start", "inline-end"]}
          />
        </ToastProvider>,
      );

      const inherited = screen.getByRole("region", { name: "Inherited notifications" });
      const explicitLtr = screen.getByRole("region", { name: "Explicit LTR notifications" });
      const explicitRtl = screen.getByRole("region", { name: "Explicit RTL notifications" });
      expect(inherited).toHaveAttribute("data-direction", "rtl");
      expect(inherited).toHaveAttribute("data-swipe-direction", "right left");
      expect(explicitLtr).toHaveAttribute("data-direction", "ltr");
      expect(explicitLtr).toHaveAttribute("data-swipe-direction", "left right");
      expect(explicitRtl).toHaveAttribute("data-direction", "rtl");
      expect(explicitRtl).toHaveAttribute("data-swipe-direction", "right left");
    } finally {
      document.documentElement.dir = originalDirection;
    }
  });

  it("keeps inherited Toast direction synchronized with the document root", async () => {
    const originalDirection = document.documentElement.dir;
    document.documentElement.dir = "ltr";

    try {
      render(
        <ToastProvider>
          <ToastViewport label="Inherited notifications" />
        </ToastProvider>,
      );
      const viewport = screen.getByRole("region", { name: "Inherited notifications" });
      expect(viewport).toHaveAttribute("data-direction", "ltr");
      expect(viewport).toHaveAttribute("data-swipe-direction", "right down");

      await act(async () => {
        document.documentElement.dir = "rtl";
        await Promise.resolve();
      });
      expect(viewport).toHaveAttribute("data-direction", "rtl");
      expect(viewport).toHaveAttribute("data-swipe-direction", "left down");
    } finally {
      document.documentElement.dir = originalDirection;
    }
  });

  it("uses one managed Toast coordinate system for stack, enter, and four-way dismissal", () => {
    const styles = readFileSync(resolve(process.cwd(), "src/styles/toast.css"), "utf8");
    const indicatorStyles = styles.match(
      /\.n-toast \[data-slot="status-indicator"\] \{([\s\S]*?)\}/,
    )?.[1];

    expect(indicatorStyles).toBeDefined();
    expect(indicatorStyles).not.toMatch(/\bbackground\s*:/);
    expect(styles).toMatch(
      /\.n-toast \[data-slot="description"\][\s\S]*font-size:\s*var\(--n-font-size-md\)/,
    );
    expect(styles).toMatch(/--toast-managed-base-y:/);
    expect(styles).toMatch(/--toast-managed-enter-y:/);
    expect(styles).toMatch(/--toast-managed-dismiss-x:/);
    expect(styles).toMatch(/--toast-managed-dismiss-y:/);
    expect(styles).toMatch(
      /--toast-viewport-inline-inset:\s*max\([\s\S]*safe-area-inset-left[\s\S]*safe-area-inset-right/,
    );
    expect(styles).toMatch(/inline-size:\s*min\([\s\S]*var\(--toast-viewport-inline-inset\) \* 2/);
    expect(styles).toMatch(/inset-inline-start:\s*50%/);
    expect(styles).toMatch(
      /inset-block-end:\s*max\(var\(--n-toast-viewport-inset\), env\(safe-area-inset-bottom\)\)/,
    );
    expect(styles).toMatch(/transform:\s*translateX\(-50%\)/);
    expect(styles).toMatch(/\.n-toast-viewport:dir\(rtl\)[\s\S]*transform:\s*translateX\(50%\)/);
    expect(styles).toMatch(/--toast-managed-scale:\s*max\(\s*0,\s*calc\(/);
    expect(styles).toMatch(
      /--toast-managed-base-y:\s*calc\(var\(--toast-index\) \* var\(--n-toast-stack-offset\) \* -1\)/,
    );
    expect(styles).toMatch(/\[data-slot="title"\][\s\S]*margin:\s*0/);
    expect(styles).toMatch(/\[data-slot="description"\][\s\S]*margin:\s*0/);
    expect(styles).toMatch(
      /transform:\s*translate3d\(\s*var\(--toast-managed-x\),\s*var\(--toast-managed-y\),\s*0\s*\)\s*scale\(var\(--toast-managed-scale\)\)/,
    );
    expect(styles).toMatch(/transform-origin:\s*top center/);
    expect(styles).toMatch(
      /\[data-starting-style\][\s\S]*--toast-managed-enter-y:\s*var\(--n-toast-enter-offset\)/,
    );

    for (const [direction, axis, sign] of [
      ["right", "x", ""],
      ["left", "x", String.raw`-1 \*`],
      ["down", "y", ""],
      ["up", "y", String.raw`-1 \*`],
    ] as const) {
      expect(styles).toMatch(
        new RegExp(
          `\\[data-ending-style\\]\\[data-swipe-direction="${direction}"\\][\\s\\S]*--toast-managed-dismiss-${axis}:\\s*calc\\(${sign}`,
        ),
      );
    }

    expect(styles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*--toast-managed-enter-y:\s*0px;[\s\S]*--toast-managed-dismiss-x:\s*0px;[\s\S]*--toast-managed-dismiss-y:\s*0px;/,
    );
  });

  it("upserts duplicate IDs, preserves ordering, and marks stack overflow deterministically", () => {
    const manager = createToastManager();
    render(
      <React.StrictMode>
        <ToastProvider limit={2} manager={manager}>
          <ToastViewport />
        </ToastProvider>
      </React.StrictMode>,
    );

    act(() => {
      manager.add({ id: "first", title: "First" });
      manager.add({ id: "second", title: "Second" });
      manager.add({ id: "first", title: "First updated" });
      manager.add({ id: "third", title: "Third" });
    });

    const roots = Array.from(document.querySelectorAll<HTMLElement>(".n-toast--managed"));
    expect(roots).toHaveLength(3);
    expect(roots.map((root) => root.textContent)).toEqual([
      expect.stringContaining("Third"),
      expect.stringContaining("Second"),
      expect.stringContaining("First updated"),
    ]);
    expect(roots.filter((root) => root.hasAttribute("data-limited"))).toHaveLength(1);
    expect(screen.queryByText("First", { exact: true })).not.toBeInTheDocument();
  });

  it("pauses and accurately resumes auto-dismiss while the pointer is over the viewport", async () => {
    vi.useFakeTimers();
    try {
      const manager = createToastManager();
      render(
        <ToastProvider manager={manager} timeout={1000}>
          <ToastViewport />
        </ToastProvider>,
      );
      act(() => manager.add({ title: "Timed toast" }));
      const viewport = screen.getByRole("region", { name: "Notifications" });

      await act(() => vi.advanceTimersByTimeAsync(400));
      fireEvent.mouseEnter(viewport);
      await act(() => vi.advanceTimersByTimeAsync(2000));
      expect(screen.getByText("Timed toast").closest(".n-toast")).not.toHaveAttribute(
        "data-ending-style",
      );

      fireEvent.mouseLeave(viewport);
      await act(() => vi.advanceTimersByTimeAsync(599));
      expect(screen.getByText("Timed toast").closest(".n-toast")).not.toHaveAttribute(
        "data-ending-style",
      );
      await act(() => vi.advanceTimersByTimeAsync(1));
      expect(screen.queryByText("Timed toast")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("supports persistent toasts and refreshes replacement timers without stale callbacks", async () => {
    vi.useFakeTimers();
    try {
      const manager = createToastManager();
      render(
        <ToastProvider manager={manager} timeout={1000}>
          <ToastViewport />
        </ToastProvider>,
      );
      act(() => {
        manager.add({ id: "persistent", title: "Persistent", timeout: 0 });
        manager.add({ id: "replaceable", title: "Initial", timeout: 1000 });
      });
      await act(() => vi.advanceTimersByTimeAsync(500));
      act(() => manager.add({ id: "replaceable", title: "Replacement", timeout: 2000 }));
      await act(() => vi.advanceTimersByTimeAsync(1500));
      expect(screen.getByText("Replacement").closest(".n-toast")).not.toHaveAttribute(
        "data-ending-style",
      );
      await act(() => vi.advanceTimersByTimeAsync(500));
      expect(screen.queryByText("Replacement")).not.toBeInTheDocument();
      await act(() => vi.advanceTimersByTimeAsync(10000));
      expect(screen.getByText("Persistent").closest(".n-toast")).not.toHaveAttribute(
        "data-ending-style",
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("pauses timers while keyboard focus is within the viewport", async () => {
    vi.useFakeTimers();
    try {
      const manager = createToastManager();
      render(
        <ToastProvider manager={manager} timeout={1000}>
          <button type="button">Outside</button>
          <ToastViewport />
        </ToastProvider>,
      );
      act(() =>
        manager.add({
          id: "focus-timer",
          title: "Keyboard pause",
          data: { action: { label: "Review", onClick: () => undefined } },
        }),
      );
      await act(() => vi.advanceTimersByTimeAsync(300));
      act(() => fireEvent.keyDown(document, { key: "Tab" }));
      const action = screen.getByRole("button", { name: "Review" });
      act(() => {
        action.focus();
        fireEvent.focus(action);
      });
      await act(() => vi.advanceTimersByTimeAsync(2000));
      expect(screen.getByText("Keyboard pause")).toBeInTheDocument();

      const outside = screen.getByRole("button", { name: "Outside" });
      act(() => {
        fireEvent.blur(action, { relatedTarget: outside });
        outside.focus();
      });
      await act(() => vi.advanceTimersByTimeAsync(700));
      expect(screen.queryByText("Keyboard pause")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps loading actions disabled and does not steal focus when a toast appears", () => {
    const manager = createToastManager();
    render(
      <ToastProvider manager={manager}>
        <button type="button">Keep focus</button>
        <ToastViewport />
      </ToastProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Keep focus" });
    trigger.focus();
    act(() =>
      manager.add({
        title: "Saving",
        data: {
          action: {
            label: "Retry",
            loading: true,
            loadingLabel: "Retrying",
            onClick: () => undefined,
          },
        },
      }),
    );

    expect(trigger).toHaveFocus();
    expect(screen.getByRole("button", { name: "Retrying" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Retrying" })).toHaveAttribute("aria-busy", "true");
  });
});

describe("Core interactive action contracts", () => {
  it("disables loading buttons while preserving their action name", () => {
    render(
      <Button loading loadingLabel="Saving">
        Save changes
      </Button>,
    );
    const button = screen.getByRole("button", { name: /save changes/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector(".n-spinner")).toHaveAttribute("aria-hidden", "true");
    expect(button.querySelector("[role=status]")).not.toBeInTheDocument();
  });

  it("keeps an icon-only Button label available while loading", () => {
    render(<Button icon={Bell} aria-label="Open notifications" loading />);
    const button = screen.getByRole("button", { name: /open notifications/i });
    expect(button).toBeDisabled();
    expect(button.querySelector(".n-spinner")).toHaveAttribute("aria-hidden", "true");
    expect(button.querySelector("[role=status]")).not.toBeInTheDocument();
  });

  it("supports directional icons, Badge counts, shortcut hints, and accessible icon-only actions", () => {
    render(
      <>
        <Button
          leadingIcon={Bell}
          trailingIcon={Bell}
          badge={<Badge tone="info">24</Badge>}
          kbd="⌘N"
        >
          Create notification
        </Button>
        <Button icon={Bell} aria-label="Open notifications" tooltip="Open notifications" />
      </>,
    );

    const labeledButton = screen.getByRole("button", { name: "Create notification 24" });
    expect(labeledButton.querySelectorAll("[data-slot=button-icon]")).toHaveLength(2);
    expect(labeledButton.querySelector("[data-slot=button-badge]")).toHaveTextContent("24");
    expect(labeledButton.querySelector(".n-badge")).toHaveAttribute("data-size", "sm");
    expect(labeledButton.querySelector("[data-slot=button-kbd]")).toHaveTextContent("⌘N");
    expect(
      Array.from(labeledButton.children).map((child) => child.getAttribute("data-slot")),
    ).toEqual(["button-icon", "button-label", "button-badge", "button-kbd", "button-icon"]);

    const iconButton = screen.getByRole("button", { name: "Open notifications" });
    expect(iconButton).toHaveAttribute("data-icon-only", "true");
    expect(iconButton.querySelector("[data-slot=button-label]")).not.toBeInTheDocument();
  });

  it("renders the link Button variant as a native anchor without a separate Link component", () => {
    render(
      <Button
        leadingIcon={ArrowRight}
        nativeButton={false}
        render={<a href="/docs" />}
        variant="link"
      >
        Read the docs
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Read the docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-variant", "link");
    expect(link).toHaveClass("n-button");
    expect(link.querySelector("[data-slot=button-icon] .n-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("preserves non-link custom render targets for navigational Buttons", () => {
    render(
      <Button
        aria-label="Next: Spinner"
        icon={ArrowRight}
        nativeButton={false}
        render={<a href="/docs/components/spinner" />}
        variant="secondary"
      />,
    );

    const link = screen.getByRole("link", { name: "Next: Spinner" });
    expect(link).toHaveAttribute("href", "/docs/components/spinner");
    expect(link).toHaveAttribute("data-variant", "secondary");
    expect(link).toHaveClass("n-button");
  });

  it("composes render-element and forwarded Button refs without dropping either ref shape", () => {
    const renderObjectRef = React.createRef<HTMLAnchorElement>();
    const forwardedCallbackRef = vi.fn<(node: HTMLElement | null) => void>();
    const renderCallbackRef = vi.fn<(node: HTMLAnchorElement | null) => void>();
    const forwardedObjectRef = React.createRef<HTMLElement>();
    const renderCleanup = vi.fn();
    const forwardedCleanup = vi.fn();
    const renderCleanupRef = vi.fn((node: HTMLAnchorElement | null) =>
      node ? renderCleanup : undefined,
    );
    const forwardedCleanupRef = vi.fn((node: HTMLElement | null) =>
      node ? forwardedCleanup : undefined,
    );

    const { unmount } = render(
      <>
        <Button
          ref={forwardedCallbackRef}
          nativeButton={false}
          render={<a ref={renderObjectRef} href="/object-render-ref" />}
        >
          Object render ref
        </Button>
        <Button
          ref={forwardedObjectRef}
          nativeButton={false}
          render={<a ref={renderCallbackRef} href="/callback-render-ref" />}
        >
          Callback render ref
        </Button>
        <Button
          ref={forwardedCleanupRef}
          nativeButton={false}
          render={<a ref={renderCleanupRef} href="/cleanup-refs" />}
        >
          Cleanup refs
        </Button>
      </>,
    );

    const objectRefLink = screen.getByRole("link", { name: "Object render ref" });
    const callbackRefLink = screen.getByRole("link", { name: "Callback render ref" });
    expect(renderObjectRef.current).toBe(objectRefLink);
    expect(forwardedCallbackRef).toHaveBeenLastCalledWith(objectRefLink);
    expect(renderCallbackRef).toHaveBeenLastCalledWith(callbackRefLink);
    expect(forwardedObjectRef.current).toBe(callbackRefLink);

    unmount();
    expect(renderObjectRef.current).toBeNull();
    expect(forwardedObjectRef.current).toBeNull();
    expect(forwardedCallbackRef).toHaveBeenLastCalledWith(null);
    expect(renderCallbackRef).toHaveBeenLastCalledWith(null);
    expect(renderCleanup).toHaveBeenCalledOnce();
    expect(forwardedCleanup).toHaveBeenCalledOnce();
  });

  it("normalizes deprecated Button variants and protects Button-owned state attributes", () => {
    render(
      <>
        <Button variant="subtle" data-variant="consumer">
          Subtle
        </Button>
        <Button variant="destructive">Destructive</Button>
        <Button loading data-loading="consumer" aria-busy={false}>
          Save
        </Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Subtle" })).toHaveAttribute(
      "data-variant",
      "secondary",
    );
    expect(screen.getByRole("button", { name: "Destructive" })).toHaveAttribute(
      "data-variant",
      "danger",
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-loading", "true");
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("aria-busy", "true");
  });

  it("only treats Nerio Kbd elements as Button shortcuts", () => {
    render(
      <Button kbd={<Kbd>⌘S</Kbd>} aria-keyshortcuts="Meta+S">
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.querySelector("[data-slot=button-kbd]")?.tagName).toBe("KBD");
    expect(button.querySelector("[data-slot=button-kbd]")).toHaveAttribute("aria-hidden", "true");
    expect(button).toHaveAttribute("aria-keyshortcuts", "Meta+S");
  });

  it("protects Card anatomy while preserving native anchor attributes", () => {
    render(
      <Card
        href="/download"
        download
        hrefLang="en"
        referrerPolicy="no-referrer"
        {...({ "data-slot": "consumer", "data-variant": "consumer" } as Record<string, string>)}
      >
        Download
      </Card>,
    );
    const card = screen.getByRole("link", { name: "Download" });
    expect(card).toHaveAttribute("download");
    expect(card).toHaveAttribute("hreflang", "en");
    expect(card).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveAttribute("data-variant", "default");
  });

  it("requires an element Tooltip trigger and supports focus, controlled state, and disabled state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Tooltip label="Copy link" onOpenChange={onOpenChange}>
        <button>Copy</button>
      </Tooltip>,
    );
    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copy link");
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    rerender(
      <Tooltip label="Copy link" open={false} disabled>
        <button>Copy</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button", { name: "Copy" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows an optional tooltip for an icon-only Button", async () => {
    const user = userEvent.setup();
    render(<Button icon={Bell} aria-label="Open notifications" tooltip="Open notifications" />);

    await user.hover(screen.getByRole("button", { name: "Open notifications" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Open notifications");
  });

  it("supports uncontrolled Dialog open, Escape close, and focus restoration", async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger="Open settings" title="Settings">
        Dialog body
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Open settings" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps controlled Dialog state consumer-owned and exposes its associations", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function ControlledDialog() {
      const [open, setOpen] = React.useState(false);
      return (
        <Dialog
          trigger="Open controlled dialog"
          title="Controlled settings"
          description="Managed by the consumer."
          open={open}
          onOpenChange={(nextOpen, details) => {
            onOpenChange(nextOpen, details);
            setOpen(nextOpen);
          }}
        >
          Settings body
        </Dialog>
      );
    }
    render(<ControlledDialog />);
    await user.click(screen.getByRole("button", { name: "Open controlled dialog" }));
    const dialog = await screen.findByRole("dialog", { name: "Controlled settings" });
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it("supports controlled Select values, labels, descriptions, and invalid state", () => {
    render(
      <Select
        label="Status"
        description="Workflow state"
        message="Required"
        invalid
        value="draft"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
        ]}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Status" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("aria-describedby", expect.stringContaining("-description"));
    expect(trigger).toHaveTextContent("Draft");
  });

  it("renders Select options and disabled option semantics after keyboard opening", async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Status"
        defaultValue="draft"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived", disabled: true },
          { label: "Published", value: "published" },
        ]}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Status" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Archived", hidden: true })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("selects enabled options, skips disabled options, and keeps controlled Select values consumer-owned", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function ControlledSelect() {
      const [value, setValue] = React.useState("draft");
      return (
        <Select
          label="Publication status"
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
          options={[
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived", disabled: true },
            { label: "Published", value: "published" },
          ]}
        />
      );
    }
    render(<ControlledSelect />);
    const trigger = screen.getByRole("combobox", { name: "Publication status" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("option", { name: "Published" });
    await user.click(screen.getByRole("option", { name: "Published" }));
    expect(onValueChange).toHaveBeenCalledWith("published");
    expect(trigger).toHaveTextContent("Published");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("supports Select composition, ReactNode option labels, descriptions, and protected anatomy", async () => {
    const user = userEvent.setup();
    render(
      <Select
        aria-describedby="selection-help selection-help"
        data-slot="consumer-slot"
        label={
          <span>
            Project <strong>visibility</strong>
          </span>
        }
      >
        <SelectGroup>
          <SelectGroupLabel>Private</SelectGroupLabel>
          <SelectItem
            description="Only workspace members can view it."
            textValue="Team"
            value="team"
          >
            <span>Team</span>
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem disabled value="public">
          Public
        </SelectItem>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Project visibility" });
    expect(trigger.closest("[data-slot='root']")).toHaveAttribute("data-slot", "root");
    expect(trigger).toHaveAttribute("aria-describedby", "selection-help");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByText("Private")).toHaveAttribute("data-slot", "group-label");
    expect(screen.getByText("Only workspace members can view it.")).toHaveAttribute(
      "data-slot",
      "item-description",
    );
    expect(document.querySelector("[data-slot='separator']")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Public" })).toHaveAttribute("aria-disabled", "true");
  });

  it("keeps Select form, event, sizing, trigger ref, and controlled-open contracts", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    const triggerRef = React.createRef<HTMLButtonElement>();
    function ControlledOpenSelect() {
      const [open, setOpen] = React.useState(false);
      return (
        <form>
          <Select
            defaultValue="draft"
            label="Status"
            name="status"
            onChange={onChange}
            onOpenChange={(nextOpen, eventDetails) => {
              onOpenChange(nextOpen, eventDetails);
              setOpen(nextOpen);
            }}
            onValueChange={onValueChange}
            open={open}
            required
            size="lg"
            triggerRef={triggerRef}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
          />
        </form>
      );
    }
    const { container } = render(<ControlledOpenSelect />);
    const trigger = screen.getByRole("combobox", { name: "Status" });
    expect(trigger).toHaveAttribute("data-size", "lg");
    expect(trigger.closest("[data-slot='root']")).toHaveAttribute("data-size", "lg");
    expect(triggerRef.current).toBe(trigger);
    expect(new FormData(container.querySelector("form")!).get("status")).toBe("draft");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    await user.click(screen.getByRole("option", { name: "Published" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("published", expect.anything());
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("published");
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(trigger).toHaveFocus();
  });

  it("renders Select size hooks, an empty state, and constrained popup styling", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Select label="Small" size="sm" options={[]} />
        <Select label="Medium" size="md" options={[{ label: "Draft", value: "draft" }]} />
        <Select label="Large" size="lg" options={[{ label: "Published", value: "published" }]} />
      </>,
    );
    expect(screen.getByRole("combobox", { name: "Small" })).toHaveAttribute("data-size", "sm");
    expect(screen.getByRole("combobox", { name: "Medium" })).toHaveAttribute("data-size", "md");
    expect(screen.getByRole("combobox", { name: "Large" })).toHaveAttribute("data-size", "lg");
    await user.click(screen.getByRole("combobox", { name: "Small" }));
    expect(screen.getByText("No options available.")).toHaveAttribute("data-slot", "empty");
    expect(document.querySelector(".n-select-positioner")).toBeInTheDocument();
    expect(document.querySelector(".n-select-list")).toBeInTheDocument();
  });

  it("supports checkbox, radio group, and switch state contracts", async () => {
    const user = userEvent.setup();
    const onRadioChange = vi.fn();
    render(
      <>
        <Checkbox aria-label="Subscribe" defaultChecked invalid />
        <Checkbox aria-label="Disabled" disabled />
        <RadioGroup
          label="Visibility"
          defaultValue="team"
          onValueChange={onRadioChange}
          description="Who can view this?"
          invalid
          options={[
            { label: "Private", value: "private" },
            { label: "Team", value: "team" },
            { label: "Disabled", value: "disabled", disabled: true },
          ]}
        />
        <Switch aria-label="Notifications" defaultChecked />
        <Switch aria-label="Disabled notifications" disabled />
      </>,
    );
    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("checkbox", { name: "Disabled" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("radio", { name: /Private/ }));
    expect(onRadioChange).toHaveBeenCalledWith("private", expect.anything());
    expect(screen.getByRole("radio", { name: "Disabled" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("switch", { name: "Notifications" }));
    expect(screen.getByRole("switch", { name: "Notifications" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("switch", { name: "Disabled notifications" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("keeps Checkbox custom indicators and RadioGroup composition compatible", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    render(
      <>
        <label>
          <Checkbox defaultChecked onCheckedChange={onCheckedChange} /> Include archived
        </label>
        <Checkbox aria-label="Partial selection" indeterminate invalid data-slot="consumer" />
        <Checkbox aria-label="Custom indicator" defaultChecked>
          Custom
        </Checkbox>
        <RadioGroup label="Audience" defaultValue="team" onChange={onChange}>
          <RadioGroupItem value="private" description="Only you can view it.">
            Private
          </RadioGroupItem>
          <RadioGroupItem value="team">Team</RadioGroupItem>
        </RadioGroup>
      </>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Include archived" }));
    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
    expect(screen.getByRole("checkbox", { name: "Partial selection" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
    expect(screen.getByRole("checkbox", { name: "Partial selection" })).toHaveAttribute(
      "data-slot",
      "root",
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /Private/ }));
    expect(onChange).toHaveBeenCalledWith("private");
    expect(screen.getByText("Only you can view it.")).toBeInTheDocument();
  });

  it("connects Checkbox label and description props without changing primitive usage", () => {
    render(
      <Checkbox
        defaultChecked
        description="Archived collections remain visible in search results."
        label="Include archived collections"
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Include archived collections" });
    const label = screen.getByText("Include archived collections");
    const description = screen.getByText("Archived collections remain visible in search results.");

    expect(checkbox).toHaveAttribute("aria-labelledby", label.id);
    expect(checkbox).toHaveAttribute("aria-describedby", description.id);
    expect(checkbox.closest("[data-slot='field']")).toBeInTheDocument();
  });

  it("keeps Switch read-only, invalid, and protected anatomy contracts", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <label>
        <Switch
          defaultChecked
          invalid
          readOnly
          data-slot="consumer"
          onCheckedChange={onCheckedChange}
        />
        Notifications
      </label>,
    );
    const switchControl = screen.getByRole("switch", { name: "Notifications" });
    expect(switchControl).toHaveAttribute("aria-invalid", "true");
    expect(switchControl).toHaveAttribute("data-readonly", "");
    expect(switchControl).toHaveAttribute("data-slot", "root");
    await user.click(switchControl);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("connects Switch label and description props without changing primitive usage", () => {
    render(
      <Switch
        defaultChecked
        description="Collaborators receive updates as they happen."
        label="Notify collaborators"
      />,
    );

    const switchControl = screen.getByRole("switch", { name: "Notify collaborators" });
    const label = screen.getByText("Notify collaborators");
    const description = screen.getByText("Collaborators receive updates as they happen.");

    expect(switchControl).toHaveAttribute("aria-labelledby", label.id);
    expect(switchControl).toHaveAttribute("aria-describedby", description.id);
    expect(switchControl.closest("[data-slot='field']")).toBeInTheDocument();
  });

  it("preserves controlled state, keyboard behavior, and form values for Checkbox and Switch", async () => {
    const user = userEvent.setup();
    const onCheckboxChange = vi.fn();
    const onSwitchChange = vi.fn();
    function ControlledControls() {
      const [checked, setChecked] = React.useState(false);
      const [enabled, setEnabled] = React.useState(false);
      return (
        <form aria-label="Control values">
          <label>
            <Checkbox
              checked={checked}
              name="includeArchived"
              value="yes"
              onCheckedChange={(next, details) => {
                onCheckboxChange(next, details);
                setChecked(next);
              }}
            />
            Include archived
          </label>
          <label>
            <Switch
              checked={enabled}
              name="notifications"
              value="enabled"
              onCheckedChange={(next, details) => {
                onSwitchChange(next, details);
                setEnabled(next);
              }}
            />
            Notifications
          </label>
        </form>
      );
    }
    render(<ControlledControls />);
    const checkbox = screen.getByRole("checkbox", { name: "Include archived" });
    const switchControl = screen.getByRole("switch", { name: "Notifications" });
    checkbox.focus();
    await user.keyboard(" ");
    expect(onCheckboxChange).toHaveBeenCalledWith(true, expect.anything());
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    switchControl.focus();
    await user.keyboard(" ");
    expect(onSwitchChange).toHaveBeenCalledWith(true, expect.anything());
    expect(switchControl).toHaveAttribute("aria-checked", "true");
    const form = screen.getByRole("form", { name: "Control values" });
    expect(new FormData(form)).toEqual(
      expect.objectContaining({
        get: expect.any(Function),
      }),
    );
    expect(new FormData(form).get("includeArchived")).toBe("yes");
    expect(new FormData(form).get("notifications")).toBe("enabled");
  });

  it("keeps RadioGroup keyboard navigation, IDs, disabled skipping, and form behavior", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form>
        <RadioGroup
          label="Visibility"
          defaultValue="team"
          description="Choose who can access this project."
          message="Select one option."
          name="visibility"
          onValueChange={onValueChange}
          options={[
            { label: "Private", value: "private" },
            { label: "Team", value: "team" },
            { label: "Unavailable", value: "unavailable", disabled: true },
          ]}
        />
      </form>,
    );
    const group = screen.getByRole("radiogroup", { name: "Visibility" });
    const team = screen.getByRole("radio", { name: "Team" });
    await user.tab();
    expect(team).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Private" })).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenCalledWith("private", expect.anything());
    await user.keyboard("{ArrowUp}");
    expect(team).toHaveAttribute("aria-checked", "true");
    expect(group).toHaveAttribute("aria-describedby", expect.stringContaining("-description"));
    expect(group).toHaveAttribute("aria-describedby", expect.stringContaining("-message"));
    expect(new FormData(group.closest("form")! as HTMLFormElement).get("visibility")).toBe("team");
  });

  it("covers Checkbox default indicators, protected states, required input, and form submission", async () => {
    const user = userEvent.setup();
    const onDisabledChange = vi.fn();
    const onReadOnlyChange = vi.fn();
    let requiredInput: HTMLInputElement | null = null;
    render(
      <form aria-label="Checkbox values">
        <label>
          <Checkbox
            defaultChecked
            inputRef={(node) => {
              requiredInput = node;
            }}
            name="selected"
            required
            value="selected"
          />
          Selected
        </label>
        <Checkbox aria-label="Indeterminate" indeterminate />
        <Checkbox aria-label="Disabled checkbox" disabled onCheckedChange={onDisabledChange} />
        <Checkbox aria-label="Read-only checkbox" readOnly onCheckedChange={onReadOnlyChange} />
      </form>,
    );
    const selected = screen.getByRole("checkbox", { name: "Selected" });
    expect(selected.querySelector(".n-checkbox__check")).toBeInTheDocument();
    const indeterminate = screen.getByRole("checkbox", { name: "Indeterminate" });
    expect(indeterminate.querySelector(".n-checkbox__minus")).toBeInTheDocument();
    expect(indeterminate).toHaveAttribute("aria-checked", "mixed");
    expect(requiredInput).toBeRequired();
    await user.click(screen.getByRole("checkbox", { name: "Disabled checkbox" }));
    await user.click(screen.getByRole("checkbox", { name: "Read-only checkbox" }));
    expect(onDisabledChange).not.toHaveBeenCalled();
    expect(onReadOnlyChange).not.toHaveBeenCalled();
    expect(
      new FormData(screen.getByRole("form", { name: "Checkbox values" })).get("selected"),
    ).toBe("selected");
  });

  it("covers Switch child compatibility, disabled state, required input, and form submission", async () => {
    const user = userEvent.setup();
    const onDisabledChange = vi.fn();
    let requiredInput: HTMLInputElement | null = null;
    render(
      <form aria-label="Switch values">
        <label>
          <Switch
            defaultChecked
            inputRef={(node) => {
              requiredInput = node;
            }}
            name="enabled"
            required
            value="enabled"
          >
            Ignored child
          </Switch>
          Enable notifications
        </label>
        <Switch aria-label="Disabled switch" disabled onCheckedChange={onDisabledChange} />
      </form>,
    );
    expect(screen.queryByText("Ignored child")).not.toBeInTheDocument();
    expect(requiredInput).toBeRequired();
    await user.click(screen.getByRole("switch", { name: "Disabled switch" }));
    expect(onDisabledChange).not.toHaveBeenCalled();
    expect(new FormData(screen.getByRole("form", { name: "Switch values" })).get("enabled")).toBe(
      "enabled",
    );
  });

  it("keeps RadioGroup options and composition equivalent, including read-only and disabled groups", async () => {
    const user = userEvent.setup();
    const onReadOnlyChange = vi.fn();
    render(
      <>
        <RadioGroup
          label="Options group"
          options={[
            { label: "Private", value: "private", description: "Only you." },
            { label: "Team", value: "team" },
          ]}
        />
        <RadioGroup label="Composed group">
          <RadioGroupItem value="private" description="Only you.">
            Private
          </RadioGroupItem>
          <RadioGroupItem value="team">Team</RadioGroupItem>
        </RadioGroup>
        <RadioGroup
          label="Read-only group"
          defaultValue="team"
          onValueChange={onReadOnlyChange}
          readOnly
          options={[
            { label: "Private", value: "private" },
            { label: "Team", value: "team" },
          ]}
        />
        <RadioGroup
          label="Disabled group"
          disabled
          options={[{ label: "Private", value: "private" }]}
        />
      </>,
    );
    expect(screen.getAllByText("Only you.")).toHaveLength(2);
    expect(document.querySelectorAll('[data-slot="option-content"]')).toHaveLength(7);
    const readOnlyPrivate = screen.getAllByRole("radio", { name: "Private" })[2];
    await user.click(readOnlyPrivate);
    expect(onReadOnlyChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radiogroup", { name: "Disabled group" })).toHaveAttribute(
      "data-disabled",
      "",
    );
    expect(screen.getAllByRole("radio", { name: "Private" })[0].closest("label")).toHaveAttribute(
      "data-slot",
      "option",
    );
  });

  it("reports popover open-state changes", async () => {
    const user = userEvent.setup();
    const onPopoverChange = vi.fn();
    render(
      <>
        <Popover trigger="Filters" title="Filters" onOpenChange={onPopoverChange}>
          Filter content
        </Popover>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(onPopoverChange).toHaveBeenCalledWith(true, expect.anything());
    await user.keyboard("{Escape}");
  });

  it("composes Tabs anatomy, protects slots, and delegates keyboard behavior to Base UI", async () => {
    const user = userEvent.setup();
    const rootRef = React.createRef<HTMLDivElement>();
    const listRef = React.createRef<HTMLDivElement>();
    const triggerRef = React.createRef<HTMLElement>();
    const panelsRef = React.createRef<HTMLDivElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    render(
      <Tabs ref={rootRef} data-slot="consumer" size="lg" variant="segmented">
        <TabsList ref={listRef} aria-label="Workspace sections" data-slot="consumer" layout="fill">
          <TabsTrigger disabled value="disabled">
            Disabled
          </TabsTrigger>
          <TabsTrigger
            ref={triggerRef}
            badge={<Badge size="sm">12</Badge>}
            leadingIcon={Bell}
            value="overview"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger trailingIcon={ArrowRight} value="activity">
            Activity
          </TabsTrigger>
          <TabsIndicator data-slot="consumer" />
        </TabsList>
        <TabsPanels ref={panelsRef} data-slot="consumer">
          <TabsContent value="disabled">Disabled panel</TabsContent>
          <TabsContent ref={contentRef} data-slot="consumer" value="overview">
            Overview panel
          </TabsContent>
          <TabsContent value="activity">Activity panel</TabsContent>
        </TabsPanels>
      </Tabs>,
    );
    const overview = screen.getByRole("tab", { name: "Overview 12" });
    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(rootRef.current).toHaveAttribute("data-slot", "root");
    expect(rootRef.current).toHaveAttribute("data-size", "lg");
    expect(listRef.current).toHaveAttribute("data-slot", "list");
    expect(listRef.current).toHaveAttribute("data-layout", "fill");
    expect(listRef.current).toHaveAttribute("data-scrollable");
    expect(triggerRef.current).toHaveAttribute("data-slot", "trigger");
    expect(contentRef.current).toHaveAttribute("data-slot", "content");
    expect(panelsRef.current).toHaveAttribute("data-slot", "panels");
    expect(overview.querySelector('[data-slot="leading-icon"]')).toHaveAttribute("aria-hidden");
    expect(overview.querySelector('[data-slot="badge"]')).toHaveTextContent("12");
    overview.focus();
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowLeft}");
    await user.keyboard(" ");
    expect(overview).toHaveAttribute("aria-selected", "true");
  });

  it("keeps controlled Tabs selection consumer-owned with Base UI event details and all visual modes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function ControlledTabs() {
      const [value, setValue] = React.useState("overview");
      return (
        <Tabs
          value={value}
          onValueChange={(nextValue, eventDetails) => {
            onValueChange(nextValue, eventDetails);
            setValue(nextValue);
          }}
          variant="separate"
        >
          <TabsList aria-label="Controlled tabs" scrollable={false}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsPanels>
            <TabsContent value="overview">Overview panel</TabsContent>
            <TabsContent value="activity">Activity panel</TabsContent>
          </TabsPanels>
        </Tabs>
      );
    }
    render(<ControlledTabs />);
    const overview = screen.getByRole("tab", { name: "Overview" });
    const activity = screen.getByRole("tab", { name: "Activity" });
    expect(overview).toHaveAttribute("aria-controls");
    await user.click(activity);
    expect(onValueChange).toHaveBeenCalledWith("activity", expect.anything());
    const panel = screen.getByRole("tabpanel");
    expect(activity).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveTextContent("Activity panel");
  });

  it("exposes bordered vertical and compact list contracts without replacing Base UI state", () => {
    render(
      <Tabs defaultValue="one" orientation="vertical" size="sm" variant="bordered">
        <TabsList aria-label="Vertical sections" layout="content" scrollable={false}>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsPanels>
          <TabsContent keepMounted value="one">
            One panel
          </TabsContent>
          <TabsContent value="two">Two panel</TabsContent>
        </TabsPanels>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute("data-layout", "content");
    expect(screen.getByRole("tablist")).not.toHaveAttribute("data-scrollable");
    expect(screen.getByRole("tab", { name: "One" }).closest('[data-slot="root"]')).toHaveAttribute(
      "data-variant",
      "bordered",
    );
  });

  it("defaults Tabs to bordered md and keeps every visual size and variant explicit", () => {
    const variants = ["bordered", "separate", "segmented"] as const;
    const sizes = ["sm", "md", "lg"] as const;
    render(
      <>
        <Tabs data-testid="default-tabs" defaultValue="one">
          <TabsList aria-label="Default tabs">
            <TabsTrigger value="one">One</TabsTrigger>
          </TabsList>
        </Tabs>
        {variants.flatMap((variant) =>
          sizes.map((size) => (
            <Tabs
              key={`${variant}-${size}`}
              data-testid={`${variant}-${size}`}
              defaultValue="one"
              size={size}
              variant={variant}
            >
              <TabsList aria-label={`${variant} ${size}`} scrollable={false}>
                <TabsTrigger value="one">One</TabsTrigger>
                <TabsIndicator />
              </TabsList>
            </Tabs>
          )),
        )}
      </>,
    );

    expect(screen.getByTestId("default-tabs")).toHaveAttribute("data-size", "md");
    expect(screen.getByTestId("default-tabs")).toHaveAttribute("data-variant", "bordered");
    for (const variant of variants) {
      for (const size of sizes) {
        expect(screen.getByTestId(`${variant}-${size}`)).toHaveAttribute("data-variant", variant);
        expect(screen.getByTestId(`${variant}-${size}`)).toHaveAttribute("data-size", size);
      }
    }
  });

  it("preserves consumer Badge visibility while separating its accessible name", () => {
    render(
      <>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Badge label">
            <TabsTrigger badge={<Badge>12</Badge>} value="overview">
              Overview
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="hidden">
          <TabsList aria-label="Hidden badge label">
            <TabsTrigger badge={<Badge aria-hidden>12</Badge>} value="hidden">
              Hidden
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="empty">
          <TabsList aria-label="Empty badge label">
            <TabsTrigger badge={<Badge aria-hidden>12</Badge>} value="empty">
              <span aria-hidden>Empty</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </>,
    );

    expect(screen.getByRole("tab", { name: "Overview 12" })).toHaveTextContent("Overview12");
    expect(screen.getByRole("tab", { name: "Hidden" })).toHaveTextContent("Hidden12");
    expect(screen.getAllByRole("tab").at(-1)).not.toHaveAttribute("aria-label");
  });

  it("skips disabled Tabs without overriding Home or a disabled loop boundary", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="two">
        <TabsList aria-label="Keyboard boundaries" loopFocus={false}>
          <TabsTrigger disabled value="one">
            One
          </TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
          <TabsTrigger value="three">Three</TabsTrigger>
        </TabsList>
        <TabsPanels>
          <TabsContent value="one">One panel</TabsContent>
          <TabsContent value="two">Two panel</TabsContent>
          <TabsContent value="three">Three panel</TabsContent>
        </TabsPanels>
      </Tabs>,
    );

    const two = screen.getByRole("tab", { name: "Two" });
    const three = screen.getByRole("tab", { name: "Three" });
    three.focus();
    await user.keyboard("{ArrowRight}");
    expect(three).toHaveFocus();
    await user.keyboard("{Home}");
    expect(two).toHaveFocus();
  });

  it("keeps vertical variants compact, horizontal fill-only, and RTL indicator geometry in the CSS contract", () => {
    const tabsStyles = readFileSync(resolve(process.cwd(), "src/styles/tabs.css"), "utf8");
    expect(tabsStyles).toContain('.n-tabs[data-orientation="vertical"] {');
    expect(tabsStyles).toContain("align-items: start;");
    expect(tabsStyles).toContain("inline-size: fit-content;");
    expect(tabsStyles).toMatch(
      /\.n-tabs:not\(\[data-orientation="vertical"\]\)\s+\.n-tabs__list\[data-layout="fill"\]/,
    );
    expect(tabsStyles).toContain("inline-size: 100%;");
    expect(tabsStyles).toContain("left: var(--active-tab-left);");
    expect(tabsStyles).toContain("width: var(--active-tab-width);");
    expect(tabsStyles).toContain("inset-inline-end: calc(var(--n-border-width-default) * -1);");
    expect(tabsStyles).not.toContain("inset-inline-start: var(--active-tab-left);");
  });

  it("keeps Tabs hover feedback to text and icon color only", () => {
    const tabsStyles = readFileSync(resolve(process.cwd(), "src/styles/tabs.css"), "utf8");
    expect(tabsStyles).toContain("color: var(--n-tabs-foreground-hover);");
    expect(tabsStyles).not.toContain("trigger-background-hover");
  });

  it("keeps scrollable focus treatment inset and Tabs motion reducible", () => {
    const tabsStyles = readFileSync(resolve(process.cwd(), "src/styles/tabs.css"), "utf8");
    expect(tabsStyles).toContain("overflow-x: auto;");
    expect(tabsStyles).toContain("overflow-y: hidden;");
    expect(tabsStyles).toContain("inset 0 0 0 var(--n-focus-ring-inner-width)");
    expect(tabsStyles).toContain("inset 0 0 0 var(--n-focus-ring-outer-width)");
    expect(tabsStyles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*transition-duration: 1ms;/,
    );
    expect(tabsStyles).toMatch(
      /@media \(forced-colors: active\)[\s\S]*\.n-tabs__trigger:focus-visible[\s\S]*solid Highlight;/,
    );
  });

  it("keeps state class names and Indicator hydration geometry available to Base UI", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="State classes">
          <TabsTrigger className={() => "trigger-state"} value="one">
            One
          </TabsTrigger>
          <TabsIndicator className={() => "indicator-state"} />
        </TabsList>
        <TabsPanels>
          <TabsContent className={() => "content-state"} value="one">
            One panel
          </TabsContent>
        </TabsPanels>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "One" })).toHaveClass("trigger-state");
    expect(screen.getByRole("tabpanel")).toHaveClass("content-state");
    const indicator = document.querySelector('[data-slot="indicator"]');
    expect(indicator).toHaveClass("indicator-state");
    expect(indicator?.getAttribute("style")).toContain("--active-tab-left");
    expect(indicator?.getAttribute("style")).toContain("--active-tab-width");
  });

  it("opens DropdownMenu with the keyboard, skips disabled items, and restores trigger focus", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu
        trigger="Actions"
        onOpenChange={onOpenChange}
        items={[
          { label: "Rename", onSelect },
          { label: "Unavailable", disabled: true },
          { label: "Archive", destructive: true, onSelect },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Unavailable" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    expect(trigger).toHaveFocus();
  });

  it("keeps Input native behavior while normalizing protected state attributes", () => {
    const onChange = vi.fn();
    const onInput = vi.fn();
    const ref = React.createRef<HTMLInputElement>();
    render(
      <>
        <Input
          ref={ref}
          aria-invalid="grammar"
          autoComplete="email"
          data-size="consumer"
          data-slot="consumer"
          defaultValue="Maya"
          enterKeyHint="next"
          htmlSize={32}
          inputMode="email"
          onChange={onChange}
          onInput={onInput}
          required
        />
        <Input aria-invalid={false} invalid />
      </>,
    );
    const input = screen.getByDisplayValue("Maya");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("data-size", "md");
    expect(input).toHaveAttribute("aria-invalid", "grammar");
    expect(input).toHaveAttribute("autocomplete", "email");
    expect(input).toHaveAttribute("inputmode", "email");
    expect(input).toHaveAttribute("enterkeyhint", "next");
    expect(input).toHaveAttribute("size", "32");
    expect(input).toBeRequired();
    expect(ref.current).toBe(input);
    fireEvent.change(input, { target: { value: "Maya Chen" } });
    fireEvent.input(input, { target: { value: "Maya Chen" } });
    expect(onChange).toHaveBeenCalled();
    expect(onInput).toHaveBeenCalled();
    expect(screen.getAllByRole("textbox")[1]).toHaveAttribute("aria-invalid", "true");
    expect(screen.getAllByRole("textbox")[1]).toHaveAttribute("data-invalid", "");
  });

  it("composes InputGroup without replacing the native input contract", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Field label="Website" description="Use your public domain." message="Required" invalid>
        <InputGroup ref={ref} data-slot="consumer">
          <InputGroupAddon placement="start">https://</InputGroupAddon>
          <Input aria-describedby="custom-description" />
          <InputGroupAddon placement="end">
            <Button aria-label="Validate website">Check</Button>
          </InputGroupAddon>
        </InputGroup>
      </Field>,
    );
    const group = ref.current!;
    const input = screen.getByRole("textbox", { name: "Website" });
    expect(group).toHaveAttribute("data-slot", "input-group");
    expect(group).toHaveAttribute("data-invalid", "");
    expect(
      group.querySelector('[data-slot="input-group-addon"][data-placement="start"]'),
    ).toBeTruthy();
    expect(
      group.querySelector('[data-slot="input-group-addon"][data-placement="end"]'),
    ).toBeTruthy();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain("custom-description");
    expect(input.getAttribute("aria-describedby")).toContain("-description");
    expect(screen.getByRole("button", { name: "Validate website" })).toBeEnabled();
  });

  it("keeps Sheet slots, controlled state, and modal dismissal contracts aligned", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<SheetExample onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "Open settings" }));
    const sheet = await screen.findByRole("dialog", { name: "Workspace settings" });
    expect(sheet).toHaveAttribute("data-slot", "sheet-content");
    expect(sheet).toHaveAttribute("data-side", "left");
    expect(sheet).toHaveAttribute("data-size", "lg");
    expect(sheet.querySelector('[data-slot="sheet-header"]')).toBeInTheDocument();
    expect(sheet.querySelector('[data-slot="sheet-body"]')).toHaveTextContent("Settings content");
    expect(sheet.querySelector('[data-slot="sheet-footer"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close sheet" })).toHaveClass("n-sheet__close-icon");
    expect(screen.getByRole("button", { name: "Cancel" })).not.toHaveClass("n-sheet__close-icon");
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());

    function ControlledSheet() {
      const [open, setOpen] = React.useState(true);
      return <SheetExample open={open} onOpenChange={setOpen} />;
    }
    render(<ControlledSheet />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog", { name: "Workspace settings" })).not.toBeInTheDocument();
  });

  it("keeps SheetClose neutral in normal flow and preserves Button composition and refs", async () => {
    const user = userEvent.setup();
    const closeRef = React.createRef<HTMLButtonElement>();

    render(
      <Sheet>
        <SheetTrigger render={<button type="button">Open composed sheet</button>} />
        <SheetContent showClose={false}>
          <SheetHeader>
            <SheetTitle>Composed sheet</SheetTitle>
          </SheetHeader>
          <SheetBody>Content</SheetBody>
          <SheetFooter>
            <SheetClose
              ref={closeRef}
              className="custom-sheet-close"
              render={<Button variant="secondary">Cancel changes</Button>}
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByRole("button", { name: "Open composed sheet" }));
    const close = await screen.findByRole("button", { name: "Cancel changes" });
    expect(close).toHaveAttribute("data-slot", "sheet-close");
    expect(close).toHaveClass("custom-sheet-close");
    expect(close).not.toHaveClass("n-sheet__close-icon");
    expect(closeRef.current).toBe(close);

    await user.click(close);
    expect(screen.queryByRole("dialog", { name: "Composed sheet" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open composed sheet" })).toHaveFocus();
  });

  it("uses Sheet-specific backdrop, safe-area close, exit motion, and reduced-motion contracts", () => {
    const styles = readFileSync(resolve(process.cwd(), "src/styles/overlays.css"), "utf8");

    expect(styles).toMatch(
      /\[data-slot="sheet-backdrop"\]\s*\{[^}]*background:\s*var\(--n-sheet-backdrop\);/s,
    );
    expect(styles).toMatch(
      /\.n-sheet__close-icon\s*\{[^}]*inset-block-start:\s*max\(var\(--n-sheet-padding\),\s*env\(safe-area-inset-top\)\);[^}]*inset-inline-end:\s*max\(var\(--n-sheet-padding\),\s*env\(safe-area-inset-right\)\);/s,
    );
    expect(styles).toMatch(
      /\.n-sheet\[data-ending-style\]\s*\{\s*animation:\s*n-sheet-exit\s+var\(--n-motion-overlay-exit-duration\)\s+var\(--n-motion-overlay-exit-easing\);\s*\}/,
    );
    expect(styles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\.n-sheet\[data-side\],[^{]*\.n-sheet\[data-ending-style\]\[data-side\][^{]*\{\s*animation:\s*none;/s,
    );
  });

  it("coordinates uncontrolled Sidebar state, stable slots, and focus-safe collapse", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider defaultExpanded={false} side="right" sidebarId="workspace-sidebar">
        <Sidebar aria-label="Workspace tools">
          <SidebarHeader>Workspace</SidebarHeader>
          <SidebarContent>
            <nav aria-label="Workspace">
              <a href="/projects">Projects</a>
            </nav>
          </SidebarContent>
          <SidebarFooter>Account</SidebarFooter>
          <SidebarRail label="Collapse workspace sidebar" />
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger label="Expand workspace sidebar" />
          Workspace content
        </SidebarInset>
      </SidebarProvider>,
    );

    const sidebar = screen.getByRole("complementary", { name: "Workspace tools" });
    const trigger = screen.getByRole("button", { name: "Expand workspace sidebar" });
    expect(sidebar).toHaveAttribute("id", "workspace-sidebar");
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
    expect(sidebar).toHaveAttribute("data-side", "right");
    expect(sidebar.querySelector('[data-slot="sidebar-inner"]')).toHaveAttribute("inert");
    expect(trigger).toHaveAttribute("aria-controls", "workspace-sidebar");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    trigger.focus();
    await user.click(trigger);
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(sidebar).toHaveAttribute("data-state", "expanded");
    expect(sidebar.querySelector('[data-slot="sidebar-inner"]')).not.toHaveAttribute("inert");
    expect(sidebar.querySelector('[data-slot="sidebar-header"]')).toHaveTextContent("Workspace");
    expect(sidebar.querySelector('[data-slot="sidebar-content"]')).toBeInTheDocument();
    expect(sidebar.querySelector('[data-slot="sidebar-footer"]')).toHaveTextContent("Account");
  });

  it("keeps Sidebar rail geometry inside the declared hit area on both physical sides", () => {
    const styles = readFileSync(resolve(process.cwd(), "src/styles/sidebar.css"), "utf8");

    expect(styles).toMatch(
      /\.n-sidebar-rail\s*\{[^}]*block-size:\s*var\(--n-sidebar-rail-hit-area\);[^}]*inline-size:\s*var\(--n-sidebar-rail-hit-area\);[^}]*inset-block-start:\s*50%;[^}]*transform:\s*translateY\(-50%\);/s,
    );
    expect(styles).not.toMatch(/\.n-sidebar-rail\s*\{[^}]*inset-block:\s*0;/s);
    expect(styles).toMatch(
      /\.n-sidebar-rail\s*\{[^}]*right:\s*calc\(-0\.5 \* var\(--n-sidebar-rail-hit-area\)\);/s,
    );
    expect(styles).toMatch(
      /\.n-sidebar\[data-side="right"\] \.n-sidebar-rail\s*\{[^}]*left:\s*calc\(-0\.5 \* var\(--n-sidebar-rail-hit-area\)\);[^}]*right:\s*auto;/s,
    );
  });

  it("exposes an exact SidebarContent div ref and does not churn SidebarInset refs", () => {
    expectTypeOf(SidebarContent).toMatchTypeOf<
      React.ForwardRefExoticComponent<
        React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
      >
    >();

    const contentRef = React.createRef<HTMLDivElement>();
    const insetRef = vi.fn<(node: HTMLElement | null) => void>();
    const { rerender } = render(
      <>
        <SidebarContent ref={contentRef}>Navigation</SidebarContent>
        <SidebarInset ref={insetRef} data-version="one" />
      </>,
    );

    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(insetRef).toHaveBeenCalledTimes(1);
    const inset = insetRef.mock.calls[0]?.[0];
    expect(inset).toBeInstanceOf(HTMLElement);

    rerender(
      <>
        <SidebarContent ref={contentRef}>Navigation</SidebarContent>
        <SidebarInset ref={insetRef} data-version="two" />
      </>,
    );

    expect(insetRef).toHaveBeenCalledTimes(1);
    expect(insetRef.mock.calls[0]?.[0]).toBe(inset);
  });

  it("keeps Sidebar package entrypoints and source installation dependencies split", () => {
    const serverEntrypoint = readFileSync(resolve(process.cwd(), "src/index.ts"), "utf8");
    const clientEntrypoint = readFileSync(resolve(process.cwd(), "src/client.ts"), "utf8");
    const docsExample = readFileSync(
      resolve(process.cwd(), "../../apps/docs/components/sidebar-example.tsx"),
      "utf8",
    );
    const docsReference = readFileSync(
      resolve(process.cwd(), "../../apps/docs/components/component-reference.ts"),
      "utf8",
    );
    const sidebarPage = readFileSync(
      resolve(process.cwd(), "../../apps/docs/app/docs/components/sidebar-primitive/page.tsx"),
      "utf8",
    );
    const registry = JSON.parse(
      readFileSync(resolve(process.cwd(), "../registry/src/manifest.json"), "utf8"),
    ) as {
      items: Array<{ name: string; files: Array<{ target: string }> }>;
    };
    const sidebarItem = registry.items.find((item) => item.name === "sidebar-primitive");

    expect(serverEntrypoint).toContain("SidebarContent");
    expect(serverEntrypoint).toContain("SidebarInset");
    expect(serverEntrypoint).not.toContain('from "./components/sidebar"');
    expect(clientEntrypoint).toContain("SidebarProvider");
    expect(docsExample).toMatch(
      /import\s*\{[\s\S]*SidebarContent[\s\S]*SidebarInset[\s\S]*\}\s*from "@nerio-ui\/ui";/,
    );
    expect(docsExample).not.toMatch(/label="(?:Collapse|Expand) preview sidebar"/);
    expect(docsReference).not.toMatch(/SidebarRail, SidebarTrigger, useSidebar/);
    expect(docsReference).not.toMatch(/label="(?:Collapse|Expand) workspace sidebar"/);
    expect(sidebarPage).toContain('import * as React from "react";');
    expect(sidebarPage).not.toMatch(/SidebarInset, Icon|SidebarTrigger, useSidebar/);
    expect(docsExample).toMatch(
      /import\s*\{[\s\S]*SidebarProvider[\s\S]*SidebarRail[\s\S]*\}\s*from "@nerio-ui\/ui\/client";/,
    );
    expect(sidebarItem?.files.map((file) => file.target)).toContain("lib/compose-refs.ts");
  });

  it("composes one mobile navigation tree inside Sheet without a desktop Sidebar", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button variant="secondary">Open mobile navigation</Button>} />
        <SheetContent side="left" size="sm">
          <SheetHeader>
            <SheetTitle>Mobile navigation</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <SidebarContent>
              <nav aria-label="Mobile workspace navigation">
                <a href="/projects">Projects</a>
              </nav>
            </SidebarContent>
          </SheetBody>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open mobile navigation" }));
    expect(await screen.findByRole("dialog", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(screen.getAllByRole("navigation", { name: "Mobile workspace navigation" })).toHaveLength(
      1,
    );
  });

  it("keeps controlled Sidebar state consumer-owned", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(
      <SidebarProvider expanded={false} onExpandedChange={onExpandedChange}>
        <Sidebar aria-label="Filters" />
        <SidebarInset>
          <SidebarTrigger label="Toggle filters" />
        </SidebarInset>
      </SidebarProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Toggle filters" }));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("complementary", { name: "Filters" })).toHaveAttribute(
      "data-state",
      "collapsed",
    );
  });

  it("filters Command items, skips disabled values, and emits stable selections", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onActiveValueChange = vi.fn();
    const items = [
      { value: "open", label: "Open project", disabled: true },
      { value: "settings", label: "Workspace settings", keywords: ["preferences"] },
      { value: "invite", label: "Invite teammate" },
    ];

    render(
      <Command items={items} onActiveValueChange={onActiveValueChange}>
        <CommandInput aria-label="Workspace commands" placeholder="Search commands" />
        <CommandLoading loading={false} />
        <CommandEmpty>No matching commands.</CommandEmpty>
        <CommandList>
          {(item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              description={`${item.label} description`}
              onSelect={onSelect}
            >
              {item.label}
            </CommandItem>
          )}
        </CommandList>
      </Command>,
    );

    const input = screen.getByRole("combobox", { name: "Workspace commands" });
    await user.click(screen.getByRole("option", { name: /Open project/ }));
    expect(onSelect).not.toHaveBeenCalled();
    input.focus();
    await user.keyboard("{ArrowDown}");
    expect(onActiveValueChange).toHaveBeenLastCalledWith("settings", expect.anything());
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("aria-activedescendant");

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("settings", expect.anything());
    expect(input).toHaveValue("Workspace settings");
    await user.clear(input);
    await user.type(input, "preferences");
    const settings = screen.getByRole("option", { name: /Workspace settings/ });
    expect(settings).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Invite teammate/ })).not.toBeInTheDocument();
    await user.click(settings);
    expect(onSelect).toHaveBeenLastCalledWith("settings", expect.anything());
    expect(input).toHaveValue("Workspace settings");

    await user.clear(input);
    await user.type(input, "missing");
    expect(screen.getByText("No matching commands.")).toBeInTheDocument();
  });

  it("keeps controlled Command queries label-only after keyword selection", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const items = [
      {
        value: "workspace-settings",
        label: "Workspace settings",
        keywords: ["preferences", "configuration"],
      },
    ];

    function ControlledCommand() {
      const [query, setQuery] = React.useState("");
      return (
        <Command
          items={items}
          query={query}
          onQueryChange={(nextQuery, details) => {
            onQueryChange(nextQuery, details);
            setQuery(nextQuery);
          }}
        >
          <CommandInput aria-label="Controlled commands" />
          <CommandList>
            {(item) => <CommandItem value={item.value}>{item.label}</CommandItem>}
          </CommandList>
        </Command>
      );
    }

    render(<ControlledCommand />);
    const input = screen.getByRole("combobox", { name: "Controlled commands" });
    await user.type(input, "preferences");
    await user.click(screen.getByRole("option", { name: "Workspace settings" }));

    expect(input).toHaveValue("Workspace settings");
    expect(onQueryChange).toHaveBeenLastCalledWith("Workspace settings", expect.anything());
    expect(onQueryChange).not.toHaveBeenCalledWith(
      expect.stringContaining("workspace-settings"),
      expect.anything(),
    );
    expect(onQueryChange).not.toHaveBeenCalledWith(
      expect.stringContaining("configuration"),
      expect.anything(),
    );
  });

  it("submits the visible Command label while onSelect emits the stable value", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const items = [
      { value: "workspace-settings", label: "Workspace settings", keywords: ["preferences"] },
    ];

    render(
      <form aria-label="Command form">
        <Command items={items} name="command">
          <CommandInput aria-label="Form commands" />
          <CommandList>
            {(item) => (
              <CommandItem value={item.value} onSelect={onSelect}>
                {item.label}
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </form>,
    );

    const input = screen.getByRole("combobox", { name: "Form commands" });
    await user.type(input, "preferences");
    await user.click(screen.getByRole("option", { name: "Workspace settings" }));

    expect(input).toHaveValue("Workspace settings");
    expect(onSelect).toHaveBeenCalledWith("workspace-settings", expect.anything());
    expect(new FormData(screen.getByRole("form")).get("command")).toBe("Workspace settings");
  });

  it("keeps Command groups semantic and supports consumer-filtered results", async () => {
    const user = userEvent.setup();
    const groups = [
      {
        value: "navigation",
        label: "Navigation",
        items: [
          { value: "overview", label: "Open overview" },
          { value: "activity", label: "Open activity" },
        ],
      },
      {
        value: "actions",
        label: "Actions",
        items: [{ value: "create", label: "Create project" }],
      },
    ];

    render(
      <Command items={groups} filter={false}>
        <CommandInput aria-label="Consumer-filtered commands" />
        <CommandList>
          {(item) => (
            <CommandItem key={item.value} value={item.value}>
              {item.label}
            </CommandItem>
          )}
        </CommandList>
      </Command>,
    );

    expect(within(screen.getByRole("listbox")).getAllByRole("group")).toHaveLength(2);
    expect(screen.getByRole("group", { name: "Navigation" })).toBeInTheDocument();
    await user.type(screen.getByRole("combobox"), "does not filter");
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("rejects duplicate Command item values", () => {
    const items = [
      { value: "settings", label: "Workspace settings" },
      { value: "settings", label: "Personal settings" },
    ];

    expect(() =>
      render(
        <Command items={items}>
          <CommandInput aria-label="Duplicate commands" />
          <CommandList>
            {(item) => (
              <CommandItem key={item.label} value={item.value}>
                {item.label}
              </CommandItem>
            )}
          </CommandList>
        </Command>,
      ),
    ).toThrow('Command items require unique values; duplicate "settings".');
  });

  it("keeps Command item layout explicit and preserves leading-content semantics", () => {
    const items = [
      { value: "plain", label: "A very long localized command label without leading content" },
      { value: "meaningful", label: "Command with meaningful leading content" },
    ];

    render(
      <Command items={items}>
        <CommandInput aria-label="Layout commands" />
        <CommandList>
          {(item) => (
            <CommandItem
              value={item.value}
              description="A long localized description that must wrap independently"
              leading={
                item.value === "meaningful" ? (
                  <span aria-label="Document status">●</span>
                ) : undefined
              }
              metadata="Metadata"
              shortcut="⌘ K"
            >
              {item.label}
            </CommandItem>
          )}
        </CommandList>
      </Command>,
    );

    const [plainItem, meaningfulItem] = screen.getAllByRole("option");
    expect(plainItem).toHaveAttribute("data-leading", "false");
    expect(meaningfulItem).toHaveAttribute("data-leading", "true");
    expect(screen.getByLabelText("Document status").parentElement).not.toHaveAttribute(
      "aria-hidden",
    );

    const styles = readFileSync(resolve(process.cwd(), "src/styles/command.css"), "utf8");
    expect(styles).toMatch(
      /\.n-command__item\[data-leading="false"\][^{]*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto auto;/s,
    );
    expect(styles).toMatch(
      /\.n-command__item\[data-leading="true"\][^{]*\{[^}]*grid-template-columns:\s*auto minmax\(0, 1fr\) auto auto;/s,
    );
    expect(styles).toContain("var(--n-focus-ring)");
    expect(styles).toMatch(
      /@media \(forced-colors: active\)[\s\S]*\.n-command__input:focus-visible[\s\S]*solid Highlight;/,
    );
  });

  it("does not select a Command item while IME composition is active", () => {
    const onSelect = vi.fn();
    const items = [{ value: "search", label: "Search workspace" }];
    render(
      <Command items={items}>
        <CommandInput aria-label="IME commands" />
        <CommandList>
          {(item) => (
            <CommandItem key={item.value} value={item.value} onSelect={onSelect}>
              {item.label}
            </CommandItem>
          )}
        </CommandList>
      </Command>,
    );
    const input = screen.getByRole("combobox", { name: "IME commands" });
    input.focus();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229, which: 229 });
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input, { data: "検索" });
  });

  it("composes Command with Popover, Dialog, and Sheet dismissal and focus contracts", async () => {
    const user = userEvent.setup();
    const items = [{ value: "settings", label: "Workspace settings" }];
    const content = (label: string) => (
      <Command items={items}>
        <CommandInput autoFocus aria-label={`${label} commands`} />
        <CommandList>
          {(item) => (
            <CommandItem key={item.value} value={item.value}>
              {item.label}
            </CommandItem>
          )}
        </CommandList>
      </Command>
    );

    render(
      <>
        <Popover trigger="Open popover commands" title="Popover commands">
          {content("Popover")}
        </Popover>
        <Dialog trigger="Open dialog commands" title="Dialog commands">
          {content("Dialog")}
        </Dialog>
        <Sheet>
          <SheetTrigger render={<button type="button">Open sheet commands</button>} />
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet commands</SheetTitle>
            </SheetHeader>
            <SheetBody>{content("Sheet")}</SheetBody>
          </SheetContent>
        </Sheet>
      </>,
    );

    for (const [triggerName, inputName] of [
      ["Open popover commands", "Popover commands"],
      ["Open dialog commands", "Dialog commands"],
      ["Open sheet commands", "Sheet commands"],
    ] as const) {
      const trigger = screen.getByRole("button", { name: triggerName });
      await user.click(trigger);
      const input = await screen.findByRole("combobox", { name: inputName });
      expect(input).toHaveFocus();
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("combobox", { name: inputName })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    }
  });
});
