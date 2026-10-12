import { cn } from "../../lib/cn";

const styles = {
  1: "text-[2.1875rem]",
  2: "text-[1.75rem]",
  3: "text-[1.53125rem]",
  4: "text-[1.3125rem] tracking-[-0.5px]",
  5: "text-[1.09375rem]",
  6: "text-sm",
} as const;

type HeadingLevel = keyof typeof styles;

type HeadingProps = React.ComponentProps<"h1"> & {
  level?: HeadingLevel;
  size?: HeadingLevel;
};

export function Heading({ level = 4, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as "h1";
  return <Tag className={cn("text-heading", styles[size ?? level], className)} {...props} />;
}
