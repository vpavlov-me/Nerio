import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";

export type FileInputSize = "sm" | "md" | "lg";

export interface FileInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "children" | "defaultValue" | "readOnly" | "size" | "type" | "value"
> {
  size?: FileInputSize;
  invalid?: boolean;
}

const fileInputBaseClasses =
  "n-file-input box-border w-full min-w-0 cursor-pointer rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) pe-(--n-input-padding-inline) text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) file:me-(--n-file-input-button-gap) file:cursor-pointer file:border-0 file:border-e-(length:--n-input-border-width) file:border-e-(--n-file-input-button-border) file:bg-(--n-file-input-button-background) file:px-(--n-file-input-button-padding-inline) file:text-(length:--n-input-font-size) file:font-(--n-input-font-weight) file:text-(--n-file-input-button-foreground) [&:hover:not(:disabled)]:border-(--n-input-border-hover) [&:hover:not(:disabled)]:bg-(--n-input-background-hover) hover:file:bg-(--n-file-input-button-background-hover) focus-visible:border-(--n-input-border-focus) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) disabled:cursor-not-allowed disabled:bg-(--n-input-disabled-background) disabled:text-(--n-input-disabled-foreground) disabled:opacity-(--n-input-disabled-opacity) disabled:file:cursor-not-allowed disabled:file:bg-(--n-file-input-button-disabled-background) disabled:file:text-(--n-file-input-button-disabled-foreground) data-invalid:border-(--n-input-border-danger) aria-invalid:border-(--n-input-border-danger) forced-colors:border-[CanvasText] forced-colors:file:border-e-[CanvasText] forced-colors:file:bg-[ButtonFace] forced-colors:file:text-[ButtonText] forced-colors:data-invalid:border-[Mark]";

const fileInputSizeClasses: Record<FileInputSize, string> = {
  sm: "min-h-(--n-input-height-sm) file:min-h-[calc(var(--n-input-height-sm)-2*var(--n-input-border-width))]",
  md: "min-h-(--n-input-height-md) file:min-h-[calc(var(--n-input-height-md)-2*var(--n-input-border-width))]",
  lg: "min-h-(--n-input-height-lg) file:min-h-[calc(var(--n-input-height-lg)-2*var(--n-input-border-width))]",
};

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { "aria-invalid": ariaInvalid, className, disabled, invalid, multiple, size = "md", ...props },
  ref,
) {
  const isInvalid = invalid === true || ariaInvalid === true || ariaInvalid === "true";

  return (
    <input
      ref={ref}
      {...props}
      aria-invalid={invalid ? true : ariaInvalid}
      className={cn(
        fileInputBaseClasses,
        fileInputSizeClasses[size],
        motionClasses.control,
        className,
      )}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-multiple={multiple ? "" : undefined}
      data-size={size}
      data-slot="file-input"
      disabled={disabled}
      multiple={multiple}
      type="file"
    />
  );
});
