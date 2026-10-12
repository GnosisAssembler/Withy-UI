"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { WithyProvider, type WithyLinkProps } from "withy-ui";

function DocsLink({ href, ...props }: WithyLinkProps) {
  return <NextLink href={href} {...props} />;
}

export function DocsProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <WithyProvider
      linkComponent={DocsLink}
      pathname={pathname}
      onNavigate={(href) => router.push(href)}
    >
      {children}
    </WithyProvider>
  );
}
