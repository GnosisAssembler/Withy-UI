import { cn } from "../../lib/cn";
import { padding, type Padding } from "./spacing";

export function Box({
  padding: paddingSize = "none",
  className,
  children,
}: {
  padding?: Padding;
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn(padding[paddingSize], className)}>{children}</div>;
}
