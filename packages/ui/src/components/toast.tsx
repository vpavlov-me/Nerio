"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { Bell, Check, CircleAlert, Info, TriangleAlert } from "@nerio/adapters";
import { cn } from "../lib/cn";
import { Icon } from "./icon";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastPriority = "low" | "high";
export type ToastSwipeDirection = "up" | "down" | "left" | "right" | "inline-start" | "inline-end";

export interface ToastAction {
  label: string;
  onClick: () => void;
  altText?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  dismissOnClick?: boolean;
}

export interface ToastData {
  tone?: ToastTone;
  action?: ToastAction;
}

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  priority?: ToastPriority;
}

export const createToastManager = () => BaseToast.createToastManager<ToastData>();
export type ToastManager = ReturnType<typeof createToastManager>;
export const toastManager = createToastManager();
export const useToastManager = BaseToast.useToastManager<ToastData>;

export interface ToastProviderProps {
  children: React.ReactNode;
  limit?: number;
  manager?: ToastManager;
  timeout?: number;
}

export function ToastProvider({
  children,
  limit = 3,
  manager = toastManager,
  timeout = 5000,
}: ToastProviderProps) {
  return (
    <BaseToast.Provider limit={limit} timeout={timeout} toastManager={manager}>
      {children}
    </BaseToast.Provider>
  );
}

export interface ToastViewportProps {
  className?: string;
  direction?: "ltr" | "rtl";
  dismissText?: string;
  dismissLabel?: string;
  label?: string;
  swipeDirection?: ToastSwipeDirection | ToastSwipeDirection[];
}

export function ToastViewport({
  className,
  direction,
  dismissText = "Dismiss",
  dismissLabel = "Dismiss notification",
  label = "Notifications",
  swipeDirection = ["inline-end", "down"],
}: ToastViewportProps) {
  const resolvedDirection = useDocumentDirection(direction);
  const resolvedSwipeDirection = resolveSwipeDirection(swipeDirection, resolvedDirection);

  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        aria-label={label}
        className={cn("n-toast-viewport", className)}
        data-direction={resolvedDirection}
        data-slot="viewport"
        data-swipe-direction={formatSwipeDirections(resolvedSwipeDirection)}
        dir={direction}
        suppressHydrationWarning
      >
        <ToastList
          dismissText={dismissText}
          dismissLabel={dismissLabel}
          swipeDirection={resolvedSwipeDirection}
        />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

export function Toast({
  title,
  description,
  tone = "neutral",
  priority = "low",
  className,
  role,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn("n-toast", className)}
      data-slot="root"
      data-tone={tone}
      role={role ?? (priority === "high" ? "alert" : "status")}
      {...props}
    >
      <ToastIndicator tone={tone} />
      <div className="n-toast__static-content" data-slot="content">
        <strong data-slot="title">{title}</strong>
        {description ? <span data-slot="description">{description}</span> : null}
      </div>
    </div>
  );
}

function ToastList({
  dismissText,
  dismissLabel,
  swipeDirection,
}: {
  dismissText: string;
  dismissLabel: string;
  swipeDirection: BaseSwipeDirection | BaseSwipeDirection[];
}) {
  const manager = BaseToast.useToastManager<ToastData>();

  return manager.toasts.map((toast) => {
    const tone = getToastTone(toast.data?.tone ?? toast.type);
    const action = toast.data?.action;
    const actionLoading = action?.loading ?? false;

    return (
      <BaseToast.Root
        key={toast.id}
        className="n-toast n-toast--managed"
        data-slot="root"
        data-tone={tone}
        swipeDirection={swipeDirection}
        toast={toast}
      >
        <BaseToast.Content className="n-toast__content" data-slot="content">
          <ToastIndicator tone={tone} />
          <div className="n-toast__copy">
            <BaseToast.Title data-slot="title" />
            <BaseToast.Description data-slot="description" />
          </div>
          {action ? (
            <BaseToast.Action
              className="n-toast__action"
              data-slot="action"
              aria-busy={actionLoading || undefined}
              aria-label={action.altText}
              disabled={action.disabled || actionLoading}
              onClick={() => {
                action.onClick();
                if (action.dismissOnClick !== false) {
                  manager.close(toast.id);
                }
              }}
            >
              {actionLoading ? (action.loadingLabel ?? action.label) : action.label}
            </BaseToast.Action>
          ) : null}
          <BaseToast.Close className="n-toast__close" data-slot="close" aria-label={dismissLabel}>
            {dismissText}
          </BaseToast.Close>
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}

type BaseSwipeDirection = "up" | "down" | "left" | "right";

function formatSwipeDirections(direction: BaseSwipeDirection | BaseSwipeDirection[]) {
  return Array.isArray(direction) ? direction.join(" ") : direction;
}

function resolveSwipeDirection(
  direction: ToastSwipeDirection | ToastSwipeDirection[],
  documentDirection: "ltr" | "rtl",
): BaseSwipeDirection | BaseSwipeDirection[] {
  const directions = Array.isArray(direction) ? direction : [direction];
  const resolved = directions.map((item): BaseSwipeDirection => {
    if (item === "inline-end") {
      return documentDirection === "rtl" ? "left" : "right";
    }
    if (item === "inline-start") {
      return documentDirection === "rtl" ? "right" : "left";
    }
    return item;
  });

  return Array.isArray(direction) ? resolved : resolved[0]!;
}

function useDocumentDirection(direction?: "ltr" | "rtl") {
  const [documentDirection, setDocumentDirection] = React.useState<"ltr" | "rtl">(
    readDocumentDirection,
  );

  React.useEffect(() => {
    if (direction) {
      return undefined;
    }

    const root = document.documentElement;
    const updateDirection = () => setDocumentDirection(readDocumentDirection());
    updateDirection();
    const observer = new MutationObserver(updateDirection);
    observer.observe(root, { attributeFilter: ["dir"] });
    return () => observer.disconnect();
  }, [direction]);

  return direction ?? documentDirection;
}

function readDocumentDirection(): "ltr" | "rtl" {
  if (typeof document === "undefined") {
    return "ltr";
  }
  return document.documentElement.dir === "rtl" ? "rtl" : "ltr";
}

function getToastTone(value: unknown): ToastTone {
  return value === "info" || value === "success" || value === "warning" || value === "danger"
    ? value
    : "neutral";
}

function ToastIndicator({ tone }: { tone: ToastTone }) {
  const icon =
    tone === "success"
      ? Check
      : tone === "info"
        ? Info
        : tone === "warning"
          ? TriangleAlert
          : tone === "danger"
            ? CircleAlert
            : Bell;

  return (
    <span data-slot="status-indicator" aria-hidden>
      <Icon icon={icon} />
    </span>
  );
}
