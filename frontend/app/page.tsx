"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { axiosInstance, axiosPrivateInstance } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

import { siteConfig } from "@/config/site";
import { LoadingButton } from "@/components/ui/button";
import { Button, buttonVariants } from "@/components/ui/button/button";
import { useAccessTokenQuery } from "@/components/hooks/useAuthQuery";

export default function IndexPage() {
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
      "http://127.0.0.1:8000/auth/social?redirect_url=http://localhost:3000/auth/google/callback/&provider=google-oauth2",
      {
        next: {
          revalidate: 0,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.data.authorization_url);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
      </div>
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
}
