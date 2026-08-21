"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Field,
  Input,
} from "@nerio-ui/ui/client";
import { PreviewFrame, type PreviewProps } from "./shared";

export function AlertDialogPreview({ kind, snippet }: PreviewProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const projectName = "Nerio";
  const [confirmation, setConfirmation] = React.useState("");
  const isConfirmed = confirmation === projectName;

  if (kind === "alert-dialog") {
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

  return (
    <PreviewFrame kind={kind} snippet={snippet}>
      <AlertDialog onOpenChange={(open) => !open && setConfirmation("")}>
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
            <AlertDialogBody>
              <Field
                label={`Type “${projectName}” to confirm`}
                description="The project name is case-sensitive."
              >
                <Input
                  autoComplete="off"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                />
              </Field>
            </AlertDialogBody>
            <AlertDialogFooter>
              <AlertDialogCancel
                ref={cancelRef}
                render={<Button variant="secondary">Cancel</Button>}
              />
              <AlertDialogAction
                disabled={!isConfirmed}
                render={<Button variant="danger">Delete project</Button>}
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </PreviewFrame>
  );
}
