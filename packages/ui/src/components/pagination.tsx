import * as React from "react";
import { cn } from "../lib/cn";

export type PaginationPage = {
  key: React.Key;
  type?: "page";
  label: React.ReactNode;
  href?: string;
  onSelect?: () => void;
  /** Router link element. `onSelect` takes precedence when both are supplied. */
  render?: React.ReactElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
  current?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  /** @deprecated Use ariaLabel. Removed in the next major version. */
  "aria-label"?: string;
};

export type PaginationEllipsis = {
  key: React.Key;
  type: "ellipsis";
  ariaLabel?: string;
};

export type PaginationItem = PaginationPage | PaginationEllipsis;

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  pages: PaginationItem[];
  previousHref?: string;
  nextHref?: string;
  previousOnSelect?: () => void;
  nextOnSelect?: () => void;
  previousRender?: React.ReactElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
  nextRender?: React.ReactElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
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
    nextOnSelect,
    nextRender,
    nextLabel = "Next",
    pages,
    previousAriaLabel = "Go to previous page",
    previousHref,
    previousOnSelect,
    previousRender,
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
            disabled={!previousHref && !previousOnSelect}
            href={previousHref}
            onSelect={previousOnSelect}
            render={previousRender}
            slot="previous"
          >
            {previousLabel}
          </PaginationControl>
        </li>
        {pages.map((page) =>
          page.type === "ellipsis" ? (
            <li data-slot="item" key={page.key}>
              <span aria-label={page.ariaLabel ?? "More pages"} data-slot="ellipsis">
                …
              </span>
            </li>
          ) : (
            <li data-slot="item" key={page.key}>
              <PaginationControl
                aria-current={page.current ? "page" : undefined}
                aria-label={page.ariaLabel ?? page["aria-label"]}
                current={page.current}
                disabled={page.disabled}
                href={page.href}
                onSelect={page.onSelect}
                render={page.render}
                slot="page"
              >
                {page.label}
              </PaginationControl>
            </li>
          ),
        )}
        <li data-slot="item">
          <PaginationControl
            aria-label={nextAriaLabel}
            disabled={!nextHref && !nextOnSelect}
            href={nextHref}
            onSelect={nextOnSelect}
            render={nextRender}
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
  onSelect?: () => void;
  render?: React.ReactElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
  slot: "previous" | "page" | "next";
} & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "aria-current" | "aria-label">;

function PaginationControl({
  children,
  current,
  disabled,
  href,
  onSelect,
  render,
  slot,
  ...props
}: PaginationControlProps) {
  const className = "n-pagination__control";

  if (disabled) {
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

  if (onSelect) {
    return (
      <button
        className={className}
        data-current={current ? "" : undefined}
        data-slot={slot}
        type="button"
        onClick={onSelect}
        {...props}
      >
        {children}
      </button>
    );
  }

  if (!href) {
    return (
      <span className={className} data-slot={slot} aria-disabled="true" data-disabled="" {...props}>
        {children}
      </span>
    );
  }

  if (render) {
    return React.cloneElement(
      render,
      {
        ...props,
        className: cn(className, render.props.className),
        href,
      },
      children,
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
