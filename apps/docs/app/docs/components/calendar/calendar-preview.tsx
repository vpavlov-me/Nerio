"use client";

import * as React from "react";
import { Calendar, type CalendarDate } from "@nerio-ui/ui/client";

export function CalendarPreview() {
  const [date, setDate] = React.useState<CalendarDate>("2026-06-15");

  return (
    <section id="preview" className="component-example" aria-label="Calendar examples">
      <div className="component-example__preview form-preview-stack">
        <Calendar
          aria-label="Release date"
          value={date}
          onValueChange={setDate}
          min="2026-06-08"
          max="2026-07-24"
          isDateDisabled={(candidate) => candidate === "2026-06-18"}
          firstDayOfWeek={1}
          today="2026-06-15"
        />
        <p aria-live="polite">Selected date: {date}</p>
      </div>
    </section>
  );
}
