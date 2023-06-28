"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccessTokenQuery } from "@/queries/auth-queries";
import { useQueryClient } from "@tanstack/react-query";

import { siteConfig } from "@/config/site";

interface AuthenticatedProps extends React.PropsWithChildren {}

export const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const query = useAccessTokenQuery();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = router.query;

  useEffect(() => {
    if ((!query.data && !query.isLoading) || query.isError) {
      queryClient.clear();
      router.push({
        pathname: "/login",
        query: {
          [siteConfig.redirectKey]: router.pathname,
        },
      });
    }
    if (query.data) {
      router.push((searchParams[siteConfig.redirectKey] as string) || "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, query.isLoading, query.isError]);

  if (!query.data || query.isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
