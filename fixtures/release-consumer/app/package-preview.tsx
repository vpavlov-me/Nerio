"use client";

import { Settings } from "@nerio/adapters/icons";
import {
  Button,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ToastProvider,
  ToastViewport,
} from "@nerio/ui/client";

export function PackagePreview() {
  return (
    <ToastProvider>
      <section aria-labelledby="package-preview-title">
        <h2 id="package-preview-title">Client package entrypoint</h2>
        <Button icon={Settings} aria-label="Package settings" />
        <Select
          label="Theme"
          defaultValue="purple"
          options={[{ label: "Purple", value: "purple" }]}
        />
        <Sheet>
          <SheetTrigger>Open package sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Package sheet</SheetTitle>
              <SheetDescription>Installed from a tarball.</SheetDescription>
            </SheetHeader>
            <SheetBody>Package client entrypoint is available.</SheetBody>
          </SheetContent>
        </Sheet>
      </section>
      <ToastViewport />
    </ToastProvider>
  );
}
