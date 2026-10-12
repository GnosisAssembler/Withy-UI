"use client";

import * as React from "react";
import { File, FileUp, X } from "lucide-react";
import { Button } from "../atoms/button";
import { Progress } from "../atoms/progress";
import { Spinner } from "../atoms/spinner";
import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";

type FileUploaderProps = {
  id?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: File[]) => void;
};

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  startedAt: number;
  duration: number;
};

const TICK_MS = 50;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uploadDuration(bytes: number) {
  const estimate = Math.min(2200, Math.max(1200, Math.round(bytes / 800)));
  return Math.ceil(estimate / TICK_MS) * TICK_MS;
}

export function FileUploader({
  id,
  accept,
  multiple = true,
  className,
  onFilesChange,
}: FileUploaderProps) {
  const control = useFieldControl({ id });
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const nextId = React.useRef(0);
  const onFilesChangeRef = React.useRef(onFilesChange);
  const reportedKey = React.useRef<string | null>(null);
  const pending = items.some((item) => item.progress < 100);

  React.useEffect(() => {
    onFilesChangeRef.current = onFilesChange;
  }, [onFilesChange]);

  React.useEffect(() => {
    if (!pending) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setItems((current) => {
        let changed = false;
        const next = current.map((item) => {
          if (item.progress >= 100) return item;
          const progress = Math.min(100, ((now - item.startedAt) / item.duration) * 100);
          if (progress === item.progress) return item;
          changed = true;
          return { ...item, progress };
        });
        return changed ? next : current;
      });
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [pending]);

  React.useEffect(() => {
    const ready = items.filter((item) => item.progress >= 100);
    const key = ready.map((item) => item.id).join("\0");
    if (reportedKey.current === null) {
      reportedKey.current = key;
      return;
    }
    if (reportedKey.current === key) return;
    reportedKey.current = key;
    onFilesChangeRef.current?.(ready.map((item) => item.file));
  }, [items]);

  function add(list: FileList | null) {
    if (!list?.length) return;
    const incoming = [...list].map((file) => {
      nextId.current += 1;
      return {
        id: String(nextId.current),
        file,
        progress: 0,
        startedAt: Date.now(),
        duration: uploadDuration(file.size),
      };
    });
    setItems((current) => (multiple ? [...current, ...incoming] : incoming.slice(0, 1)));
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
        {...control}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          add(event.target.files);
          event.target.value = "";
        }}
      />
      {items.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((item) => {
            const uploading = item.progress < 100;
            return (
              <li
                key={item.id}
                aria-busy={uploading}
                className="flex flex-col gap-2 rounded-sm border border-border px-3 py-2 text-[13px]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    {uploading ? (
                      <Spinner size="sm" label={`Uploading ${item.file.name}`} />
                    ) : (
                      <File className="size-4 shrink-0 text-text-3" aria-hidden />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-heading">{item.file.name}</span>
                      <span className="text-text-3">
                        {formatSize(item.file.size)}
                        {uploading ? " · Uploading" : null}
                      </span>
                    </span>
                  </span>
                  <Button
                    type="button"
                    icon
                    size="xs"
                    color="white"
                    aria-label={`Remove ${item.file.name}`}
                    onClick={() =>
                      setItems((current) => current.filter((entry) => entry.id !== item.id))
                    }
                  >
                    <X />
                  </Button>
                </div>
                {uploading ? (
                  <Progress
                    value={item.progress}
                    animation="stripes"
                    aria-label={`Uploading ${item.file.name}`}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
