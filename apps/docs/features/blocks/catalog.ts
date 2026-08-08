export type BlockStatus = "Preview" | "Experimental";

export type BlockDefinition = {
  slug: string;
  title: string;
  description: string;
  category:
    "Authentication" | "Settings and account" | "Team and operations" | "Content and feedback";
  status: BlockStatus;
  previewRoute: `/views/blocks/${string}`;
  componentsUsed: readonly string[];
  intendedUse: string;
  boundaries: readonly string[];
  relatedBlocks: readonly string[];
  relatedTemplates: readonly string[];
  indexable: boolean;
};

export const blockCatalog = [
  {
    slug: "sign-in",
    title: "Sign in",
    description: "A focused workspace sign-in layout with email, password, and recovery context.",
    category: "Authentication",
    status: "Preview",
    previewRoute: "/views/blocks/sign-in",
    componentsUsed: ["Alert", "Button", "Card", "Field", "Input"],
    intendedUse: "Adapt this block for a conventional email and password entry point.",
    boundaries: [
      "Authentication, session, SSO, and workspace-routing policy remain application concerns.",
      "The preview is intentionally static and does not validate or send credentials.",
    ],
    relatedBlocks: ["create-account", "reset-password"],
    relatedTemplates: [],
    indexable: true,
  },
  {
    slug: "create-account",
    title: "Create account",
    description:
      "A complete registration layout with identity, credentials, confirmation, and policy context.",
    category: "Authentication",
    status: "Preview",
    previewRoute: "/views/blocks/create-account",
    componentsUsed: ["Alert", "Button", "Card", "Field", "Input"],
    intendedUse: "Use this block for a small self-serve account creation flow.",
    boundaries: [
      "Invitations, entitlement checks, provisioning, and verification delivery stay product-local.",
      "The preview is intentionally static and does not validate, create an account, or persist data.",
    ],
    relatedBlocks: ["sign-in", "reset-password"],
    relatedTemplates: [],
    indexable: true,
  },
  {
    slug: "reset-password",
    title: "Reset password",
    description: "A single-task recovery layout with email entry and sign-in context.",
    category: "Authentication",
    status: "Preview",
    previewRoute: "/views/blocks/reset-password",
    componentsUsed: ["Alert", "Button", "Card", "Field", "Input"],
    intendedUse: "Use this block to begin a conventional password recovery flow.",
    boundaries: [
      "Secure tokens, rate limits, email delivery, and password policy remain application concerns.",
      "The preview is intentionally static and does not send a recovery request.",
    ],
    relatedBlocks: ["sign-in", "create-account"],
    relatedTemplates: [],
    indexable: true,
  },
  {
    slug: "profile-settings",
    title: "Profile settings",
    description:
      "A bounded personal profile card with avatar upload, a short bio, and workspace visibility.",
    category: "Settings and account",
    status: "Preview",
    previewRoute: "/views/blocks/profile-settings",
    componentsUsed: [
      "Avatar",
      "Button",
      "Card",
      "Field",
      "FileInput",
      "Input",
      "Item",
      "Separator",
      "Switch",
      "Textarea",
    ],
    intendedUse: "Place this block inside an application-owned settings route.",
    boundaries: [
      "Navigation, persistence, permissions, and a complete settings layout are not included.",
      "Avatar upload, visibility, and saving actions are intentionally inert in the preview.",
    ],
    relatedBlocks: ["notification-preferences", "security-settings"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
  {
    slug: "security-settings",
    title: "Security settings",
    description:
      "A bounded security card for credentials, two-factor protection, active sessions, and guarded deletion.",
    category: "Settings and account",
    status: "Preview",
    previewRoute: "/views/blocks/security-settings",
    componentsUsed: ["Alert", "Button", "Card", "Dialog", "Field", "Input", "Item"],
    intendedUse: "Adapt this block for account-level security controls and confirmations.",
    boundaries: [
      "Authorization, reauthentication, audit history, and deletion policy stay product-local.",
      "The confirmed destructive action only shows a preview status and never deletes data.",
    ],
    relatedBlocks: ["profile-settings", "notification-preferences"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
  {
    slug: "notification-preferences",
    title: "Notification preferences",
    description:
      "A structured notification card for workspace activity, product updates, and email digests.",
    category: "Settings and account",
    status: "Preview",
    previewRoute: "/views/blocks/notification-preferences",
    componentsUsed: [
      "Alert",
      "Button",
      "Card",
      "FormGroup",
      "Item",
      "Select",
      "Separator",
      "Switch",
    ],
    intendedUse: "Use this block for a small, save-based notification preference section.",
    boundaries: [
      "Delivery infrastructure, consent policy, and channel availability remain application concerns.",
      "Saving only updates deterministic local preview state.",
    ],
    relatedBlocks: ["profile-settings", "security-settings"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
  {
    slug: "table-toolbar",
    title: "Table toolbar",
    description:
      "A bounded project table with status tabs, search, contextual bulk actions, row menus, selection state, and pagination.",
    category: "Team and operations",
    status: "Preview",
    previewRoute: "/views/blocks/table-toolbar",
    componentsUsed: [
      "Avatar",
      "Badge",
      "Button",
      "Card",
      "Checkbox",
      "DropdownMenu",
      "EmptyState",
      "Input",
      "Pagination",
      "Table",
      "Tabs",
    ],
    intendedUse: "Use this block around a small, non-virtualized table workflow.",
    boundaries: [
      "Saved views, advanced filters, column settings, and virtualization belong to Pro or the app.",
      "Filtering and selection use local preview state; pagination is a static table control.",
    ],
    relatedBlocks: ["file-upload-state"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
  {
    slug: "account-summary",
    title: "Account summary",
    description: "A bounded identity and account-details composition with one focused edit action.",
    category: "Settings and account",
    status: "Preview",
    previewRoute: "/views/blocks/account-summary",
    componentsUsed: [
      "Avatar",
      "Badge",
      "Button",
      "Card",
      "Dialog",
      "Field",
      "Heading",
      "Input",
      "Item",
      "KeyValue",
      "Separator",
      "Text",
      "Textarea",
    ],
    intendedUse: "Use this block for a compact account overview inside a profile or settings area.",
    boundaries: [
      "Activity feeds, permissions, social metrics, and a full profile page are intentionally excluded.",
      "The edit dialog does not persist changes.",
    ],
    relatedBlocks: ["profile-settings", "security-settings"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
  {
    slug: "file-upload-state",
    title: "File upload state",
    description:
      "A deterministic upload-status composition with progress, completion, failure, retry, and cancellation feedback.",
    category: "Content and feedback",
    status: "Experimental",
    previewRoute: "/views/blocks/file-upload-state",
    componentsUsed: ["Button", "Card", "Icon", "Item", "Spinner", "Tooltip"],
    intendedUse: "Adapt this block around an application-owned batch upload operation.",
    boundaries: [
      "File selection, transport, retries, persistence, and server errors remain application concerns.",
      "The preview represents deterministic local file states and does not perform uploads.",
    ],
    relatedBlocks: ["table-toolbar"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
] as const satisfies readonly BlockDefinition[];

export const blockSlugs = blockCatalog.map((block) => block.slug);

export function getBlock(slug: string) {
  return blockCatalog.find((block) => block.slug === slug);
}

export const legacyPublicBlockRedirects: Record<string, (typeof blockCatalog)[number]["slug"]> = {
  login: "sign-in",
  register: "create-account",
  "forgot-password": "reset-password",
  "settings-form": "profile-settings",
  "table-toolbar": "table-toolbar",
  "user-profile": "account-summary",
  feedback: "file-upload-state",
};

export function getLegacyPublicBlockRedirect(slug: string) {
  return Object.hasOwn(legacyPublicBlockRedirects, slug)
    ? legacyPublicBlockRedirects[slug]
    : undefined;
}

export const internalBlockFixtures = {
  "overlay-playground": {
    title: "Overlay playground",
    description:
      "Nested overlay, focus restoration, keyboard, and long-content regression fixture.",
  },
  "navigation-patterns": {
    title: "Navigation patterns",
    description: "Broad navigation-family semantics and responsive regression fixture.",
  },
  "dense-form": {
    title: "Dense form",
    description: "Forty-two-control focus-order, compact-density, and reflow stress fixture.",
  },
  feedback: {
    title: "Feedback family",
    description: "Alert, progress, loading, spinner, and managed Toast regression fixture.",
  },
} as const;

export type InternalBlockFixtureSlug = keyof typeof internalBlockFixtures;

export function isInternalBlockFixture(slug: string): slug is InternalBlockFixtureSlug {
  return Object.hasOwn(internalBlockFixtures, slug);
}
