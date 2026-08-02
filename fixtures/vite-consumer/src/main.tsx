import * as React from "react";
import { createRoot } from "react-dom/client";
import { Calendar, DatePicker, type CalendarDate } from "@nerio-ui/ui/client";
import { Settings } from "@nerio-ui/adapters/icons";
import {
  Alert,
  Button,
  Checkbox,
  Field,
  Input,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Toast,
  ToastProvider,
  ToastViewport,
} from "@nerio-ui/ui/client";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@nerio-ui/ui";
import "./styles.css";

function App() {
  const [date, setDate] = React.useState<CalendarDate>("2026-08-02");

  return (
    <ToastProvider>
      <main className="mx-auto grid max-w-3xl gap-6 p-8">
        <h1 className="text-2xl font-semibold">Nerio Vite consumer</h1>
        <Card>
          <CardHeader>
            <CardTitle>Static package entrypoint</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge tone="success">Packed artifacts</Badge>
          </CardContent>
        </Card>
        <section className="grid gap-4" aria-label="Client and form controls">
          <Button leadingIcon={Settings}>Workspace settings</Button>
          <Field label="Project name">
            <Input defaultValue="Vite consumer" />
          </Field>
          <label className="inline-flex items-center gap-2">
            <Checkbox defaultChecked />
            Include source evidence
          </label>
          <Select
            label="Status"
            defaultValue="ready"
            options={[{ label: "Ready", value: "ready" }]}
          />
        </section>
        <section className="grid gap-4" aria-label="Date controls">
          <Calendar
            aria-label="Release date"
            value={date}
            month="2026-08-01"
            today="2026-08-02"
            onValueChange={setDate}
          />
          <DatePicker
            aria-label="Release date picker"
            value={date}
            today="2026-08-02"
            onValueChange={(value) => value && setDate(value)}
          />
        </section>
        <Alert tone="info" title="Independent consumer">
          Vite compiled static, client, form, overlay, feedback, and date imports.
        </Alert>
        <Sheet>
          <SheetTrigger>Open packed overlay</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Vite overlay</SheetTitle>
              <SheetDescription>Built without workspace aliases.</SheetDescription>
            </SheetHeader>
            <SheetBody>Public package boundaries remain complete.</SheetBody>
          </SheetContent>
        </Sheet>
        <Toast title="Vite feedback" description="Feedback components compiled from tarballs." />
      </main>
      <ToastViewport />
    </ToastProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
