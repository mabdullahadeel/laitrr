"use client";

import React, { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccessTokenQuery } from "@/queries/auth-queries";

import { siteConfig } from "@/config/site";

interface AuthenticatedProps extends React.PropsWithChildren {}

export const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const { isError, isSuccess, isLoading } = useAccessTokenQuery();
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
    const redirectKey = searchParams?.get(siteConfig.redirectKey);
    if (isSuccess && redirectKey) {
      router.push(redirectKey || "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isError) {
      router.push(`/login?${createQueryString("next", pathname!)}`);
    }
  }, [isLoading, isError, router, pathname, createQueryString]);

  if (isLoading || !isSuccess || isError) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
