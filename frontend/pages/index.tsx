import React from "react";
import { useRouter } from "next/router";
import { axiosPrivateInstance } from "@/api/axios";
import { useLogoutMutation } from "@/queries/auth-mutations";
import { useMutation } from "@tanstack/react-query";

import { NextPageWithLayout } from "@/types/next.types";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Authenticated } from "@/components/auth/Authenticated";

const IndexPage: NextPageWithLayout = () => {
  const { session } = useSession();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosPrivateInstance.get(
        "auth/social?redirect_url=http://localhost:3000/auth/google/callback/&provider=google-oauth2"
      );
      return res.data;
    },
  });

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
      <h1>Logged in as {session?.user.email}</h1>
      {session && (
        <Button variant="destructive" onClick={() => logoutMutation.mutate()}>
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
      <Button
        onClick={() => {
          router.push("/login/test");
        }}
      >
        Move
      </Button>
    </div>
  );
};

IndexPage.getLayout = (page) => {
  return <Authenticated>{page}</Authenticated>;
};

export default IndexPage;
