import { cn } from "../../lib/cn";

const tones = {
  primary: "text-primary",
  muted: "text-text-3",
  heading: "text-heading",
} as const;

type EyebrowProps = React.ComponentProps<"p"> & {
  as?: "p" | "span" | "h2" | "h3" | "h4" | "h5" | "h6";
  tone?: keyof typeof tones;
};

export function Eyebrow({ as: Tag = "p", tone = "primary", className, ...props }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "font-inter text-[10px] leading-normal font-semibold tracking-[0.5px] uppercase",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
