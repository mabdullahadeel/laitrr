"use client";

import { useSearchParams } from "next/navigation";

import { useAccessTokenQuery } from "@/components/hooks/useAuthQuery";

export default function Page() {
  const params = useSearchParams();
  const query = useAccessTokenQuery({
    code: params.get("code"),
  });

  return <div>Hello</div>;
}
