"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "@nerio-ui/adapters/icons";
import { composeRefs } from "../lib/compose-refs";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { Button } from "./button";

type CalendarMonth =
  "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";
type CalendarDay =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31";
type CalendarYear = `${number}${number}${number}${number}`;

export type CalendarDate = `${CalendarYear}-${CalendarMonth}-${CalendarDay}`;
export type CalendarFirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarLabels {
  previousMonth: string;
  nextMonth: string;
  selectedDate: string;
}

type CalendarNamingProps =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-label"?: never; "aria-labelledby": string };

type CalendarRootProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "aria-label" | "aria-labelledby" | "children" | "defaultValue" | "dir" | "onChange" | "role"
>;

export type CalendarProps = CalendarRootProps &
  CalendarNamingProps & {
    /** Selected ISO calendar date in YYYY-MM-DD form. */
    value?: CalendarDate;
    /** Initial selected ISO calendar date for the uncontrolled path. */
    defaultValue?: CalendarDate;
    onValueChange?: (value: CalendarDate) => void;
    /** Visible month, expressed as an ISO date and normalized to its first day. */
    month?: CalendarDate;
    /** Initial visible month for the uncontrolled path. */
    defaultMonth?: CalendarDate;
    onMonthChange?: (month: CalendarDate) => void;
    min?: CalendarDate;
    max?: CalendarDate;
    isDateDisabled?: (date: CalendarDate) => boolean;
    locale?: string | string[];
    firstDayOfWeek?: CalendarFirstDayOfWeek;
    /** Stable current date for today styling and deterministic server rendering. */
    today?: CalendarDate;
    labels?: Partial<CalendarLabels>;
    disabled?: boolean;
    readOnly?: boolean;
  };

