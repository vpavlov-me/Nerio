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
  const normalizedName = name.trim().replace(/\s+/g, " ");
  const initials =
    normalizedName
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
      <AvatarContent
        key={src ?? "fallback"}
        alt={alt}
        decorative={decorative}
        fallback={fallback}
        initials={initials}
        normalizedName={normalizedName}
        src={src}
      />
    </span>
  );
});

type AvatarContentProps = Pick<AvatarProps, "alt" | "decorative" | "fallback" | "src"> & {
  initials: string;
  normalizedName: string;
};

function AvatarContent({
  alt,
  decorative,
  fallback,
  initials,
  normalizedName,
  src,
}: AvatarContentProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  if (src && !imageFailed) {
    return (
      <img
        src={src}
        alt={decorative ? "" : (alt ?? normalizedName)}
        data-slot="image"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span
      data-slot="fallback"
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": (alt ?? normalizedName) || "Avatar" })}
    >
      {fallback ?? initials}
    </span>
  );
}
