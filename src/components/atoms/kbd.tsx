import { cn } from "@/lib/cn";

export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-xs border border-border bg-gray-50 px-1.5 py-0.5 font-inter text-[10px] font-medium text-text-3",
        className,
      )}
      {...props}
    />
  );
}
