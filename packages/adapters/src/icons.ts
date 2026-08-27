import type * as React from "react";
import { createLucideIcon } from "lucide-react";

/**
 * Public contract accepted by Nerio icon consumers.
 *
 * It intentionally describes an SVG component rather than a Lucide component so
 * consumers can pass their own forwarded-ref SVG components without adapting them.
 */
export type IconSvgProps = React.SVGProps<SVGSVGElement> & {
  size?: string | number;
  strokeWidth?: string | number;
};

export type IconComponent = React.ElementType<IconSvgProps>;

/** Lucide-only extension kept outside the generic SVG component contract. */
export type LucideIconProps = IconSvgProps & {
  absoluteStrokeWidth?: boolean;
};

/**
 * Compatibility export for Nerio's public beta API.
 *
 * Lucide removed brand marks in v1. This preserves the existing GitHub icon
 * through the same Lucide component contract until a dedicated migration can
 * classify the public export separately from the default icon source.
 */
export const Github = /* @__PURE__ */ createLucideIcon("Github", [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "github-body",
    },
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "github-tail" }],
]);

export {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  Bell,
  Bold,
  BookOpen,
  Box,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleQuestionMark,
  ChartNoAxesCombined,
  ChartPie,
  Code2,
  Circle,
  Copy,
  EllipsisVertical,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Info,
  Italic,
  Layers,
  LayoutDashboard,
  ListTree,
  Mail,
  MessageCircle,
  Minus,
  Moon,
  Monitor,
  Palette,
  PanelLeft,
  PackageOpen,
  Plus,
  RefreshCw,
  Rocket,
  Rows2,
  Rows3,
  Save,
  Search,
  Settings,
  Sparkles,
  Sun,
  TriangleAlert,
  Type,
  Underline,
  Upload,
  UserPlus,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";
