"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { Bell, Check, CircleAlert, Info, TriangleAlert } from "@nerio/adapters";
import { cn } from "../lib/cn";
import { Icon } from "./icon";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface ToastData {
  tone?: ToastTone;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
}

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
}

export const toastManager = BaseToast.createToastManager<ToastData>();
export const useToastManager = BaseToast.useToastManager<ToastData>;

export function ToastProvider({
  children,
  limit = 3,
  timeout = 5000,
}: {
  children: React.ReactNode;
  limit?: number;
  timeout?: number;
}) {
  return (
    <BaseToast.Provider limit={limit} timeout={timeout} toastManager={toastManager}>
      {children}
    </BaseToast.Provider>
  );
}

export function ToastViewport({
  className,
  dismissLabel = "Dismiss notification",
}: {
  className?: string;
  dismissLabel?: string;
}) {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className={cn("n-toast-viewport", className)} data-slot="viewport">
        <ToastList dismissLabel={dismissLabel} />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

export function Toast({ title, description, tone = "neutral", className, ...props }: ToastProps) {
  return (
    <div
      className={cn("n-toast", className)}
      data-slot="root"
      data-tone={tone}
      role="status"
      {...props}
    >
      <ToastIndicator tone={tone} />
      <div data-slot="content">
        <strong data-slot="title">{title}</strong>
        {description ? <span data-slot="description">{description}</span> : null}
      </div>
    </div>
  );
}

function ToastList({ dismissLabel }: { dismissLabel: string }) {
  const { toasts } = BaseToast.useToastManager<ToastData>();

  return toasts.map((toast) => {
    const tone = getToastTone(toast.data?.tone ?? toast.type);

    return (
      <BaseToast.Root
        key={toast.id}
        className="n-toast n-toast--managed"
        data-slot="root"
        data-tone={tone}
        swipeDirection={["right", "down"]}
        toast={toast}
      >
        <BaseToast.Content className="n-toast__content" data-slot="content">
          <ToastIndicator tone={tone} />
          <div className="n-toast__copy">
            <BaseToast.Title data-slot="title" />
            <BaseToast.Description data-slot="description" />
          </div>
          {toast.data?.action ? (
            <BaseToast.Action
              className="n-toast__action"
              data-slot="action"
              aria-label={toast.data.action.altText}
              onClick={toast.data.action.onClick}
            >
              {toast.data.action.label}
            </BaseToast.Action>
          ) : null}
          <BaseToast.Close className="n-toast__close" data-slot="close" aria-label={dismissLabel}>
            Dismiss
          </BaseToast.Close>
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
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
