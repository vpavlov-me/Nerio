"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { composeRefs } from "../lib/compose-refs";
import { motionClasses } from "../lib/motion";
import { Badge, type BadgeProps } from "./badge";
import { Icon } from "./icon";
import { Kbd, type KbdProps } from "./kbd";
import { Spinner } from "./spinner";
import { Tooltip } from "./tooltip";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "danger"
  /** @deprecated Use secondary. */
  | "subtle"
  /** @deprecated Use danger. */
  | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

type CanonicalButtonVariant = Exclude<ButtonVariant, "subtle" | "destructive">;

const buttonBaseClasses =
  "n-button box-border inline-flex h-(--n-button-height-md) cursor-pointer items-center justify-center gap-(--n-button-gap) whitespace-nowrap rounded-(--n-button-radius) border-(length:--n-button-border-width) border-(--n-button-border-transparent) px-(--n-button-padding-inline-md) text-(length:--n-button-font-size) font-(--n-button-font-weight) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) disabled:cursor-not-allowed disabled:opacity-(--n-button-disabled-opacity) data-disabled:cursor-not-allowed data-disabled:opacity-(--n-button-disabled-opacity) [&_[data-slot=button-icon]]:inline-flex [&_[data-slot=button-icon]]:items-center [&_[data-slot=button-badge]]:inline-flex [&_[data-slot=button-badge]]:shrink-0 [&_.n-kbd]:bg-(--n-button-kbd-background) [&_.n-kbd]:border-(--n-button-kbd-border-color) [&_.n-kbd]:text-(--n-button-kbd-foreground) [&_.n-kbd]:opacity-(--n-button-kbd-opacity)";

const buttonVariantClasses: Record<CanonicalButtonVariant, string> = {
  primary:
    "bg-(--n-button-background-primary) text-(--n-button-foreground-primary) [&:hover:not(:disabled):not([data-disabled])]:bg-(--n-button-background-primary-hover) [&:active:not(:disabled):not([data-disabled])]:bg-(--n-button-background-primary-active)",
  secondary:
    "bg-(--n-button-background-secondary) border-(--n-button-border-secondary) text-(--n-button-foreground-secondary) [&:hover:not(:disabled):not([data-disabled])]:bg-(--n-button-background-secondary-hover)",
  outline:
    "bg-(--n-button-background-outline) border-(--n-button-border-outline) text-(--n-button-foreground-outline) [&:hover:not(:disabled):not([data-disabled])]:bg-(--n-button-background-outline-hover)",
  ghost:
    "bg-(--n-button-background-ghost) border-(--n-button-border-ghost) text-(--n-button-foreground-ghost) [&:hover:not(:disabled):not([data-disabled])]:bg-(--n-button-background-ghost-hover) [&:hover:not(:disabled):not([data-disabled])]:text-(--n-color-text-primary)",
  link: "h-auto bg-transparent border-transparent px-(--n-space-0) text-(--n-link-color) [&:hover:not(:disabled):not([data-disabled])]:text-(--n-link-color-hover)",
  danger: "bg-(--n-button-background-destructive) text-(--n-button-foreground-destructive)",
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "h-(--n-button-height-sm) px-(--n-button-padding-inline-sm)",
  md: "h-(--n-button-height-md) px-(--n-button-padding-inline-md)",
  lg: "h-(--n-button-height-lg) px-(--n-button-padding-inline-lg)",
};

type RenderElementProps = {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-busy"?: boolean;
  "aria-disabled"?: boolean;
  className?: string;
  children?: React.ReactNode;
  "data-icon-only"?: string;
  "data-loading"?: string;
  "data-size"?: ButtonSize;
  "data-slot"?: string;
  "data-variant"?: CanonicalButtonVariant;
  onClick?: React.MouseEventHandler<HTMLElement>;
  ref?: React.Ref<HTMLElement>;
};

function isRenderElement(render: unknown): render is React.ReactElement<RenderElementProps> {
  return React.isValidElement(render);
}
type ButtonBaseProps = Omit<
  React.ComponentProps<typeof BaseButton>,
  "aria-label" | "children" | "className" | "disabled"
> & {
  "data-slot"?: string;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** @deprecated Loading preserves the action name and exposes aria-busy. */
  loadingLabel?: string;
  /** Shows supplemental help on hover and keyboard focus. */
  tooltip?: React.ReactNode;
};

export type ButtonKbd = string | number | React.ReactElement<KbdProps, typeof Kbd>;
export type ButtonBadge = React.ReactElement<BadgeProps, typeof Badge>;

type TextButtonProps = ButtonBaseProps & {
  children: React.ReactNode;
  icon?: never;
  "aria-label"?: string;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  /** Optional native Kbd hint displayed after the visible button label. */
  kbd?: ButtonKbd;
  /** Optional Badge displayed after the visible button label. */
  badge?: ButtonBadge;
};

