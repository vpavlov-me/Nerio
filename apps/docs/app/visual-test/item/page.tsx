import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@nerio-ui/ui";

export default function ItemTestPage() {
  return (
    <main className="visual-test-fixture">
      <ItemGroup aria-label="Workspace resources" className="m-0 list-none p-0" render={<ul />}>
        <Item render={<li />}>
          <ItemContent>
            <ItemTitle>Design system</ItemTitle>
            <ItemDescription>Shared components and usage guidance.</ItemDescription>
          </ItemContent>
        </Item>
        <Item render={<li />}>
          <ItemContent>
            <ItemTitle>Release checklist</ItemTitle>
            <ItemDescription>Verification steps for the next candidate.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </main>
  );
}
