"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

type FileInputProps = {
  id?: string;
  accept?: string;
  className?: string;
  onFileChange?: (file: File | undefined) => void;
};

export function FileInput({ id, accept, className, onFileChange }: FileInputProps) {
  const [name, setName] = React.useState<string>();

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-sm border border-dashed border-text-4 bg-card px-3 py-2 text-[13px] text-text-3 transition-colors hover:border-primary",
        className,
      )}
    >
      <span className="truncate">{name ?? "Choose a file"}</span>
      <span className="shrink-0 font-medium text-primary">Browse</span>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setName(file?.name);
          onFileChange?.(file);
        }}
      />
    </label>
  );
}
