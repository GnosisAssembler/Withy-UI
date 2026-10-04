import { cn } from "@/lib/cn";

type InputGroupProps = {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const addon =
  "inline-flex items-center border border-text-4 bg-muted px-2.5 text-[13px] text-text-3";

export function InputGroup({ prefix, suffix, children, className }: InputGroupProps) {
  return (
    <div className={cn("flex items-stretch", className)}>
      {prefix ? <span className={cn(addon, "rounded-l-sm border-r-0")}>{prefix}</span> : null}
      <div
        className={cn(
          "min-w-0 flex-1",
          prefix && "[&_input]:rounded-l-none",
          suffix && "[&_input]:rounded-r-none",
        )}
      >
        {children}
      </div>
      {suffix ? <span className={cn(addon, "rounded-r-sm border-l-0")}>{suffix}</span> : null}
    </div>
  );
}
