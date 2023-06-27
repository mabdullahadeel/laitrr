import { makeAuthRequest } from "@/api/auth.request";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";

type AccessTokenQueryProps = {
  enabled?: boolean;
};

export const useAccessTokenQuery = (opts: AccessTokenQueryProps = {}) => {
  const { enabled = true } = opts;
  const query = useQuery({
    queryKey: [queryKeys.AUTH_ACCESS_TOKEN],
    queryFn: makeAuthRequest.getSession,
    staleTime: 1000 * 60 * 4, // 4 minutes,
    cacheTime: Infinity,
    retry: 1,
    enabled,
  });

  return query;
};
