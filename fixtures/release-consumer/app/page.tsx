import { themes } from "@nerio/tokens";
import { registry } from "@nerio/registry";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nerio/ui";
import { PackagePreview } from "./package-preview";
import { SourcePreview } from "./source-preview";

export default function Page() {
  return (
    <main>
      <h1>Nerio release consumer</h1>
      <p>
        {themes.length} themes and {registry.length} registry items loaded from package entrypoints.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Server-safe package entrypoint</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Surface</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Static Core</TableCell>
                <TableCell>Ready</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PackagePreview />
      <SourcePreview />
    </main>
  );
}
