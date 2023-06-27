"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { siteConfig } from "@/config/site";
import { useSession } from "@/hooks/useSession";

interface AuthenticationRouteProps extends React.PropsWithChildren {}

export const AuthenticationRoute: React.FC<AuthenticationRouteProps> = ({
  children,
}) => {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (session) {
      router.push(searchParams?.get(siteConfig.redirectKey) || "/");
    }
  }, [session, router, searchParams]);

  return <>{children}</>;
};
