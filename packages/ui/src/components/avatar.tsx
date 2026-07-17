import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

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
      className={cn(
        "n-avatar inline-flex size-(--n-avatar-size-md) items-center justify-center overflow-hidden rounded-(--n-avatar-radius) border-(length:--n-avatar-border-width) border-(--n-avatar-border) bg-(--n-avatar-background) text-(length:--n-font-size-xs) font-(--n-font-weight-semibold) text-(--n-avatar-foreground) data-[size=sm]:size-(--n-avatar-size-sm) data-[size=sm]:text-(length:--n-avatar-font-size-sm) data-[size=lg]:size-(--n-avatar-size-lg) data-[size=lg]:text-(length:--n-avatar-font-size-lg) [&_img]:size-full [&_img]:object-cover forced-colors:border-[CanvasText]",
        className,
      )}
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
