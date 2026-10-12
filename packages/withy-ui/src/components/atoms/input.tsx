"use client";

import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";
import { fieldClass, fieldSize } from "../../lib/styles";

type InputProps = React.ComponentProps<"input"> & {
  fieldSize?: keyof typeof fieldSize;
};

export function Input({ className, fieldSize: size = "md", ...props }: InputProps) {
  const control = useFieldControl(props);
  return <input className={cn(fieldClass, fieldSize[size], className)} {...props} {...control} />;
}
