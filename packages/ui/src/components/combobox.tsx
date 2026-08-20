"use client";

import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { composeRefs } from "../lib/compose-refs";
import { motionClasses } from "../lib/motion";
import { resolveClassName } from "../lib/resolve-class-name";
import { FormMessage } from "./form-message";
import { Icon } from "./icon";
import { Spinner } from "./spinner";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioEventDetails,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";

export interface ComboboxOption<Value extends string = string> {
  value: Value;
  label: React.ReactNode;
  textValue: string;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface ComboboxOptionGroup<Value extends string = string> {
  value: string;
  label: React.ReactNode;
  options: readonly ComboboxOption<Value>[];
}

export type ComboboxItems<Value extends string = string> =
  readonly ComboboxOption<Value>[] | readonly ComboboxOptionGroup<Value>[];
export type ComboboxFilter<Value extends string = string> = (
  option: ComboboxOption<Value>,
  query: string,
) => boolean;
export type ComboboxSize = "sm" | "md" | "lg";

export type ComboboxChangeEventReason =
  | "trigger-press"
  | "outside-press"
  | "item-press"
  | "close-press"
  | "escape-key"
  | "list-navigation"
  | "focus-out"
  | "input-change"
  | "input-clear"
  | "input-press"
  | "clear-press"
  | "chip-remove-press"
  | "cancel-open"
  | "none";
export type ComboboxChangeEventDetails = NerioChangeEventDetails<ComboboxChangeEventReason>;
export type ComboboxOpenChangeEventDetails = ComboboxChangeEventDetails;
export type ComboboxQueryChangeEventDetails = ComboboxChangeEventDetails;
export type ComboboxHighlightEventDetails = NerioEventDetails<"keyboard" | "pointer" | "none"> & {
  index: number;
};

type SharedComboboxProps<Value extends string> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> & {
  autoComplete?: string;
  clearLabel?: string;
  defaultOpen?: boolean;
  defaultQuery?: string;
  defaultValue?: NoInfer<Value> | null;
  description?: React.ReactNode;
  disabled?: boolean;
  emptyMessage?: React.ReactNode;
  filter?: ComboboxFilter<Value> | false;
  form?: string;
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  invalid?: boolean;
  label: React.ReactNode;
  loading?: boolean;
  loadingMessage?: React.ReactNode;
  locale?: Intl.LocalesArgument;
  loopFocus?: boolean;
  message?: React.ReactNode;
  name?: string;
  onHighlightChange?: (
    value: Value | undefined,
    eventDetails: ComboboxHighlightEventDetails,
  ) => void;
  onOpenChange?: (open: boolean, eventDetails: ComboboxOpenChangeEventDetails) => void;
  onQueryChange?: (query: string, eventDetails: ComboboxQueryChangeEventDetails) => void;
  onValueChange?: (value: Value | null, eventDetails: ComboboxChangeEventDetails) => void;
  open?: boolean;
  placeholder?: string;
  query?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: ComboboxSize;
  toggleLabel?: string;
  value?: NoInfer<Value> | null;
  "data-slot"?: string;
};

type OptionsComboboxProps<Value extends string> = {
  options: ComboboxItems<Value>;
  children?: never;
  items?: never;
};

type ComposedComboboxProps<Value extends string> = {
  children: React.ReactNode;
  items: ComboboxItems<Value>;
  options?: never;
};

export type ComboboxProps<Value extends string = string> = SharedComboboxProps<Value> &
  (OptionsComboboxProps<Value> | ComposedComboboxProps<Value>);

type ComboboxContextValue = {
  optionsByValue: ReadonlyMap<string, ComboboxOption<string>>;
};

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext() {
  const context = React.useContext(ComboboxContext);
  if (!context) throw new Error("Combobox parts must be used inside Combobox.");
  return context;
}

function isGrouped<Value extends string>(
  items: ComboboxItems<Value>,
): items is readonly ComboboxOptionGroup<Value>[] {
  return items.length > 0 && "options" in items[0]!;
}

function flattenItems<Value extends string>(items: ComboboxItems<Value>) {
  return isGrouped(items) ? items.flatMap((group) => group.options) : items;
}

export interface ComboboxItemState {
  disabled: boolean;
  selected: boolean;
  highlighted: boolean;
}

export interface ComboboxItemProps<Value extends string = string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "color" | "style"
> {
  children: React.ReactNode;
  className?: NerioClassName<ComboboxItemState>;
  description?: React.ReactNode;
  disabled?: boolean;
  render?: NerioRenderProp<ComboboxItemState>;
  style?: NerioStyle<ComboboxItemState>;
  value: Value;
}

const comboboxItemClasses =
  "n-combobox-item grid min-h-(--n-size-control-sm) cursor-pointer grid-cols-[minmax(0,1fr)_var(--n-icon-size-md)] items-center gap-(--n-select-item-gap) rounded-(--n-radius-md) px-(--n-select-item-padding-inline) py-(--n-space-2) text-(--n-color-text-secondary) [&:not([data-disabled]):hover]:bg-(--n-color-surface-muted) [&:not([data-disabled]):hover]:text-(--n-color-text-primary) data-highlighted:bg-(--n-color-surface-muted) data-highlighted:text-(--n-color-text-primary) data-selected:bg-(--n-color-surface-selected) data-selected:text-(--n-color-text-primary) data-selected:data-highlighted:bg-(--n-color-surface-control-active) data-disabled:cursor-not-allowed data-disabled:text-(--n-color-text-disabled) data-disabled:opacity-(--n-opacity-disabled) forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-[Highlight]";

function ComboboxItemInner<Value extends string>(
  { children, className, description, disabled, value, ...props }: ComboboxItemProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { optionsByValue } = useComboboxContext();
  const option = optionsByValue.get(value);
  if (!option) throw new Error(`ComboboxItem value "${value}" is missing from Combobox items.`);

  return (
    <BaseCombobox.Item
      ref={ref}
      className={(state) => cn(comboboxItemClasses, resolveClassName(className, state))}
      disabled={disabled ?? option.disabled}
      value={option}
      {...props}
      data-slot="item"
    >
      <span
        className="n-combobox-item__content grid min-w-0 gap-(--n-space-0-5)"
        data-slot="item-content"
      >
        <span
          className="n-combobox-item__label min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
          data-slot="item-label"
        >
          {children}
        </span>
        {description ? (
          <span
            className="n-combobox-item__description text-(length:--n-font-size-xs) leading-(--n-line-height-sm) text-(--n-color-text-tertiary)"
            data-slot="item-description"
          >
            {description}
          </span>
        ) : null}
      </span>
      <BaseCombobox.ItemIndicator
        className="n-combobox-item__indicator inline-flex w-(--n-icon-size-md) items-center justify-center text-(--n-color-action-primary)"
        data-slot="indicator"
      >
        <Icon icon={Check} />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

export const ComboboxItem = React.forwardRef(ComboboxItemInner) as <Value extends string = string>(
  props: ComboboxItemProps<Value> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;

export type ComboboxPartState = Record<never, never>;
export interface ComboboxGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<ComboboxPartState>;
  render?: NerioRenderProp<ComboboxPartState>;
  style?: NerioStyle<ComboboxPartState>;
}

export const ComboboxGroup = React.forwardRef<HTMLDivElement, ComboboxGroupProps>(
  function ComboboxGroup({ className, ...props }, ref) {
    return (
      <BaseCombobox.Group
        ref={ref}
        {...props}
        className={(state) =>
          cn("n-combobox-group grid gap-(--n-space-1)", resolveClassName(className, state))
        }
        data-slot="group"
      />
    );
  },
);

export type ComboboxGroupLabelProps = ComboboxGroupProps;
export const ComboboxGroupLabel = React.forwardRef<HTMLDivElement, ComboboxGroupLabelProps>(
  function ComboboxGroupLabel({ className, ...props }, ref) {
    return (
      <BaseCombobox.GroupLabel
        ref={ref}
        {...props}
        className={(state) =>
          cn(
            "n-combobox-group-label px-(--n-select-group-label-padding-inline) pt-(--n-space-2) pb-(--n-space-1) text-(length:--n-font-size-xs) font-(--n-font-weight-medium) text-(--n-color-text-tertiary)",
            resolveClassName(className, state),
          )
        }
        data-slot="group-label"
      />
    );
  },
);

function containsComboboxItem(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    if (child.type === ComboboxItem) return true;
    if (child.type === React.Fragment) {
      return containsComboboxItem(
        (child as React.ReactElement<{ children?: React.ReactNode }>).props.children,
      );
    }
    return false;
  });
}

function filterComposedChildren(
  children: React.ReactNode,
  visibleValues: ReadonlySet<string>,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type === ComboboxItem) {
      const item = child as React.ReactElement<ComboboxItemProps<string>>;
      return visibleValues.has(item.props.value) ? item : null;
    }
    if (child.type === ComboboxGroup) {
      const group = child as React.ReactElement<ComboboxGroupProps>;
      const filteredChildren = filterComposedChildren(group.props.children, visibleValues);
      return containsComboboxItem(filteredChildren)
        ? React.cloneElement(group, undefined, filteredChildren)
        : null;
    }
    if (child.type === React.Fragment) {
      const fragment = child as React.ReactElement<{ children?: React.ReactNode }>;
      return React.cloneElement(
        fragment,
        undefined,
        filterComposedChildren(fragment.props.children, visibleValues),
      );
    }
    return child;
  });
}

