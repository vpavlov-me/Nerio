"use client";

import * as React from "react";
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { Search } from "@nerio/adapters/icons";
import { cn } from "../lib/cn";
import { resolveClassName } from "../lib/resolve-class-name";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

export interface CommandItemData {
  value: string;
  label: string;
  keywords?: readonly string[];
  disabled?: boolean;
}

export interface CommandGroupData {
  value: string;
  label: React.ReactNode;
  items: readonly CommandItemData[];
}

export type CommandItems = readonly CommandItemData[] | readonly CommandGroupData[];
export type CommandFilter = (item: CommandItemData, query: string) => boolean;

export type CommandQueryChangeEventDetails = Parameters<
  NonNullable<React.ComponentProps<typeof BaseAutocomplete.Root>["onValueChange"]>
>[1];

export type CommandActiveChangeEventDetails = Parameters<
  NonNullable<React.ComponentProps<typeof BaseAutocomplete.Root>["onItemHighlighted"]>
>[1];

export type CommandSelectEvent = Parameters<
  NonNullable<React.ComponentProps<typeof BaseAutocomplete.Item>["onClick"]>
>[0];

type CommandContextValue = {
  disabled: boolean;
  grouped: boolean;
  itemsByValue: ReadonlyMap<string, CommandItemData>;
  readOnly: boolean;
  selectItem: (item: CommandItemData, event: CommandSelectEvent) => void;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommandContext() {
  const context = React.useContext(CommandContext);
  if (!context) throw new Error("Command parts must be used inside Command.");
  return context;
}

function isGroupedItems(items: CommandItems): items is readonly CommandGroupData[] {
  return items.length > 0 && "items" in items[0]!;
}

function isCommandGroupData(item: CommandItemData | CommandGroupData): item is CommandGroupData {
  return "items" in item;
}

function isCommandItemData(item: CommandItemData | CommandGroupData): item is CommandItemData {
  return !isCommandGroupData(item);
}

function flattenItems(items: CommandItems) {
  return isGroupedItems(items) ? items.flatMap((group) => group.items) : items;
}

function itemToSearchText(item: CommandItemData) {
  return [item.label, item.value, ...(item.keywords ?? [])].join(" ");
}

function itemToInputValue(item: CommandItemData) {
  return item.label;
}

type BaseCommandRootProps = {
  disabled?: boolean;
  form?: string;
  id?: string;
  limit?: number;
  locale?: Intl.LocalesArgument;
  loopFocus?: boolean;
  name?: string;
  readOnly?: boolean;
  required?: boolean;
};

export interface CommandProps
  extends
    BaseCommandRootProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  children: React.ReactNode;
  items: CommandItems;
  query?: string;
  defaultQuery?: string;
  filter?: CommandFilter | false;
  onQueryChange?: (query: string, eventDetails: CommandQueryChangeEventDetails) => void;
  onActiveValueChange?: (
    value: string | undefined,
    eventDetails: CommandActiveChangeEventDetails,
  ) => void;
}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(function Command(
  {
    children,
    className,
    defaultQuery,
    disabled,
    filter: filterProp,
    form,
    id,
    items,
    limit,
    locale,
    loopFocus = true,
    name,
    onActiveValueChange,
    onQueryChange,
    query,
    readOnly,
    required,
    ...props
  },
  ref,
) {
  const filterApi = BaseAutocomplete.useFilter({ locale });
  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultQuery ?? "");
  const controlled = query !== undefined;
  const currentQuery = controlled ? query : uncontrolledQuery;
  const grouped = isGroupedItems(items);
  const flatItems = React.useMemo(() => flattenItems(items), [items]);
  const itemsByValue = React.useMemo(() => {
    const itemMap = new Map<string, CommandItemData>();
    for (const item of flatItems) {
      if (itemMap.has(item.value)) {
        throw new Error(`Command items require unique values; duplicate "${item.value}".`);
      }
      itemMap.set(item.value, item);
    }
    return itemMap;
  }, [flatItems]);
  const filter = React.useMemo<CommandFilter | null>(() => {
    if (filterProp === false) return null;
    if (filterProp) return filterProp;
    return (item, nextQuery) => filterApi.contains(itemToSearchText(item), nextQuery);
  }, [filterApi, filterProp]);
  const handleQueryChange = React.useCallback(
    (nextQuery: string, details: CommandQueryChangeEventDetails) => {
      onQueryChange?.(nextQuery, details);
      if (!details.isCanceled && !controlled) setUncontrolledQuery(nextQuery);
    },
    [controlled, onQueryChange],
  );
  const selectItem = React.useCallback(
    (item: CommandItemData, event: CommandSelectEvent) => {
      // Inline Autocomplete has no popup to perform its normal input fill, so Command commits
      // the public label-only query contract before exposing the stable value through onSelect.
      let canceled = false;
      let propagationAllowed = false;
      const details = {
        reason: "item-press",
        event: event.nativeEvent,
        trigger: event.currentTarget,
        cancel() {
          canceled = true;
        },
        allowPropagation() {
          propagationAllowed = true;
        },
        get isCanceled() {
          return canceled;
        },
        get isPropagationAllowed() {
          return propagationAllowed;
        },
      } satisfies CommandQueryChangeEventDetails;
      handleQueryChange(itemToInputValue(item), details);
    },
    [handleQueryChange],
  );
  const context = React.useMemo(
    () => ({
      disabled: Boolean(disabled),
      grouped,
      itemsByValue,
      readOnly: Boolean(readOnly),
      selectItem,
    }),
    [disabled, grouped, itemsByValue, readOnly, selectItem],
  );

  const rootProps = {
    autoHighlight: "always" as const,
    disabled,
    filter,
    form,
    id,
    inline: true,
    itemToStringValue: itemToInputValue,
    limit,
    locale,
    loopFocus,
    mode: filterProp === false ? ("none" as const) : ("list" as const),
    name,
    onItemHighlighted: (
      item: CommandItemData | undefined,
      details: CommandActiveChangeEventDetails,
    ) => onActiveValueChange?.(item?.value, details),
    onValueChange: handleQueryChange,
    open: true,
    readOnly,
    required,
    value: currentQuery,
  };
  type UnifiedCommandRootProps = typeof rootProps & {
    children: React.ReactNode;
    items: CommandItems;
  };
  // Base UI supports flat and grouped collections at runtime, while its overloads cannot accept
  // the already-validated union after it crosses the public Command boundary.
  const UnifiedCommandRoot = BaseAutocomplete.Root as React.ComponentType<UnifiedCommandRootProps>;

  const content = (
    <div
      ref={ref}
      className={cn("n-command", className)}
      {...props}
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="command"
    >
      {children}
    </div>
  );

  return (
    <CommandContext.Provider value={context}>
      <UnifiedCommandRoot {...rootProps} items={items}>
        {content}
      </UnifiedCommandRoot>
    </CommandContext.Provider>
  );
});

