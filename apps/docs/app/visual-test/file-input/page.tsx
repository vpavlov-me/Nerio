"use client";

import { Button, Field, FileInput } from "@nerio-ui/ui/client";

export default function FileInputTestPage() {
  return (
    <main className="visual-test-fixture">
      <form className="form-preview-stack" aria-label="Native file input examples">
        <Field label="Primary attachment" description="Choose one PDF or image file.">
          <FileInput name="primaryAttachment" accept=".pdf,image/*" required />
        </Field>
        <Field label="Captured attachments" description="Choose one or more images.">
          <FileInput name="attachments" accept="image/*" capture="environment" multiple />
        </Field>
        <Field label="Unavailable attachment">
          <FileInput disabled />
        </Field>
        <Button type="reset" variant="outline">
          Reset file inputs
        </Button>
      </form>
    </main>
  );
}
