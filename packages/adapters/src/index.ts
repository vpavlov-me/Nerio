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
  absoluteStrokeWidth?: boolean;
};

export type IconComponent = React.ElementType<IconSvgProps>;

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
export type { ColumnDef } from "@tanstack/react-table";
export { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
export {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
export { useForm } from "react-hook-form";
export { z } from "zod";
