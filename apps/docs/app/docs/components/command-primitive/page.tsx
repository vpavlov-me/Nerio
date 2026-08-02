import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { CommandPreview } from "./command-preview";

const commandDoc = getComponentDoc("command-primitive")!;

export default function Page() {
  return (
    <StandardDocPage
      title="Command Primitive"
      lede={commandDoc.description}
      kind="command-primitive"
      preview={<CommandPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Mode", "Contract"]}
            rows={[
              [
                "Local",
                "Locale-aware matching uses label, value, and keywords; selection writes only the visible label.",
              ],
              [
                "Consumer-filtered",
                "filter={false}; consumers replace items during loading or remote work.",
              ],
              [
                "Grouped",
                "Labelled group records preserve stable leaf values and listbox semantics.",
              ],
              ["Overlay", "The same inline primitive composes inside Popover, Dialog, or Sheet."],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Purpose"]}
            rows={[
              ["command", "Inline Base UI Autocomplete root."],
              ["command-input", "Required named combobox input; DOM focus remains here."],
              ["command-list", "Filtered listbox and grouped result renderer."],
              ["command-group / command-group-label", "Accessible labelled result group."],
              ["command-item", "Stable action value with optional content slots."],
              [
                "command-item-leading",
                "General React content that owns its semantics; decorative Nerio Icons hide themselves.",
              ],
              [
                "command-empty / command-loading",
                "Dedicated polite status regions outside listbox children.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable
            headers={["State", "Behavior"]}
            rows={[
              ["Active", "aria-activedescendant tracks the keyboard or pointer-highlighted item."],
              ["Disabled", "Visible but skipped during keyboard navigation and never selected."],
              ["Empty", "One concise polite message after filtering."],
              [
                "Loading",
                "A single Spinner and localized polite status for consumer-owned async work.",
              ],
              ["IME composition", "Enter does not select until composition finishes."],
            ]}
            codeColumns={1}
          />
        ),
        api: (
          <DocumentationTable
            headers={["API", "Purpose"]}
            rows={[
              [
                "items",
                "Flat CommandItemData or labelled CommandGroupData records with stable values.",
              ],
              [
                "query / defaultQuery / onQueryChange",
                "Controlled or uncontrolled visible query; selection writes the item label only.",
              ],
              [
                "filter",
                "Typed matcher over leaf items; default search includes label, value, and keywords, or false preserves external results.",
              ],
              [
                "onActiveValueChange",
                "Reports stable highlighted values without exposing internal indices.",
              ],
              [
                "CommandItem.onSelect",
                "Emits the stable value and event while the visible query remains label-only.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use for local commands and compact action pickers; compose icons, descriptions,
                metadata, and Kbd.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Turn Core Command into GlobalSearch, Documentation Search, a routed palette, remote
                ranking, history, or global shortcut registration.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
