import * as React from "react";
import { cn } from "../lib/cn";

export type ListItem = {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  href?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export interface ListProps extends Omit<
  React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
  "children"
> {
  items: ListItem[];
  ordered?: boolean;
}

export const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(function List(
  { className, items, ordered = false, ...props },
  ref,
) {
  const Root = ordered ? "ol" : "ul";
  const setRef = (node: HTMLUListElement | HTMLOListElement | null) => {
    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  return (
    <Root ref={setRef} className={cn("n-list", className)} data-slot="root" {...props}>
      {items.map((item, index) => {
        const body = (
          <>
            {item.leading ? (
              <span className="n-list__leading" data-slot="leading">
                {item.leading}
              </span>
            ) : null}
            <span className="n-list__content" data-slot="content">
              <span className="n-list__title" data-slot="title">
                {item.title}
              </span>
              {item.description ? (
                <span className="n-list__description" data-slot="description">
                  {item.description}
                </span>
              ) : null}
            </span>
            {item.meta || item.trailing ? (
              <span className="n-list__trailing" data-slot="trailing">
                {item.meta ? (
                  <span className="n-list__meta" data-slot="meta">
                    {item.meta}
                  </span>
                ) : null}
                {item.trailing}
              </span>
            ) : null}
          </>
        );

        return (
          <li className="n-list__item" data-slot="item" key={`${index}`}>
            {item.href ? (
              <a className="n-list__link" data-slot="link" href={item.href}>
                {body}
              </a>
            ) : (
              <span className="n-list__body" data-slot="body">
                {body}
              </span>
            )}
          </li>
        );
      })}
    </Root>
  );
});
