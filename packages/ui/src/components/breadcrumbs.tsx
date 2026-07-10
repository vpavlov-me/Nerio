import * as React from "react";
import { cn } from "../lib/cn";

export type BreadcrumbsItem = {
  label: React.ReactNode;
  href?: string;
  current?: boolean;
};

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbsItem[];
  "aria-label"?: string;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { "aria-label": ariaLabel = "Breadcrumb", className, items, ...props },
  ref,
) {
  const hasExplicitCurrent = items.some((item) => item.current);

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn("n-breadcrumbs", className)}
      data-slot="root"
      {...props}
    >
      <ol className="n-breadcrumbs__list" data-slot="list">
        {items.map((item, index) => {
          const isCurrent = hasExplicitCurrent ? item.current === true : index === items.length - 1;
          const content =
            item.href && !isCurrent ? (
              <a className="n-breadcrumbs__link" data-slot="link" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span
                className="n-breadcrumbs__current"
                data-slot="current"
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.label}
              </span>
            );

          return (
            <li className="n-breadcrumbs__item" data-slot="item" key={`${index}`}>
              {index > 0 ? (
                <span className="n-breadcrumbs__separator" data-slot="separator" aria-hidden>
                  /
                </span>
              ) : null}
              {content}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
