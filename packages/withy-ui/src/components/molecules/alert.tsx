import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Icon } from "../atoms/icon";
import { cn } from "../../lib/cn";

const alertVariants = cva("flex items-start gap-3 rounded-sm border px-4 py-3 text-sm", {
  variants: {
    color: {
      primary: "border-primary/20 bg-primary/10 text-text",
      success: "border-success/20 bg-success/10 text-text",
      danger: "border-danger/20 bg-danger/10 text-text",
      warning: "border-warning/40 bg-warning/15 text-text",
      info: "border-info/20 bg-info/10 text-text",
    },
  },
  defaultVariants: { color: "primary" },
});

type AlertColor = NonNullable<VariantProps<typeof alertVariants>["color"]>;

const alertIcons: Record<AlertColor, { icon: LucideIcon; tone: string }> = {
  primary: { icon: Info, tone: "text-primary" },
  success: { icon: CircleCheck, tone: "text-success" },
  danger: { icon: CircleAlert, tone: "text-danger" },
  warning: { icon: TriangleAlert, tone: "text-warning" },
  info: { icon: Info, tone: "text-info" },
};

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    title?: string;
    actions?: React.ReactNode;
  };

export function Alert({ className, color, title, actions, children, ...props }: AlertProps) {
  const mark = alertIcons[color ?? "primary"];

  return (
    <div role="status" className={cn(alertVariants({ color }), className)} {...props}>
      <Icon icon={mark.icon} className={cn("mt-0.5 shrink-0", mark.tone)} />
      <div className="min-w-0 flex-1">
        {title ? <p className="mb-0.5 font-medium text-heading">{title}</p> : null}
        {children}
        {actions ? <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
