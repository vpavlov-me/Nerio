import * as React from "react";

export const RouterLinkFixture = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function RouterLinkFixture({ href, ...props }, ref) {
  return <a ref={ref} {...props} data-router-path={href} href={href} />;
});
