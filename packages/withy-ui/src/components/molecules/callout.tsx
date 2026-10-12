import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const calloutVariants = cva("flex gap-3 rounded-sm border border-l-4 px-4 py-3 text-sm", {
  variants: {
    color: {
      primary: "border-y-primary/20 border-r-primary/20 border-l-primary bg-primary/10 text-text",
      success: "border-y-success/20 border-r-success/20 border-l-success bg-success/10 text-text",
      danger: "border-y-danger/20 border-r-danger/20 border-l-danger bg-danger/10 text-text",
      warning: "border-y-warning/40 border-r-warning/40 border-l-warning bg-warning/15 text-text",
      info: "border-y-info/20 border-r-info/20 border-l-info bg-info/10 text-text",
    },
  },
  defaultVariants: { color: "info" },
});

type CalloutProps = React.ComponentProps<"div"> &
  VariantProps<typeof calloutVariants> & {
    title: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
  };

export function Callout({
  className,
  color,
  title,
  icon,
  action,
  children,
  ...props
}: CalloutProps) {
  return (
    <div className={cn(calloutVariants({ color }), className)} {...props}>
      {icon ? <span className="mt-0.5 text-heading [&_svg]:size-4">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-heading">{title}</p>
        {children ? <div className="mt-1 text-[13px] text-text-2">{children}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
