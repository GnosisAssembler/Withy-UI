"use client";

import * as React from "react";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/cn";

type FileUploaderProps = {
  id?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: File[]) => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploader({
  id,
  accept,
  multiple = true,
  className,
  onFilesChange,
}: FileUploaderProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function update(next: File[]) {
    setFiles(next);
    onFilesChange?.(next);
  }

  function add(list: FileList | null) {
    if (!list?.length) return;
    const incoming = [...list];
    update(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          add(event.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center gap-2 rounded-sm border border-dashed border-text-4 bg-card px-4 py-6 text-center text-[13px] text-text-3 transition-colors hover:border-primary",
          dragging && "border-primary bg-primary/5",
        )}
      >
        <FileUp className="size-5 text-primary" />
        <span>
          Drop files here or <span className="font-medium text-primary">browse</span>
        </span>
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          add(event.target.files);
          event.target.value = "";
        }}
      />
      {files.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-sm border border-border px-3 py-2 text-[13px]"
            >
              <span className="min-w-0">
                <span className="block truncate text-heading">{file.name}</span>
                <span className="text-text-3">{formatSize(file.size)}</span>
              </span>
              <Button
                type="button"
                icon
                size="xs"
                color="white"
                aria-label={`Remove ${file.name}`}
                onClick={() => update(files.filter((_, item) => item !== index))}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
