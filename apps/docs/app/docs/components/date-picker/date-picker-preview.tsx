"use client";

import * as React from "react";
import { Field } from "@nerio-ui/ui";
import { Button, DatePicker, type CalendarDate } from "@nerio-ui/ui/client";

export function DatePickerPreview() {
  const [date, setDate] = React.useState<CalendarDate | null>("2026-06-15");

  return (
    <section id="preview" className="component-example" aria-label="DatePicker examples">
      <form
        className="component-example__preview form-preview-stack"
        aria-label="DatePicker form example"
        onSubmit={(event) => event.preventDefault()}
      >
        <Field label="Release date" description="Choose one timezone-independent calendar date.">
          <DatePicker
            clearable
            firstDayOfWeek={1}
            isDateDisabled={(candidate) => candidate === "2026-06-18"}
            max="2026-07-24"
            min="2026-06-08"
            name="releaseDate"
            onValueChange={setDate}
            required
            today="2026-06-15"
            value={date}
          />
        </Field>
        <Field label="Invalid required date" message="Choose a date before submitting." invalid>
          <DatePicker name="invalidDate" required invalid />
        </Field>
        <Field label="Read-only date">
          <DatePicker name="readOnlyDate" value="2026-06-22" readOnly />
        </Field>
        <p aria-live="polite">Form value: {date ?? "empty"}</p>
        <Button type="submit">Submit dates</Button>
      </form>
    </section>
  );
}
