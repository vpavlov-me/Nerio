import { MultiSelect, type MultiSelectOption } from "../../src/client";

type Discipline = "design" | "research";

const options = [
  { value: "design", label: "Design systems", textValue: "Design systems" },
  { value: "research", label: "Research", textValue: "Research" },
] satisfies readonly MultiSelectOption<Discipline>[];

const inferred = (
  <MultiSelect
    label="Disciplines"
    onValueChange={(value) => {
      value satisfies Discipline[];
    }}
    options={options}
    value={["design"]}
  />
);

const invalidValue = (
  // @ts-expect-error The controlled values must be inferred option values.
  <MultiSelect label="Disciplines" options={options} value={["writing"]} />
);

const invalidChildren = (
  // @ts-expect-error MultiSelect is deliberately options-only.
  <MultiSelect label="Disciplines" options={options}>
    Unexpected child
  </MultiSelect>
);

void [inferred, invalidValue, invalidChildren];
