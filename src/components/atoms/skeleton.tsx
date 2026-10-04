import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "block animate-pulse rounded-sm bg-[color-mix(in_srgb,var(--heading)_14%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn("h-3", index === lines - 1 && lines > 1 && "w-2/3")} />
      ))}
    </span>
  );
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn("size-10 rounded-full", className)} />;
}

export function SkeletonRows({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <span className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} className="flex items-center gap-3">
          <SkeletonAvatar className="size-8" />
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </span>
        </span>
      ))}
    </span>
  );
}
