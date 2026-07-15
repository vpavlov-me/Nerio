"use client";

import { Settings } from "@nerio-ui/adapters/icons";
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
  Toast,
  ToastProvider,
  ToastViewport,
} from "@nerio-ui/ui/client";

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
        <Toast title="Package toast" description="Client feedback API compiled from a tarball." />
      </section>
      <ToastViewport />
    </ToastProvider>
  );
}
