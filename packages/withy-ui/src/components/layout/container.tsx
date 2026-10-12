import { cn } from "../../lib/cn";

const widths = {
  fluid: "w-full",
  wide: "mx-auto w-full max-w-[1280px]",
  narrow: "mx-auto w-full max-w-[768px]",
} as const;

export type ContainerWidth = keyof typeof widths;

export function Container({
  width = "wide",
  className,
  children,
}: {
  width?: ContainerWidth;
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn(widths[width], className)}>{children}</div>;
}
