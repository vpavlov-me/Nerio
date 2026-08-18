"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Slider, Tabs, TabsContent, TabsList, TabsPanels, TabsTrigger } from "@nerio-ui/ui/client";
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
          <Slider label="RTL priority" defaultValue={35} />
        </div>
      </PreviewFrame>
    </DirectionProvider>
  );
}
