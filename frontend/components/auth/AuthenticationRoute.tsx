"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccessTokenQuery } from "@/queries/auth-queries";

import { siteConfig } from "@/config/site";

interface AuthenticationRouteProps extends React.PropsWithChildren {}

export const AuthenticationRoute: React.FC<AuthenticationRouteProps> = ({
  children,
}) => {
  const { data } = useAccessTokenQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (data) {
      router.push(searchParams?.get(siteConfig.redirectKey) || "/");
    }
  }, [data, router, searchParams]);

  return <>{children}</>;
};
