"use client";

import {
  Alert,
  Avatar,
  Badge,
  Icon,
  Input,
  Label,
  Progress,
  RadioGroup,
  Select,
  Separator,
  Spinner,
} from "@nerio/ui/client";
import {
  Button,
  Checkbox,
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
} from "@nerio/ui/client";
import {
  CircleAlert,
  Mail,
  MessageCircle,
  Plus,
  Save,
  Settings,
  UserPlus,
  X,
} from "@nerio/adapters/icons";
import type { IconComponent } from "@nerio/adapters/icons";

const avatars = ["Ava Cole", "Noah Lee", "Maya Chen", "Owen Hart", "Iris Park"];

const GoogleIcon: IconComponent = ({ size = 24, strokeWidth, ...props }) => {
  void strokeWidth;

  return (
    <svg {...props} height={size} viewBox="0 0 24 24" width={size}>
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.16 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
};

const AppleIcon: IconComponent = ({ size = 24, strokeWidth, ...props }) => {
  void strokeWidth;

  return (
    <svg {...props} height={size} viewBox="0 0 24 24" width={size}>
      <path
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.32.03-1.75-.79-3.27-.79-1.53 0-2.01.77-3.26.82-1.31.05-2.3-1.32-3.14-2.53-1.71-2.47-3.02-6.96-1.26-10.01.87-1.52 2.47-2.48 4.19-2.51 1.31-.03 2.55.89 3.27.89.71 0 2.05-1.1 3.46-.94.59.03 2.24.24 3.3 1.79-.08.05-1.97 1.15-1.95 3.54.03 2.86 2.51 3.81 2.54 3.82-.03.07-.4 1.36-1.31 2.78M14.86 5.41c.69-.79 1.14-1.88 1.02-2.96-1 .04-2.21.67-2.91 1.46-.63.7-1.18 1.81-1.03 2.85 1.11.09 2.24-.56 2.92-1.35Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
};

function AvatarStack() {
  return (
    <div className="home-avatar-stack" aria-label="Project collaborators">
      {avatars.map((name) => (
        <Avatar key={name} name={name} size="lg" />
      ))}
      <span className="home-avatar-stack__more">+5</span>
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
                    <Badge emphasis="strong" size="sm" tone="danger">
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

          <section className="home-gallery__menu" aria-label="Action menu">
            <p>Actions</p>
            <Button kbd="⌘N" leadingIcon={Plus} variant="ghost">
              <span className="home-gallery__menu-label">
                <strong>New component</strong>
                <small>Add a reusable building block.</small>
              </span>
            </Button>
            <Button kbd="⌘," leadingIcon={Settings} variant="ghost">
              <span className="home-gallery__menu-label">
                <strong>Edit theme</strong>
                <small>Adjust color and appearance.</small>
              </span>
            </Button>
            <Separator />
            <Button kbd="⌘⌫" leadingIcon={X} variant="danger">
              <span className="home-gallery__menu-label">
                <strong>Archive project</strong>
                <small>Move this project out of view.</small>
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
              <h3 id="verification-title">Verify workspace</h3>
              <p>Enter the six-digit access code.</p>
            </div>
            <div className="home-gallery__verification-code">
              <div className="home-otp-inputs" aria-label="Verification code">
                {["4", "3", "2", "0", "", ""].map((value, index) => (
                  <Input
                    aria-label={`Code digit ${index + 1}`}
                    defaultValue={value}
                    key={`${value}-${index}`}
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>
              <Button size="sm" variant="link">
                Resend
              </Button>
            </div>
            <div className="home-gallery__button-row">
              <Button size="sm">Continue</Button>
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
              <Button leadingIcon={GoogleIcon} size="sm" variant="secondary">
                Continue with Google
              </Button>
              <Button leadingIcon={AppleIcon} size="sm" variant="secondary">
                Continue with Apple
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
            <span className="home-gallery__icon-mark" aria-hidden>
              <Icon icon={Save} />
            </span>
            <div className="home-gallery__confirm-copy">
              <h3 id="confirm-title">Unsaved changes</h3>
              <p>Save your token changes before leaving this page.</p>
            </div>
            <div className="home-gallery__confirm-actions">
              <Button variant="secondary">Discard</Button>
              <Button>Save changes</Button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
