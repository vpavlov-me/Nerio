"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "./lib/cn";
import { Button, type ButtonProps } from "./components/button";
import { Icon, type IconComponent } from "./components/icon";
import { Spinner } from "./components/spinner";

export { Button, Icon, Spinner };
export type { ButtonProps, ButtonSize, ButtonVariant } from "./components/button";
export type { IconComponent, IconProps } from "./components/icon";
export type { SpinnerProps } from "./components/spinner";
export { Select, type SelectOption, type SelectProps } from "./components/select";
export { Tabs, type TabItem, type TabsProps } from "./components/tabs";
export { Tooltip, type TooltipProps } from "./components/tooltip";
export { Dialog, type DialogProps } from "./components/dialog";
export { Popover, type PopoverProps } from "./components/popover";
export {
  DropdownMenu,
  type DropdownMenuItem,
  type DropdownMenuProps,
} from "./components/dropdown-menu";
export {
  Toast,
  ToastProvider,
  ToastViewport,
  toastManager,
  useToastManager,
  type ToastData,
  type ToastProps,
  type ToastTone,
} from "./components/toast";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "leadingIcon" | "trailingIcon" | "children"
> {
  icon: IconComponent;
  label: string;
}

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  { icon, label, className, ...props },
  ref,
) {
  return (
    <Button ref={ref} aria-label={label} className={cn("n-icon-button", className)} {...props}>
      <Icon icon={icon} />
    </Button>
  );
});

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "success" | "danger" | "info";
}) {
  return (
    <span className={cn("n-badge", className)} data-slot="root" data-variant={variant} {...props} />
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("n-skeleton", className)} data-slot="root" aria-hidden {...props} />;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="n-empty-state" data-slot="root">
      <div className="n-empty-state__mark" aria-hidden />
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn("n-input", className)} data-slot="root" {...props} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn("n-textarea", className)} data-slot="root" {...props} />;
});

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("n-label", className)} data-slot="root" {...props} />;
}

export function Field({
  label,
  description,
  message,
  children,
}: {
  label: string;
  description?: string;
  message?: string;
  children: React.ReactNode;
}) {
  const id = React.useId();
  return (
    <div className="n-field" data-slot="root">
      <Label htmlFor={id}>{label}</Label>
      {React.isValidElement(children)
        ? React.cloneElement(
            children as React.ReactElement<{ id?: string; "aria-describedby"?: string }>,
            {
              id,
              "aria-describedby": description || message ? `${id}-hint` : undefined,
            },
          )
        : children}
      {description ? <p id={`${id}-hint`}>{description}</p> : null}
      {message ? <FormMessage id={`${id}-hint`}>{message}</FormMessage> : null}
    </div>
  );
}

export function FormMessage({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("n-form-message", className)} data-slot="root" {...props} />;
}

export const Checkbox = React.forwardRef<
  HTMLElement,
  React.ComponentProps<typeof BaseCheckbox.Root>
>(function Checkbox({ className, children, ...props }, ref) {
  return (
    <BaseCheckbox.Root
      ref={ref}
      className={cn("n-checkbox", className)}
      data-slot="root"
      {...props}
    >
      <BaseCheckbox.Indicator>{children ?? "✓"}</BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
});

export const Switch = React.forwardRef<HTMLElement, React.ComponentProps<typeof BaseSwitch.Root>>(
  function Switch({ className, ...props }, ref) {
    return (
      <BaseSwitch.Root ref={ref} className={cn("n-switch", className)} data-slot="root" {...props}>
        <BaseSwitch.Thumb className="n-switch__thumb" />
      </BaseSwitch.Root>
    );
  },
);

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("n-card", className)} data-slot="root" {...props} />;
}

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("n-separator", className)} data-slot="root" {...props} />;
}

export function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="n-avatar" data-slot="root">
      {src ? <img src={src} alt="" /> : initials}
    </span>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="n-progress" data-slot="root">
      {label ? <span>{label}</span> : null}
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function Stat({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <Card className="n-stat" data-slot="root">
      <span>{label}</span>
      <strong>{value}</strong>
      {trend ? <em>{trend}</em> : null}
    </Card>
  );
}

export function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="n-key-value" data-slot="root">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("n-table", className)} data-slot="root" {...props} />;
}
