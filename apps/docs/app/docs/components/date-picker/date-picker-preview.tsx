"use client";

import { Field } from "@nerio-ui/ui";
import { DatePicker } from "@nerio-ui/ui/client";

export function DatePickerPreview() {
  return (
    <section className="component-example" aria-label="DatePicker preview">
      <form className="component-example__preview" aria-label="DatePicker form example">
        <Field label="Release date">
          <DatePicker
            clearable
            defaultValue="2026-06-15"
            firstDayOfWeek={1}
            isDateDisabled={(candidate) => candidate === "2026-06-18"}
            max="2026-07-24"
            min="2026-06-08"
            name="releaseDate"
            required
            today="2026-06-15"
          />
        </Field>
      </form>
    </section>
  );
}
