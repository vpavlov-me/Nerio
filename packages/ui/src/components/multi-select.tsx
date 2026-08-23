"use client";

import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "@nerio-ui/adapters/icons";
import { composeRefs } from "../lib/compose-refs";
import type { NerioChangeEventDetails } from "../lib/component-props";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { FormMessage } from "./form-message";
import { Icon } from "./icon";

export interface MultiSelectOption<Value extends string = string> {
  value: Value;
  label: React.ReactNode;
  textValue: string;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MultiSelectOptionGroup<Value extends string = string> {
  value: string;
  label: React.ReactNode;
  options: readonly MultiSelectOption<Value>[];
}

export type MultiSelectItems<Value extends string = string> =
  readonly MultiSelectOption<Value>[] | readonly MultiSelectOptionGroup<Value>[];

export interface MultiSelectLabels {
  clear: string;
  toggle: string;
  remove: (textValue: string) => string;
  selected: (textValue: string) => string;
  removed: (textValue: string) => string;
  cleared: string;
}

export type MultiSelectFilter<Value extends string = string> = (
  option: MultiSelectOption<Value>,
  query: string,
) => boolean;
export type MultiSelectSize = "sm" | "md" | "lg";

export type MultiSelectChangeEventReason =
  | "item-press"
  | "chip-remove-press"
  | "clear-press"
  | "escape-key"
  | "input-change"
  | "input-clear"
  | "list-navigation"
  | "outside-press"
  | "focus-out"
  | "trigger-press"
  | "none";
export type MultiSelectChangeEventDetails = NerioChangeEventDetails<MultiSelectChangeEventReason>;
export type MultiSelectOpenChangeEventDetails = MultiSelectChangeEventDetails;
export type MultiSelectQueryChangeEventDetails = MultiSelectChangeEventDetails;

export type MultiSelectProps<Value extends string = string> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> & {
  defaultOpen?: boolean;
  defaultQuery?: string;
  defaultValue?: readonly NoInfer<Value>[];
  description?: React.ReactNode;
  disabled?: boolean;
  emptyMessage?: React.ReactNode;
  filter?: MultiSelectFilter<Value> | false;
  form?: string;
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  invalid?: boolean;
  label: React.ReactNode;
  labels?: Partial<MultiSelectLabels>;
  locale?: Intl.LocalesArgument;
  loopFocus?: boolean;
  message?: React.ReactNode;
  name?: string;
  onOpenChange?: (open: boolean, eventDetails: MultiSelectOpenChangeEventDetails) => void;
  onQueryChange?: (query: string, eventDetails: MultiSelectQueryChangeEventDetails) => void;
  onValueChange?: (value: Value[], eventDetails: MultiSelectChangeEventDetails) => void;
  open?: boolean;
  options: MultiSelectItems<Value>;
  placeholder?: string;
  query?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: MultiSelectSize;
  value?: readonly NoInfer<Value>[];
  "data-slot"?: string;
};

const defaultLabels: MultiSelectLabels = {
  clear: "Clear all selections",
  toggle: "Toggle options",
  remove: (textValue) => `Remove ${textValue}`,
  selected: (textValue) => `${textValue} selected.`,
  removed: (textValue) => `${textValue} removed.`,
  cleared: "All selections cleared.",
};

const multiSelectChangeReasons = new Set<MultiSelectChangeEventReason>([
  "item-press",
  "chip-remove-press",
  "clear-press",
  "escape-key",
  "input-change",
  "input-clear",
  "list-navigation",
  "outside-press",
  "focus-out",
  "trigger-press",
  "none",
]);

function normalizeChangeEventDetails(
  details: NerioChangeEventDetails<string>,
): MultiSelectChangeEventDetails {
  const reason = multiSelectChangeReasons.has(details.reason as MultiSelectChangeEventReason)
    ? (details.reason as MultiSelectChangeEventReason)
    : "none";
  return {
    reason,
    event: details.event,
    trigger: details.trigger,
    cancel: details.cancel,
    allowPropagation: details.allowPropagation,
    get isCanceled() {
      return details.isCanceled;
    },
    get isPropagationAllowed() {
      return details.isPropagationAllowed;
    },
  };
}

function isGrouped<Value extends string>(
  items: MultiSelectItems<Value>,
): items is readonly MultiSelectOptionGroup<Value>[] {
  return items.length > 0 && "options" in items[0]!;
}

function flattenItems<Value extends string>(items: MultiSelectItems<Value>) {
  return isGrouped(items) ? items.flatMap((group) => group.options) : items;
}

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

function MultiSelectItem<Value extends string>({ option }: { option: MultiSelectOption<Value> }) {
  return (
    <BaseCombobox.Item
      className="n-multi-select-item grid min-h-(--n-size-control-sm) cursor-pointer grid-cols-[minmax(0,1fr)_var(--n-icon-size-md)] items-center gap-(--n-select-item-gap) rounded-(--n-radius-md) px-(--n-select-item-padding-inline) py-(--n-space-2) text-(--n-color-text-secondary) [&:not([data-disabled]):hover]:bg-(--n-color-surface-muted) [&:not([data-disabled]):hover]:text-(--n-color-text-primary) data-highlighted:bg-(--n-color-surface-muted) data-highlighted:text-(--n-color-text-primary) data-selected:bg-(--n-color-surface-selected) data-selected:text-(--n-color-text-primary) data-selected:data-highlighted:bg-(--n-color-surface-control-active) data-disabled:cursor-not-allowed data-disabled:text-(--n-color-text-disabled) data-disabled:opacity-(--n-opacity-disabled) forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-[Highlight]"
      data-slot="item"
      disabled={option.disabled}
      value={option}
    >
      <span
        className="n-multi-select-item__content grid min-w-0 gap-(--n-space-0-5)"
        data-slot="item-content"
      >
        <span
          className="n-multi-select-item__label min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
          data-slot="item-label"
        >
          {option.label}
        </span>
        {option.description ? (
          <span
            className="n-multi-select-item__description text-(length:--n-font-size-xs) leading-(--n-line-height-sm) text-(--n-color-text-tertiary)"
            data-slot="item-description"
          >
            {option.description}
          </span>
        ) : null}
      </span>
      <BaseCombobox.ItemIndicator
        className="n-multi-select-item__indicator inline-flex w-(--n-icon-size-md) items-center justify-center text-(--n-color-action-primary)"
        data-slot="indicator"
      >
        <Icon icon={Check} />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

function MultiSelectItemsView<Value extends string>({
  options,
}: {
  options: MultiSelectItems<Value>;
}) {
  const filteredItems = BaseCombobox.useFilteredItems<MultiSelectOption<Value>>();
  const visibleValues = React.useMemo(
    () => new Set(filteredItems.map((option) => option.value)),
    [filteredItems],
  );

  if (isGrouped(options)) {
    return options.map((group) => {
      const visibleOptions = group.options.filter((option) => visibleValues.has(option.value));
      if (visibleOptions.length === 0) return null;
      return (
        <BaseCombobox.Group
          key={group.value}
          className="n-multi-select-group grid gap-(--n-space-1)"
          data-slot="group"
        >
          <BaseCombobox.GroupLabel
            className="n-multi-select-group-label px-(--n-select-group-label-padding-inline) pt-(--n-space-2) pb-(--n-space-1) text-(length:--n-font-size-xs) font-(--n-font-weight-medium) text-(--n-color-text-tertiary)"
            data-slot="group-label"
          >
            {group.label}
          </BaseCombobox.GroupLabel>
          {visibleOptions.map((option) => (
            <MultiSelectItem key={option.value} option={option} />
          ))}
        </BaseCombobox.Group>
      );
    });
  }

  return options
    .filter((option) => visibleValues.has(option.value))
    .map((option) => <MultiSelectItem key={option.value} option={option} />);
}

function getSelectionKey(values: readonly string[]) {
  return JSON.stringify(values);
}

function MultiSelectInner<Value extends string>(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    className,
    defaultOpen,
    defaultQuery,
    defaultValue,
    description,
    disabled,
    emptyMessage = "No matching options.",
    filter: filterProp,
    form,
    id,
    inputRef,
    invalid = false,
    label,
    labels,
    locale,
    loopFocus = true,
    message,
    name,
    onOpenChange,
    onQueryChange,
    onValueChange,
    open,
    options,
    placeholder = "Search options",
    query,
    readOnly,
    required,
    size = "md",
    value,
    "data-slot": _dataSlot,
    ...props
  }: MultiSelectProps<Value>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const generatedId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const visibleInputRef = React.useRef<HTMLInputElement>(null);
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId, messageId);
  const inputAriaLabel = ariaLabel ?? (typeof label === "string" ? label : undefined);
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const resolvedLabels: MultiSelectLabels = { ...defaultLabels, ...labels };
  const flatOptions = React.useMemo(() => flattenItems(options), [options]);
  const optionsByValue = React.useMemo(() => {
    const result = new Map<Value, MultiSelectOption<Value>>();
    for (const option of flatOptions) {
      if (result.has(option.value)) {
        throw new Error(`MultiSelect options require unique values; duplicate "${option.value}".`);
      }
      result.set(option.value, option);
    }
    return result;
  }, [flatOptions]);
  const filterApi = BaseCombobox.useFilter({ locale });
  const filter = React.useMemo(() => {
    if (filterProp === false) return null;
    if (filterProp) {
      return (option: MultiSelectOption<Value>, nextQuery: string) => filterProp(option, nextQuery);
    }
    return (option: MultiSelectOption<Value>, nextQuery: string) =>
      filterApi.contains(option.textValue, nextQuery);
  }, [filterApi, filterProp]);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<Value[]>(() => [
    ...(defaultValue ?? []),
  ]);
  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultQuery ?? "");
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [announcement, setAnnouncement] = React.useState("");
  const currentValue = value === undefined ? uncontrolledValue : value;
  const currentQuery = query === undefined ? uncontrolledQuery : query;
  const currentOpen = open === undefined ? uncontrolledOpen : open;
  const currentSelectedOptions = React.useMemo(() => {
    const selected: MultiSelectOption<Value>[] = [];
    const seen = new Set<Value>();
    const unknown: Value[] = [];
    const duplicates: Value[] = [];
    for (const selectedValue of currentValue) {
      if (seen.has(selectedValue)) {
        duplicates.push(selectedValue);
        continue;
      }
      seen.add(selectedValue);
      const option = optionsByValue.get(selectedValue);
      if (option) selected.push(option);
      else unknown.push(selectedValue);
    }
    if (unknown.length > 0 || duplicates.length > 0) {
      const details = [
        unknown.length > 0 ? `unknown values: ${unknown.join(", ")}` : null,
        duplicates.length > 0 ? `duplicate values: ${duplicates.join(", ")}` : null,
      ]
        .filter(Boolean)
        .join("; ");
      throw new Error(`MultiSelect value must contain unique current option values (${details}).`);
    }
    return selected;
  }, [currentValue, optionsByValue]);
  const currentSelectionKey = getSelectionKey(currentSelectedOptions.map((option) => option.value));
  const pendingAnnouncementRef = React.useRef<{ key: string; message: string } | null>(null);

