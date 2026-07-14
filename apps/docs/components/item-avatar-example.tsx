"use client";

import { ChevronDown } from "@nerio/adapters/icons";
import {
  Avatar,
  Badge,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@nerio/ui";
import { Button } from "@nerio/ui/client";

export function ItemAvatarExample() {
  return (
    <Item>
      <ItemMedia>
        <Avatar name="Maya Chen" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Maya Chen</ItemTitle>
        <ItemDescription>Product designer · Last active today</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge>Owner</Badge>
        <Button
          icon={ChevronDown}
          aria-label="More actions for Maya Chen"
          size="sm"
          variant="ghost"
        />
      </ItemActions>
    </Item>
  );
}
