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

export {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  Bell,
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
  Github,
  GripVertical,
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
  Upload,
  UserPlus,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";
