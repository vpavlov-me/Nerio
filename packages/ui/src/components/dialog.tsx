"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Button } from "./button";
import { cn } from "../lib/cn";

export interface DialogProps {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ trigger, title, description, children, className }: DialogProps) {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger
        render={React.isValidElement(trigger) ? trigger : <Button>{trigger}</Button>}
      />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="n-backdrop" data-slot="backdrop" />
        <BaseDialog.Popup className={cn("n-dialog", className)} data-slot="content">
          <header className="n-dialog__header" data-slot="header">
            <div className="n-dialog__heading" data-slot="heading">
              <BaseDialog.Title className="n-dialog__title" data-slot="title">
                {title}
              </BaseDialog.Title>
              {description ? (
                <BaseDialog.Description className="n-dialog__description" data-slot="description">
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
            <BaseDialog.Close className="n-dialog__close" aria-label="Close dialog">
              x
            </BaseDialog.Close>
          </header>
          <div className="n-dialog__body" data-slot="body">
            {children}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
