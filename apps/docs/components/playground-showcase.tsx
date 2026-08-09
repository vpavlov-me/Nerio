"use client";

import * as React from "react";
import {
  Bell,
  CalendarDays,
  Check,
  CircleAlert,
  Copy,
  EllipsisVertical,
  ExternalLink,
  Github,
  Info,
  Layers,
  Mail,
  MessageCircle,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Upload,
  UserPlus,
  WalletCards,
  X,
} from "@nerio-ui/adapters/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Code,
  DatePicker,
  Dialog,
  DialogFooter,
  DropdownMenu,
  Field,
  FileInput,
  FormGroup,
  FormMessage,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  KeyValue,
  Pagination,
  Progress,
  RadioGroup,
  RadioGroupItem,
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
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
  Text,
  Textarea,
  Tooltip,
  useToastManager,
} from "@nerio-ui/ui/client";
import { avatarPreviewAssets } from "../lib/avatar-preview-assets";

type ScenarioCardProps = {
  action?: React.ReactNode;
  children: React.ReactNode;
  description: string;
  footer?: React.ReactNode;
  title: string;
  wide?: boolean;
};

function ScenarioCard({
  action,
  children,
  description,
  footer,
  title,
  wide = false,
}: ScenarioCardProps) {
  return (
    <Card className="playground-scene" data-playground-card="" data-span={wide ? "2" : "1"}>
      <CardHeader>
        <div>
          <CardTitle as="h2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}

function WorkspaceSetup() {
  return (
    <ScenarioCard
      title="Create workspace"
      description="Set the team identity and invite the first collaborators."
      footer={<Button leadingIcon={UserPlus}>Create workspace</Button>}
    >
      <Item variant="outline">
        <ItemMedia variant="image">
          <Avatar {...avatarPreviewAssets[0]} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Nerio</ItemTitle>
          <ItemDescription>4 collaborators ready to join</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge tone="primary-soft">Draft</Badge>
        </ItemActions>
      </Item>
      <Field label="Workspace name">
        <Input defaultValue="Nerio" />
      </Field>
      <Select
        defaultValue="design"
        label="Team focus"
        options={[
          { label: "Product design", value: "design" },
          { label: "Engineering", value: "engineering" },
          { label: "Operations", value: "operations" },
        ]}
      />
      <Checkbox label="Send invitations now" defaultChecked />
    </ScenarioCard>
  );
}

function SignIn() {
  return (
    <ScenarioCard
      title="Sign in"
      description="Use your workspace credentials to continue."
      footer={<Button>Continue</Button>}
    >
      <Field label="Email">
        <InputGroup>
          <InputGroupAddon placement="start">
            <Icon icon={Mail} />
          </InputGroupAddon>
          <Input defaultValue="maya@nerio.dev" type="email" />
        </InputGroup>
      </Field>
      <Field label="Password" message="Password strength looks good.">
        <Input defaultValue="••••••••••••" type="password" />
      </Field>
      <FormGroup layout="inline">
        <Checkbox label="Remember me" defaultChecked />
      </FormGroup>
    </ScenarioCard>
  );
}

function SocialLinks() {
  return (
    <ScenarioCard
      title="Social links"
      description="Add public profiles to your workspace page."
      action={
        <Tooltip label="Add another social link">
          <Button icon={Plus} aria-label="Add social link" size="sm" variant="ghost" />
        </Tooltip>
      }
      footer={<Button>Save links</Button>}
    >
      <Field label="GitHub">
        <InputGroup>
          <InputGroupAddon placement="start">
            <Icon icon={Github} />
          </InputGroupAddon>
          <Input defaultValue="github.com/vpavlov-me/Nerio" />
        </InputGroup>
      </Field>
      <Field label="Website">
        <InputGroup>
          <InputGroupAddon placement="start">
            <Icon icon={ExternalLink} />
          </InputGroupAddon>
          <Input defaultValue="nerio.vpavlov.com" />
        </InputGroup>
      </Field>
    </ScenarioCard>
  );
}

function AccountAccess() {
  return (
    <ScenarioCard
      title="Account access"
      description="Review active members and outstanding invitations."
      action={
        <DropdownMenu
          trigger={
            <Button icon={EllipsisVertical} aria-label="Account access actions" variant="ghost" />
          }
          items={[
            { label: "Invite member", leadingIcon: UserPlus },
            { label: "Review roles", leadingIcon: Settings },
            { label: "Remove access", leadingIcon: CircleAlert, destructive: true },
          ]}
        />
      }
    >
      <ItemGroup>
        {avatarPreviewAssets.slice(0, 3).map((avatar, index) => (
          <React.Fragment key={avatar.name}>
            <Item size="sm">
              <ItemMedia variant="image">
                <Avatar {...avatar} size="sm" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{avatar.name}</ItemTitle>
                <ItemDescription>{index === 0 ? "Owner" : "Member"}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge tone={index === 2 ? "warning" : "success"}>
                  {index === 2 ? "Invited" : "Active"}
                </Badge>
              </ItemActions>
            </Item>
            {index < 2 ? <ItemSeparator /> : null}
          </React.Fragment>
        ))}
      </ItemGroup>
    </ScenarioCard>
  );
}

function NotificationSettings() {
  return (
    <ScenarioCard
      title="Notifications"
      description="Choose how and when the product should contact you."
      footer={<Button>Save preferences</Button>}
    >
      <FormGroup title="Delivery channels">
        <Checkbox label="Email summaries" defaultChecked />
        <Checkbox label="Desktop alerts" defaultChecked />
        <Checkbox label="Product announcements" />
      </FormGroup>
      <Separator />
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Quiet hours</ItemTitle>
          <ItemDescription>Pause non-critical alerts after 18:00.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Switch aria-label="Quiet hours" defaultChecked />
        </ItemActions>
      </Item>
      <Select
        defaultValue="weekly"
        label="Digest frequency"
        options={[
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
        ]}
      />
    </ScenarioCard>
  );
}

function AppointmentBooking() {
  return (
    <ScenarioCard
      title="Book appointment"
      description="Choose a date and available meeting time."
      footer={<Button leadingIcon={CalendarDays}>Schedule appointment</Button>}
    >
      <Field label="Date">
        <DatePicker defaultValue="2026-08-18" today="2026-08-09" aria-label="Appointment date" />
      </Field>
      <Select
        defaultValue="10:30"
        label="Time"
        options={[
          { label: "10:30", value: "10:30" },
          { label: "14:00", value: "14:00" },
          { label: "16:30", value: "16:30" },
        ]}
      />
      <Switch label="Send appointment reminder" defaultChecked />
    </ScenarioCard>
  );
}

function NewMilestone() {
  return (
    <ScenarioCard
      title="Set new milestone"
      description="Create a measurable target for the current project."
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button>Set milestone</Button>
        </>
      }
    >
      <Field label="Milestone name">
        <Input placeholder="Public beta" />
      </Field>
      <Field label="Target date">
        <DatePicker today="2026-08-09" aria-label="Milestone target date" />
      </Field>
      <Select
        defaultValue="high"
        label="Priority"
        options={[
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
        ]}
      />
      <Field label="Success criteria">
        <Textarea placeholder="Describe what completion looks like…" />
      </Field>
    </ScenarioCard>
  );
}

function ProjectsPreview() {
  return (
    <ScenarioCard title="Projects" description="Organize product work into shared spaces.">
      <ItemGroup>
        {[
          { icon: Layers, title: "Design system release", detail: "18 tasks · Updated today" },
          { icon: Rocket, title: "Documentation refresh", detail: "7 tasks · Updated yesterday" },
          { icon: Settings, title: "Mobile foundations", detail: "12 tasks · Updated Aug 7" },
        ].map((project) => (
          <Item key={project.title} size="sm" variant="outline">
            <ItemMedia variant="icon">
              <Icon icon={project.icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{project.title}</ItemTitle>
              <ItemDescription>{project.detail}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button aria-label={`Open ${project.title}`} size="sm" variant="ghost">
                Open
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </ScenarioCard>
  );
}

function NotificationFeed() {
  return (
    <ScenarioCard
      title="Notification center"
      description="Product updates and mentions appear here."
    >
      <ItemGroup>
        {[
          {
            icon: MessageCircle,
            title: "Maya mentioned you",
            detail: "Release checklist · 2 min ago",
          },
          {
            icon: Rocket,
            title: "Preview deployment ready",
            detail: "Nerio docs · 18 min ago",
          },
          {
            icon: Bell,
            title: "Milestone due tomorrow",
            detail: "Mobile foundations · 1 hr ago",
          },
        ].map((notification, index) => (
          <React.Fragment key={notification.title}>
            <Item size="sm">
              <ItemMedia variant="icon">
                <Icon icon={notification.icon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{notification.title}</ItemTitle>
                <ItemDescription>{notification.detail}</ItemDescription>
              </ItemContent>
              {index === 0 ? (
                <ItemActions>
                  <Badge tone="primary-soft">New</Badge>
                </ItemActions>
              ) : null}
            </Item>
            {index < 2 ? <ItemSeparator /> : null}
          </React.Fragment>
        ))}
      </ItemGroup>
    </ScenarioCard>
  );
}

function BillingSummary() {
  return (
    <ScenarioCard
      title="Billing summary"
      description="Current plan, usage, and next invoice."
      action={<Badge tone="success">Paid</Badge>}
      footer={<Button variant="secondary">Manage billing</Button>}
    >
      <Heading as="h3" size="2xl">
        $576.00
      </Heading>
      <Text tone="secondary">Studio plan · annual billing</Text>
      <Separator />
      <KeyValue className="playground-key-value-row" label="Members" value="12" />
      <KeyValue
        className="playground-key-value-row"
        label="Next invoice"
        value="September 1, 2026"
      />
      <KeyValue
        className="playground-key-value-row"
        label="Payment method"
        value="Visa •••• 4242"
      />
    </ScenarioCard>
  );
}

function PayoutThreshold() {
  return (
    <ScenarioCard
      title="Payout threshold"
      description="Set the balance required before a transfer begins."
      footer={<Button>Save threshold</Button>}
    >
      <Select
        defaultValue="usd"
        label="Preferred currency"
        options={[
          { label: "USD — United States Dollar", value: "usd" },
          { label: "EUR — Euro", value: "eur" },
          { label: "GBP — British Pound", value: "gbp" },
        ]}
      />
      <Slider
        defaultValue={42}
        label="Minimum payout amount"
        valueLabel="$2,500"
        description="$50 minimum · $10,000 maximum"
      />
      <Field label="Notes">
        <Textarea placeholder="Add a note for your finance team…" />
      </Field>
    </ScenarioCard>
  );
}

function SavingsProgress() {
  return (
    <ScenarioCard
      title="Savings target"
      description="Track progress toward the annual reserve."
      action={<Badge tone="warning">Needs attention</Badge>}
    >
      <Heading as="h3" size="2xl">
        $420,000
      </Heading>
      <Text tone="secondary">$273,000 remaining</Text>
      <Progress label="Retirement target" value={65} valueLabel="65%" />
      <Alert icon={Info} tone="neutral" title="Below monthly pace">
        Increase the recurring transfer to stay on target.
      </Alert>
    </ScenarioCard>
  );
}

const transactionItems = [
  { title: "Blue Bottle Coffee", description: "Food & drink · Today", status: "−$8.40" },
  { title: "Whole Foods Market", description: "Groceries · Yesterday", status: "−$64.18" },
  { title: "Stripe payout", description: "Income · Aug 7", status: "+$2,410" },
] as const;

function RecentTransactions() {
  return (
    <ScenarioCard
      title="Recent transactions"
      description="Latest activity across connected accounts."
      action={<Button icon={EllipsisVertical} aria-label="Transaction actions" variant="ghost" />}
    >
      <ItemGroup>
        {transactionItems.map((item, index) => (
          <React.Fragment key={item.title}>
            <Item size="sm">
              <ItemMedia variant="icon">
                <Icon icon={index === 2 ? Check : WalletCards} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Text tone="secondary">{item.status}</Text>
              </ItemActions>
            </Item>
            {index < transactionItems.length - 1 ? <ItemSeparator /> : null}
          </React.Fragment>
        ))}
      </ItemGroup>
    </ScenarioCard>
  );
}

function TeamDirectory() {
  return (
    <ScenarioCard
      title="Team directory"
      description="Workspace members, roles, and access status."
      action={
        <Button leadingIcon={UserPlus} size="sm" variant="secondary">
          Invite
        </Button>
      }
      wide
    >
      <TableContainer aria-label="Team directory table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["Maya Chen", "maya@nerio.dev", "Owner", "Active"],
              ["Malik Johnson", "malik@nerio.dev", "Engineer", "Active"],
              ["Sofia Alvarez", "sofia@nerio.dev", "Research", "Invited"],
              ["Arjun Patel", "arjun@nerio.dev", "Operations", "Active"],
            ].map(([name, email, role, status], index) => (
              <TableRow key={email}>
                <TableCell>
                  <Item size="sm">
                    <ItemMedia variant="image">
                      <Avatar
                        name={avatarPreviewAssets[index]?.name ?? name ?? "Team member"}
                        src={avatarPreviewAssets[index]?.src}
                        size="sm"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{name}</ItemTitle>
                    </ItemContent>
                  </Item>
                </TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{role}</TableCell>
                <TableCell>
                  <Badge tone={status === "Active" ? "success" : "warning"}>{status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ScenarioCard>
  );
}

function InvoiceTable() {
  return (
    <ScenarioCard
      title="Invoices"
      description="Billing documents for the current workspace."
      action={
        <Button leadingIcon={ExternalLink} size="sm" variant="secondary">
          Export
        </Button>
      }
      wide
    >
      <TableContainer aria-label="Invoice history table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead data-align="numeric">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["INV-2048", "Aug 1, 2026", "Studio", "Paid", "$576.00"],
              ["INV-2014", "Jul 1, 2026", "Studio", "Paid", "$576.00"],
              ["INV-1980", "Jun 1, 2026", "Studio", "Paid", "$528.00"],
            ].map(([invoice, date, plan, status, amount]) => (
              <TableRow key={invoice}>
                <TableCell>
                  <Code>{invoice}</Code>
                </TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{plan}</TableCell>
                <TableCell>
                  <Badge tone="success">{status}</Badge>
                </TableCell>
                <TableCell data-align="numeric">{amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ScenarioCard>
  );
}

function ApiKeysTable() {
  return (
    <ScenarioCard
      title="API keys"
      description="Credentials used by development environments."
      action={
        <Button leadingIcon={Plus} size="sm">
          Create key
        </Button>
      }
      wide
    >
      <TableContainer aria-label="API keys table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["Production", "nr_live_••••9F2A", "Jul 12", "2 minutes ago"],
              ["Preview", "nr_test_••••31BC", "Jun 28", "Yesterday"],
              ["Local development", "nr_test_••••A114", "May 03", "Aug 5"],
            ].map(([name, key, created, used]) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>
                  <Code>{key}</Code>
                </TableCell>
                <TableCell>{created}</TableCell>
                <TableCell>{used}</TableCell>
                <TableCell>
                  <Tooltip label={"Copy " + name + " key"}>
                    <Button
                      icon={Copy}
                      aria-label={"Copy " + name + " key"}
                      size="sm"
                      variant="ghost"
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ScenarioCard>
  );
}

function UploadAssets() {
  return (
    <ScenarioCard
      title="Upload assets"
      description="Add source files for the next release."
      footer={<Button leadingIcon={Upload}>Upload files</Button>}
    >
      <FileInput aria-label="Upload release assets" multiple />
      <Progress label="brand-assets.zip" value={72} valueLabel="72%" />
      <ItemGroup>
        <Item size="sm">
          <ItemMedia variant="icon">
            <Icon icon={Check} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>logo-pack.zip</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Badge tone="success">Ready</Badge>
          </ItemActions>
        </Item>
        <Item size="sm">
          <ItemMedia variant="icon">
            <Spinner decorative size="sm" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>product-screens.zip</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Badge loading>Processing</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    </ScenarioCard>
  );
}

function ReleaseChecklist() {
  return (
    <ScenarioCard
      title="Release readiness"
      description="Automated checks and manual review gates."
      footer={
        <>
          <Button variant="secondary">Review</Button>
          <Button>Approve</Button>
        </>
      }
    >
      <Tabs defaultValue="checks" variant="segmented">
        <TabsList aria-label="Release view" layout="fill">
          <TabsTrigger value="checks">Checks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsPanels>
          <TabsContent value="checks">
            <ItemGroup>
              <Item size="sm">
                <ItemMedia variant="icon">
                  <Icon icon={Check} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Automated tests</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Badge tone="success">13/13</Badge>
                </ItemActions>
              </Item>
              <Item size="sm">
                <ItemMedia variant="icon">
                  <Icon icon={Info} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Manual review</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Badge tone="warning">2/4</Badge>
                </ItemActions>
              </Item>
            </ItemGroup>
          </TabsContent>
          <TabsContent value="activity">
            <Text tone="secondary">Last deployment completed 12 minutes ago.</Text>
          </TabsContent>
        </TabsPanels>
      </Tabs>
      <Progress label="Release readiness" value={78} valueLabel="78%" />
    </ScenarioCard>
  );
}

function MoveTask() {
  return (
    <ScenarioCard
      title="Move task"
      description="Choose a new project and section for selected work."
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button>Move task</Button>
        </>
      }
    >
      <Item size="sm" variant="outline">
        <ItemMedia variant="icon">
          <Icon icon={Check} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Publish migration guide</ItemTitle>
          <ItemDescription>Docs refresh · In review</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge tone="primary-soft">Selected</Badge>
        </ItemActions>
      </Item>
      <Select
        defaultValue="design-system"
        label="Destination project"
        options={[
          { label: "Design system release", value: "design-system" },
          { label: "Documentation refresh", value: "docs" },
          { label: "Mobile foundations", value: "mobile" },
        ]}
      />
      <Select
        defaultValue="in-progress"
        label="Section"
        options={[
          { label: "Backlog", value: "backlog" },
          { label: "In progress", value: "in-progress" },
          { label: "Review", value: "review" },
        ]}
      />
      <Switch label="Keep current assignee" defaultChecked />
    </ScenarioCard>
  );
}

function PreviewDeployment() {
  return (
    <ScenarioCard
      title="Preview deployment"
      description="Review the latest documentation build for Nerio."
      footer={
        <>
          <Button leadingIcon={RefreshCw} variant="secondary">
            Redeploy
          </Button>
          <Button trailingIcon={ExternalLink}>Open preview</Button>
        </>
      }
    >
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Icon icon={Rocket} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>nerio-docs / preview</ItemTitle>
          <ItemDescription>main · 8f2a1c7 · 2 minutes ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge tone="success">Ready</Badge>
        </ItemActions>
      </Item>
      <ItemGroup>
        <Item size="sm">
          <ItemContent>
            <ItemTitle>Build</ItemTitle>
            <ItemDescription>Completed in 1m 42s</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge tone="success">Passed</Badge>
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item size="sm">
          <ItemContent>
            <ItemTitle>Preview domain</ItemTitle>
            <ItemDescription>nerio-preview.nerio.dev</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge>Secure</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    </ScenarioCard>
  );
}

function SecuritySettings() {
  return (
    <ScenarioCard
      title="Security settings"
      description="Protect the workspace with account-level controls."
      footer={<Button variant="secondary">Review security</Button>}
    >
      <Switch
        label="Two-factor authentication"
        description="Required for administrators."
        defaultChecked
      />
      <Switch
        label="New device alerts"
        description="Email account owners after sign-in."
        defaultChecked
      />
      <Switch
        label="Allow password sign-in"
        description="Keep as a backup authentication method."
      />
      <Alert icon={Info} tone="info" title="Security score: 84%">
        Enable passkeys to improve account protection.
      </Alert>
    </ScenarioCard>
  );
}

function PasswordReset() {
  return (
    <ScenarioCard
      title="Set a new password"
      description="Choose a unique password for this workspace."
      footer={<Button>Update password</Button>}
    >
      <Field label="New password">
        <Input placeholder="Enter a new password" type="password" />
      </Field>
      <Field label="Confirm password">
        <Input placeholder="Repeat the password" type="password" />
      </Field>
      <FormMessage tone="success">Meets all password requirements.</FormMessage>
    </ScenarioCard>
  );
}

function InviteDialogCard() {
  return (
    <ScenarioCard
      title="Invite teammates"
      description="Open a focused dialog without leaving the canvas."
    >
      <Dialog
        trigger={<Button leadingIcon={UserPlus}>Open invite dialog</Button>}
        title="Invite teammates"
        description="Share this workspace with your product team."
      >
        <Field label="Email address">
          <Input placeholder="teammate@nerio.dev" type="email" />
        </Field>
        <Select
          defaultValue="member"
          label="Role"
          options={[
            { label: "Member", value: "member" },
            { label: "Administrator", value: "admin" },
          ]}
        />
        <DialogFooter>
          <Button variant="secondary">Cancel</Button>
          <Button>Send invite</Button>
        </DialogFooter>
      </Dialog>
      <Text tone="secondary">The dialog uses the current theme and density.</Text>
    </ScenarioCard>
  );
}

function SettingsSheetCard() {
  return (
    <ScenarioCard title="Workspace settings" description="Edit secondary settings in a side sheet.">
      <Sheet>
        <SheetTrigger render={<Button leadingIcon={Settings}>Open settings sheet</Button>} />
        <SheetContent side="right" size="sm">
          <SheetHeader>
            <SheetTitle>Workspace settings</SheetTitle>
            <SheetDescription>Adjust collaboration defaults.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <Switch label="Weekly digest" defaultChecked />
            <Switch label="External guests" />
          </SheetBody>
          <SheetFooter>
            <SheetClose render={<Button variant="secondary">Cancel</Button>} />
            <Button>Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Text tone="secondary">Useful for tasks that do not need a full page.</Text>
    </ScenarioCard>
  );
}

function QuickFilterCard() {
  const toast = useToastManager();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("active");
  const [owner, setOwner] = React.useState("me");
  const [alertsOnly, setAlertsOnly] = React.useState(true);

  const reset = () => {
    setQuery("");
    setStatus("active");
    setOwner("me");
    setAlertsOnly(true);
  };

  return (
    <ScenarioCard
      title="Project filters"
      description="Narrow the portfolio by ownership, status, and activity."
      footer={
        <>
          <Button variant="secondary" onClick={reset}>
            Reset
          </Button>
          <Button
            onClick={() =>
              toast.add({
                id: "project-filters-" + Date.now(),
                title: "Filters saved",
                description: "Your project view will reuse these filters.",
                data: { tone: "success" },
              })
            }
          >
            Save filters
          </Button>
        </>
      }
    >
      <Field label="Keyword">
        <Input
          placeholder="Search project names…"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </Field>
      <Select
        label="Status"
        value={status}
        options={[
          { label: "Active", value: "active" },
          { label: "At risk", value: "risk" },
          { label: "Completed", value: "completed" },
        ]}
        onValueChange={setStatus}
      />
      <Select
        label="Owner"
        value={owner}
        options={[
          { label: "Owned by me", value: "me" },
          { label: "My team", value: "team" },
          { label: "Anyone", value: "anyone" },
        ]}
        onValueChange={setOwner}
      />
      <Switch
        checked={alertsOnly}
        label="Only projects with alerts"
        onCheckedChange={setAlertsOnly}
      />
    </ScenarioCard>
  );
}

function ActionsMenuCard() {
  return (
    <ScenarioCard
      title="Nerio launch"
      description="Coordinate the final release checklist."
      action={
        <DropdownMenu
          trigger={
            <Button icon={EllipsisVertical} aria-label="Nerio launch actions" variant="ghost" />
          }
          items={[
            { label: "Open project", leadingIcon: ExternalLink },
            { label: "Duplicate", leadingIcon: Copy },
            { label: "Archive", leadingIcon: X, destructive: true },
          ]}
        />
      }
    >
      <Heading as="h3" size="2xl">
        12 / 16
      </Heading>
      <Text tone="secondary">Launch tasks completed</Text>
      <Progress label="Release checklist" value={75} valueLabel="75%" />
      <Separator />
      <KeyValue label="Owner" value="Maya Chen" />
      <KeyValue label="Target date" value="August 18, 2026" />
      <Badge tone="warning">2 blockers</Badge>
    </ScenarioCard>
  );
}

function ToastFeedback() {
  const toast = useToastManager();

  return (
    <ScenarioCard
      title="Save feedback"
      description="Confirm background actions with a transient toast."
    >
      <Button
        onClick={() =>
          toast.add({
            id: "playground-" + Date.now(),
            title: "Changes saved",
            description: "All 35 scenarios use the current theme.",
            data: { tone: "success" },
          })
        }
      >
        Show success toast
      </Button>
      <Text tone="secondary">The toast appears outside the canvas card stack.</Text>
    </ScenarioCard>
  );
}

function LoadingStates() {
  return (
    <ScenarioCard
      title="Loading state"
      description="Keep structure stable while content is prepared."
      action={<Badge loading>Syncing</Badge>}
    >
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ScenarioCard>
  );
}

function ErrorRecovery() {
  return (
    <ScenarioCard
      title="Connection error"
      description="Explain what failed and provide a clear recovery action."
      footer={<Button leadingIcon={RefreshCw}>Try again</Button>}
    >
      <Alert icon={CircleAlert} tone="danger" title="Could not sync workspace">
        Check your connection and retry. Local edits are safe.
      </Alert>
      <Field label="Incident note" invalid message="Add a short note before contacting support.">
        <Textarea placeholder="What were you doing when sync failed?" />
      </Field>
    </ScenarioCard>
  );
}

function PlanSelection() {
  return (
    <ScenarioCard
      title="Choose a plan"
      description="Select the workspace plan that matches your team."
      footer={<Button>Continue with Studio</Button>}
    >
      <RadioGroup label="Workspace plan" defaultValue="studio" name="workspace-plan">
        <RadioGroupItem value="starter" description="Free">
          Starter
        </RadioGroupItem>
        <RadioGroupItem value="studio" description="$48 per member">
          Studio
        </RadioGroupItem>
        <RadioGroupItem value="enterprise" description="Contact sales">
          Enterprise
        </RadioGroupItem>
      </RadioGroup>
      <Badge tone="primary-soft">Studio includes unlimited projects</Badge>
    </ScenarioCard>
  );
}

function FeedbackForm() {
  return (
    <ScenarioCard
      title="Share feedback"
      description="Tell the product team how this experience worked."
      footer={<Button>Send feedback</Button>}
    >
      <RadioGroup label="Overall experience" defaultValue="good" name="feedback-rating">
        <RadioGroupItem value="great">Great</RadioGroupItem>
        <RadioGroupItem value="good">Good</RadioGroupItem>
        <RadioGroupItem value="needs-work">Needs work</RadioGroupItem>
      </RadioGroup>
      <Field label="Comments">
        <Textarea placeholder="What should we improve?" />
      </Field>
      <Checkbox label="May we contact you about this feedback?" />
    </ScenarioCard>
  );
}

function DeleteAccount() {
  return (
    <ScenarioCard
      title="Delete account"
      description="Permanently remove your profile and personal data."
      footer={<Button variant="danger">Delete account</Button>}
    >
      <Alert icon={CircleAlert} tone="danger" title="This action cannot be undone">
        Workspace-owned projects remain available to other members.
      </Alert>
      <Field label="Type DELETE to confirm">
        <Input placeholder="DELETE" />
      </Field>
      <Checkbox label="I understand that my personal data will be removed" />
    </ScenarioCard>
  );
}

function ActivityFeed() {
  return (
    <ScenarioCard
      title="Activity feed"
      description="Recent updates from the product team."
      action={<Badge tone="primary-soft">5 new</Badge>}
    >
      <ItemGroup>
        {[
          ["Maya published a prototype", "12 minutes ago"],
          ["Malik resolved 8 issues", "1 hour ago"],
          ["Sofia shared research notes", "Yesterday"],
        ].map(([title, description], index) => (
          <React.Fragment key={title}>
            <Item size="sm">
              <ItemMedia variant="image">
                <Avatar
                  name={avatarPreviewAssets[index]?.name ?? title ?? "Team member"}
                  src={avatarPreviewAssets[index]?.src}
                  size="sm"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{description}</ItemDescription>
              </ItemContent>
            </Item>
            {index < 2 ? <ItemSeparator /> : null}
          </React.Fragment>
        ))}
      </ItemGroup>
    </ScenarioCard>
  );
}

function SearchResults() {
  return (
    <ScenarioCard
      title="Search results"
      description="Find projects, people, and workspace settings."
      footer={
        <Pagination
          previousHref="#search"
          nextHref="#search"
          pages={[
            { key: "1", label: "1", href: "#search", current: true },
            { key: "2", label: "2", href: "#search" },
            { key: "3", label: "3", href: "#search" },
          ]}
        />
      }
    >
      <InputGroup>
        <InputGroupAddon placement="start">
          <Icon icon={Search} />
        </InputGroupAddon>
        <Input aria-label="Search workspace" defaultValue="nerio" />
      </InputGroup>
      <ItemGroup>
        <Item size="sm">
          <ItemContent>
            <ItemTitle>Nerio redesign</ItemTitle>
            <ItemDescription>Project · updated 12 minutes ago</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge tone="primary-soft">Project</Badge>
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item size="sm">
          <ItemContent>
            <ItemTitle>Nerio launch checklist</ItemTitle>
            <ItemDescription>Document · updated yesterday</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge>Document</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    </ScenarioCard>
  );
}

function FeatureFlags() {
  return (
    <ScenarioCard
      title="Feature flags"
      description="Control staged product capabilities."
      action={<Badge tone="success">Environment: Preview</Badge>}
    >
      <ItemGroup>
        <Item size="sm">
          <ItemContent>
            <ItemTitle>New navigation</ItemTitle>
            <ItemDescription>Enabled for the design team</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch aria-label="New navigation" defaultChecked />
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item size="sm">
          <ItemContent>
            <ItemTitle>AI summaries</ItemTitle>
            <ItemDescription>Internal testing only</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch aria-label="AI summaries" />
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item size="sm">
          <ItemContent>
            <ItemTitle>Compact tables</ItemTitle>
            <ItemDescription>Available to all members</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch aria-label="Compact tables" defaultChecked />
          </ItemActions>
        </Item>
      </ItemGroup>
    </ScenarioCard>
  );
}

export function PlaygroundShowcase() {
  const masonryRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const masonry = masonryRef.current;
    if (!masonry) return;

    let frame = 0;

    const layout = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const cards = Array.from(masonry.querySelectorAll<HTMLElement>("[data-playground-card]"));
        const gap = Number.parseFloat(window.getComputedStyle(masonry).columnGap);
        const cardHeights = cards.map((card) => Math.ceil(card.getBoundingClientRect().height));

        if (
          !Number.isFinite(gap) ||
          cardHeights.some((height) => !Number.isFinite(height) || height <= 0)
        ) {
          frame = window.requestAnimationFrame(layout);
          return;
        }

        const columnHeights = Array.from({ length: 7 }, () => 0);

        cards.forEach((card, cardIndex) => {
          const span = card.dataset.span === "2" ? 2 : 1;
          let column = 0;
          let top = Number.POSITIVE_INFINITY;
          let imbalance = Number.POSITIVE_INFINITY;

          for (let index = 0; index <= columnHeights.length - span; index += 1) {
            const candidateHeights = columnHeights.slice(index, index + span);
            const candidateTop = Math.max(...candidateHeights);
            const candidateImbalance = candidateTop - Math.min(...candidateHeights);
            const isBetterWidePlacement =
              span === 2 &&
              (candidateImbalance < imbalance ||
                (candidateImbalance === imbalance && candidateTop < top));
            const isBetterSinglePlacement = span === 1 && candidateTop < top;

            if (isBetterWidePlacement || isBetterSinglePlacement) {
              column = index;
              top = candidateTop;
              imbalance = candidateImbalance;
            }
          }

          const height = cardHeights[cardIndex]!;
          card.style.gridColumn = `${column + 1} / span ${span}`;
          card.style.gridRow = `${Math.round(top) + 1} / span ${height}`;

          const nextTop = top + height + gap;
          for (let index = column; index < column + span; index += 1) {
            columnHeights[index] = nextTop;
          }
        });
      });
    };

    const resizeObserver = new ResizeObserver(layout);
    let observedCards = new Set<HTMLElement>();

    const syncCards = () => {
      const nextCards = new Set(masonry.querySelectorAll<HTMLElement>("[data-playground-card]"));

      observedCards.forEach((card) => {
        if (!nextCards.has(card)) resizeObserver.unobserve(card);
      });
      nextCards.forEach((card) => {
        if (!observedCards.has(card)) resizeObserver.observe(card);
      });

      observedCards = nextCards;
      layout();
    };

    const mutationObserver = new MutationObserver(syncCards);
    mutationObserver.observe(masonry, { childList: true });
    syncCards();

    return () => {
      window.cancelAnimationFrame(frame);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={masonryRef} className="playground-masonry" aria-label="Nerio product scenario canvas">
      <WorkspaceSetup />
      <SignIn />
      <SocialLinks />
      <AccountAccess />
      <NotificationSettings />
      <AppointmentBooking />
      <NewMilestone />
      <ProjectsPreview />
      <NotificationFeed />
      <BillingSummary />
      <PayoutThreshold />
      <SavingsProgress />
      <RecentTransactions />
      <TeamDirectory />
      <InvoiceTable />
      <ApiKeysTable />
      <UploadAssets />
      <ReleaseChecklist />
      <MoveTask />
      <PreviewDeployment />
      <SecuritySettings />
      <PasswordReset />
      <InviteDialogCard />
      <SettingsSheetCard />
      <QuickFilterCard />
      <ActionsMenuCard />
      <ToastFeedback />
      <LoadingStates />
      <ErrorRecovery />
      <PlanSelection />
      <FeedbackForm />
      <DeleteAccount />
      <ActivityFeed />
      <SearchResults />
      <FeatureFlags />
    </div>
  );
}
