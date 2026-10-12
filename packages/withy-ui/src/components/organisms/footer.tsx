import { cn } from "../../lib/cn";
import { WithyLink } from "../theme/withy-routing";

export type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  children?: React.ReactNode;
  links?: FooterLink[];
  className?: string;
};

export function Footer({ children, links = [], className }: FooterProps) {
  return (
    <footer
      className={cn(
        "flex flex-col gap-2 border-t border-border px-5 py-4 text-xs text-text-3 sm:flex-row sm:items-center sm:justify-between lg:px-[25px] xl:px-[30px]",
        className,
      )}
    >
      {children ? <div>{children}</div> : null}
      {links.length > 0 ? (
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <WithyLink
                  href={link.href}
                  className="rounded-xs outline-none hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25"
                >
                  {link.label}
                </WithyLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </footer>
  );
}
