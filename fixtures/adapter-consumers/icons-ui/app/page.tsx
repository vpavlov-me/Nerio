import { Check } from "@nerio/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio/ui";
import { ClientPreview } from "./client-preview";

export default function Page() {
  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Isolated icons and UI consumer</CardTitle>
        </CardHeader>
        <CardContent>
          <Icon icon={Check} decorative={false} label="Available" />
        </CardContent>
      </Card>
      <ClientPreview />
    </main>
  );
}