type DateParts = { year: number; month: number; day: number };

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number) {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function parseDate(value: CalendarDate, name: string): DateParts {
  const match = datePattern.exec(value);
  if (!match) throw new RangeError(`${name} must use the YYYY-MM-DD calendar-date format.`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new RangeError(`${name} must be a valid calendar date.`);
  }
  return { year, month, day };
}

function formatDate({ year, month, day }: DateParts): CalendarDate {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` as CalendarDate;
}

function normalizeMonth(value: CalendarDate, name: string): CalendarDate {
  return formatDate({ ...parseDate(value, name), day: 1 });
}

export function calendarDateToUtcDate(value: CalendarDate) {
  const { year, month, day } = parseDate(value, "date");
  const date = new Date(0);
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

function fromUtcDate(date: Date): CalendarDate {
  if (date.getUTCFullYear() < 1) return "0001-01-01";
  if (date.getUTCFullYear() > 9999) return "9999-12-31";
  return formatDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  });
}

function addDays(value: CalendarDate, amount: number): CalendarDate {
  const date = calendarDateToUtcDate(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return fromUtcDate(date);
}

function addMonths(value: CalendarDate, amount: number): CalendarDate {
  const { year, month, day } = parseDate(value, "date");
  const monthIndex = year * 12 + month - 1 + amount;
  const nextYear = Math.floor(monthIndex / 12);
  if (nextYear < 1) return "0001-01-01";
  if (nextYear > 9999) return "9999-12-31";
  const nextMonth = (((monthIndex % 12) + 12) % 12) + 1;
  return formatDate({
    year: nextYear,
    month: nextMonth,
    day: Math.min(day, daysInMonth(nextYear, nextMonth)),
  });
}

function localToday(): CalendarDate {
  const now = new Date();
  return formatDate({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

function getMonthDates(month: CalendarDate, firstDayOfWeek: CalendarFirstDayOfWeek) {
  const first = normalizeMonth(month, "month");
  const offset = (calendarDateToUtcDate(first).getUTCDay() - firstDayOfWeek + 7) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function isSameMonth(left: CalendarDate, right: CalendarDate) {
  return left.slice(0, 7) === right.slice(0, 7);
}

function isWithinRange(date: CalendarDate, min?: CalendarDate, max?: CalendarDate) {
  return (!min || date >= min) && (!max || date <= max);
}

function findAvailableDate(
  start: CalendarDate,
  step: number,
  isUnavailable: (date: CalendarDate) => boolean,
) {
  let candidate = start;
  for (let index = 0; index < 3660; index += 1) {
    if (!isUnavailable(candidate)) return candidate;
    candidate = addDays(candidate, step);
  }
  return start;
}

const rootClasses =
  "n-calendar box-border w-full max-w-(--n-calendar-width) rounded-(--n-calendar-radius) border-(length:--n-calendar-border-width) border-(--n-calendar-border) bg-(--n-calendar-background) p-(--n-calendar-padding) text-(--n-calendar-foreground)";
const headerClasses = "flex items-center justify-between gap-(--n-calendar-header-gap)";
const headingClasses =
  "m-0 min-w-0 text-center text-(length:--n-calendar-heading-font-size) font-(--n-calendar-heading-font-weight)";
const gridClasses =
  "mt-(--n-calendar-grid-gap) w-full table-fixed border-separate border-spacing-(--n-calendar-cell-gap)";
const weekdayClasses =
  "h-(--n-calendar-cell-size) p-0 text-center text-(length:--n-calendar-weekday-font-size) font-(--n-calendar-weekday-font-weight) text-(--n-calendar-weekday-foreground)";
const dayClasses =
  "size-(--n-calendar-cell-size) rounded-(--n-calendar-day-radius) border-(length:--n-calendar-day-border-width) border-transparent bg-transparent p-0 text-(length:--n-calendar-day-font-size) text-(--n-calendar-day-foreground) transition-[background-color,border-color,color] duration-(--n-calendar-duration) ease-(--n-calendar-easing) [&:hover:not(:disabled):not([aria-disabled=true])]:bg-(--n-calendar-day-background-hover) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-outside-month:text-(--n-calendar-day-foreground-outside) data-today:font-(--n-calendar-today-font-weight) data-today:underline data-today:decoration-(length:--n-calendar-today-underline-width) data-today:underline-offset-(--n-calendar-today-underline-offset) data-selected:border-(--n-calendar-day-border-selected) data-selected:bg-(--n-calendar-day-background-selected) data-selected:text-(--n-calendar-day-foreground-selected) data-unavailable:cursor-not-allowed data-unavailable:text-(--n-calendar-day-foreground-unavailable) data-unavailable:line-through disabled:cursor-not-allowed disabled:opacity-(--n-calendar-disabled-opacity) forced-colors:border-[Canvas] forced-colors:data-selected:border-[Highlight] forced-colors:data-selected:bg-[Highlight] forced-colors:data-selected:text-[HighlightText] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-visible:shadow-none motion-reduce:duration-(--n-duration-instant)";

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    className,
    defaultMonth,
    defaultValue,
    disabled = false,
    firstDayOfWeek = 0,
    isDateDisabled,
    labels,
    locale,
    max,
    min,
    month,
    onMonthChange,
    onValueChange,
    readOnly = false,
    today: todayProp,
    value,
    ...props
  },
  forwardedRef,
) {
  for (const [name, date] of [
    ["value", value],
    ["defaultValue", defaultValue],
    ["month", month],
    ["defaultMonth", defaultMonth],
    ["min", min],
    ["max", max],
    ["today", todayProp],
  ] as const) {
    if (date !== undefined) parseDate(date, name);
  }
  if (min && max && min > max) throw new RangeError("Calendar min must not be after max.");

  const generatedId = React.useId();
  const headingId = `${generatedId}-heading`;
  const [defaultToday] = React.useState(localToday);
  const resolvedToday = todayProp ?? defaultToday;
  const initialMonth = normalizeMonth(
    month ?? defaultMonth ?? value ?? defaultValue ?? resolvedToday,
    "month",
  );
  const [uncontrolledMonth, setUncontrolledMonth] = React.useState(initialMonth);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const visibleMonth = normalizeMonth(month ?? uncontrolledMonth, "month");
  const selectedValue = value ?? uncontrolledValue;
  const isUnavailable = React.useCallback(
    (date: CalendarDate) => !isWithinRange(date, min, max) || Boolean(isDateDisabled?.(date)),
    [isDateDisabled, max, min],
  );
  const dates = React.useMemo(
    () => getMonthDates(visibleMonth, firstDayOfWeek),
    [firstDayOfWeek, visibleMonth],
  );
  const initialFocus = React.useMemo(() => {
    if (selectedValue && dates.includes(selectedValue) && !isUnavailable(selectedValue)) {
      return selectedValue;
    }
    if (dates.includes(resolvedToday) && !isUnavailable(resolvedToday)) return resolvedToday;
    const inMonth = dates.find((date) => isSameMonth(date, visibleMonth) && !isUnavailable(date));
    return inMonth ?? dates.find((date) => !isUnavailable(date)) ?? visibleMonth;
  }, [dates, isUnavailable, resolvedToday, selectedValue, visibleMonth]);
  const [focusedDate, setFocusedDate] = React.useState(initialFocus);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const dayRefs = React.useRef(new Map<CalendarDate, HTMLButtonElement>());
  const shouldRestoreGridFocus = React.useRef(false);

  const mergedRootRef = React.useMemo(() => composeRefs(forwardedRef, rootRef), [forwardedRef]);

  React.useEffect(() => {
    if (!dates.includes(focusedDate) || isUnavailable(focusedDate)) setFocusedDate(initialFocus);
  }, [dates, focusedDate, initialFocus, isUnavailable]);

  React.useLayoutEffect(() => {
    if (shouldRestoreGridFocus.current) {
      dayRefs.current.get(focusedDate)?.focus();
      shouldRestoreGridFocus.current = false;
    }
  }, [focusedDate, visibleMonth]);

  const monthFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }),
    [locale],
  );
  const weekdayShortFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }),
    [locale],
  );
  const weekdayLongFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }),
    [locale],
  );
  const dateFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    [locale],
  );

  const setVisibleMonth = React.useCallback(
    (nextMonth: CalendarDate) => {
      const normalized = normalizeMonth(nextMonth, "month");
      if (month === undefined) setUncontrolledMonth(normalized);
      onMonthChange?.(normalized);
    },
    [month, onMonthChange],
  );

  const moveFocus = React.useCallback(
    (nextDate: CalendarDate, step: number) => {
      const boundedDate = min && nextDate < min ? min : max && nextDate > max ? max : nextDate;
      const searchStep = boundedDate !== nextDate ? (boundedDate === min ? 1 : -1) : step;
      const available = findAvailableDate(boundedDate, searchStep, isUnavailable);
      shouldRestoreGridFocus.current = true;
      setFocusedDate(available);
      if (!isSameMonth(available, visibleMonth)) setVisibleMonth(available);
    },
    [isUnavailable, max, min, setVisibleMonth, visibleMonth],
  );

  const selectDate = React.useCallback(
    (nextValue: CalendarDate) => {
      if (disabled || readOnly || isUnavailable(nextValue)) return;
      if (value === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
      if (!isSameMonth(nextValue, visibleMonth)) setVisibleMonth(nextValue);
    },
    [disabled, isUnavailable, onValueChange, readOnly, setVisibleMonth, value, visibleMonth],
  );

  const weekdayDates = Array.from({ length: 7 }, (_, index) =>
    addDays("2026-01-04", (firstDayOfWeek + index) % 7),
  );
  const monthLabel = monthFormatter.format(calendarDateToUtcDate(visibleMonth));
  const previousMonthLabel = labels?.previousMonth ?? "Previous month";
  const nextMonthLabel = labels?.nextMonth ?? "Next month";
  const selectedDateLabel = labels?.selectedDate ?? "Selected";
  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);
  const canVisitPrevious = !min || addMonths(visibleMonth, -1).slice(0, 7) >= min.slice(0, 7);
  const canVisitNext = !max || addMonths(visibleMonth, 1).slice(0, 7) <= max.slice(0, 7);

  return (
    <div
      ref={mergedRootRef}
      {...props}
      className={cn(rootClasses, className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      data-disabled={disabled ? "" : undefined}
      data-month={visibleMonth}
      data-readonly={readOnly ? "" : undefined}
      data-slot="root"
      role="group"
    >
      <div className={headerClasses} data-slot="header">
        <Button
          aria-label={previousMonthLabel}
          className="rtl:[&_.n-icon]:rotate-180"
          data-slot="previous-month"
          disabled={disabled || !canVisitPrevious}
          icon={ChevronLeft}
          onClick={() => setVisibleMonth(previousMonth)}
          size="sm"
          type="button"
          variant="ghost"
        />
        <h2 aria-live="polite" className={headingClasses} data-slot="heading" id={headingId}>
          {monthLabel}
        </h2>
        <Button
          aria-label={nextMonthLabel}
          className="rtl:[&_.n-icon]:rotate-180"
          data-slot="next-month"
          disabled={disabled || !canVisitNext}
          icon={ChevronRight}
          onClick={() => setVisibleMonth(nextMonth)}
          size="sm"
          type="button"
          variant="ghost"
        />
      </div>
      <table
        aria-labelledby={headingId}
        aria-readonly={readOnly || undefined}
        className={gridClasses}
        data-slot="grid"
        role="grid"
      >
        <thead data-slot="weekday-header">
          <tr data-slot="weekday-row">
            {weekdayDates.map((date) => {
              const nativeDate = calendarDateToUtcDate(date);
              const longLabel = weekdayLongFormatter.format(nativeDate);
              return (
                <th
                  abbr={longLabel}
                  className={weekdayClasses}
                  data-slot="weekday"
                  key={date}
                  scope="col"
                >
                  {weekdayShortFormatter.format(nativeDate)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody data-slot="body">
          {Array.from({ length: 6 }, (_, rowIndex) => (
            <tr data-slot="row" key={dates[rowIndex * 7]}>
              {dates.slice(rowIndex * 7, rowIndex * 7 + 7).map((date) => {
                const { day } = parseDate(date, "date");
                const unavailable = isUnavailable(date);
                const selected = selectedValue === date;
                const outsideMonth = !isSameMonth(date, visibleMonth);
                return (
                  <td
                    aria-selected={selected || undefined}
                    data-slot="cell"
                    key={date}
                    role="gridcell"
                  >
                    <button
                      ref={(node) => {
                        if (node) dayRefs.current.set(date, node);
                        else dayRefs.current.delete(date);
                      }}
                      aria-current={date === resolvedToday ? "date" : undefined}
                      aria-disabled={unavailable || undefined}
                      aria-label={`${dateFormatter.format(calendarDateToUtcDate(date))}${
                        selected ? `, ${selectedDateLabel}` : ""
                      }`}
                      className={dayClasses}
                      data-outside-month={outsideMonth ? "" : undefined}
                      data-selected={selected ? "" : undefined}
                      data-slot="day"
                      data-today={date === resolvedToday ? "" : undefined}
                      data-unavailable={unavailable ? "" : undefined}
                      data-value={date}
                      disabled={disabled}
                      onClick={() => selectDate(date)}
                      onFocus={() => setFocusedDate(date)}
                      onKeyDown={(event) => {
                        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
                        let nextDate: CalendarDate | undefined;
                        let step = 1;
                        switch (event.key) {
                          case "ArrowLeft":
                            step = rtl ? 1 : -1;
                            nextDate = addDays(date, step);
                            break;
                          case "ArrowRight":
                            step = rtl ? -1 : 1;
                            nextDate = addDays(date, step);
                            break;
                          case "ArrowUp":
                            step = -1;
                            nextDate = addDays(date, -7);
                            break;
                          case "ArrowDown":
                            nextDate = addDays(date, 7);
                            break;
                          case "Home": {
                            step = -1;
                            const weekday = calendarDateToUtcDate(date).getUTCDay();
                            nextDate = addDays(date, -((weekday - firstDayOfWeek + 7) % 7));
                            break;
                          }
                          case "End": {
                            const weekday = calendarDateToUtcDate(date).getUTCDay();
                            nextDate = addDays(date, 6 - ((weekday - firstDayOfWeek + 7) % 7));
                            break;
                          }
                          case "PageUp":
                            step = -1;
                            nextDate = addMonths(date, event.shiftKey ? -12 : -1);
                            break;
                          case "PageDown":
                            nextDate = addMonths(date, event.shiftKey ? 12 : 1);
                            break;
                          case " ":
                          case "Enter":
                            event.preventDefault();
                            selectDate(date);
                            return;
                          default:
                            return;
                        }
                        event.preventDefault();
                        moveFocus(nextDate, step);
                      }}
                      tabIndex={date === focusedDate && !disabled ? 0 : -1}
                      type="button"
                    >
                      {day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
