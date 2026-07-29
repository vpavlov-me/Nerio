"use client";

import * as React from "react";
import { Calendar, type CalendarDate } from "@nerio-ui/ui/client";

export function CalendarPreview() {
  const [date, setDate] = React.useState<CalendarDate>("2026-06-15");

  return (
    <section id="preview" className="component-example" aria-label="Calendar examples">
      <div className="component-example__preview component-lab-card-grid">
        <div className="component-lab-stack">
          <h3>Interactive with constraints</h3>
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
        <div className="component-lab-stack">
          <h3>Disabled</h3>
          <Calendar
            aria-label="Disabled release calendar"
            defaultValue="2026-06-15"
            disabled
            today="2026-06-15"
          />
        </div>
        <div className="component-lab-stack" dir="rtl" lang="ar">
          <h3>للقراءة فقط</h3>
          <Calendar
            aria-label="تقويم الإصدار للقراءة فقط"
            defaultValue="2026-06-15"
            firstDayOfWeek={6}
            labels={{
              previousMonth: "الشهر السابق",
              nextMonth: "الشهر التالي",
              selectedDate: "التاريخ المحدد",
            }}
            locale="ar"
            readOnly
            today="2026-06-15"
          />
        </div>
      </div>
    </section>
  );
}
