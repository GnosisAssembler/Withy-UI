import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const alertVariants = cva("rounded-sm border px-4 py-3 text-sm", {
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

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    title?: string;
  };

export function Alert({ className, color, title, children, ...props }: AlertProps) {
  return (
    <div role="status" className={cn(alertVariants({ color }), className)} {...props}>
      {title ? <p className="mb-0.5 font-medium text-heading">{title}</p> : null}
      {children}
    </div>
  );
}
