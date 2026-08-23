"use client";

import {
  BookOpen,
  CircleQuestionMark,
  Copy,
  Eye,
  FileText,
  Layers,
  Palette,
  PanelLeft,
  Save,
  Settings,
  Upload,
  UserPlus,
  WalletCards,
  X,
} from "@nerio-ui/adapters/icons";
import {
  Button,
  Dialog,
  DialogFooter,
  DropdownMenuCheckboxItem,
  DropdownMenuCheckboxItemIndicator,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuItemContent,
  DropdownMenuItemDescription,
  DropdownMenuItemLabel,
  DropdownMenuLinkItem,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRadioItemIndicator,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubContent,
  DropdownMenuSubmenu,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Popover,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
  ToastProvider,
  ToastViewport,
  Tooltip,
  useToastManager,
} from "@nerio-ui/ui/client";
import { PreviewFrame, type PreviewProps } from "./shared";

export function OverlaysPreview({ kind, snippet }: PreviewProps) {
  return (
    <PreviewFrame kind={kind} snippet={snippet}>
      {kind === "dialog" ? (
        <Dialog
          trigger="Open dialog"
          title="Share collection"
          description="Choose how this collection should be shared."
        >
          <p>Choose collaborators and permissions before sharing this workspace collection.</p>
          <DialogFooter>
            <Button>Send invite</Button>
          </DialogFooter>
        </Dialog>
      ) : null}
      {kind === "sheet" ? (
        <>
          <Sheet>
            <SheetTrigger render={<Button variant="secondary">Open settings</Button>} />
            <SheetContent side="right" size="md" showClose={false}>
              <SheetHeader>
                <SheetTitle>Workspace settings</SheetTitle>
                <SheetDescription>Configure shared workspace defaults.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>
                  Choose how this workspace handles member notifications and shared preferences.
                </p>
              </SheetBody>
              <SheetFooter>
                <SheetClose render={<Button variant="secondary">Cancel</Button>} />
                <Button>Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger render={<Button variant="secondary">Open mobile navigation</Button>} />
            <SheetContent side="left" size="sm">
              <SheetHeader>
                <SheetTitle>Workspace navigation</SheetTitle>
                <SheetDescription>Choose a destination in this product.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <Button variant="ghost">Projects</Button>
                <Button variant="ghost">Activity</Button>
              </SheetBody>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger render={<Button variant="secondary">Open filters</Button>} />
            <SheetContent side="top" size="lg">
              <SheetHeader>
                <SheetTitle>View filters</SheetTitle>
                <SheetDescription>
                  Refine the current list in the consumer application.
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>Filter controls remain application-owned composition.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger render={<Button variant="secondary">Open details</Button>} />
            <SheetContent side="bottom" size="sm">
              <SheetHeader>
                <SheetTitle>Collection details</SheetTitle>
                <SheetDescription>
                  Review contextual information without leaving the page.
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p>Contextual detail content remains owned by the consuming product.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </>
      ) : null}
      {kind === "toast" ? (
        <ToastProvider>
          <ToastDemoButton />
          <ToastViewport swipeDirection={["left", "right", "up", "down"]} />
        </ToastProvider>
      ) : null}
      {kind === "tabs" ? (
        <Tabs defaultValue="overview" variant="segmented">
          <TabsList aria-label="Workspace sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger disabled value="archive">
              Archive
            </TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsPanels>
            <TabsContent value="overview">
              Recent activity, ownership, and status are grouped here.
            </TabsContent>
            <TabsContent value="files">
              Documents, assets, and supporting material stay in this panel.
            </TabsContent>
            <TabsContent value="settings">
              Permissions and workflow preferences are edited here.
            </TabsContent>
            <TabsContent value="archive">
              Archived content is unavailable in this preview.
            </TabsContent>
          </TabsPanels>
        </Tabs>
      ) : null}
      {kind === "tooltip" ? (
        <Tooltip label="Copies the share link to your clipboard.">
          <Button variant="secondary">Copy link</Button>
        </Tooltip>
      ) : null}
      {kind === "popover" ? (
        <Popover
          trigger="Filters"
          title="View filters"
          description="Refine the workspace list without leaving the page."
        >
          <Button size="sm">Apply filters</Button>
        </Popover>
      ) : null}
      {kind === "dropdown-menu" ? (
        <DropdownMenuRoot>
          <DropdownMenuTrigger render={<Button variant="secondary">Complex menu</Button>} />
          <DropdownMenuPortal>
            <DropdownMenuPositioner>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuGroupLabel>File</DropdownMenuGroupLabel>
                  <DropdownMenuItem>
                    <FileText aria-hidden />
                    <DropdownMenuItemLabel>New document</DropdownMenuItemLabel>
                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy aria-hidden />
                    <DropdownMenuItemLabel>Duplicate</DropdownMenuItemLabel>
                    <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSubmenu>
                    <DropdownMenuSubTrigger>
                      <Layers aria-hidden />
                      <DropdownMenuItemLabel>Open recent</DropdownMenuItemLabel>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Design system</DropdownMenuItem>
                      <DropdownMenuItem>Documentation</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSubmenu>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Save aria-hidden />
                  <DropdownMenuItemLabel>Save</DropdownMenuItemLabel>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload aria-hidden />
                  <DropdownMenuItemLabel>Export</DropdownMenuItemLabel>
                  <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuGroupLabel>View</DropdownMenuGroupLabel>
                  <DropdownMenuCheckboxItem closeOnClick={false} defaultChecked>
                    <Eye aria-hidden />
                    <DropdownMenuItemLabel>Show sidebar</DropdownMenuItemLabel>
                    <DropdownMenuCheckboxItemIndicator className="ms-auto" />
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem closeOnClick={false}>
                    <PanelLeft aria-hidden />
                    <DropdownMenuItemLabel>Show details</DropdownMenuItemLabel>
                    <DropdownMenuCheckboxItemIndicator className="ms-auto" />
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSubmenu>
                    <DropdownMenuSubTrigger>
                      <Palette aria-hidden />
                      <DropdownMenuItemLabel>Theme</DropdownMenuItemLabel>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup defaultValue="system">
                        <DropdownMenuRadioItem closeOnClick={false} value="light">
                          <DropdownMenuRadioItemIndicator />
                          Light
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem closeOnClick={false} value="dark">
                          <DropdownMenuRadioItemIndicator />
                          Dark
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem closeOnClick={false} value="system">
                          <DropdownMenuRadioItemIndicator />
                          System
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSubmenu>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuGroupLabel>Account</DropdownMenuGroupLabel>
                  <DropdownMenuLinkItem href="#dropdown-menu-guidance">
                    <UserPlus aria-hidden />
                    <DropdownMenuItemContent>
                      <DropdownMenuItemLabel>Invite members</DropdownMenuItemLabel>
                      <DropdownMenuItemDescription>
                        Add people to this workspace
                      </DropdownMenuItemDescription>
                    </DropdownMenuItemContent>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuLinkItem>
                  <DropdownMenuItem>
                    <WalletCards aria-hidden />
                    <DropdownMenuItemLabel>Billing</DropdownMenuItemLabel>
                  </DropdownMenuItem>
                  <DropdownMenuSubmenu>
                    <DropdownMenuSubTrigger>
                      <Settings aria-hidden />
                      <DropdownMenuItemLabel>Settings</DropdownMenuItemLabel>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Workspace settings</DropdownMenuItem>
                      <DropdownMenuItem disabled>Organization settings</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSubmenu>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLinkItem href="#dropdown-menu-guidance">
                  <CircleQuestionMark aria-hidden />
                  <DropdownMenuItemLabel>Help and support</DropdownMenuItemLabel>
                </DropdownMenuLinkItem>
                <DropdownMenuLinkItem href="#dropdown-menu-anatomy">
                  <BookOpen aria-hidden />
                  <DropdownMenuItemLabel>Documentation</DropdownMenuItemLabel>
                </DropdownMenuLinkItem>
                <DropdownMenuItem variant="destructive">
                  <X aria-hidden />
                  <DropdownMenuItemLabel>Remove workspace</DropdownMenuItemLabel>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      ) : null}
    </PreviewFrame>
  );
}

function ToastDemoButton() {
  const toast = useToastManager();
  return (
    <>
      <Button
        onClick={() => {
          ["Draft saved", "Link copied", "Invite sent"].forEach((title, index) => {
            toast.add({
              id: `toast-stack-${index}`,
              title,
              description: "This managed stack keeps newest feedback first.",
              data: { tone: index === 0 ? "success" : "neutral" },
            });
          });
        }}
      >
        Stack notifications
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            id: "toast-persistent",
            title: "Export is ready",
            description:
              "The export includes every selected workspace, translated field label, and collaborator note, so it stays available until dismissed.",
            timeout: 0,
            data: {
              tone: "success",
              action: { label: "Open", onClick: () => undefined },
            },
          })
        }
      >
        Persistent action
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            id: "toast-urgent",
            title: "Sync failed",
            description: "Keep the inline error visible until the issue is resolved.",
            priority: "high",
            data: { tone: "danger" },
          })
        }
      >
        Urgent failure
      </Button>
    </>
  );
}
