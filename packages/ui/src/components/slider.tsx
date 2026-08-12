"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { composeRefs } from "../lib/compose-refs";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { resolveClassName } from "../lib/resolve-class-name";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioEventDetails,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";

export type SliderOrientation = "horizontal" | "vertical";

export type SliderChangeEventReason = "input-change" | "track-press" | "drag" | "keyboard" | "none";
export type SliderChangeEventDetails = NerioChangeEventDetails<SliderChangeEventReason> & {
  activeThumbIndex: number;
};
export type SliderCommitEventDetails = NerioEventDetails<SliderChangeEventReason>;

export interface SliderState {
  activeThumbIndex: number;
  disabled: boolean;
  dragging: boolean;
  max: number;
  min: number;
  minStepsBetweenValues: number;
  orientation: SliderOrientation;
  step: number;
  values: readonly number[];
}
type SliderRootProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "aria-label" | "aria-labelledby" | "children" | "className" | "defaultValue" | "style"
> & {
  className?: NerioClassName<SliderState>;
  disabled?: boolean;
  form?: string;
  format?: Intl.NumberFormatOptions;
  largeStep?: number;
  locale?: Intl.LocalesArgument;
  max?: number;
  min?: number;
  name?: string;
  render?: NerioRenderProp<SliderState>;
  step?: number;
  style?: NerioStyle<SliderState>;
};

type SliderVisibleLabel = Exclude<React.ReactNode, boolean | null | undefined>;

type SliderNamingProps =
  | {
      label: SliderVisibleLabel;
      "aria-label"?: never;
      "aria-labelledby"?: never;
    }
  | {
      label?: never;
      "aria-label": string;
      "aria-labelledby"?: never;
    }
  | {
      label?: never;
      "aria-label"?: never;
      "aria-labelledby": string;
    };

export type SliderProps = SliderRootProps &
  SliderNamingProps & {
    /** Current controlled value. Slider intentionally accepts one value, not a range. */
    value?: number;
    /** Initial value for the uncontrolled path. Defaults to min. */
    defaultValue?: number;
    onValueChange?: (value: number, eventDetails: SliderChangeEventDetails) => void;
    onValueCommitted?: (value: number, eventDetails: SliderCommitEventDetails) => void;
    orientation?: SliderOrientation;
    /** Keeps the control focusable and form-associated while preventing value changes. */
    readOnly?: boolean;
    /** Mirrors native range required semantics. A range always has a value, defaulting to min. */
    required?: boolean;
    invalid?: boolean;
    description?: React.ReactNode;
    /** Optional visible value supplied and formatted by the consumer. */
    valueLabel?: React.ReactNode;
    /** Ref to the nested native range input used for focus and form access. */
    inputRef?: React.Ref<HTMLInputElement>;
    /** Localized accessible value text for the single thumb. */
    getAriaValueText?: (formattedValue: string, value: number) => string;
    "aria-valuetext"?: string;
  };

const sliderClasses =
  "n-slider group/slider grid w-full gap-0 text-(--n-color-text-primary) data-[orientation=vertical]:w-max data-[orientation=vertical]:gap-(--n-slider-gap) data-disabled:cursor-not-allowed data-disabled:text-(--n-color-text-disabled) data-readonly:cursor-default";

const sliderControlClasses =
  "n-slider__control relative my-(--n-slider-control-layout-offset) flex h-(--n-slider-control-size) w-full touch-none select-none items-center [--n-slider-control-layout-offset:calc((var(--n-slider-control-size)-var(--n-slider-track-size)-var(--n-slider-gap)-var(--n-slider-gap))*-0.5)] data-[orientation=vertical]:my-0 data-[orientation=vertical]:h-(--n-slider-length) data-[orientation=vertical]:w-(--n-slider-control-size) data-[orientation=vertical]:justify-center data-readonly:touch-auto";

const sliderTrackClasses =
  "n-slider__track relative h-(--n-slider-track-size) w-full overflow-hidden rounded-(--n-slider-track-radius) bg-(--n-slider-track-background) data-[orientation=vertical]:h-full data-[orientation=vertical]:w-(--n-slider-track-size) group-data-disabled/slider:bg-(--n-slider-disabled-track-background) group-data-disabled/slider:opacity-(--n-slider-disabled-opacity) forced-colors:bg-[Canvas] forced-colors:opacity-100 forced-colors:outline forced-colors:outline-1 forced-colors:outline-[CanvasText]";

const sliderIndicatorClasses =
  "n-slider__indicator absolute bg-(--n-slider-indicator-background) data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full group-data-disabled/slider:bg-(--n-slider-disabled-indicator-background) forced-colors:bg-[Highlight]";

