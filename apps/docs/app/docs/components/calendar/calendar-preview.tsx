"use client";

import { Calendar } from "@nerio-ui/ui/client";

export function CalendarPreview() {
  return (
    <section className="component-example" aria-label="Calendar preview">
      <div className="component-example__preview">
        <Calendar
          aria-label="Release date"
          defaultValue="2026-06-15"
          min="2026-06-08"
          max="2026-07-24"
          isDateDisabled={(candidate) => candidate === "2026-06-18"}
          firstDayOfWeek={1}
          today="2026-06-15"
        />
      </div>
    </section>
  );
}
