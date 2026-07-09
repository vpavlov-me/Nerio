import * as React from "react";
import { cn } from "../lib/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, name, src, ...props },
  ref,
) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span ref={ref} className={cn("n-avatar", className)} data-slot="root" {...props}>
      {src ? (
        <img src={src} alt={name} data-slot="image" />
      ) : (
        <span data-slot="fallback">{initials}</span>
      )}
    </span>
  );
});
