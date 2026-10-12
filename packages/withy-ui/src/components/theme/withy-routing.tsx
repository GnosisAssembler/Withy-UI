"use client";

import * as React from "react";

export type WithyLinkProps = React.ComponentProps<"a"> & {
  href: string;
};

export type WithyLinkComponent = React.ComponentType<WithyLinkProps>;

const LinkContext = React.createContext<WithyLinkComponent | null>(null);

function DefaultLink({ href, ...props }: WithyLinkProps) {
  return <a href={href} {...props} />;
}

export function WithyLinkProvider({
  linkComponent,
  children,
}: {
  linkComponent?: WithyLinkComponent;
  children: React.ReactNode;
}) {
  return <LinkContext.Provider value={linkComponent ?? null}>{children}</LinkContext.Provider>;
}

export function WithyLink(props: WithyLinkProps) {
  const LinkComponent = React.useContext(LinkContext);
  if (!LinkComponent) return <DefaultLink {...props} />;
  // Provided by WithyLinkProvider, so this is the same component on each render.
  // eslint-disable-next-line react-hooks/static-components -- injected router link
  return <LinkComponent {...props} />;
}

type WithyNavigation = {
  pathname: string;
  onNavigate: (href: string) => void;
};

const NavigationContext = React.createContext<WithyNavigation>({
  pathname: "",
  onNavigate: (href) => {
    window.location.assign(href);
  },
});

export function WithyNavigationProvider({
  pathname,
  onNavigate,
  children,
}: WithyNavigation & { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ pathname, onNavigate }), [pathname, onNavigate]);
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useWithyNavigation() {
  return React.useContext(NavigationContext);
}
