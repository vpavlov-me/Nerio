import type * as React from "react";

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

/** @deprecated Use IconComponent. Kept as a compatible Lucide-specific alias. */
export type { LucideIcon } from "lucide-react";
export {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  BookOpen,
  Box,
  Boxes,
  Check,
  ChevronDown,
  CircleAlert,
  CircleQuestionMark,
  Code2,
  Circle,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Info,
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
  Rocket,
  Rows3,
  Save,
  Search,
  Settings,
  Sparkles,
  Sun,
  TriangleAlert,
  Type,
  UserPlus,
  Wrench,
  X,
} from "lucide-react";
