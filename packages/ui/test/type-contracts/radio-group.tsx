import { RadioGroup, RadioGroupItem } from "../../src/components/radio-group";

const optionsUsage = <RadioGroup label="Visibility" options={[{ label: "Team", value: "team" }]} />;

const compositionUsage = (
  <RadioGroup label="Visibility" onValueChange={(value) => value.toUpperCase()}>
    <RadioGroupItem value="team">Team</RadioGroupItem>
  </RadioGroup>
);

const compatibilityCallbacks = (
  <RadioGroup
    label="Visibility"
    onChange={(value) => value.toUpperCase()}
    onValueChange={(value) => value.toUpperCase()}
    options={[{ label: "Team", value: "team" }]}
  />
);

const invalidMixedUsage = (
  // @ts-expect-error RadioGroup accepts either data-driven options or children, not both.
  <RadioGroup label="Visibility" options={[{ label: "Team", value: "team" }]}>
    <RadioGroupItem value="private">Private</RadioGroupItem>
  </RadioGroup>
);

void [optionsUsage, compositionUsage, compatibilityCallbacks, invalidMixedUsage];
