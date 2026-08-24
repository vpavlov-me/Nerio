"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";
import { SidebarInset } from "@nerio-ui/ui";
import {
  Sidebar,
  SidebarProvider,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsPanels,
  TabsTrigger,
  ToggleGroup,
} from "@nerio-ui/ui/client";
import { PreviewFrame } from "./doc-page-previews/shared";

export function LocalizationPreview({ snippet }: { snippet: string }) {
  return (
    <DirectionProvider direction="rtl">
      <PreviewFrame kind="RTL direction" snippet={snippet}>
        <div className="form-preview-stack w-full" dir="rtl" data-direction-fixture="rtl">
          <Tabs defaultValue="overview">
            <TabsList aria-label="RTL workspace sections">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsPanels>
              <TabsContent value="overview">Overview content</TabsContent>
              <TabsContent value="details">Details content</TabsContent>
            </TabsPanels>
          </Tabs>
          <ToggleGroup
            aria-label="RTL text alignment"
            defaultValue={["right"]}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
          />
          <Slider label="RTL priority" defaultValue={35} />
          {(["left", "right"] as const).map((side) => (
            <SidebarProvider
              key={side}
              className="h-20 min-h-0 overflow-hidden rounded-(--n-radius-overlay) border border-(--n-color-border-default)"
              data-physical-side={side}
              side={side}
            >
              <Sidebar
                aria-label={`${side} inherited direction sidebar`}
                className="h-20 min-h-0 w-20 basis-20"
              />
              <SidebarInset as="div" className="flex items-center justify-center p-2">
                {side} content
              </SidebarInset>
            </SidebarProvider>
          ))}
        </div>
      </PreviewFrame>
    </DirectionProvider>
  );
}