  React.useEffect(() => {
    const pending = pendingAnnouncementRef.current;
    if (!pending || pending.key !== currentSelectionKey) return;
    setAnnouncement(pending.message);
    pendingAnnouncementRef.current = null;
  }, [currentSelectionKey]);

  const resetStateRef = React.useRef({
    defaultQuery,
    defaultValue,
    open,
    query,
    value,
  });
  resetStateRef.current = { defaultQuery, defaultValue, open, query, value };

  React.useEffect(() => {
    const root = rootRef.current;
    const ownerDocument = root?.ownerDocument;
    const owningForm = form
      ? ownerDocument?.getElementById(form)
      : root?.closest<HTMLFormElement>("form");
    if (!(owningForm instanceof HTMLFormElement)) return undefined;
    let active = true;
    const resetTimeouts = new Set<ReturnType<typeof setTimeout>>();
    const handleReset = (event: Event) => {
      if (event.target !== owningForm) return;
      const timeout = setTimeout(() => {
        resetTimeouts.delete(timeout);
        if (!active || event.defaultPrevented) return;
        const resetState = resetStateRef.current;
        pendingAnnouncementRef.current = null;
        setAnnouncement("");
        if (resetState.value === undefined) {
          setUncontrolledValue([...(resetState.defaultValue ?? [])]);
        }
        if (resetState.query === undefined) setUncontrolledQuery(resetState.defaultQuery ?? "");
        if (resetState.open === undefined) setUncontrolledOpen(false);
      }, 0);
      resetTimeouts.add(timeout);
    };
    owningForm.addEventListener("reset", handleReset);
    return () => {
      active = false;
      resetTimeouts.forEach(clearTimeout);
      owningForm.removeEventListener("reset", handleReset);
    };
  }, [form]);

