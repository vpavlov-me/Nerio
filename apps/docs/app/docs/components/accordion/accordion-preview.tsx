"use client";

import { ChevronDown } from "@nerio-ui/adapters/icons";
import { Icon } from "@nerio-ui/ui";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

const usage = `import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@nerio-ui/ui/client";

<Accordion defaultValue={["billing"]}>
  <AccordionItem value="billing">
    <AccordionHeader>
      <AccordionTrigger>How does billing work?</AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>Plans renew monthly unless cancelled.</AccordionPanel>
  </AccordionItem>
  <AccordionItem value="members">
    <AccordionHeader>
      <AccordionTrigger>Can I invite collaborators?</AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>Workspace owners can invite and remove members.</AccordionPanel>
  </AccordionItem>
</Accordion>`;

const items = [
  ["billing", "How does billing work?", "Plans renew monthly unless cancelled."],
  ["members", "Can I invite collaborators?", "Workspace owners can invite and remove members."],
  ["export", "Can I export my data?", "Workspace data can be exported from organization settings."],
] as const;

export function AccordionPreview() {
  return (
    <section className="component-example" aria-label="Accordion example">
      <div className="component-example__preview disclosure-doc-preview">
        <Accordion defaultValue={["billing"]}>
          {items.map(([value, label, content]) => (
            <AccordionItem key={value} value={value}>
              <AccordionHeader>
                <AccordionTrigger>
                  {label}
                  <Icon aria-hidden className="disclosure-doc-indicator" icon={ChevronDown} />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>{content}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <CodeExample
        className="component-example__code"
        code={usage}
        label="Accordion example code"
      />
    </section>
  );
}
