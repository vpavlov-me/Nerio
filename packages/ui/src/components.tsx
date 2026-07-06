"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { Menu as BaseMenu } from "@base-ui-components/react/menu";
import { Popover as BasePopover } from "@base-ui-components/react/popover";
import { Select as BaseSelect } from "@base-ui-components/react/select";
import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { cn } from "./lib/cn";

type IconComponent = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

function triggerContent(trigger: React.ReactNode) {
  if (React.isValidElement<{ children?: React.ReactNode }>(trigger)) {
    return trigger.props.children;
  }

  return trigger;
}

export function Icon({ icon: IconSvg, className }: { icon: IconComponent; className?: string }) {
  return <IconSvg aria-hidden className={cn("n-icon", className)} />;
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading,
    leadingIcon,
    trailingIcon,
    children,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn("n-button", className)}
      data-slot="root"
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leadingIcon ? <Icon icon={leadingIcon} /> : null}
      <span data-slot="label">{children}</span>
      {trailingIcon ? <Icon icon={trailingIcon} /> : null}
    </button>
  );
});

export interface IconButtonProps extends Omit<
  ButtonProps,
  "leadingIcon" | "trailingIcon" | "children"
> {
  icon: IconComponent;
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
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

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return <span className="n-spinner" data-slot="root" data-size={size} aria-label="Loading" />;
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

export function Toast({
  title,
  description,
  tone = "neutral",
}: {
  title: string;
  description?: string;
  tone?: "neutral" | "success" | "danger";
}) {
  return (
    <div className="n-toast" data-slot="root" data-variant={tone} role="status">
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
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

export function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const fallbackValue = value ?? options[0]?.value;

  return (
    <div className="n-field n-select-field" data-slot="root">
      <span className="n-label">{label}</span>
      <BaseSelect.Root<string>
        value={value}
        defaultValue={fallbackValue}
        items={options}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange?.(nextValue);
          }
        }}
      >
        <BaseSelect.Trigger className="n-select-trigger" aria-label={label}>
          <BaseSelect.Value>
            {(selectedValue) =>
              options.find((option) => option.value === selectedValue)?.label ?? "Select"
            }
          </BaseSelect.Value>
          <BaseSelect.Icon aria-hidden>⌄</BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner className="n-popover-positioner">
            <BaseSelect.Popup className="n-select-popup">
              <BaseSelect.List>
                {options.map((option) => (
                  <BaseSelect.Item
                    key={option.value}
                    className="n-select-item"
                    value={option.value}
                  >
                    <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                    <BaseSelect.ItemIndicator>✓</BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}

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

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: Array<{ label: string; value: string; content: React.ReactNode }>;
  value: string;
  onChange: (value: string) => void;
}) {
  const active = tabs.find((tab) => tab.value === value);

  if (!active) {
    return null;
  }

  return (
    <div className="n-tabs" data-slot="root">
      <div role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={tab.value === active.value}
            data-state={tab.value === active.value ? "active" : "inactive"}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{active.content}</div>
    </div>
  );
}

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const trigger = React.isValidElement(children) ? children : <span>{children}</span>;

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={trigger} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner>
            <BaseTooltip.Popup className="n-tooltip-popup" data-slot="content">
              {label}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

export function Dialog({
  trigger,
  title,
  children,
}: {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger
        className="n-button"
        data-slot="root"
        data-variant="primary"
        data-size="md"
      >
        <span data-slot="label">{triggerContent(trigger)}</span>
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="n-backdrop" data-slot="backdrop" />
        <BaseDialog.Popup className="n-dialog" data-slot="content">
          <header>
            <BaseDialog.Title>{title}</BaseDialog.Title>
            <BaseDialog.Close aria-label="Close">x</BaseDialog.Close>
          </header>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export function Popover({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        className="n-button"
        data-slot="root"
        data-variant="secondary"
        data-size="md"
      >
        <span data-slot="label">{triggerContent(trigger)}</span>
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner className="n-popover-positioner">
          <BasePopover.Popup className="n-popover__content" data-slot="content">
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export function DropdownMenu({
  trigger,
  items,
}: {
  trigger: React.ReactNode;
  items: Array<{ label: string; onSelect?: () => void }>;
}) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger
        className="n-button"
        data-slot="root"
        data-variant="secondary"
        data-size="md"
      >
        <span data-slot="label">{triggerContent(trigger)}</span>
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner>
          <BaseMenu.Popup className="n-dropdown" data-slot="content">
            {items.map((item) => (
              <BaseMenu.Item key={item.label} onClick={item.onSelect}>
                {item.label}
              </BaseMenu.Item>
            ))}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
