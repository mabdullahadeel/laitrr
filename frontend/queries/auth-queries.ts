import { makeAuthRequest } from "@/api/auth.request";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";

export const useAccessTokenQuery = () => {
  const query = useQuery({
    queryKey: [queryKeys.AUTH_ACCESS_TOKEN],
    queryFn: makeAuthRequest.getAccessToken,
    staleTime: 1000 * 60 * 4, // 4 minutes,
    cacheTime: Infinity,
    retry: 1,
  });

  return query;
};