const sliderThumbClasses =
  "n-slider__thumb size-(--n-slider-thumb-size) cursor-grab rounded-(--n-slider-thumb-radius) border-(length:--n-slider-thumb-border-width) border-(--n-slider-thumb-border) bg-(--n-slider-thumb-background) shadow-(--n-slider-thumb-shadow) transition-[background-color,border-color,box-shadow] duration-(--n-slider-duration) ease-(--n-slider-easing) hover:border-(--n-slider-thumb-border-hover) has-[:focus-visible]:outline-0 has-[:focus-visible]:shadow-(--n-slider-focus-ring) group-data-dragging/slider:cursor-grabbing group-data-disabled/slider:cursor-not-allowed group-data-disabled/slider:border-(--n-slider-disabled-thumb-border) group-data-disabled/slider:bg-(--n-slider-disabled-thumb-background) group-data-readonly/slider:cursor-default forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:has-[:focus-visible]:outline-2 forced-colors:has-[:focus-visible]:outline-offset-2 forced-colors:has-[:focus-visible]:outline-[Highlight] forced-colors:has-[:focus-visible]:shadow-none motion-reduce:duration-(--n-duration-instant)";

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

function syncNativeInput(
  input: HTMLInputElement,
  {
    id,
    invalid,
    readOnly,
    required,
  }: { id: string; invalid: boolean; readOnly: boolean; required: boolean },
) {
  input.id = id;
  input.readOnly = readOnly;
  input.required = required;
  for (const [attribute, present] of [
    ["aria-readonly", readOnly],
    ["aria-required", required],
    ["aria-invalid", invalid],
  ] as const) {
    if (present) input.setAttribute(attribute, "true");
    else input.removeAttribute(attribute);
  }
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-valuetext": ariaValueText,
    className,
    defaultValue,
    description,
    disabled = false,
    getAriaValueText,
    id,
    inputRef,
    invalid = false,
    label,
    onValueChange,
    onValueCommitted,
    orientation = "horizontal",
    readOnly = false,
    required = false,
    value,
    valueLabel,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const labelId = label === undefined ? undefined : `${inputId}-label`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId);
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const nativeInputRef = React.useRef<HTMLInputElement>(null);
  const mergedInputRef = React.useMemo(
    () =>
      composeRefs(inputRef, nativeInputRef, (node) => {
        if (node) syncNativeInput(node, { id: inputId, invalid: isInvalid, readOnly, required });
      }),
    [inputId, inputRef, isInvalid, readOnly, required],
  );

  React.useLayoutEffect(() => {
    if (nativeInputRef.current) {
      syncNativeInput(nativeInputRef.current, {
        id: inputId,
        invalid: isInvalid,
        readOnly,
        required,
      });
    }
  }, [inputId, isInvalid, readOnly, required]);

  return (
    <BaseSlider.Root<number>
      ref={ref}
      className={(state) => cn(sliderClasses, resolveClassName(className, state))}
      defaultValue={defaultValue}
      disabled={disabled}
      onValueChange={(nextValue, eventDetails) => {
        if (readOnly) {
          eventDetails.cancel();
          return;
        }
        onValueChange?.(nextValue, eventDetails);
      }}
      onValueCommitted={(nextValue, eventDetails) => {
        if (!readOnly) onValueCommitted?.(nextValue, eventDetails);
      }}
      orientation={orientation}
      value={value}
      {...props}
      aria-invalid={isInvalid ? true : ariaInvalid}
      aria-labelledby={labelId ?? ariaLabelledBy}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-required={required ? "" : undefined}
      data-slot="root"
    >
      {label !== undefined || valueLabel !== undefined ? (
        <div
          className="n-slider__header relative z-1 flex items-baseline justify-between gap-(--n-slider-header-gap) data-[orientation=vertical]:w-(--n-slider-header-width)"
          data-orientation={orientation}
          data-slot="header"
        >
          {label !== undefined ? (
            <label
              className="n-slider__label text-(length:--n-slider-label-font-size) font-(--n-slider-label-font-weight) text-(--n-slider-label-color)"
              data-slot="label"
              htmlFor={inputId}
              id={labelId}
            >
              {label}
            </label>
          ) : null}
          {valueLabel !== undefined ? (
            <span
              className="n-slider__value text-(length:--n-slider-value-font-size) text-(--n-slider-value-color)"
              data-slot="value"
            >
              {valueLabel}
            </span>
          ) : null}
        </div>
      ) : null}
      <BaseSlider.Control
        className={cn(sliderControlClasses, motionClasses.control)}
        data-readonly={readOnly ? "" : undefined}
        data-slot="control"
      >
        <BaseSlider.Track className={sliderTrackClasses} data-slot="track">
          <BaseSlider.Indicator className={sliderIndicatorClasses} data-slot="indicator" />
        </BaseSlider.Track>
        <BaseSlider.Thumb
          className={sliderThumbClasses}
          inputRef={mergedInputRef}
          aria-describedby={describedBy}
          aria-label={ariaLabel}
          aria-labelledby={labelId ?? ariaLabelledBy}
          aria-valuetext={ariaValueText}
          getAriaValueText={
            getAriaValueText
              ? (formattedValue, currentValue) => getAriaValueText(formattedValue, currentValue)
              : undefined
          }
          data-slot="thumb"
        />
      </BaseSlider.Control>
      {description ? (
        <p
          className="n-slider__description relative z-1 m-0 text-(length:--n-slider-description-font-size) text-(--n-color-text-tertiary)"
          data-slot="description"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
    </BaseSlider.Root>
  );
});
