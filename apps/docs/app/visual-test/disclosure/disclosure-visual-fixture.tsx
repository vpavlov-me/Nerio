"use client";

import { ChevronDown } from "@nerio-ui/adapters/icons";
import { Icon } from "@nerio-ui/ui";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@nerio-ui/ui/client";

function Indicator() {
  return <Icon aria-hidden className="disclosure-doc-indicator" icon={ChevronDown} />;
}

export function DisclosureVisualFixture() {
  return (
    <main className="disclosure-visual-fixture" data-visual-test-ready="true">
      <section>
        <h1>Disclosure primitives</h1>
        <p>Independent and grouped disclosure states at comfortable density.</p>
      </section>

      <section className="disclosure-visual-grid">
        <div>
          <h2>Collapsible</h2>
          <Collapsible defaultOpen>
            <CollapsibleTrigger>
              Recovery keys
              <Indicator />
            </CollapsibleTrigger>
            <CollapsiblePanel>
              Generate a new recovery set before revoking the current keys. Store the replacement
              outside this workspace so account access does not depend on one device.
            </CollapsiblePanel>
          </Collapsible>
          <Collapsible disabled>
            <CollapsibleTrigger>
              Managed by your organization
              <Indicator />
            </CollapsibleTrigger>
            <CollapsiblePanel>Only an organization owner can change this policy.</CollapsiblePanel>
          </Collapsible>
        </div>

        <div>
          <h2>Accordion</h2>
          <Accordion defaultValue={["billing", "advanced"]} multiple>
            <AccordionItem value="billing">
              <AccordionHeader>
                <AccordionTrigger>
                  How does billing work?
                  <Indicator />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>Plans renew monthly unless they are cancelled.</AccordionPanel>
            </AccordionItem>
            <AccordionItem value="members">
              <AccordionHeader>
                <AccordionTrigger>
                  Can I invite collaborators?
                  <Indicator />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>Workspace owners can invite and remove members.</AccordionPanel>
            </AccordionItem>
            <AccordionItem value="advanced">
              <AccordionHeader>
                <AccordionTrigger>
                  Advanced controls
                  <Indicator />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>
                <Collapsible defaultOpen>
                  <CollapsibleTrigger>
                    Export retention policy
                    <Indicator />
                  </CollapsibleTrigger>
                  <CollapsiblePanel>
                    Exported archives remain available for thirty days.
                  </CollapsiblePanel>
                </Collapsible>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem disabled value="enterprise">
              <AccordionHeader>
                <AccordionTrigger>
                  Enterprise controls
                  <Indicator />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>Contact an organization owner.</AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
