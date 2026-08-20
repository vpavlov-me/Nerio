"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBackdrop,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@nerio-ui/ui/client";
import { PreviewFrame, type PreviewProps } from "./shared";

export function AlertDialogPreview({ kind, snippet }: PreviewProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <PreviewFrame kind={kind} snippet={snippet}>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="danger">Delete project</Button>} />
        <AlertDialogPortal>
          <AlertDialogBackdrop />
          <AlertDialogContent initialFocus={cancelRef}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the project and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                ref={cancelRef}
                render={<Button variant="secondary">Cancel</Button>}
              />
              <AlertDialogAction render={<Button variant="danger">Delete project</Button>} />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </PreviewFrame>
  );
}
