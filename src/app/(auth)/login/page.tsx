"use client";

import Link from "next/link";
import { httpClient } from "@/api/httpClient";
import { useQuery } from "@tanstack/react-query";

import { StructuredResponse } from "@/types/api/common";
import { useLogout } from "@/hooks/useLogout";
import { buttonVariants } from "@/components/ui/button";

export const revalidate = 60 * 60;

const getGoogleUrl = async () => {
  try {
    const data = await httpClient
      .get(
        "auth/social/?redirect_url=http://localhost:3000/auth/google/callback/&provider=google-oauth2"
      )
      .json<StructuredResponse<{ authorization_url: string }>>();
    const url = new URL(data.data.authorization_url);
    const state = { backTo: "/" };
    url.searchParams.append("state", JSON.stringify(state));
    return url.toString();
  } catch (error) {
    console.log("error", error);
    return "";
  }
};

export default function LoginRoot() {
  useLogout();
  const query = useQuery({
    queryKey: ["google-url"],
    queryFn: getGoogleUrl,
    staleTime: Infinity,
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  console.log("query.data", query.data);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex gap-4">
        <Link
          href={query.data}
          className={buttonVariants({ className: "bg-red-500 text-white" })}
        >
          Login With Google
        </Link>
      </div>
    </section>
  );
}
