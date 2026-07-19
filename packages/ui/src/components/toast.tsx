"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { Bell, Check, CircleAlert, Info, TriangleAlert, X } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { Button } from "./button";
import { Icon } from "./icon";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastPriority = "low" | "high";
export type ToastSwipeDirection = "up" | "down" | "left" | "right" | "inline-start" | "inline-end";

const toastClasses =
  "n-toast flex items-center gap-(--n-toast-gap) rounded-(--n-toast-radius) border-(length:--n-toast-border-width) border-(--n-toast-border) bg-(--n-toast-background) p-(--n-toast-padding) text-(--n-toast-foreground) shadow-(--n-toast-shadow) data-[tone=info]:[--n-toast-status-color:var(--n-color-status-info)] data-[tone=success]:[--n-toast-status-color:var(--n-color-status-success)] data-[tone=warning]:[--n-toast-status-color:var(--n-color-status-warning)] data-[tone=danger]:[--n-toast-status-color:var(--n-color-status-danger)] [&_[data-slot=status-indicator]]:inline-flex [&_[data-slot=status-indicator]]:size-(--n-toast-status-indicator-size) [&_[data-slot=status-indicator]]:flex-none [&_[data-slot=status-indicator]]:items-center [&_[data-slot=status-indicator]]:justify-center [&_[data-slot=status-indicator]]:rounded-(--n-toast-status-indicator-radius) [&_[data-slot=status-indicator]]:text-(--n-toast-status-color) [&_[data-slot=status-indicator]_.n-icon]:size-(--n-icon-size-md) [&_[data-slot=title]]:m-0 [&_[data-slot=title]]:text-(length:--n-font-size-md) [&_[data-slot=title]]:leading-(--n-line-height-tight) [&_[data-slot=title]]:font-(--n-font-weight-semibold) [&_[data-slot=title]]:text-(--n-color-text-primary) [&_[data-slot=description]]:m-0 [&_[data-slot=description]]:text-(length:--n-font-size-md) [&_[data-slot=description]]:leading-(--n-line-height-normal) [&_[data-slot=description]]:text-(--n-color-text-secondary) max-[30rem]:items-start forced-colors:border-[CanvasText] forced-colors:[&_[data-slot=status-indicator]]:border forced-colors:[&_[data-slot=status-indicator]]:border-[ButtonText]";
