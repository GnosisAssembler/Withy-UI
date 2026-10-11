import { cn } from "../../lib/cn";
import { fieldClass } from "../../lib/styles";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea className={cn(fieldClass, "min-h-24 py-2 leading-normal", className)} {...props} />
  );
}
