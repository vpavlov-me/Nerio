"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "../lib/cn";

export type ToastTone = "neutral" | "success" | "danger";

export interface ToastData {
  tone?: ToastTone;
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

export function ToastViewport({ className }: { className?: string }) {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className={cn("n-toast-viewport", className)} data-slot="viewport">
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

export function Toast({ title, description, tone = "neutral", className, ...props }: ToastProps) {
  return (
    <div
      className={cn("n-toast", className)}
      data-slot="root"
      data-variant={tone}
      role="status"
      {...props}
    >
      <strong data-slot="title">{title}</strong>
      {description ? <span data-slot="description">{description}</span> : null}
    </div>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager<ToastData>();

  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      className="n-toast n-toast--managed"
      data-slot="root"
      data-variant={toast.data?.tone ?? toast.type ?? "neutral"}
      swipeDirection={["right", "down"]}
      toast={toast}
    >
      <BaseToast.Content className="n-toast__content" data-slot="content">
        <div className="n-toast__copy">
          <BaseToast.Title data-slot="title" />
          <BaseToast.Description data-slot="description" />
        </div>
        <BaseToast.Close className="n-toast__close" aria-label="Dismiss notification">
          x
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  ));
}
