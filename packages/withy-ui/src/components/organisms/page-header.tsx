import { Breadcrumb, type Crumb } from "../molecules/breadcrumb";
import { cn } from "../../lib/cn";

type PageHeaderProps = {
  title: string;
  crumbs?: Crumb[];
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ crumbs, title, description, actions, className }: PageHeaderProps) {
  const hasCrumbs = Boolean(crumbs?.length);
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {hasCrumbs && crumbs ? <Breadcrumb items={crumbs} /> : null}
        <h1
          className={cn(
            "text-[1.3125rem] font-medium tracking-[-0.5px] text-heading",
            hasCrumbs && "mt-2.5",
          )}
        >
          {title}
        </h1>
        {description ? <p className="mt-1 text-[13px] text-text-3">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </div>
  );
}
