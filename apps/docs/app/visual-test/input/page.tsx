"use client";

import { Button, Input, Label } from "@nerio-ui/ui/client";

export default function InputTestPage() {
  return (
    <main className="visual-test-fixture">
      <form className="form-preview-stack" aria-label="Native temporal input examples">
        <div className="docs-input-grid">
          <Label htmlFor="input-test-start-date">Start date</Label>
          <Input
            id="input-test-start-date"
            name="startDate"
            type="date"
            min="2026-01-01"
            max="2026-12-31"
            step={1}
            defaultValue="2026-07-22"
            required
          />
          <Label htmlFor="input-test-billing-month">Billing month</Label>
          <Input
            id="input-test-billing-month"
            name="billingMonth"
            type="month"
            defaultValue="2026-07"
          />
          <Label htmlFor="input-test-reporting-week">Reporting week</Label>
          <Input
            id="input-test-reporting-week"
            name="reportingWeek"
            type="week"
            defaultValue="2026-W30"
          />
          <Label htmlFor="input-test-start-time">Start time</Label>
          <Input
            id="input-test-start-time"
            name="startTime"
            type="time"
            step={900}
            defaultValue="09:30"
          />
          <Label htmlFor="input-test-local-deadline">Local deadline</Label>
          <Input
            id="input-test-local-deadline"
            name="localDeadline"
            type="datetime-local"
            defaultValue="2026-07-22T17:30"
            readOnly
          />
        </div>
        <div className="component-lab-inline">
          <Button type="submit">Submit temporal values</Button>
          <Button type="reset" variant="outline">
            Reset temporal values
          </Button>
        </div>
      </form>
    </main>
  );
}
