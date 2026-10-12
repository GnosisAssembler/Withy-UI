import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { Icon } from "../atoms/icon";
import { cn } from "../../lib/cn";

const tones: Record<"success" | "warning" | "danger" | "info", { icon: LucideIcon; text: string }> =
  {
    success: { icon: CircleCheck, text: "text-success" },
    warning: { icon: TriangleAlert, text: "text-warning" },
    danger: { icon: CircleAlert, text: "text-danger" },
    info: { icon: Info, text: "text-info" },
  };

type InlineMessageProps = React.ComponentProps<"p"> & {
  tone: keyof typeof tones;
};

export function InlineMessage({ tone, className, children, ...props }: InlineMessageProps) {
  return (
    <p
      role="status"
      className={cn("flex items-start gap-1.5 text-[13px]", tones[tone].text, className)}
      {...props}
    >
      <Icon icon={tones[tone].icon} size="sm" className="mt-[3px]" />
      <span>{children}</span>
    </p>
  );
}