function ComboboxItemsView<Value extends string>({
  children,
  options,
}: {
  children?: React.ReactNode;
  options?: ComboboxItems<Value>;
}) {
  const filteredItems = BaseCombobox.useFilteredItems<ComboboxOption<Value>>();
  const visibleValues = React.useMemo(
    () => new Set(filteredItems.map((option) => option.value)),
    [filteredItems],
  );

  if (!options) return filterComposedChildren(children, visibleValues);
  if (isGrouped(options)) {
    return options.map((group) => {
      const visibleOptions = group.options.filter((option) => visibleValues.has(option.value));
      if (visibleOptions.length === 0) return null;
      return (
        <ComboboxGroup key={group.value}>
          <ComboboxGroupLabel>{group.label}</ComboboxGroupLabel>
          {visibleOptions.map((option) => (
            <ComboboxItem
              key={option.value}
              description={option.description}
              disabled={option.disabled}
              value={option.value}
            >
              {option.label}
            </ComboboxItem>
          ))}
        </ComboboxGroup>
      );
    });
  }
  return options
    .filter((option) => visibleValues.has(option.value))
    .map((option) => (
      <ComboboxItem
        key={option.value}
        description={option.description}
        disabled={option.disabled}
        value={option.value}
      >
        {option.label}
      </ComboboxItem>
    ));
}

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

