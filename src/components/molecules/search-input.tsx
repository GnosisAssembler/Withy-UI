import { Search } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/cn";
import { fieldSize } from "@/lib/styles";

type SearchInputProps = Omit<React.ComponentProps<typeof Input>, "fieldSize"> & {
  fieldSize?: keyof typeof fieldSize;
};

export function SearchInput({ className, fieldSize: size = "sm", ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-text-3" />
      <Input fieldSize={size} className="pl-8" {...props} />
    </div>
  );
}
