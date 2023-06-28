import React, { useEffect, useState } from "react";
import Link from "next/link";

import { NextPageWithLayout } from "@/types/next.types";
import { buttonVariants } from "@/components/ui/button";
import { AuthenticationRoute } from "@/components/auth/AuthenticationRoute";

const LoginRoot: NextPageWithLayout = () => {
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
      <div></div>
    </section>
  );
};

LoginRoot.getLayout = (page) => {
  return <AuthenticationRoute>{page}</AuthenticationRoute>;
};

export default LoginRoot;
