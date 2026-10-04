import { cn } from "@/lib/cn";

export function SproutMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-5", className)} aria-hidden>
      <path d="M12 21.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 13.2c0-4.4 2.7-7.4 7.4-7.7-.6 5.2-3.4 7.7-7.4 7.7Z" fill="currentColor" />
      <path
        d="M12 15.4c0-3.6-2.4-6.2-6.4-6.6.5 4.4 2.8 6.6 6.4 6.6Z"
        fill="currentColor"
        opacity="0.72"
      />
    </svg>
  );
}
