"use client";

import React from "react";

interface AuthenticationRouteProps extends React.PropsWithChildren {}

export const AuthenticationRoute: React.FC<AuthenticationRouteProps> = ({
  children,
}) => {
  return <>{children}</>;
};
