import { Search, X } from "lucide-react";
import { Input } from "../atoms/input";
import { cn } from "../../lib/cn";
import { fieldSize } from "../../lib/styles";

type SearchInputProps = Omit<React.ComponentProps<typeof Input>, "fieldSize"> & {
  fieldSize?: keyof typeof fieldSize;
  onClear?: () => void;
};

export function SearchInput({
  className,
  fieldSize: size = "sm",
  onClear,
  ...props
}: SearchInputProps) {
  const showClear = Boolean(onClear) && String(props.value ?? "").length > 0;

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-text-3" />
      <Input fieldSize={size} className={cn("pl-8", onClear && "pr-8")} {...props} />
      {showClear ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute top-1/2 right-1.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-xs text-text-3 outline-none hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
