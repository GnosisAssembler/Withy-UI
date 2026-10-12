import { cn } from "../../lib/cn";
import { gaps, type Gap } from "./spacing";

const alignItems = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

type FlowProps = {
  gap?: Gap;
  align?: keyof typeof alignItems;
  className?: string;
  children?: React.ReactNode;
};

export function Stack({ gap = "sm", align = "stretch", className, children }: FlowProps) {
  return (
    <div className={cn("flex flex-col", gaps[gap], alignItems[align], className)}>{children}</div>
  );
}

export function Row({
  gap = "sm",
  align = "center",
  wrap = true,
  className,
  children,
}: FlowProps & { wrap?: boolean }) {
  return (
    <div className={cn("flex", wrap && "flex-wrap", gaps[gap], alignItems[align], className)}>
      {children}
    </div>
  );
}

export function Rows({ gap = "md", className, children }: Omit<FlowProps, "align">) {
  return <div className={cn("flex w-full flex-col", gaps[gap], className)}>{children}</div>;
}
