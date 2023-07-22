"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

interface AuthenticatedProps extends React.PropsWithChildren {}

export const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (session) {
    return <>{children}</>;
  }

  redirect("/login");
};
