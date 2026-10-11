"use client";

import * as React from "react";

export type SprigLinkProps = React.ComponentProps<"a"> & {
  href: string;
};

export type SprigLinkComponent = React.ComponentType<SprigLinkProps>;

const LinkContext = React.createContext<SprigLinkComponent | null>(null);

function DefaultLink({ href, ...props }: SprigLinkProps) {
  return <a href={href} {...props} />;
}

export function SprigLinkProvider({
  linkComponent,
  children,
}: {
  linkComponent?: SprigLinkComponent;
  children: React.ReactNode;
}) {
  return <LinkContext.Provider value={linkComponent ?? null}>{children}</LinkContext.Provider>;
}

export function SprigLink(props: SprigLinkProps) {
  const LinkComponent = React.useContext(LinkContext);
  if (!LinkComponent) return <DefaultLink {...props} />;
  // Provided by SprigLinkProvider, so this is the same component on each render.
  // eslint-disable-next-line react-hooks/static-components -- injected router link
  return <LinkComponent {...props} />;
}

type SprigNavigation = {
  pathname: string;
  onNavigate: (href: string) => void;
};

const NavigationContext = React.createContext<SprigNavigation>({
  pathname: "",
  onNavigate: (href) => {
    window.location.assign(href);
  },
});

export function SprigNavigationProvider({
  pathname,
  onNavigate,
  children,
}: SprigNavigation & { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ pathname, onNavigate }), [pathname, onNavigate]);
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useSprigNavigation() {
  return React.useContext(NavigationContext);
}
