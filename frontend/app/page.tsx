"use client";

import React from "react";
import { privateHttpClient } from "@/api/httpClient";
import { PlainLayout } from "@/layouts/plain";
import { useLogoutMutation } from "@/queries/auth-mutations";
import { useMutation } from "@tanstack/react-query";

import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Authenticated } from "@/components/auth/Authenticated";

const IndexPage = () => {
  const { session } = useSession();
  const logoutMutation = useLogoutMutation();
  const testMutation = useMutation({
    mutationFn: () => privateHttpClient.get("auth/test/"),
  });

  return (
    <Authenticated>
      <PlainLayout>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
          <h1>Logged in as {session?.user.email}</h1>
          {session && (
            <Button
              variant="destructive"
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </Button>
          )}
          <Button
            onClick={() => {
              testMutation.mutate();
            }}
          >
            Test
          </Button>
        </div>
      </PlainLayout>
    </Authenticated>
  );
};

export default IndexPage;
