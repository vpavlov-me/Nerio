import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";

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
      {...props}
      aria-label={ariaLabel}
      className={cn(
        "n-breadcrumbs text-(length:--n-font-size-sm) text-(--n-color-text-secondary)",
        className,
      )}
      data-slot="root"
    >
      <ol
        className="n-breadcrumbs__list m-0 flex list-none flex-wrap items-center gap-(--n-breadcrumbs-gap) p-0"
        data-slot="list"
      >
        {items.map((item, index) => {
          const isCurrent = hasExplicitCurrent ? item.current === true : index === items.length - 1;
          const content =
            item.href && !isCurrent ? (
              <a
                className={cn(
                  "n-breadcrumbs__link text-(--n-link-color-muted) no-underline hover:text-(--n-link-color) hover:underline hover:decoration-(--n-link-underline-thickness) hover:underline-offset-(--n-link-underline-offset) focus-visible:rounded-(--n-radius-sm) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring)",
                  motionClasses.hover,
                )}
                data-slot="link"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span
                className="n-breadcrumbs__current font-(--n-font-weight-medium) text-(--n-color-text-primary)"
                data-slot="current"
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.label}
              </span>
            );

          return (
            <li
              className="n-breadcrumbs__item inline-flex min-w-0 items-center gap-(--n-breadcrumbs-gap)"
              data-slot="item"
              key={`${index}`}
            >
              {index > 0 ? (
                <span
                  className="n-breadcrumbs__separator text-(--n-breadcrumbs-separator-color)"
                  data-slot="separator"
                  aria-hidden
                >
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
