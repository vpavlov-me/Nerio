"use client";

import {
  Alert,
  Avatar,
  Badge,
  Dialog,
  DialogFooter,
  Icon,
  Input,
  Label,
  Popover,
  Progress,
  RadioGroup,
  Select,
  Separator,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Spinner,
} from "@nerio-ui/ui/client";
import {
  Button,
  Checkbox,
  Kbd,
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
} from "@nerio-ui/ui/client";
import {
  CircleAlert,
  Mail,
  MessageCircle,
  Plus,
  Save,
  Settings,
  UserPlus,
  X,
} from "@nerio-ui/adapters/icons";

const avatars = ["Ava Cole", "Noah Lee", "Maya Chen", "Owen Hart", "Iris Park"];

function AvatarStack() {
  return (
    <div className="home-avatar-stack" aria-label="Project collaborators">
      {avatars.map((name) => (
        <Avatar key={name} name={name} size="lg" />
      ))}
      <Avatar fallback="+5" name="5 more collaborators" size="lg" />
    </div>
  );
}

export function HomeComponentShowcase() {
  return (
    <section className="home-showcase__canvas" aria-label="Component showcase">
      <div className="home-gallery">
        <div className="home-gallery__column">
          <section className="home-gallery__controls" aria-label="Form components">
            <div className="home-gallery__field">
              <Label htmlFor="showcase-email">Your email</Label>
              <Input
                key="showcase-email-v2"
                id="showcase-email"
                defaultValue="john@email.com"
                type="email"
              />
            </div>
            <Select
              defaultValue="california"
              label="State"
              options={[
                { label: "California", value: "california" },
                { label: "New York", value: "new-york" },
                { label: "Texas", value: "texas" },
              ]}
            />
            <div className="home-gallery__control-row" aria-label="Control states">
              <Checkbox aria-label="Selected" defaultChecked />
              <Switch aria-label="Enabled" defaultChecked />
              <RadioGroup
                className="home-gallery__radio"
                defaultValue="selected"
                label="View"
                options={[
                  { label: "", value: "selected" },
                  { label: "", value: "unselected" },
                ]}
              />
              <Spinner className="home-gallery__spinner" label="Loading preview" size="sm" />
            </div>
            <Progress
              label="Release readiness"
              max={4}
              value={3}
              valueLabel="3/4"
              valueText="3 of 4 release checks complete"
            />
          </section>

          <section className="home-gallery__ranges" aria-label="View controls">
            <Tabs className="home-gallery__range-tabs" defaultValue="1d" variant="segmented">
              <TabsList aria-label="Chart range" layout="fill">
                {["1D", "7D", "1M", "1Y", "All"].map((label) => (
                  <TabsTrigger key={label} value={label.toLowerCase()}>
                    {label}
                  </TabsTrigger>
                ))}
                <TabsIndicator />
              </TabsList>
              <TabsPanels>
                {["1D", "7D", "1M", "1Y", "All"].map((label) => (
                  <TabsContent key={label} value={label.toLowerCase()} />
                ))}
              </TabsPanels>
            </Tabs>
            <Tabs className="home-gallery__channel-tabs" defaultValue="chats" variant="segmented">
              <TabsList aria-label="Message channel" layout="fill">
                <TabsTrigger leadingIcon={MessageCircle} value="chats">
                  Chats
                </TabsTrigger>
                <TabsTrigger
                  badge={
                    <Badge emphasis="soft" size="sm" tone="warning">
                      12
                    </Badge>
                  }
                  leadingIcon={Mail}
                  value="emails"
                >
                  Emails
                </TabsTrigger>
                <TabsIndicator />
              </TabsList>
              <TabsPanels>
                <TabsContent value="chats" />
                <TabsContent value="emails" />
              </TabsPanels>
            </Tabs>
          </section>

          <section className="home-gallery__overlays" aria-labelledby="overlays-title">
            <div className="home-gallery__overlays-heading">
              <h3 id="overlays-title">Overlays</h3>
              <p>Contextual layers and focused tasks.</p>
            </div>
            <div className="home-gallery__overlay-triggers">
              <Dialog
                trigger={
                  <Button size="sm" variant="secondary">
                    Dialog
                  </Button>
                }
                title="Invite teammates"
                description="Share this workspace with your product team."
              >
                <Input aria-label="Teammate email" placeholder="name@company.com" type="email" />
                <DialogFooter>
                  <Button variant="secondary">Copy invite</Button>
                  <Button>Send invite</Button>
                </DialogFooter>
              </Dialog>

              <Sheet>
                <SheetTrigger
                  render={
                    <Button size="sm" variant="secondary">
                      Sheet
                    </Button>
                  }
                />
                <SheetContent side="right" size="sm">
                  <SheetHeader>
                    <SheetTitle>Workspace settings</SheetTitle>
                    <SheetDescription>Adjust the defaults for this project.</SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <div className="home-gallery__overlay-setting">
                      <span>
                        <strong>Activity summaries</strong>
                        <small>Receive a weekly project digest.</small>
                      </span>
                      <Switch aria-label="Enable activity summaries" defaultChecked />
                    </div>
                  </SheetBody>
                  <SheetFooter>
                    <SheetClose render={<Button variant="secondary">Cancel</Button>} />
                    <Button>Save changes</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Popover
                trigger={
                  <Button size="sm" variant="secondary">
                    Popover
                  </Button>
                }
                title="Quick preferences"
                description="Keep changes close to their trigger."
              >
                <div className="home-gallery__overlay-setting">
                  <span>
                    <strong>Compact updates</strong>
                    <small>Reduce detail in the activity feed.</small>
                  </span>
                  <Switch aria-label="Enable compact updates" />
                </div>
              </Popover>
            </div>
          </section>

          <section className="home-gallery__menu" aria-label="Action menu">
            <p>Actions</p>
            <Button kbd={<Kbd>⌘N</Kbd>} leadingIcon={Plus} variant="ghost">
              <span className="home-gallery__menu-label">
                <strong>New component</strong>
              </span>
            </Button>
            <Button kbd={<Kbd>⌘,</Kbd>} leadingIcon={Settings} variant="ghost">
              <span className="home-gallery__menu-label">
                <strong>Edit theme</strong>
              </span>
            </Button>
            <Separator />
            <Button kbd={<Kbd>⌘⌫</Kbd>} leadingIcon={X} variant="ghost">
              <span className="home-gallery__menu-label">
                <strong>Archive project</strong>
              </span>
            </Button>
          </section>
        </div>

        <div className="home-gallery__column">
          <section className="home-gallery__avatars" aria-label="Project collaborators">
            <AvatarStack />
          </section>

          <section className="home-gallery__verification" aria-labelledby="verification-title">
            <div>
              <h3 id="verification-title">Verify account</h3>
              <p>We&apos;ve sent a code to a****@gmail.com.</p>
            </div>
            <div className="home-gallery__verification-code">
              <div className="home-otp-inputs" aria-label="Verification code">
                {["4", "3", "2", "separator", "0", "", ""].map((value, index) =>
                  value === "separator" ? (
                    <span key={value} className="home-otp-inputs__separator" aria-hidden>
                      –
                    </span>
                  ) : (
                    <Input
                      aria-label={`Code digit ${index < 3 ? index + 1 : index}`}
                      defaultValue={value}
                      key={`${value}-${index}`}
                      maxLength={1}
                      inputMode="numeric"
                    />
                  ),
                )}
              </div>
              <p className="home-gallery__verification-resend">
                Didn&apos;t receive a code?{" "}
                <Button size="sm" variant="link">
                  Resend
                </Button>
              </p>
            </div>
          </section>

          <section className="home-gallery__button-block" aria-label="Button variants">
            <div className="home-gallery__button-set">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="danger">
                Danger
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
              <Button size="sm" variant="link">
                Link
              </Button>
            </div>
          </section>

          <section className="home-gallery__profile" aria-labelledby="profile-title">
            <Avatar name="Nerio Core" size="lg" />
            <div className="home-gallery__profile-content">
              <div className="home-gallery__profile-heading">
                <h3 id="profile-title">
                  Nerio Core <Badge tone="primary-soft">Open source</Badge>
                </h3>
                <p>@nerio-ui</p>
              </div>
              <strong>Accessible building blocks for adaptable product teams.</strong>
              <div className="home-gallery__profile-stats">
                <span>
                  <b>37</b> Components
                </span>
                <span>
                  <b>587</b> Tokens
                </span>
              </div>
            </div>
          </section>

          <Alert
            action={<Button size="sm">Upgrade</Button>}
            className="home-gallery__credits"
            icon={CircleAlert}
            title="You have 2 credits left"
            tone="info"
          >
            Add a project to keep your workspace moving.
          </Alert>

          <section className="home-gallery__preference" aria-label="Density preference">
            <span>
              <strong>Compact density</strong>
              <small>Use tighter control spacing.</small>
            </span>
            <Switch aria-label="Enable compact density" defaultChecked />
          </section>
        </div>

        <div className="home-gallery__column">
          <section className="home-gallery__project" aria-labelledby="project-title">
            <Button
              aria-label="Close account form"
              className="home-gallery__modal-close"
              icon={X}
              size="sm"
              variant="secondary"
            />
            <span className="home-gallery__icon-mark" aria-hidden>
              <Icon icon={UserPlus} />
            </span>
            <div className="home-gallery__project-copy">
              <h3 id="project-title">Create an account</h3>
              <p>Start a workspace for your product team.</p>
            </div>
            <Button>Get started</Button>
            <div className="home-gallery__or" aria-hidden="true">
              <Separator />
              <span>or</span>
              <Separator />
            </div>
            <div className="home-gallery__project-actions">
              <Button size="sm" variant="secondary">
                <span className="home-auth-action">
                  <img
                    alt=""
                    className="home-auth-action__google"
                    height="120"
                    src="/brand/google-g.svg"
                    width="118"
                  />
                  <span>Continue with Google</span>
                </span>
              </Button>
              <Button size="sm" variant="secondary">
                <span className="home-auth-action">
                  <img
                    alt=""
                    className="home-auth-action__apple"
                    height="73"
                    src="/brand/apple-logo.svg"
                    width="73"
                  />
                  <span>Continue with Apple</span>
                </span>
              </Button>
            </div>
          </section>

          <section className="home-gallery__members" aria-label="Team members">
            <div>
              <Avatar name="AC" size="lg" />
              <div className="home-gallery__member-copy">
                <strong>Design systems</strong>
                <span>128 members</span>
              </div>
            </div>
            <div>
              <Avatar name="NL" size="lg" />
              <div className="home-gallery__member-copy">
                <strong>Product builders</strong>
                <span>362 members</span>
              </div>
            </div>
          </section>

          <section className="home-gallery__confirm" aria-labelledby="confirm-title">
            <Button
              aria-label="Close unsaved changes dialog"
              className="home-gallery__modal-close"
              icon={X}
              size="sm"
              variant="secondary"
            />
            <span className="home-gallery__icon-mark" aria-hidden>
              <Icon icon={Save} />
            </span>
            <div className="home-gallery__confirm-copy">
              <h3 id="confirm-title">Unsaved changes</h3>
              <p>Save your token changes before leaving this page.</p>
            </div>
            <div className="home-gallery__confirm-actions">
              <Button variant="secondary">Discard</Button>
              <Button kbd={<Kbd>↵</Kbd>}>Save changes</Button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