export interface CommandInputProps extends Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Input>,
  "className"
> {
  className?: string;
}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  function CommandInput({ className, ...props }, ref) {
    return (
      <BaseAutocomplete.InputGroup
        className="n-command__input-group"
        data-slot="command-input-group"
      >
        <span aria-hidden className="n-command__input-icon" data-slot="command-input-icon">
          <Icon icon={Search} />
        </span>
        <BaseAutocomplete.Input
          ref={ref}
          {...props}
          aria-expanded="true"
          className={cn("n-command__input", className)}
          data-slot="command-input"
        />
      </BaseAutocomplete.InputGroup>
    );
  },
);

export interface CommandListProps extends Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.List>,
  "children"
> {
  children: React.ReactNode | ((item: CommandItemData, index: number) => React.ReactNode);
  renderGroupLabel?: (group: CommandGroupData) => React.ReactNode;
}

export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(function CommandList(
  { children, className, renderGroupLabel, ...props },
  ref,
) {
  const { grouped } = useCommandContext();
  const filteredItems = BaseAutocomplete.useFilteredItems<CommandItemData | CommandGroupData>();
  if (typeof children === "function") {
    const renderItem = (item: CommandItemData, index: number) => {
      const renderedItem = children(item, index);
      return React.isValidElement(renderedItem)
        ? React.cloneElement(renderedItem, { key: item.value })
        : renderedItem;
    };

    if (grouped) {
      if (!filteredItems.every(isCommandGroupData)) {
        throw new Error("Command grouped collections must contain group records.");
      }
      const content = filteredItems.map((group) => (
        <CommandGroup key={group.value} items={group.items}>
          <CommandGroupLabel>{renderGroupLabel?.(group) ?? group.label}</CommandGroupLabel>
          <BaseAutocomplete.Collection children={renderItem} />
        </CommandGroup>
      ));

      return (
        <BaseAutocomplete.List
          ref={ref}
          className={cn("n-command__list", className)}
          {...props}
          data-slot="command-list"
        >
          {content}
        </BaseAutocomplete.List>
      );
    }

    if (!filteredItems.every(isCommandItemData)) {
      throw new Error("Command flat collections must contain item records.");
    }

    return (
      <BaseAutocomplete.List
        ref={ref}
        className={cn("n-command__list", className)}
        {...props}
        data-slot="command-list"
        children={renderItem}
      />
    );
  }

  return (
    <BaseAutocomplete.List
      ref={ref}
      className={cn("n-command__list", className)}
      {...props}
      data-slot="command-list"
    >
      {children}
    </BaseAutocomplete.List>
  );
});

