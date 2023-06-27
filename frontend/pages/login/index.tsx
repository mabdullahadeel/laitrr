import React, { useEffect, useState } from "react";
import Link from "next/link";
import { axiosPrivateInstance } from "@/api/axios";
import { useAccessTokenQuery } from "@/queries/auth-queries";
import { useMutation } from "@tanstack/react-query";

import { NextPageWithLayout } from "@/types/next.types";
import { Button, buttonVariants } from "@/components/ui/button";

const LoginRoot: NextPageWithLayout = () => {
  const query = useAccessTokenQuery();
  const testMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosPrivateInstance.get(
        "auth/social?redirect_url=http://localhost:3000/auth/google/callback/&provider=google-oauth2"
      );
      return res.data;
    },
  });
  const logout = useMutation({
    mutationFn: async () => {
      await axiosPrivateInstance.post("auth/logout/");
    },
  });

  const [url, setUrl] = useState("");
  useEffect(() => {
    fetch(
      "http://127.0.0.1:8000/auth/social?redirect_url=http://localhost:3000/auth/google/callback/&provider=google-oauth2"
    )
      .then((res) => res.json())
      .then((data) => {
        const url = new URL(data.data.authorization_url);
        const state = { backTo: "/" };
        url.searchParams.append("state", JSON.stringify(state));
        setUrl(url.toString());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex gap-4">
        <Link
          href={url}
          className={buttonVariants({ className: "bg-red-500 text-white" })}
        >
          Login With Google
        </Link>
      </div>
      <div>
        <pre>
          <code>{JSON.stringify(query.data, null, 2)}</code>
        </pre>
        <Button
          onClick={() => {
            testMutation.mutate();
          }}
        >
          Test
        </Button>
        <Button
          onClick={() => {
            logout.mutate();
          }}
        >
          Logout
        </Button>
      </div>
    </section>
  );
};

export default LoginRoot;
