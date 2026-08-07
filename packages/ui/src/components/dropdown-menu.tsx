"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { Button } from "./button";
import { Icon } from "./icon";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import type { NerioChangeEventDetails } from "../lib/component-props";

export interface DropdownMenuItem {
  label: React.ReactNode;
  description?: React.ReactNode;
  group?: string;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  hotkey?: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  /** One nested level of related menu actions. */
  items?: DropdownMenuItem[];
}

export type DropdownMenuOpenChangeEventReason =
  | "trigger-hover"
  | "trigger-focus"
  | "trigger-press"
  | "outside-press"
  | "focus-out"
  | "list-navigation"
  | "escape-key"
  | "item-press"
  | "close-press"
  | "sibling-open"
  | "cancel-open"
  | "imperative-action"
  | "none";
export type DropdownMenuOpenChangeEventDetails =
  NerioChangeEventDetails<DropdownMenuOpenChangeEventReason> & {
    preventUnmountOnClose: () => void;
  };
export interface DropdownMenuProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: DropdownMenuOpenChangeEventDetails) => void;
  open?: boolean;
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  className?: string;
}

function groupMenuItems(items: DropdownMenuItem[]) {
  return items.reduce<
    Array<{ label: string | undefined; items: Array<{ item: DropdownMenuItem; index: number }> }>
  >((groups, item, index) => {
    const currentGroup = groups.at(-1);
    if (!currentGroup || currentGroup.label !== item.group) {
      groups.push({ label: item.group, items: [{ item, index }] });
    } else {
      currentGroup.items.push({ item, index });
    }
    return groups;
  }, []);
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu({ trigger, items, className, open, defaultOpen, onOpenChange }, ref) {
    const groups = groupMenuItems(items);
    const descriptionIdPrefix = React.useId();

    return (
      <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <BaseMenu.Trigger
          render={
            React.isValidElement(trigger) ? trigger : <Button variant="secondary">{trigger}</Button>
          }
        />
        <BaseMenu.Portal>
          <BaseMenu.Positioner className="n-popover-positioner z-(--n-overlay-floating-z-index)">
            <BaseMenu.Popup
              ref={ref}
              className={cn(
                "n-dropdown grid min-w-(--n-dropdown-min-width) gap-0 rounded-(--n-dropdown-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-space-2) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-color-danger:var(--n-overlay-danger)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)]",
                motionClasses.overlayEnter,
                className,
              )}
              data-slot="content"
            >
              {groups.map((group, groupIndex) => (
                <React.Fragment key={`${group.label ?? "items"}-${groupIndex}`}>
                  {groupIndex > 0 ? (
                    <BaseMenu.Separator
                      className="my-(--n-space-1) h-px bg-(--n-overlay-divider)"
                      data-slot="separator"
                    />
                  ) : null}
                  <BaseMenu.Group className="grid gap-0" data-slot="group">
                    {group.label ? (
                      <BaseMenu.GroupLabel
                        className="px-(--n-dropdown-item-padding-inline) pt-(--n-space-1) pb-(--n-space-0-5) text-(length:--n-font-size-xs) font-(--n-font-weight-medium) text-(--n-color-text-tertiary)"
                        data-slot="group-label"
                      >
                        {group.label}
                      </BaseMenu.GroupLabel>
                    ) : null}
                    {group.items.map(({ item, index }) => {
                      const labelId = `${descriptionIdPrefix}-label-${index}`;
                      const descriptionId = item.description
                        ? `${descriptionIdPrefix}-description-${index}`
                        : undefined;

                      if (item.items?.length) {
                        return (
                          <BaseMenu.SubmenuRoot key={`${item.label}-${index}`}>
                            <BaseMenu.SubmenuTrigger
                              className={cn(
                                "n-dropdown__item grid cursor-pointer grid-cols-[var(--n-icon-inline-size)_minmax(0,1fr)_var(--n-icon-inline-size)] items-center gap-(--n-dropdown-item-gap) rounded-(--n-radius-md) border-0 bg-(--n-button-background-ghost) px-(--n-dropdown-item-padding-inline) py-(--n-space-2) text-start text-(length:--n-font-size-sm) text-(--n-color-text-secondary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) data-highlighted:bg-(--n-color-surface-muted) data-highlighted:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring)",
                                motionClasses.hover,
                              )}
                              data-slot="submenu-trigger"
                            >
                              {item.leadingIcon ? (
                                <span
                                  aria-hidden
                                  className="col-start-1 inline-flex"
                                  data-slot="leading-icon"
                                >
                                  <Icon icon={item.leadingIcon} />
                                </span>
                              ) : null}
                              <span className="col-start-2" id={labelId}>
                                {item.label}
                              </span>
                              {item.trailingIcon ? (
                                <span
                                  aria-hidden
                                  className="col-start-3 inline-flex justify-self-end"
                                  data-slot="trailing-icon"
                                >
                                  <Icon icon={item.trailingIcon} />
                                </span>
                              ) : null}
                            </BaseMenu.SubmenuTrigger>
                            <BaseMenu.Portal>
                              <BaseMenu.Positioner
                                className="n-popover-positioner z-(--n-overlay-floating-z-index)"
                                side="right"
                                sideOffset={4}
                              >
                                <BaseMenu.Popup
                                  className={cn(
                                    "n-dropdown grid min-w-(--n-dropdown-min-width) gap-0 rounded-(--n-dropdown-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-space-2) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-color-danger:var(--n-overlay-danger)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)]",
                                    motionClasses.overlayEnter,
                                  )}
                                  data-slot="submenu-content"
                                >
                                  {item.items.map((subitem, subIndex) => (
                                    <BaseMenu.Item
                                      className={cn(
                                        "n-dropdown__item grid cursor-pointer grid-cols-[var(--n-icon-inline-size)_minmax(0,1fr)_auto] items-center gap-(--n-dropdown-item-gap) rounded-(--n-radius-md) border-0 bg-(--n-button-background-ghost) px-(--n-dropdown-item-padding-inline) py-(--n-space-2) text-start text-(length:--n-font-size-sm) text-(--n-color-text-secondary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) data-highlighted:bg-(--n-color-surface-muted) data-highlighted:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring)",
                                        motionClasses.hover,
                                      )}
                                      disabled={subitem.disabled}
                                      key={`${subitem.label}-${subIndex}`}
                                      onClick={subitem.onSelect}
                                    >
                                      {subitem.leadingIcon ? (
                                        <span aria-hidden className="col-start-1 inline-flex">
                                          <Icon icon={subitem.leadingIcon} />
                                        </span>
                                      ) : null}
                                      <span className="col-start-2">{subitem.label}</span>
                                      {subitem.hotkey ? (
                                        <span
                                          aria-hidden
                                          className="col-start-3 justify-self-end text-(length:--n-font-size-xs) text-(--n-color-text-tertiary)"
                                        >
                                          {subitem.hotkey}
                                        </span>
                                      ) : null}
                                    </BaseMenu.Item>
                                  ))}
                                </BaseMenu.Popup>
                              </BaseMenu.Positioner>
                            </BaseMenu.Portal>
                          </BaseMenu.SubmenuRoot>
                        );
                      }

                      return (
                        <BaseMenu.Item
                          key={`${item.label}-${index}`}
                          aria-describedby={descriptionId}
                          aria-labelledby={labelId}
                          className={cn(
                            "n-dropdown__item grid cursor-pointer grid-cols-[var(--n-icon-inline-size)_minmax(0,1fr)_auto_var(--n-icon-inline-size)] items-center gap-(--n-dropdown-item-gap) rounded-(--n-radius-md) border-0 bg-(--n-button-background-ghost) px-(--n-dropdown-item-padding-inline) py-(--n-space-2) text-start text-(length:--n-font-size-sm) text-(--n-color-text-secondary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) data-highlighted:bg-(--n-color-surface-muted) data-highlighted:text-(--n-color-text-primary) data-[variant=destructive]:text-(--n-color-danger) data-disabled:cursor-not-allowed data-disabled:opacity-(--n-opacity-disabled) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring)",
                            motionClasses.hover,
                          )}
                          data-slot="item"
                          data-variant={item.destructive ? "destructive" : undefined}
                          disabled={item.disabled}
                          onClick={item.onSelect}
                        >
                          {item.leadingIcon ? (
                            <span
                              aria-hidden
                              className="col-start-1 inline-flex"
                              data-slot="leading-icon"
                            >
                              <Icon icon={item.leadingIcon} />
                            </span>
                          ) : null}
                          <span
                            className={cn(
                              "col-start-2 min-w-0",
                              item.description && "grid gap-(--n-space-0-5)",
                            )}
                            data-slot="label"
                          >
                            <span id={labelId}>{item.label}</span>
                            {item.description ? (
                              <span
                                id={descriptionId}
                                className="text-(length:--n-font-size-xs) font-(--n-font-weight-regular) text-(--n-color-text-tertiary)"
                                data-slot="description"
                              >
                                {item.description}
                              </span>
                            ) : null}
                          </span>
                          {item.hotkey ? (
                            <span
                              aria-hidden
                              className="col-start-3 justify-self-end text-(length:--n-font-size-xs) text-(--n-color-text-tertiary)"
                              data-slot="hotkey"
                            >
                              {item.hotkey}
                            </span>
                          ) : null}
                          {item.trailingIcon ? (
                            <span
                              aria-hidden
                              className="col-start-4 inline-flex"
                              data-slot="trailing-icon"
                            >
                              <Icon icon={item.trailingIcon} />
                            </span>
                          ) : null}
                        </BaseMenu.Item>
                      );
                    })}
                  </BaseMenu.Group>
                </React.Fragment>
              ))}
            </BaseMenu.Popup>
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      </BaseMenu.Root>
    );
  },
);