function ComboboxInner<Value extends string>(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    autoComplete,
    children,
    className,
    clearLabel = "Clear selection",
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
    items,
    label,
    loading = false,
    loadingMessage = "Loading options…",
    locale,
    loopFocus = true,
    message,
    name,
    onHighlightChange,
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
    toggleLabel = "Toggle options",
    value,
    "data-slot": _dataSlot,
    ...props
  }: ComboboxProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const generatedId = React.useId();
  const visibleInputRef = React.useRef<HTMLInputElement>(null);
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId, messageId);
  const inputAriaLabel = ariaLabel ?? (typeof label === "string" ? label : undefined);
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const sourceItems = options ?? items;
  const flatOptions = React.useMemo(() => flattenItems(sourceItems), [sourceItems]);
  const optionsByValue = React.useMemo(() => {
    const result = new Map<string, ComboboxOption<Value>>();
    for (const option of flatOptions) {
      if (result.has(option.value)) {
        throw new Error(`Combobox items require unique values; duplicate "${option.value}".`);
      }
      result.set(option.value, option);
    }
    return result;
  }, [flatOptions]);
  const filterApi = BaseCombobox.useFilter({ locale });
  const filter = React.useMemo(() => {
    if (filterProp === false) return null;
    if (filterProp)
      return (option: ComboboxOption<Value>, nextQuery: string) => filterProp(option, nextQuery);
    return (option: ComboboxOption<Value>, nextQuery: string) =>
      filterApi.contains(option.textValue, nextQuery);
  }, [filterApi, filterProp]);
  const selectedDefaultValue =
    defaultValue === null
      ? null
      : defaultValue === undefined
        ? undefined
        : (optionsByValue.get(defaultValue) ?? null);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<Value | null>(
    defaultValue ?? null,
  );
  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(
    () => defaultQuery ?? selectedDefaultValue?.textValue ?? "",
  );
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const currentValue = value === undefined ? uncontrolledValue : value;
  const currentQuery = query === undefined ? uncontrolledQuery : query;
  const currentOpen = open === undefined ? uncontrolledOpen : open;
  const currentSelectedValue =
    currentValue === null ? null : (optionsByValue.get(currentValue) ?? null);
  const context = React.useMemo(
    () => ({ optionsByValue: optionsByValue as ReadonlyMap<string, ComboboxOption<string>> }),
    [optionsByValue],
  );

  React.useEffect(() => {
    const owningForm = visibleInputRef.current?.form;
    if (!owningForm) return undefined;
    const handleReset = () => {
      if (value === undefined) setUncontrolledValue(defaultValue ?? null);
      if (query === undefined) {
        setUncontrolledQuery(defaultQuery ?? selectedDefaultValue?.textValue ?? "");
      }
      if (open === undefined) setUncontrolledOpen(false);
    };
    owningForm.addEventListener("reset", handleReset);
    return () => owningForm.removeEventListener("reset", handleReset);
  }, [defaultQuery, defaultValue, form, open, query, selectedDefaultValue, value]);

  return (
    <ComboboxContext.Provider value={context}>
      <div
        ref={ref}
        className={cn(
          "n-field n-combobox-field grid content-start gap-(--n-field-gap) [&_p]:m-0 [&_p]:text-(length:--n-helper-font-size) [&_p]:text-(--n-color-text-tertiary)",
          className,
        )}
        {...props}
        data-disabled={disabled ? "" : undefined}
        data-invalid={isInvalid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-size={size}
        data-slot="root"
      >
        <BaseCombobox.Root<ComboboxOption<Value>>
          autoComplete={autoComplete}
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
          name={name}
          onInputValueChange={(nextQuery, details) => {
            if (query === undefined) setUncontrolledQuery(nextQuery);
            onQueryChange?.(nextQuery, details);
          }}
          onItemHighlighted={(option, details) => onHighlightChange?.(option?.value, details)}
          onOpenChange={(nextOpen, details) => {
            if (open === undefined) setUncontrolledOpen(nextOpen);
            onOpenChange?.(nextOpen, details);
          }}
          onValueChange={(option, details) => {
            if (value === undefined) setUncontrolledValue(option?.value ?? null);
            onValueChange?.(option?.value ?? null, details);
          }}
          open={currentOpen}
          readOnly={readOnly}
          required={required}
          value={currentSelectedValue}
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
              "n-combobox-input-group grid min-h-(--n-select-height-md) w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) data-[size=sm]:min-h-(--n-select-height-sm) data-[size=lg]:min-h-(--n-select-height-lg) [&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-input-border-hover) [&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-input-background-hover) has-[[data-slot=input]:focus-visible]:shadow-(--n-focus-ring) data-invalid:border-(--n-input-border-danger) data-disabled:cursor-not-allowed data-disabled:bg-(--n-input-disabled-background) data-disabled:text-(--n-input-disabled-foreground) data-disabled:opacity-(--n-input-disabled-opacity) data-readonly:cursor-default data-readonly:border-(--n-input-readonly-border) data-readonly:bg-(--n-input-readonly-background)",
              motionClasses.control,
            )}
            data-disabled={disabled ? "" : undefined}
            data-invalid={isInvalid ? "" : undefined}
            data-readonly={readOnly ? "" : undefined}
            data-size={size}
            data-slot="input-group"
          >
            <BaseCombobox.Input
              ref={composeRefs(visibleInputRef, inputRef)}
              aria-describedby={describedBy}
              aria-invalid={isInvalid ? true : ariaInvalid}
              aria-label={inputAriaLabel}
              aria-labelledby={ariaLabelledBy}
              className="n-combobox-input min-h-[inherit] min-w-0 appearance-none border-0 bg-transparent px-(--n-select-padding-inline) font-inherit text-inherit outline-0 placeholder:text-(--n-input-placeholder) disabled:cursor-not-allowed"
              form={form}
              placeholder={placeholder}
              data-slot="input"
            />
            <BaseCombobox.Clear
              aria-label={clearLabel}
              className="n-combobox-clear inline-flex size-(--n-size-control-sm) items-center justify-center rounded-(--n-radius-pill) text-(--n-color-text-tertiary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-disabled:cursor-not-allowed data-disabled:opacity-(--n-opacity-disabled) forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-visible:shadow-none"
              data-slot="clear"
            >
              <Icon icon={X} />
            </BaseCombobox.Clear>
            <BaseCombobox.Trigger
              aria-label={toggleLabel}
              className="n-combobox-trigger inline-flex size-(--n-size-control-sm) items-center justify-center rounded-(--n-radius-pill) text-(--n-color-text-tertiary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-popup-open:[&_[data-slot=icon]]:rotate-180 forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-visible:shadow-none"
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
              className="n-combobox-positioner z-(--n-overlay-floating-z-index) min-w-[min(var(--anchor-width),var(--available-width))] max-w-(--available-width)"
              side="bottom"
              sideOffset={4}
            >
              <BaseCombobox.Popup
                className="n-combobox-popup max-h-(--available-height) w-[max(var(--anchor-width),var(--n-size-select-min))] min-w-[min(var(--anchor-width),var(--available-width))] max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-(--n-select-popup-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-space-1) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-color-surface-control-active:var(--n-overlay-control-background-hover)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-surface-selected:var(--n-overlay-selected-background)] [--n-color-text-disabled:var(--n-overlay-foreground-muted)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)] data-open:[animation:n-select-popup-in_var(--n-overlay-duration)_var(--n-overlay-easing)] data-closed:[animation:n-select-popup-out_var(--n-overlay-duration)_var(--n-overlay-easing)] motion-reduce:data-open:[animation-duration:1ms] motion-reduce:data-closed:[animation-duration:1ms]"
                data-slot="content"
              >
                <BaseCombobox.List
                  className="n-combobox-list max-h-[calc(var(--available-height)-var(--n-space-2))] overflow-auto overscroll-contain [scrollbar-width:thin]"
                  data-slot="list"
                >
                  <ComboboxItemsView options={options}>{children}</ComboboxItemsView>
                </BaseCombobox.List>
                <BaseCombobox.Empty
                  className="n-combobox-empty p-(--n-select-empty-padding) text-center text-(length:--n-font-size-sm) text-(--n-color-text-tertiary)"
                  data-slot="empty"
                >
                  {loading ? null : emptyMessage}
                </BaseCombobox.Empty>
                <BaseCombobox.Status
                  className="n-combobox-loading flex items-center justify-center gap-(--n-space-2) p-(--n-select-empty-padding) text-center text-(length:--n-font-size-sm) text-(--n-color-text-tertiary) empty:hidden"
                  data-slot="loading"
                >
                  {loading ? (
                    <>
                      <Spinner decorative size="sm" />
                      {loadingMessage}
                    </>
                  ) : null}
                </BaseCombobox.Status>
              </BaseCombobox.Popup>
            </BaseCombobox.Positioner>
          </BaseCombobox.Portal>
        </BaseCombobox.Root>
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
    </ComboboxContext.Provider>
  );
}

export const Combobox = React.forwardRef(ComboboxInner) as <Value extends string = string>(
  props: ComboboxProps<Value> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement;
