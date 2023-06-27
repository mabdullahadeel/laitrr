import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { NextPageWithLayout } from "@/types/next.types";
import { useAccessTokenQuery } from "@/components/hooks/useAuthQuery";

const GoogleCallbackPage: NextPageWithLayout = () => {
  const params = useSearchParams()!;
  const router = useRouter();
  const payload = {
    code: params.get("code"),
    state: params.get("state"),
  };
  const query = useAccessTokenQuery(payload);

  useEffect(() => {
    if (query.data) {
      const state = JSON.parse(payload.state!);
      router.push(state.backTo ?? "/");
    }
  }, [query.data, payload.state, router]);

  return <div>Hello</div>;
};

export default GoogleCallbackPage;
