"use client";

import Link from "next/link";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Circle } from "@nerio-ui/adapters/icons";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardVisual,
  Code,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Heading,
  Kbd,
  KeyValue,
  List,
  Pagination,
  Progress,
  Separator,
  Skeleton,
  Spinner,
  Stat,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  ToggleGroup,
} from "@nerio-ui/ui/client";
import { PreviewFrame, type PreviewProps } from "./shared";

export function DisplayPreview({ kind, snippet }: PreviewProps) {
  return (
    <PreviewFrame kind={kind} snippet={snippet}>
      {kind === "button" ? (
        <>
          <Button>Save project</Button>
          <Button variant="secondary">Preview</Button>
          <Button variant="ghost">Cancel</Button>
          <Button loading>Saving</Button>
        </>
      ) : null}
      {kind === "button-group" ? (
        <ButtonGroup aria-label="Document actions">
          <Button variant="secondary">Cancel</Button>
          <Button variant="secondary">Save</Button>
        </ButtonGroup>
      ) : null}
      {kind === "toggle-group" ? (
        <div className="form-preview-stack">
          <ToggleGroup
            aria-label="Text alignment"
            defaultValue={["left"]}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
          />
          <DirectionProvider direction="rtl">
            <div dir="rtl">
              <ToggleGroup
                aria-label="Text alignment RTL"
                defaultValue={["right"]}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
              />
            </div>
          </DirectionProvider>
        </div>
      ) : null}
      {kind === "typography" ? (
        <div className="preview-card">
          <Heading as="h2" size="lg">
            Workspace settings
          </Heading>
          <Text tone="secondary">Changes apply to every member.</Text>
          <Text>
            Install with <Code>pnpm exec nerio add typography</Code>.
          </Text>
        </div>
      ) : null}
      {kind === "kbd" ? (
        <>
          <Kbd>Esc</Kbd>
          <Kbd>⌘K</Kbd>
          <Kbd>⇧⌘P</Kbd>
          <Kbd>⌥←</Kbd>
          <Kbd>⌘↵</Kbd>
        </>
      ) : null}
      {kind === "badge" ? (
        <>
          <Badge>Draft</Badge>
          <Badge tone="primary-soft">Core</Badge>
          <Badge tone="info">Shared</Badge>
          <Badge tone="success">Published</Badge>
          <Badge tone="warning">Review</Badge>
          <Badge tone="danger">Blocked</Badge>
        </>
      ) : null}
      {kind === "spinner" ? (
        <>
          <Spinner label="Loading activity" />
          <Button loading>Saving</Button>
        </>
      ) : null}
      {kind === "skeleton" ? (
        <div className="form-preview-stack" aria-label="Loading project summary">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : null}
      {kind === "empty-state" ? (
        <EmptyState>
          <EmptyStateMedia aria-hidden="true">○</EmptyStateMedia>
          <EmptyStateHeader>
            <EmptyStateTitle>No collections</EmptyStateTitle>
            <EmptyStateDescription>
              Create a collection to organize projects, notes, and shared context.
            </EmptyStateDescription>
          </EmptyStateHeader>
          <EmptyStateActions>
            <Button size="sm">Create collection</Button>
          </EmptyStateActions>
        </EmptyState>
      ) : null}
      {kind === "alert" ? (
        <Alert tone="info" title="Invite sent" icon={Circle}>
          Collaborators will receive an email shortly.
        </Alert>
      ) : null}
      {kind === "card" ? (
        <Card as="div" className="preview-card">
          <CardVisual placement="bleed">
            <img
              className="preview-card-image"
              src="/card/abstract-architecture.jpg"
              alt="Curved architectural forms illuminated by soft light"
            />
          </CardVisual>
          <CardHeader>
            <CardTitle>Design system rollout</CardTitle>
            <CardDescription>
              Bring components, owners, and release milestones into one shared workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Track implementation progress and keep the team aligned through every release stage.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Open workspace</Button>
          </CardFooter>
        </Card>
      ) : null}
      {kind === "separator" ? (
        <div className="form-preview-stack">
          <span>Overview</span>
          <Separator />
          <span>Activity</span>
        </div>
      ) : null}
      {kind === "avatar" ? (
        <>
          <Avatar name="Maya Chen" src="/avatars/maya-chen.png" />
          <Avatar name="Nerio Team" />
        </>
      ) : null}
      {kind === "progress" ? (
        <div className="form-preview-stack">
          <Progress label="Collection completion" value={68} />
        </div>
      ) : null}
      {kind === "stat" ? (
        <>
          <Stat label="Active projects" value="12" trend="+3 this week" />
          <Stat label="Open tasks" value="34" trend="8 due today" />
        </>
      ) : null}
      {kind === "key-value" ? (
        <dl className="preview-key-values">
          <KeyValue label="Owner" value="Product team" />
          <KeyValue label="Updated" value="Today" />
          <KeyValue label="Status" value={<Badge tone="success">Ready</Badge>} />
        </dl>
      ) : null}
      {kind === "table" ? (
        <TableContainer aria-label="Projects">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Roadmap refresh</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Maya</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Content audit</TableCell>
                <TableCell>Draft</TableCell>
                <TableCell>Alex</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
      {kind === "list" ? (
        <div className="form-preview-stack">
          <Heading as="h2" id="setup-steps-title" size="sm">
            Setup steps
          </Heading>
          <List
            aria-labelledby="setup-steps-title"
            marker="decimal"
            items={[
              { id: "install", title: "Install tokens" },
              { id: "source", title: "Register Tailwind source" },
              { id: "components", title: "Add your first component" },
            ]}
          />
        </div>
      ) : null}
      {kind === "breadcrumbs" ? (
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Components", href: "/docs/components/button" },
            { label: "Button" },
          ]}
        />
      ) : null}
      {kind === "pagination" ? (
        <Pagination
          previousHref="/docs/components/breadcrumbs"
          nextHref="/docs/components/list"
          pages={[
            { key: "1", label: "1", href: "/docs/components/breadcrumbs" },
            {
              key: "2",
              label: "2",
              href: "/docs/components/pagination",
              current: true,
              render: <Link href="#" />,
            },
            { key: "3", label: "3", href: "/docs/components/list" },
          ]}
        />
      ) : null}
    </PreviewFrame>
  );
}
