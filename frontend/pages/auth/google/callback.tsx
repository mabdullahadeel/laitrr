import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOAuthSignIn } from "@/queries/auth-queries";

import { NextPageWithLayout } from "@/types/next.types";

const GoogleCallbackPage: NextPageWithLayout = () => {
  const params = useSearchParams()!;
  const router = useRouter();
  const payload = {
    code: params.get("code")!,
    state: params.get("state")!,
  };
  const query = useOAuthSignIn(payload);

  useEffect(() => {
    if (query.data) {
      const state = JSON.parse(payload.state!);
      router.push(state.backTo ?? "/");
    }
  }, [query.data, payload.state, router]);

  return <div>Google</div>;
};

export default GoogleCallbackPage;