const managedToastClasses =
  "n-toast--managed absolute right-0 bottom-0 z-[calc(var(--n-overlay-z-index)-var(--toast-index))] h-(--toast-managed-height) w-full origin-top touch-none select-none pointer-events-auto [--toast-managed-scale:max(0,calc(1-(var(--toast-index)*var(--n-toast-stack-scale-step))))] [--toast-managed-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-managed-base-y:calc(var(--toast-index)*var(--n-toast-stack-offset)*-1)] [--toast-managed-dismiss-x:0px] [--toast-managed-dismiss-y:0px] [--toast-managed-enter-y:0px] [--toast-managed-x:calc(var(--toast-swipe-movement-x)+var(--toast-managed-dismiss-x))] [--toast-managed-y:calc(var(--toast-managed-base-y)+var(--toast-swipe-movement-y)+var(--toast-managed-enter-y)+var(--toast-managed-dismiss-y))] [transform:translate3d(var(--toast-managed-x),var(--toast-managed-y),0)_scale(var(--toast-managed-scale))] transition-[transform,opacity] duration-(--n-motion-reveal-duration) ease-(--n-motion-reveal-easing) data-expanded:[--toast-managed-height:var(--toast-height)] data-expanded:[--toast-managed-scale:1] data-expanded:[--toast-managed-base-y:calc((var(--toast-offset-y)*-1)-(var(--toast-index)*var(--n-toast-stack-gap)))] data-limited:pointer-events-none data-limited:opacity-(--n-opacity-hidden) data-starting-style:[--toast-managed-enter-y:var(--n-toast-enter-offset)] data-ending-style:opacity-(--n-opacity-hidden) data-ending-style:data-[swipe-direction=right]:[--toast-managed-dismiss-x:var(--n-toast-swipe-dismiss-distance)] data-ending-style:data-[swipe-direction=left]:[--toast-managed-dismiss-x:calc(-1*var(--n-toast-swipe-dismiss-distance))] data-ending-style:data-[swipe-direction=down]:[--toast-managed-dismiss-y:var(--n-toast-swipe-dismiss-distance)] data-ending-style:data-[swipe-direction=up]:[--toast-managed-dismiss-y:calc(-1*var(--n-toast-swipe-dismiss-distance))] after:absolute after:top-full after:left-0 after:h-[calc(var(--n-toast-stack-gap)+1px)] after:w-full after:content-[''] motion-reduce:duration-(--n-duration-instant) motion-reduce:data-starting-style:[--toast-managed-enter-y:0px] motion-reduce:data-ending-style:[--toast-managed-dismiss-x:0px] motion-reduce:data-ending-style:[--toast-managed-dismiss-y:0px]";

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
        className={cn(
          "n-toast-viewport fixed bottom-[max(var(--n-toast-viewport-inset),env(safe-area-inset-bottom))] left-1/2 z-(--n-overlay-z-index) h-0 max-h-[calc(100dvh-max(var(--n-toast-viewport-inset),env(safe-area-inset-top))-max(var(--n-toast-viewport-inset),env(safe-area-inset-bottom)))] w-[min(calc(100dvw-(var(--toast-viewport-inline-inset)*2)),var(--n-toast-width))] -translate-x-1/2 pointer-events-none [--toast-viewport-inline-inset:max(var(--n-toast-viewport-inset),env(safe-area-inset-left),env(safe-area-inset-right))]",
          className,
        )}
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
      {...props}
      className={cn(toastClasses, className)}
      data-slot="root"
      data-tone={tone}
      role={role ?? (priority === "high" ? "alert" : "status")}
    >
      <ToastIndicator tone={tone} />
      <div
        className="n-toast__static-content grid min-w-0 flex-1 content-center gap-(--n-toast-copy-gap) [overflow-wrap:anywhere]"
        data-slot="content"
      >
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
        className={cn(toastClasses, managedToastClasses)}
        data-slot="root"
        data-tone={tone}
        swipeDirection={swipeDirection}
        toast={toast}
      >
        <BaseToast.Content
          className="n-toast__content flex flex-1 items-center gap-(--n-toast-content-gap) data-behind:opacity-(--n-opacity-muted) data-expanded:opacity-100 max-[30rem]:flex-wrap max-[30rem]:items-start"
          data-slot="content"
        >
          <ToastIndicator tone={tone} />
          <div className="n-toast__copy grid min-w-0 flex-1 content-center gap-(--n-space-1) [overflow-wrap:anywhere] max-[30rem]:basis-[calc(100%-var(--n-toast-status-indicator-size)-var(--n-toast-content-gap))]">
            <BaseToast.Title data-slot="title" />
            <BaseToast.Description data-slot="description" />
          </div>
          {action ? (
            <Button
              render={
                <BaseToast.Action
                  aria-label={action.altText}
                  disabled={action.disabled || actionLoading}
                  onClick={() => {
                    action.onClick();
                    if (action.dismissOnClick !== false) {
                      manager.close(toast.id);
                    }
                  }}
                />
              }
              className="n-toast__action flex-none"
              data-slot="action"
              aria-busy={actionLoading || undefined}
              disabled={action.disabled || actionLoading}
              loading={actionLoading}
              size="sm"
              variant="secondary"
            >
              {actionLoading ? (action.loadingLabel ?? action.label) : action.label}
            </Button>
          ) : null}
          <Button
            render={<BaseToast.Close />}
            aria-label={dismissLabel}
            className="n-toast__close flex-none"
            data-slot="close"
            icon={X}
            size="sm"
            tooltip={dismissText}
            variant="ghost"
          />
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
