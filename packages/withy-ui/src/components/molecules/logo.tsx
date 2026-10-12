import { cn } from "../../lib/cn";
import { SproutMark } from "../atoms/sprout";
import { WithyLink } from "../theme/withy-routing";

type LogoProps = {
  name?: string;
  mark?: React.ReactNode;
  href?: string;
  inverse?: boolean;
  className?: string;
};

export function Logo({
  name = "withy-ui",
  mark = <SproutMark />,
  href = "/",
  inverse = false,
  className,
}: LogoProps) {
  return (
    <WithyLink
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-[1.09375rem] leading-none font-medium tracking-tight",
        inverse ? "text-white" : "text-heading",
        className,
      )}
    >
      {mark ? <span className={inverse ? "text-white" : "text-primary"}>{mark}</span> : null}
      {name}
    </WithyLink>
  );
}
