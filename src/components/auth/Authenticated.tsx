"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { CircularSpinner } from "../ui/loading-spinner";

interface AuthenticatedProps extends React.PropsWithChildren {}

export const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <CircularSpinner size={30} />
      </div>
    );
  }
  if (session) {
    return <>{children}</>;
  }

  redirect("/login");
};
