import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

export type KbdProps = React.HTMLAttributes<HTMLElement> & {
  "data-slot"?: string;
};

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, ...props },
  ref,
) {
  return (
    <kbd
      ref={ref}
      className={cn(
        "n-kbd inline-block whitespace-nowrap rounded-(--n-kbd-radius) border-(length:--n-kbd-border-width) border-(--n-kbd-border-color) bg-(--n-kbd-background) px-(--n-kbd-padding-inline) py-(--n-kbd-padding-block) align-baseline font-(family-name:--n-kbd-font-family) text-(length:--n-kbd-font-size) leading-none font-(--n-kbd-font-weight) text-(--n-kbd-foreground) forced-colors:border-[CanvasText]",
        className,
      )}
      data-slot="kbd"
      {...props}
    />
  );
});
