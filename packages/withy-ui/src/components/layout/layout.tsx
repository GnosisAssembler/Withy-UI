import { cn } from "../../lib/cn";

export function Layout({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("flex flex-col gap-2.5", className)}>{children}</div>;
}

export function LayoutHeader({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <header className={cn("w-full", className)}>{children}</header>;
}

export function LayoutBody({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2.5 lg:flex-row lg:items-start", className)}>
      {children}
    </div>
  );
}

export function LayoutContent({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("order-1 min-w-0 w-full flex-1 lg:order-2", className)}>{children}</div>
  );
}

export function LayoutPane({
  side = "start",
  className,
  children,
}: {
  side?: "start" | "end";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <aside
      className={cn(
        "w-full shrink-0",
        side === "start" ? "order-2 lg:order-1 lg:w-60" : "order-3 lg:w-64",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function LayoutFooter({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <footer className={cn("w-full", className)}>{children}</footer>;
}
