"use client";

import React, { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccessTokenQuery } from "@/queries/auth-queries";

interface AuthenticatedProps extends React.PropsWithChildren {}

export const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const { error, data, status } = useAccessTokenQuery();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (data) {
      return;
    }
    if (error) {
      router.push(`/login?${createQueryString("next", pathname!)}`);
    }
  }, [data, error, router, pathname, createQueryString]);

  if (status !== "success") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
