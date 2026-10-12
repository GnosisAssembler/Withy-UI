import { WithyLink, type WithyLinkProps } from "../theme/withy-routing";
import { cn } from "../../lib/cn";

type LinkProps = WithyLinkProps & {
  external?: boolean;
};

export function Link({ external = false, className, children, ...props }: LinkProps) {
  return (
    <WithyLink
      className={cn(
        "rounded-xs font-medium text-primary underline-offset-2 outline-none hover:underline focus-visible:ring-4 focus-visible:ring-primary/25",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </WithyLink>
  );
}
