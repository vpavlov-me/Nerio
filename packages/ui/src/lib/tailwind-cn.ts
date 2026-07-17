import { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cn } from "./cn";

/** Merges Tailwind utility conflicts while preserving clsx-compatible inputs. */
export function tailwindCn(...inputs: ClassValue[]) {
  return twMerge(cn(inputs));
}
