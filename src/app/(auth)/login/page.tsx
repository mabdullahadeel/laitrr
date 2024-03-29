"use client";

import { redirect } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { CircularSpinner } from "@/components/ui/loading-spinner";

export default function LoginRoot() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <CircularSpinner size={30} />
      </div>
    );
  }

  if (status === "authenticated") {
    redirect("/");
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex gap-4 justify-center">
        <Button onClick={() => signIn("google")} variant="destructive">
          Sign in with Google
        </Button>
      </div>
    </section>
  );
}
