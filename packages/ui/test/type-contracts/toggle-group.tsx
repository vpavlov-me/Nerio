import { Bell } from "@nerio-ui/adapters/icons";
import { ToggleGroup, ToggleGroupItem } from "../../src/client";

void (
  <ToggleGroup
    aria-label="Text alignment"
    defaultValue={["left"]}
    onValueChange={(value, details) => {
      value satisfies string[];
      details.cancel();
    }}
  >
    <ToggleGroupItem value="left">Left</ToggleGroupItem>
    <ToggleGroupItem icon={Bell} aria-label="Follow updates" value="follow" />
  </ToggleGroup>
);

void (
  <ToggleGroup
    aria-labelledby="layers-label"
    multiple
    options={[
      { value: "grid", label: "Grid" },
      { value: "alerts", icon: Bell, "aria-label": "Alerts" },
    ]}
  />
);

// @ts-expect-error ToggleGroup requires an accessible group name.
void (<ToggleGroup options={[{ value: "grid", label: "Grid" }]} />);

// @ts-expect-error Icon-only options require an accessible name.
void (<ToggleGroup aria-label="Layers" options={[{ value: "alerts", icon: Bell }]} />);

// @ts-expect-error ToggleGroup owns pressed values as string arrays.
void (<ToggleGroup aria-label="Alignment" value="left" options={[]} />);

void (
  (
    // @ts-expect-error Composed ToggleGroup items require a string selection value.
    <ToggleGroupItem>Left</ToggleGroupItem>
  )
);