type IconOnlyButtonProps = ButtonBaseProps & {
  /** Renders an accessible icon-only button. */
  icon: IconComponent;
  children?: never;
  "aria-label": string;
  leadingIcon?: never;
  trailingIcon?: never;
  kbd?: never;
  badge?: never;
};

export type ButtonProps = TextButtonProps | IconOnlyButtonProps;

function normalizeButtonVariant(variant: ButtonVariant): CanonicalButtonVariant {
  if (variant === "subtle") return "secondary";
  if (variant === "destructive") return "danger";
  return variant;
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading = false,
    loadingLabel: _loadingLabel,
    leadingIcon,
    trailingIcon,
    icon,
    kbd,
    badge,
    tooltip,
    children,
    disabled,
    render,
    nativeButton,
    "data-slot": dataSlot = "button",
    ...props
  },
  ref,
) {
  const iconOnly = Boolean(icon);
  const buttonLabelId = React.useId();
  const buttonBadgeId = React.useId();
  const normalizedVariant = normalizeButtonVariant(variant);
  const hasCustomAccessibleName = "aria-label" in props || "aria-labelledby" in props;
  const labelledBy =
    badge && !hasCustomAccessibleName ? `${buttonLabelId} ${buttonBadgeId}` : undefined;
  const classNames = cn(
    buttonBaseClasses,
    buttonSizeClasses[size],
    buttonVariantClasses[normalizedVariant],
    iconOnly &&
      "w-(--n-icon-button-size-md) rounded-(--n-icon-button-radius) p-(--n-space-0) [&_.n-icon]:size-(--n-icon-button-icon-size-md)",
    iconOnly &&
      size === "sm" &&
      "w-(--n-icon-button-size-sm) [&_.n-icon]:size-(--n-icon-button-icon-size-sm)",
    iconOnly &&
      size === "lg" &&
      "w-(--n-icon-button-size-lg) [&_.n-icon]:size-(--n-icon-button-icon-size-lg)",
    motionClasses.hover,
    motionClasses.press,
    motionClasses.focus,
    className,
  );
  const keyboardShortcut =
    React.isValidElement(kbd) && kbd.type === Kbd ? (
      React.cloneElement(kbd as React.ReactElement<KbdProps>, {
        "data-slot": "button-kbd",
        "aria-hidden": true,
      })
    ) : typeof kbd === "string" || typeof kbd === "number" ? (
      <Kbd data-slot="button-kbd" aria-hidden="true">
        {kbd}
      </Kbd>
    ) : null;
  const buttonBadge = badge ? React.cloneElement(badge, { size: "sm" }) : null;
  const contents = (
    <>
      {loading ? (
        <Spinner decorative size="sm" />
      ) : icon ? (
        <Icon icon={icon} />
      ) : leadingIcon ? (
        <span data-slot="button-icon">
          <Icon icon={leadingIcon} />
        </span>
      ) : null}
      {!iconOnly ? (
        <span data-slot="button-label" id={labelledBy ? buttonLabelId : undefined}>
          {children}
        </span>
      ) : null}
      {!iconOnly && badge ? (
        <span data-slot="button-badge" id={labelledBy ? buttonBadgeId : undefined}>
          {buttonBadge}
        </span>
      ) : null}
      {!iconOnly ? keyboardShortcut : null}
      {!iconOnly && !loading && trailingIcon ? (
        <span data-slot="button-icon">
          <Icon icon={trailingIcon} />
        </span>
      ) : null}
    </>
  );
  const renderedElement = isRenderElement(render) ? render : null;
  const renderRef = renderedElement?.props.ref;
  const composedRef = React.useMemo(
    () => (renderRef && ref ? composeRefs(renderRef, ref) : (renderRef ?? ref ?? undefined)),
    [ref, renderRef],
  );
  const content = renderedElement ? (
    React.cloneElement(renderedElement, {
      ref: composedRef,
      className: cn(renderedElement.props.className, classNames),
      "aria-label": props["aria-label"] ?? renderedElement.props["aria-label"],
      "aria-busy": loading || undefined,
      "aria-disabled": disabled || loading || undefined,
      "data-icon-only": iconOnly ? "true" : undefined,
      "data-loading": loading ? "true" : undefined,
      "data-size": size,
      "data-slot": dataSlot,
      "data-variant": normalizedVariant,
      "aria-labelledby": labelledBy ?? renderedElement.props["aria-labelledby"],
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        renderedElement.props.onClick?.(event);
      },
      children: contents,
    })
  ) : (
    <BaseButton
      ref={ref}
      {...props}
      nativeButton={nativeButton}
      className={classNames}
      data-slot={dataSlot}
      data-variant={normalizedVariant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      data-icon-only={iconOnly ? "true" : undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-labelledby={labelledBy ?? props["aria-labelledby"]}
    >
      {contents}
    </BaseButton>
  );

  return tooltip ? (
    <Tooltip delay={iconOnly ? 0 : undefined} label={tooltip}>
      {content}
    </Tooltip>
  ) : (
    content
  );
});
