import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";

const paginationControlClasses =
  "n-pagination__control inline-flex min-h-(--n-pagination-item-size) min-w-(--n-pagination-item-size) items-center justify-center rounded-(--n-pagination-radius) border-(length:--n-pagination-border-width) border-(--n-pagination-border) bg-(--n-pagination-background) px-(--n-pagination-control-padding-inline) font-(--n-font-weight-medium) text-(--n-color-text-secondary) no-underline hover:bg-(--n-pagination-background-hover) hover:text-(--n-color-text-primary) focus-visible:rounded-(--n-radius-sm) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-current:border-(--n-pagination-border-current) data-current:bg-(--n-pagination-background-current) data-current:font-(--n-font-weight-semibold) data-current:text-(--n-color-text-primary) data-disabled:cursor-not-allowed data-disabled:text-(--n-color-text-disabled) data-disabled:opacity-(--n-opacity-muted) [&:is(button)]:cursor-pointer [&:is(button)]:appearance-none [&:is(button)]:font-inherit forced-colors:border-[CanvasText] forced-colors:data-current:outline-(length:--n-focus-ring-inner-width) forced-colors:data-current:outline-[Highlight] forced-colors:focus-visible:outline-(length:--n-focus-ring-inner-width) forced-colors:focus-visible:outline-offset-(--n-focus-ring-inner-width) forced-colors:focus-visible:outline-[Highlight]";

export type PaginationPage = {
  key: React.Key;
  type?: "page";
  label: React.ReactNode;
  href?: string;
  onSelect?: () => void;
  /** Router link element. `onSelect` takes precedence when both are supplied. */
  render?: React.ReactElement<PaginationRenderProps>;
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

type PaginationRenderProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  "data-current"?: string;
  "data-slot"?: string;
};

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  pages: PaginationItem[];
  previousHref?: string;
  nextHref?: string;
  previousOnSelect?: () => void;
  nextOnSelect?: () => void;
  previousRender?: React.ReactElement<PaginationRenderProps>;
  nextRender?: React.ReactElement<PaginationRenderProps>;
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
      {...props}
      aria-label={ariaLabel}
      className={cn(
        "n-pagination text-(length:--n-font-size-sm) text-(--n-color-text-secondary)",
        className,
      )}
      data-slot="root"
    >
      <ul
        className="n-pagination__list m-0 flex list-none flex-wrap items-center gap-(--n-pagination-gap) p-0"
        data-slot="list"
      >
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
              <span
                className="inline-flex min-h-(--n-pagination-item-size) min-w-(--n-pagination-item-size) items-center justify-center"
                aria-label={page.ariaLabel ?? "More pages"}
                data-slot="ellipsis"
              >
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
  render?: React.ReactElement<PaginationRenderProps>;
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
  const className = cn(paginationControlClasses, motionClasses.hover, motionClasses.focus);

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
      <span
        className={className}
        data-current={current ? "" : undefined}
        data-slot={slot}
        aria-disabled="true"
        data-disabled=""
        {...props}
      >
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
        "data-current": current ? "" : undefined,
        "data-slot": slot,
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
