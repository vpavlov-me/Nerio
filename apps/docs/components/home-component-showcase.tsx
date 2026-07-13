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
import { Check, Circle, CircleAlert, Plus, Save, Settings, X } from "@nerio/adapters";

const avatars = ["Ava Cole", "Noah Lee", "Maya Chen", "Owen Hart", "Iris Park"];

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
              <Spinner label="Loading preview" size="sm" />
            </div>
            <Progress label="Release readiness" value={68} valueText="68 percent" />
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
                <TabsTrigger value="chats">Chats</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
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
            <Button leadingIcon={Plus} variant="ghost">
              New component
            </Button>
            <Button leadingIcon={Settings} variant="ghost">
              Edit theme
            </Button>
            <Separator />
            <Button leadingIcon={X} variant="ghost">
              Archive project
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
            <div className="home-gallery__button-row">
              <Button size="sm">Continue</Button>
              <Button size="sm" variant="secondary">
                Resend
              </Button>
              <Button size="sm" variant="ghost">
                Cancel
              </Button>
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
            <div>
              <h3 id="profile-title">
                Nerio Core <Badge tone="primary-soft">Open source</Badge>
              </h3>
              <p>@nerio-ui</p>
              <strong>Accessible building blocks for adaptable product teams.</strong>
              <div>
                <b>37</b> Components <b>587</b> Tokens
              </div>
            </div>
          </section>

          <Alert
            action={
              <Button size="sm" variant="secondary">
                Upgrade
              </Button>
            }
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
              <Icon icon={Circle} />
            </span>
            <h3 id="project-title">Create an account</h3>
            <p>Start a workspace for your product team.</p>
            <Button>Get started</Button>
            <div className="home-gallery__or" aria-hidden="true">
              <Separator />
              <span>or</span>
              <Separator />
            </div>
            <div className="home-gallery__project-actions">
              <Button size="sm" variant="secondary">
                Continue with Google
              </Button>
              <Button size="sm" variant="secondary">
                Continue with Apple
              </Button>
            </div>
          </section>

          <section className="home-gallery__members" aria-label="Team members">
            <div>
              <Avatar name="AC" size="lg" />
              <strong>Design systems</strong>
              <span>128 members</span>
            </div>
            <div>
              <Avatar name="NL" size="lg" />
              <strong>Product builders</strong>
              <span>362 members</span>
            </div>
          </section>

          <section className="home-gallery__confirm" aria-labelledby="confirm-title">
            <span className="home-gallery__icon-mark" aria-hidden>
              <Icon icon={Save} />
            </span>
            <h3 id="confirm-title">Unsaved changes</h3>
            <p>Save your token changes before leaving this page.</p>
            <div className="home-gallery__confirm-actions">
              <Button variant="secondary">Discard</Button>
              <Button leadingIcon={Check}>Save changes</Button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
