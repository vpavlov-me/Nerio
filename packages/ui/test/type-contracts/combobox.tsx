import { Combobox, ComboboxItem, type ComboboxOption } from "../../src/client";

type City = "paris" | "tbilisi";

const cityOptions = [
  { value: "paris", label: "Paris", textValue: "Paris" },
  { value: "tbilisi", label: "Tbilisi", textValue: "Tbilisi" },
] satisfies readonly ComboboxOption<City>[];

const inferredOptions = (
  <Combobox
    label="City"
    onValueChange={(value) => {
      value satisfies City | null;
    }}
    options={cityOptions}
    value="paris"
  />
);

const composed = (
  <Combobox<City> items={cityOptions} label="City">
    <ComboboxItem value="paris">Paris</ComboboxItem>
    <ComboboxItem value="tbilisi">Tbilisi</ComboboxItem>
  </Combobox>
);

const invalidValue = (
  // @ts-expect-error The controlled value must be one of the inferred option values.
  <Combobox label="City" options={cityOptions} value="london" />
);

const invalidMixedMode = (
  // @ts-expect-error Combobox accepts options or composed items, not both.
  <Combobox items={cityOptions} label="City" options={cityOptions}>
    <ComboboxItem value="paris">Paris</ComboboxItem>
  </Combobox>
);

void [inferredOptions, composed, invalidValue, invalidMixedMode];
