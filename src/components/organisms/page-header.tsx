import { Breadcrumb, type Crumb } from "@/components/molecules/breadcrumb";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  crumbs: Crumb[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ crumbs, title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <Breadcrumb items={crumbs} />
        <h1 className="mt-2.5 text-[1.3125rem] font-medium tracking-[-0.5px] text-heading">
          {title}
        </h1>
        {description ? <p className="mt-1 text-[13px] text-text-3">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </div>
  );
}