  return (
    <div
      ref={composeRefs(rootRef, forwardedRef)}
      className={cn(
        "n-field n-multi-select-field grid content-start gap-(--n-field-gap) [&_p]:m-0 [&_p]:text-(length:--n-helper-font-size) [&_p]:text-(--n-color-text-tertiary)",
        className,
      )}
      {...props}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-required={required ? "" : undefined}
      data-size={size}
      data-slot="root"
    >
      <BaseCombobox.Root<MultiSelectOption<Value>, true>
        disabled={disabled}
        filter={filter}
        form={form}
        id={controlId}
        inputValue={currentQuery}
        isItemEqualToValue={(item, selected) => item.value === selected.value}
        itemToStringLabel={(option) => option.textValue}
        itemToStringValue={(option) => option.value}
        items={flatOptions}
        locale={locale}
        loopFocus={loopFocus}
        modal={false}
        multiple
        name={name}
        onInputValueChange={(nextQuery, details) => {
          const eventDetails = normalizeChangeEventDetails(details);
          onQueryChange?.(nextQuery, eventDetails);
          if (eventDetails.isCanceled) return;
          if (query === undefined) setUncontrolledQuery(nextQuery);
        }}
        onOpenChange={(nextOpen, details) => {
          if (details.reason === "item-press") {
            details.cancel();
            return;
          }
          const eventDetails = normalizeChangeEventDetails(details);
          onOpenChange?.(nextOpen, eventDetails);
          if (eventDetails.isCanceled) return;
          if (open === undefined) setUncontrolledOpen(nextOpen);
        }}
        onValueChange={(nextOptions, details) => {
          const eventDetails = normalizeChangeEventDetails(details);
          if (eventDetails.reason === "escape-key" && !currentOpen) {
            eventDetails.cancel();
            return;
          }
          const removedOptions = currentSelectedOptions.filter(
            (currentOption) =>
              !nextOptions.some((nextOption) => nextOption.value === currentOption.value),
          );
          if (
            eventDetails.reason !== "clear-press" &&
            removedOptions.some((option) => option.disabled)
          ) {
            eventDetails.cancel();
            return;
          }
          const nextValue = nextOptions.map((option) => option.value);
          onValueChange?.(nextValue, eventDetails);
          if (eventDetails.isCanceled) return;
          const addedOption = nextOptions.find(
            (nextOption) =>
              !currentSelectedOptions.some(
                (currentOption) => currentOption.value === nextOption.value,
              ),
          );
          const message =
            eventDetails.reason === "clear-press"
              ? resolvedLabels.cleared
              : addedOption
                ? resolvedLabels.selected(addedOption.textValue)
                : removedOptions[0]
                  ? resolvedLabels.removed(removedOptions[0].textValue)
                  : "";
          if (message) {
            pendingAnnouncementRef.current = {
              key: getSelectionKey(nextValue),
              message,
            };
          }
          if (value === undefined) setUncontrolledValue(nextValue);
        }}
        open={currentOpen}
        readOnly={readOnly}
        required={required}
        value={currentSelectedOptions}
      >
        <label
          className="n-label text-(length:--n-label-font-size) font-(--n-label-font-weight) text-(--n-color-text-primary)"
          data-slot="label"
          htmlFor={controlId}
        >
          {label}
        </label>
        <BaseCombobox.InputGroup
          className={cn(
            "n-multi-select-input-group flex min-h-(--n-select-height-md) w-full items-center rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) data-[size=sm]:min-h-(--n-select-height-sm) data-[size=lg]:min-h-(--n-select-height-lg) [&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-input-border-hover) [&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-input-background-hover) has-[[data-slot=input]:focus-visible]:shadow-(--n-focus-ring) data-invalid:border-(--n-input-border-danger) data-disabled:cursor-not-allowed data-disabled:bg-(--n-input-disabled-background) data-disabled:text-(--n-input-disabled-foreground) data-disabled:opacity-(--n-input-disabled-opacity) data-readonly:cursor-default data-readonly:border-(--n-input-readonly-border) data-readonly:bg-(--n-input-readonly-background)",
            motionClasses.control,
          )}
          data-disabled={disabled ? "" : undefined}
          data-invalid={isInvalid ? "" : undefined}
          data-readonly={readOnly ? "" : undefined}
          data-size={size}
          data-slot="input-group"
        >
          <BaseCombobox.Chips
            className="n-multi-select-values flex min-w-0 flex-1 flex-wrap items-center gap-(--n-space-1) px-(--n-select-padding-inline) py-(--n-space-1)"
            data-slot="selected-values"
          >
            {currentSelectedOptions.map((option) => (
              <BaseCombobox.Chip
                key={option.value}
                aria-disabled={option.disabled || undefined}
                aria-label={option.textValue}
                className="n-multi-select-value inline-flex max-w-full items-center gap-(--n-space-1) rounded-(--n-radius-pill) bg-(--n-color-surface-selected) py-(--n-space-0-5) ps-(--n-space-2) pe-(--n-space-1) text-(length:--n-font-size-sm) text-(--n-color-text-primary) outline-0 focus-visible:shadow-(--n-focus-ring) aria-disabled:opacity-(--n-opacity-disabled) forced-colors:border forced-colors:border-[ButtonText] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-visible:shadow-none"
                data-disabled={option.disabled ? "" : undefined}
                data-slot="value"
              >
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  {option.textValue}
                </span>
                <BaseCombobox.ChipRemove
                  aria-label={resolvedLabels.remove(option.textValue)}
                  className="n-multi-select-remove inline-flex size-(--n-icon-size-md) shrink-0 items-center justify-center rounded-(--n-radius-pill) text-(--n-color-text-tertiary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) focus-visible:outline-0 disabled:cursor-not-allowed"
                  data-slot="remove"
                  disabled={option.disabled}
                >
                  <Icon className="size-(--n-icon-size-sm)" icon={X} />
                </BaseCombobox.ChipRemove>
              </BaseCombobox.Chip>
            ))}
            <BaseCombobox.Input
              ref={composeRefs(visibleInputRef, inputRef)}
              aria-describedby={describedBy}
              aria-invalid={isInvalid ? true : ariaInvalid}
              aria-label={inputAriaLabel}
              aria-labelledby={ariaLabelledBy}
              className="n-multi-select-input min-h-(--n-size-control-sm) min-w-[min(8rem,100%)] flex-1 appearance-none border-0 bg-transparent p-0 font-inherit text-inherit outline-0 placeholder:text-(--n-input-placeholder) disabled:cursor-not-allowed"
              form={form}
              placeholder={currentSelectedOptions.length > 0 ? "" : placeholder}
              data-slot="input"
            />
          </BaseCombobox.Chips>
          <BaseCombobox.Clear
            aria-label={resolvedLabels.clear}
            className="n-multi-select-clear inline-flex size-(--n-size-control-sm) shrink-0 items-center justify-center rounded-(--n-radius-pill) text-(--n-color-text-tertiary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-disabled:cursor-not-allowed data-disabled:opacity-(--n-opacity-disabled) forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-visible:shadow-none"
            data-slot="clear"
          >
            <Icon icon={X} />
          </BaseCombobox.Clear>
          <BaseCombobox.Trigger
            aria-label={resolvedLabels.toggle}
            className="n-multi-select-trigger inline-flex size-(--n-size-control-sm) shrink-0 items-center justify-center rounded-(--n-radius-pill) text-(--n-color-text-tertiary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-popup-open:[&_[data-slot=icon]]:rotate-180 forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-visible:shadow-none"
            data-slot="trigger"
          >
            <BaseCombobox.Icon
              className="inline-flex transition-transform duration-(--n-overlay-duration) ease-(--n-overlay-easing) motion-reduce:duration-[1ms]"
              data-slot="icon"
            >
              <Icon icon={ChevronDown} />
            </BaseCombobox.Icon>
          </BaseCombobox.Trigger>
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal>
          <BaseCombobox.Positioner
            align="start"
            className="n-multi-select-positioner z-(--n-overlay-floating-z-index) min-w-[min(var(--anchor-width),var(--available-width))] max-w-(--available-width)"
            side="bottom"
            sideOffset={4}
          >
            <BaseCombobox.Popup
              className="n-multi-select-popup max-h-(--available-height) w-[max(var(--anchor-width),var(--n-size-select-min))] min-w-[min(var(--anchor-width),var(--available-width))] max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-(--n-select-popup-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-space-1) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-color-surface-control-active:var(--n-overlay-control-background-hover)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-surface-selected:var(--n-overlay-selected-background)] [--n-color-text-disabled:var(--n-overlay-foreground-muted)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)] data-open:[animation:n-select-popup-in_var(--n-overlay-duration)_var(--n-overlay-easing)] data-closed:[animation:n-select-popup-out_var(--n-overlay-duration)_var(--n-overlay-easing)] motion-reduce:data-open:[animation-duration:1ms] motion-reduce:data-closed:[animation-duration:1ms]"
              data-slot="content"
            >
              <BaseCombobox.List
                className="n-multi-select-list max-h-[calc(var(--available-height)-var(--n-space-2))] overflow-auto overscroll-contain [scrollbar-width:thin]"
                data-slot="list"
              >
                <MultiSelectItemsView options={options} />
              </BaseCombobox.List>
              <BaseCombobox.Empty
                className="n-multi-select-empty p-(--n-select-empty-padding) text-center text-(length:--n-font-size-sm) text-(--n-color-text-tertiary)"
                data-slot="empty"
              >
                {emptyMessage}
              </BaseCombobox.Empty>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
      <div
        aria-atomic="true"
        aria-live="polite"
        className="sr-only"
        data-slot="announcement"
        role="status"
      >
        {announcement}
      </div>
      {description ? (
        <p className="n-field__description" data-slot="description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {message ? (
        <FormMessage
          data-slot="message"
          id={messageId}
          role={isInvalid ? "alert" : undefined}
          tone={isInvalid ? "danger" : "neutral"}
        >
          {message}
        </FormMessage>
      ) : null}
    </div>
  );
}

export const MultiSelect = React.forwardRef(MultiSelectInner) as <Value extends string = string>(
  props: MultiSelectProps<Value> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;
