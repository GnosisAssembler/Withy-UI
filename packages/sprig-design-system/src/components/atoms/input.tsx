import { cn } from "../../lib/cn";
import { fieldClass, fieldSize } from "../../lib/styles";

type InputProps = React.ComponentProps<"input"> & {
  fieldSize?: keyof typeof fieldSize;
};

export function Input({ className, fieldSize: size = "md", ...props }: InputProps) {
  return <input className={cn(fieldClass, fieldSize[size], className)} {...props} />;
}
