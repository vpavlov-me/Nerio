import type * as React from "react";

export type NerioChangeEventDetails<
  Reason extends string,
  CustomProperties extends object = object,
> = {
  reason: Reason;
  event: Event;
  trigger: Element | undefined;
  cancel: () => void;
  allowPropagation: () => void;
  readonly isCanceled: boolean;
  readonly isPropagationAllowed: boolean;
} & CustomProperties;

export type NerioEventDetails<Reason extends string, CustomProperties extends object = object> = {
  reason: Reason;
  event: Event;
} & CustomProperties;

export type NerioClassName<State> = string | ((state: State) => string | undefined);
export type NerioStyle<State> =
  React.CSSProperties | ((state: State) => React.CSSProperties | undefined);
export type NerioRenderProps = React.HTMLAttributes<HTMLElement> & {
  disabled?: boolean;
  ref?: React.Ref<HTMLElement>;
  type?: "button" | "reset" | "submit";
};
export type NerioRenderProp<State> =
  React.ReactElement | ((props: NerioRenderProps, state: State) => React.ReactElement);
