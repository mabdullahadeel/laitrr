import { makeAuthRequest } from "@/api/auth.request";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";

type AccessTokenQueryProps = {
  enabled?: boolean;
};

export const useAccessTokenQuery = (opts: AccessTokenQueryProps = {}) => {
  const { enabled = true } = opts;
  const query = useQuery({
    queryKey: [queryKeys.USER_SESSION],
    queryFn: makeAuthRequest.getSession,
    staleTime: Infinity,
    retry: 1,
    enabled,
  });

  return query;
};

type OAuthSignInProps = {
  code: string;
  state?: string;
};

export const useOAuthSignIn = (opts: OAuthSignInProps) => {
  const query = useQuery({
    queryKey: [queryKeys.OAUTH_SIGN_IN],
    queryFn: () => makeAuthRequest.signInWithGoogle(opts.code),
    enabled: !!opts.code,
  });
  return query;
};
