"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccessTokenQuery } from "@/queries/auth-queries";

import { siteConfig } from "@/config/site";

interface AuthenticationRouteProps extends React.PropsWithChildren {}

export const AuthenticationRoute: React.FC<AuthenticationRouteProps> = ({
  children,
}) => {
  const { isSuccess, fetchStatus } = useAccessTokenQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isSuccess) {
      router.push(searchParams?.get(siteConfig.redirectKey) || "/");
    }
  }, [isSuccess, router, searchParams]);

  if (fetchStatus === "fetching") {
    return null;
  }

  return <>{children}</>;
};
