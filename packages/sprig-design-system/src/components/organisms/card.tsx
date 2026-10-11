import { cn } from "../../lib/cn";

const tones = {
  default: "bg-card text-card-foreground",
  primary: "border-primary bg-primary text-white",
  success: "border-success bg-success text-white",
  info: "border-info bg-info text-white",
  warning: "border-warning bg-warning text-warning-foreground",
  danger: "border-danger bg-danger text-white",
} as const;

type CardProps = React.ComponentProps<"section"> & {
  tone?: keyof typeof tones;
};

export function Card({ tone = "default", className, ...props }: CardProps) {
  return (
    <section
      className={cn("rounded-sm border border-border shadow-elevation", tones[tone], className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border px-5 py-3.5",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-[15px] font-medium text-heading", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border px-5 py-3",
        className,
      )}
      {...props}
    />
  );
}
