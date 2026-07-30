"use client";

import { Calendar, type CalendarDate } from "@nerio-ui/ui/client";
import * as React from "react";

export default function CalendarTestPage() {
  const [date, setDate] = React.useState<CalendarDate>("2026-06-15");

  return (
    <main className="visual-test-fixture">
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
      <Calendar
        aria-label="Disabled release calendar"
        defaultValue="2026-06-15"
        disabled
        today="2026-06-15"
      />
      <div dir="rtl" lang="fr">
        <Calendar
          aria-label="Calendrier de publication en lecture seule"
          defaultValue="2026-06-15"
          firstDayOfWeek={1}
          labels={{
            previousMonth: "Mois précédent",
            nextMonth: "Mois suivant",
            selectedDate: "Date sélectionnée",
          }}
          locale="fr-FR"
          readOnly
          today="2026-06-15"
        />
      </div>
    </main>
  );
}
