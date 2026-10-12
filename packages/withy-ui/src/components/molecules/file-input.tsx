"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";

type FileInputProps = {
  id?: string;
  accept?: string;
  className?: string;
  onFileChange?: (file: File | undefined) => void;
};

export function FileInput({ id, accept, className, onFileChange }: FileInputProps) {
  const [name, setName] = React.useState<string>();
  const control = useFieldControl({ id });

  return (
    <label
      htmlFor={control.id}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-sm border border-dashed border-text-4 bg-card px-3 py-2 text-[13px] text-text-3 transition-colors hover:border-primary has-[:focus-visible]:border-primary has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/25",
        className,
      )}
    >
      <span className="truncate">{name ?? "Choose a file"}</span>
      <span className="shrink-0 font-medium text-primary">Browse</span>
      <input
        {...control}
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
