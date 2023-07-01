"use client";

import React from "react";
import { useLogoutMutation } from "@/queries/auth-mutations";

import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Authenticated } from "@/components/auth/Authenticated";

const IndexPage = () => {
  const { session } = useSession();
  const logoutMutation = useLogoutMutation();

  return (
    <Authenticated>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
        <h1>Logged in as {session?.user.email}</h1>
        {session && (
          <Button variant="destructive" onClick={() => logoutMutation.mutate()}>
            Logout
          </Button>
        )}
      </div>
    </Authenticated>
  );
};

export default IndexPage;