export const CommandGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Group>
>(function CommandGroup({ className, ...props }, ref) {
  return (
    <BaseAutocomplete.Group
      ref={ref}
      className={cn("n-command__group", className)}
      {...props}
      data-slot="command-group"
    />
  );
});

export const CommandGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.GroupLabel>
>(function CommandGroupLabel({ className, ...props }, ref) {
  return (
    <BaseAutocomplete.GroupLabel
      ref={ref}
      className={cn("n-command__group-label", className)}
      {...props}
      data-slot="command-group-label"
    />
  );
});

export interface CommandItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Item>,
  "children" | "className" | "onClick" | "onClickCapture" | "onSelect" | "value"
> {
  value: string;
  children: React.ReactNode;
  className?: React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Item>["className"];
  description?: React.ReactNode;
  leading?: React.ReactNode;
  metadata?: React.ReactNode;
  shortcut?: React.ReactNode;
  onSelect?: (value: string, event: CommandSelectEvent) => void;
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  {
    children,
    className,
    description,
    disabled,
    leading,
    metadata,
    onSelect,
    shortcut,
    value,
    ...props
  },
  ref,
) {
  const { disabled: rootDisabled, itemsByValue, readOnly, selectItem } = useCommandContext();
  const item = itemsByValue.get(value);
  if (!item) throw new Error(`CommandItem value "${value}" is missing from Command items.`);
  const isDisabled = disabled ?? item.disabled;
  const hasLeading = leading !== undefined && leading !== null && leading !== false;

  return (
    <BaseAutocomplete.Item
      ref={ref}
      className={(state) => cn("n-command__item", resolveClassName(className, state))}
      disabled={isDisabled}
      onClickCapture={(event) => {
        if (!rootDisabled && !isDisabled && !readOnly) {
          selectItem(item, event);
          onSelect?.(value, event);
        }
      }}
      value={item}
      {...props}
      data-disabled={isDisabled ? "" : undefined}
      data-leading={hasLeading ? "true" : "false"}
      data-slot="command-item"
    >
      {hasLeading ? (
        <span className="n-command__item-leading" data-slot="command-item-leading">
          {leading}
        </span>
      ) : null}
      <span className="n-command__item-content" data-slot="command-item-content">
        <span className="n-command__item-label" data-slot="command-item-label">
          {children}
        </span>
        {description ? (
          <span className="n-command__item-description" data-slot="command-item-description">
            {description}
          </span>
        ) : null}
      </span>
      {metadata ? (
        <span className="n-command__item-metadata" data-slot="command-item-metadata">
          {metadata}
        </span>
      ) : null}
      {shortcut ? (
        <span className="n-command__item-shortcut" data-slot="command-item-shortcut">
          {shortcut}
        </span>
      ) : null}
    </BaseAutocomplete.Item>
  );
});

export const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Separator>
>(function CommandSeparator({ className, ...props }, ref) {
  return (
    <BaseAutocomplete.Separator
      ref={ref}
      className={cn("n-command__separator", className)}
      {...props}
      data-slot="command-separator"
    />
  );
});

export const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Empty>
>(function CommandEmpty({ children = "No results found.", className, ...props }, ref) {
  return (
    <BaseAutocomplete.Empty
      ref={ref}
      className={cn("n-command__empty", className)}
      {...props}
      data-slot="command-empty"
    >
      {children}
    </BaseAutocomplete.Empty>
  );
});

export interface CommandLoadingProps extends Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Status>,
  "children"
> {
  loading?: boolean;
  children?: React.ReactNode;
}

export const CommandLoading = React.forwardRef<HTMLDivElement, CommandLoadingProps>(
  function CommandLoading(
    { children = "Loading results…", className, loading = true, ...props },
    ref,
  ) {
    return (
      <BaseAutocomplete.Status
        ref={ref}
        className={cn("n-command__loading", className)}
        {...props}
        data-loading={loading ? "" : undefined}
        data-slot="command-loading"
      >
        {loading ? (
          <>
            <Spinner decorative size="sm" />
            <span>{children}</span>
          </>
        ) : null}
      </BaseAutocomplete.Status>
    );
  },
);
