import { CheckboxGroup, CheckboxGroupItem } from "../../src/client";

void (
  <CheckboxGroup
    defaultValue={["email"]}
    label="Notifications"
    onValueChange={(value) => value.map((item) => item.toUpperCase())}
    options={[{ value: "email", label: "Email", description: "Weekly summary" }]}
  />
);

void (
  <CheckboxGroup label="Notifications" value={["email"]}>
    <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
  </CheckboxGroup>
);

// @ts-expect-error CheckboxGroup requires a visible group label.
void (<CheckboxGroup options={[]} />);

void (
  (
    // @ts-expect-error CheckboxGroup accepts either options or composed items, not both.
    <CheckboxGroup label="Notifications" options={[]}>
      <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
    </CheckboxGroup>
  )
);

// @ts-expect-error CheckboxGroup owns selected values as string arrays.
void (<CheckboxGroup label="Notifications" options={[]} value="email" />);

void (
  <CheckboxGroup label="Notifications">
    {/* @ts-expect-error CheckboxGroupItem requires a string selection value. */}
    <CheckboxGroupItem>Email</CheckboxGroupItem>
  </CheckboxGroup>
);

void (
  <CheckboxGroup form="preferences" label="Notifications" name="notifications">
    {/* @ts-expect-error CheckboxGroup owns shared item form metadata. */}
    <CheckboxGroupItem form="other-form" value="email">
      Email
    </CheckboxGroupItem>
    {/* @ts-expect-error CheckboxGroup owns the shared submitted field name. */}
    <CheckboxGroupItem name="other-name" value="sms">
      SMS
    </CheckboxGroupItem>
    {/* @ts-expect-error CheckboxGroup owns the group-level required constraint. */}
    <CheckboxGroupItem required value="push">
      Push
    </CheckboxGroupItem>
  </CheckboxGroup>
);
