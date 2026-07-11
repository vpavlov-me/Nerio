"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../lib/cn";
import { motionClasses } from "../lib/motion";
import { Badge, type BadgeProps } from "./badge";
import { Icon, type IconComponent } from "./icon";
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
};

function isRenderElement(render: unknown): render is React.ReactElement<RenderElementProps> {
  return React.isValidElement(render);
}
type ButtonBaseProps = Omit<
  React.ComponentProps<typeof BaseButton>,
  "aria-label" | "children" | "className" | "disabled"
> & {
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
    "n-button",
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
        <Spinner aria-hidden size="sm" />
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
  const content = renderedElement ? (
    React.cloneElement(renderedElement, {
      className: cn(renderedElement.props.className, classNames),
      "aria-label": props["aria-label"] ?? renderedElement.props["aria-label"],
      "aria-busy": loading || undefined,
      "aria-disabled": disabled || loading || undefined,
      "data-icon-only": iconOnly ? "true" : undefined,
      "data-loading": loading ? "true" : undefined,
      "data-size": size,
      "data-slot": "button",
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
      data-slot="button"
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
