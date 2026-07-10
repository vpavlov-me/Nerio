import * as React from "react";
import { cn } from "../lib/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string;
  alt?: string;
  decorative?: boolean;
  fallback?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { alt, className, decorative = false, fallback, name, size = "md", src, ...props },
  ref,
) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const normalizedName = name.trim().replace(/\s+/g, " ");
  const initials = normalizedName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <span
      ref={ref}
      className={cn("n-avatar", className)}
      data-slot="root"
      data-size={size}
      {...props}
    >
      {src && !imageFailed ? (
        <img
          src={src}
          alt={decorative ? "" : (alt ?? normalizedName)}
          data-slot="image"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span data-slot="fallback" aria-hidden={decorative ? true : undefined}>
          {fallback ?? initials}
        </span>
      )}
    </span>
  );
});
