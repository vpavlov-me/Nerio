import { SearchField } from "../../src/client";

void (
  <SearchField
    label="Search projects"
    defaultValue="Nerio"
    onValueChange={(value, details) => {
      value.toUpperCase();
      details.reason satisfies "input" | "clear";
    }}
    onSearch={(value, details) => {
      value.toUpperCase();
      details.reason satisfies "enter";
    }}
  />
);

// @ts-expect-error SearchField fixes native search semantics.
void (<SearchField label="Search projects" type="email" />);

// @ts-expect-error SearchField uses onValueChange instead of a parallel native change contract.
void (<SearchField label="Search projects" onChange={() => undefined} />);
