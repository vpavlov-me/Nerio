import * as React from "react";
import { cn } from "../lib/cn";

export type PaginationPage = {
  label: React.ReactNode;
  href?: string;
  current?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
};

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  pages: PaginationPage[];
  previousHref?: string;
  nextHref?: string;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  previousAriaLabel?: string;
  nextAriaLabel?: string;
  "aria-label"?: string;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    "aria-label": ariaLabel = "Pagination",
    className,
    nextAriaLabel = "Go to next page",
    nextHref,
    nextLabel = "Next",
    pages,
    previousAriaLabel = "Go to previous page",
    previousHref,
    previousLabel = "Previous",
    ...props
  },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn("n-pagination", className)}
      data-slot="root"
      {...props}
    >
      <ul className="n-pagination__list" data-slot="list">
        <li data-slot="item">
          <PaginationControl
            aria-label={previousAriaLabel}
            disabled={!previousHref}
            href={previousHref}
            slot="previous"
          >
            {previousLabel}
          </PaginationControl>
        </li>
        {pages.map((page, index) => (
          <li data-slot="item" key={`${index}`}>
            <PaginationControl
              aria-current={page.current ? "page" : undefined}
              aria-label={page["aria-label"]}
              current={page.current}
              disabled={page.disabled}
              href={page.href}
              slot="page"
            >
              {page.label}
            </PaginationControl>
          </li>
        ))}
        <li data-slot="item">
          <PaginationControl
            aria-label={nextAriaLabel}
            disabled={!nextHref}
            href={nextHref}
            slot="next"
          >
            {nextLabel}
          </PaginationControl>
        </li>
      </ul>
    </nav>
  );
});

type PaginationControlProps = {
  children: React.ReactNode;
  current?: boolean;
  disabled?: boolean;
  href?: string;
  slot: "previous" | "page" | "next";
} & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "aria-current" | "aria-label">;

function PaginationControl({
  children,
  current,
  disabled,
  href,
  slot,
  ...props
}: PaginationControlProps) {
  const className = "n-pagination__control";

  if (!href || disabled) {
    return (
      <span
        className={className}
        data-current={current ? "" : undefined}
        data-disabled=""
        data-slot={slot}
        aria-disabled="true"
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      className={className}
      data-current={current ? "" : undefined}
      data-slot={slot}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
}
