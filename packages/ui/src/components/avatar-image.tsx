"use client";

import * as React from "react";

export interface AvatarImageProps {
  accessibleName: string;
  decorative: boolean;
  fallback?: React.ReactNode;
  initials: string;
  src: string;
}

export function AvatarImage({
  accessibleName,
  decorative,
  fallback,
  initials,
  src,
}: AvatarImageProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  if (!imageFailed) {
    return (
      <img
        src={src}
        alt={decorative ? "" : accessibleName}
        data-slot="image"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span
      data-slot="fallback"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": accessibleName })}
    >
      {fallback ?? initials}
    </span>
  );
}
