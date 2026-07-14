export type CompositionDoc = {
  title: string;
  description: string;
  indexable: boolean;
};

export const compositionDocs: Record<string, CompositionDoc> = {
  login: {
    title: "Login",
    description:
      "A compact authentication composition that tests form hierarchy without becoming a product screen.",
    indexable: false,
  },
  register: {
    title: "Register",
    description:
      "A registration composition that checks multi-field rhythm, inline help, and success feedback.",
    indexable: false,
  },
  "forgot-password": {
    title: "Forgot password",
    description:
      "A recovery composition for testing a focused, success-oriented single-field form.",
    indexable: false,
  },
  "settings-form": {
    title: "Settings form",
    description:
      "A large, sectioned form that exercises Core choices, help text, destructive confirmation, and a save bar.",
    indexable: false,
  },
  "table-toolbar": {
    title: "Table toolbar",
    description:
      "A basic table workflow with search, a small filter menu, selected-row actions, pagination, and an empty result.",
    indexable: false,
  },
  "user-profile": {
    title: "User profile",
    description:
      "A composed profile view that pairs identity, lightweight metrics, metadata, activity, and a focused dialog action.",
    indexable: false,
  },
  "empty-states": {
    title: "Empty states",
    description:
      "Six realistic absence states that test concise explanation, clear actions, and neutral visual hierarchy.",
    indexable: false,
  },
  feedback: {
    title: "Feedback",
    description:
      "A shared feedback surface for inline outcomes, progress, loading placeholders, a spinner, and a toast.",
    indexable: false,
  },
  "overlay-playground": {
    title: "Overlay playground",
    description:
      "A focused stress test for modal, contextual, and menu overlays—including a nested overlay and long content.",
    indexable: false,
  },
  "navigation-patterns": {
    title: "Navigation patterns",
    description:
      "A small documentation-oriented composition of breadcrumbs, top links, tabs, a local sidebar, and pagination.",
    indexable: false,
  },
  "dense-form": {
    title: "Dense form",
    description:
      "A 42-control stress test for compact spacing, labels, focus order, and responsive readability.",
    indexable: false,
  },
};

export const compositionDocSlugs = Object.keys(compositionDocs);

export function getCompositionDoc(slug: string) {
  return compositionDocs[slug];
}
