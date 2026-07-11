"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../lib/cn";
import { motionClasses } from "../lib/motion";
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
type AnchorRenderProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  "data-icon-only"?: string;
  "data-loading"?: string;
  "data-size"?: ButtonSize;
  "data-slot"?: string;
  "data-variant"?: CanonicalButtonVariant;
};

function isAnchorRender(render: unknown): render is React.ReactElement<AnchorRenderProps> {
  return React.isValidElement(render) && render.type === "a";
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

type TextButtonProps = ButtonBaseProps & {
  children: React.ReactNode;
  icon?: never;
  "aria-label"?: string;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  /** Optional native Kbd hint displayed after the visible button label. */
  kbd?: ButtonKbd;
};

type IconOnlyButtonProps = ButtonBaseProps & {
  /** Renders an accessible icon-only button. */
  icon: IconComponent;
  children?: never;
  "aria-label": string;
  leadingIcon?: never;
  trailingIcon?: never;
  kbd?: never;
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
    tooltip,
    children,
    disabled,
    render,
    nativeButton: _nativeButton,
    ...props
  },
  ref,
) {
  const iconOnly = Boolean(icon);
  const normalizedVariant = normalizeButtonVariant(variant);
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
      {!iconOnly ? <span data-slot="button-label">{children}</span> : null}
      {!iconOnly ? keyboardShortcut : null}
      {!iconOnly && !loading && trailingIcon ? (
        <span data-slot="button-icon">
          <Icon icon={trailingIcon} />
        </span>
      ) : null}
    </>
  );
  const anchor = normalizedVariant === "link" && isAnchorRender(render) ? render : null;
  const content = anchor ? (
    React.cloneElement(anchor, {
      className: cn(anchor.props.className, classNames),
      "aria-busy": loading || undefined,
      "aria-disabled": disabled || loading || undefined,
      "data-icon-only": iconOnly ? "true" : undefined,
      "data-loading": loading ? "true" : undefined,
      "data-size": size,
      "data-slot": "button",
      "data-variant": normalizedVariant,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        anchor.props.onClick?.(event);
      },
      children: contents,
    })
  ) : (
    <BaseButton
      ref={ref}
      {...props}
      className={classNames}
      data-slot="button"
      data-variant={normalizedVariant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      data-icon-only={iconOnly ? "true" : undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
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
