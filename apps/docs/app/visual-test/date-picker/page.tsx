"use client";

import * as React from "react";
import { Field } from "@nerio-ui/ui";
import { Button, DatePicker, type CalendarDate } from "@nerio-ui/ui/client";

export default function DatePickerTestPage() {
  const [date, setDate] = React.useState<CalendarDate | null>("2026-06-15");
  const [requiredDate, setRequiredDate] = React.useState<CalendarDate | null>(null);
  const [submittedPayload, setSubmittedPayload] = React.useState<string | null>(null);
  const requiredDateInvalid = requiredDate === null;

  return (
    <main className="visual-test-fixture">
      <form
        className="form-preview-stack"
        aria-label="DatePicker form example"
        onSubmit={(event) => {
          event.preventDefault();
          const entries = Array.from(
            new FormData(event.currentTarget).entries(),
            ([key, value]) => [key, typeof value === "string" ? value : value.name],
          );
          setSubmittedPayload(JSON.stringify(Object.fromEntries(entries)));
        }}
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
        <Field
          label="Invalid required date"
          message={requiredDateInvalid ? "Choose a date before submitting." : undefined}
          invalid={requiredDateInvalid}
        >
          <DatePicker
            name="invalidDate"
            onValueChange={setRequiredDate}
            required
            invalid={requiredDateInvalid}
            today="2026-06-15"
            value={requiredDate}
          />
        </Field>
        <Field label="Read-only date">
          <DatePicker name="readOnlyDate" value="2026-06-22" readOnly />
        </Field>
        <p aria-live="polite">Form value: {date ?? "empty"}</p>
        <Button type="submit">Submit dates</Button>
        <output aria-live="polite">
          Submitted form data: {submittedPayload ?? "not submitted"}
        </output>
      </form>
    </main>
  );
}
