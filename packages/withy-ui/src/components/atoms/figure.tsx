import { cn } from "../../lib/cn";

const sizes = {
  sm: "text-[13px]",
  md: "text-[1.53125rem] leading-none",
  lg: "text-[2.1875rem] leading-none",
} as const;

type FigureProps = React.ComponentProps<"p"> & {
  as?: "p" | "span";
  size?: keyof typeof sizes;
};

export function Figure({ as: Tag = "p", size = "md", className, ...props }: FigureProps) {
  return (
    <Tag
      className={cn("font-rubik font-normal text-heading tabular-nums", sizes[size], className)}
      {...props}
    />
  );
}
