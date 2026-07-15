"use client";

import { Settings } from "@nerio-ui/adapters/icons";
import { Button, Select } from "@nerio-ui/ui/client";

export function ClientPreview() {
  return (
    <section>
      <Button icon={Settings} aria-label="Workspace settings" />
      <Select
        label="Theme"
        defaultValue="purple"
        options={[{ label: "Purple", value: "purple" }]}
      />
    </section>
  );
}
