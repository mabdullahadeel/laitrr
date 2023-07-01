"use client";

import React, { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccessTokenQuery } from "@/queries/auth-queries";

import { siteConfig } from "@/config/site";
import { useSession } from "@/hooks/useSession";

interface AuthenticatedProps extends React.PropsWithChildren {}

export const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const session = useSession();
  const { error, data } = useAccessTokenQuery();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (session) {
      router.push(searchParams?.get(siteConfig.redirectKey) || "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (data) {
      return;
    }
    if (error) {
      router.push(`/login?${createQueryString("next", pathname!)}`);
    }
  }, [data, error, router, pathname, createQueryString]);

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
