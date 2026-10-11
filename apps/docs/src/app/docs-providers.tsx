"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SprigLinkProvider,
  SprigNavigationProvider,
  type SprigLinkProps,
} from "sprig-design-system";

function DocsLink({ href, ...props }: SprigLinkProps) {
  return <NextLink href={href} {...props} />;
}

export function DocsProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SprigLinkProvider linkComponent={DocsLink}>
      <SprigNavigationProvider pathname={pathname} onNavigate={(href) => router.push(href)}>
        {children}
      </SprigNavigationProvider>
    </SprigLinkProvider>
  );
}
