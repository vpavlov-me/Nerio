export type BlockStatus = "Preview" | "Experimental";

export type BlockDefinition = {
  slug: string;
  title: string;
  description: string;
  category:
    "Authentication" | "Settings and account" | "Team and operations" | "Content and feedback";
  status: BlockStatus;
  detailRoute: `/blocks/${string}`;
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
    description:
      "A focused workspace sign-in form with validation, loading feedback, and recovery navigation.",
    category: "Authentication",
    status: "Preview",
    detailRoute: "/blocks/sign-in",
    previewRoute: "/views/blocks/sign-in",
    componentsUsed: ["Alert", "Button", "Card", "Field", "Input"],
    intendedUse: "Adapt this block for a conventional email and password entry point.",
    boundaries: [
      "Authentication, session, SSO, and workspace-routing policy remain application concerns.",
      "The preview validates locally and does not send credentials.",
    ],
    relatedBlocks: ["create-account", "reset-password"],
    relatedTemplates: [],
    indexable: true,
  },
  {
    slug: "create-account",
    title: "Create account",
    description:
      "A compact registration form with realistic account copy, inline validation, and verification guidance.",
    category: "Authentication",
    status: "Preview",
    detailRoute: "/blocks/create-account",
    previewRoute: "/views/blocks/create-account",
    componentsUsed: ["Alert", "Button", "Card", "Field", "Input"],
    intendedUse: "Use this block for a small self-serve account creation flow.",
    boundaries: [
      "Invitations, entitlement checks, provisioning, and verification delivery stay product-local.",
      "The preview does not create an account or persist entered data.",
    ],
    relatedBlocks: ["sign-in", "reset-password"],
    relatedTemplates: [],
    indexable: true,
  },
  {
    slug: "reset-password",
    title: "Reset password",
    description:
      "A single-task recovery form that transitions from email entry to clear success feedback.",
    category: "Authentication",
    status: "Preview",
    detailRoute: "/blocks/reset-password",
    previewRoute: "/views/blocks/reset-password",
    componentsUsed: ["Alert", "Button", "Card", "Field", "Input"],
    intendedUse: "Use this block to begin a conventional password recovery flow.",
    boundaries: [
      "Secure tokens, rate limits, email delivery, and password policy remain application concerns.",
      "The preview only demonstrates the local form-state transition.",
    ],
    relatedBlocks: ["sign-in", "create-account"],
    relatedTemplates: [],
    indexable: true,
  },
  {
    slug: "profile-settings",
    title: "Profile settings",
    description: "A bounded profile section for a workspace name and short public description.",
    category: "Settings and account",
    status: "Preview",
    detailRoute: "/blocks/profile-settings",
    previewRoute: "/views/blocks/profile-settings",
    componentsUsed: ["Alert", "Button", "Field", "Input", "Textarea"],
    intendedUse: "Place this block inside an application-owned settings route.",
    boundaries: [
      "Navigation, persistence, permissions, and a complete settings layout are not included.",
      "Saving only updates deterministic local preview state.",
    ],
    relatedBlocks: ["notification-preferences", "security-settings"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
  {
    slug: "security-settings",
    title: "Security settings",
    description:
      "A focused security section with an immediate two-factor setting and destructive confirmation.",
    category: "Settings and account",
    status: "Preview",
    detailRoute: "/blocks/security-settings",
    previewRoute: "/views/blocks/security-settings",
    componentsUsed: ["Button", "Dialog", "Field", "Input", "Separator", "Switch"],
    intendedUse: "Adapt this block for account-level security controls and confirmations.",
    boundaries: [
      "Authorization, reauthentication, audit history, and deletion policy stay product-local.",
      "The destructive action is intentionally inert in the preview.",
    ],
    relatedBlocks: ["profile-settings", "notification-preferences"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
  {
    slug: "notification-preferences",
    title: "Notification preferences",
    description: "A concise preference group for channel selection and digest frequency.",
    category: "Settings and account",
    status: "Preview",
    detailRoute: "/blocks/notification-preferences",
    previewRoute: "/views/blocks/notification-preferences",
    componentsUsed: ["Alert", "Button", "Checkbox", "FormGroup", "Select"],
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
      "A basic operational table with search, status filtering, explicit row selection, bulk actions, and pagination.",
    category: "Team and operations",
    status: "Preview",
    detailRoute: "/blocks/table-toolbar",
    previewRoute: "/views/blocks/table-toolbar",
    componentsUsed: [
      "Badge",
      "Button",
      "Checkbox",
      "DropdownMenu",
      "EmptyState",
      "Input",
      "Pagination",
      "Table",
    ],
    intendedUse: "Use this block around a small, non-virtualized table workflow.",
    boundaries: [
      "Saved views, advanced filters, column settings, and virtualization belong to Pro or the app.",
      "Filtering, selection, and pagination are deterministic local preview state.",
    ],
    relatedBlocks: ["empty-project"],
    relatedTemplates: ["operations-workspace"],
    indexable: true,
  },
  {
    slug: "account-summary",
    title: "Account summary",
    description: "A bounded identity and account-details composition with one focused edit action.",
    category: "Settings and account",
    status: "Preview",
    detailRoute: "/blocks/account-summary",
    previewRoute: "/views/blocks/account-summary",
    componentsUsed: [
      "Avatar",
      "Badge",
      "Button",
      "Card",
      "Dialog",
      "Field",
      "KeyValue",
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
    slug: "empty-project",
    title: "Empty project",
    description:
      "A practical first-project empty state with one primary next step and restrained secondary guidance.",
    category: "Content and feedback",
    status: "Preview",
    detailRoute: "/blocks/empty-project",
    previewRoute: "/views/blocks/empty-project",
    componentsUsed: ["Button", "EmptyState"],
    intendedUse:
      "Use this block when a collection is genuinely empty and creation is the next task.",
    boundaries: [
      "Onboarding policy, permissions, illustrations, and project creation remain application concerns.",
      "Search, offline, and error states need their own product-specific recovery copy.",
    ],
    relatedBlocks: ["table-toolbar", "file-upload-state"],
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
    detailRoute: "/blocks/file-upload-state",
    previewRoute: "/views/blocks/file-upload-state",
    componentsUsed: ["Alert", "Button", "Progress", "Spinner"],
    intendedUse: "Adapt this block around an application-owned upload operation.",
    boundaries: [
      "File selection, transport, retries, persistence, and server errors remain application concerns.",
      "Preview controls only switch between deterministic local states.",
    ],
    relatedBlocks: ["empty-project"],
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
  "empty-states": "empty-project",
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
