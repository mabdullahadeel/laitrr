import { makeAuthRequest } from "@/api/auth.request";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";

export const useLogout = () => {
  return useQuery({
    queryKey: [queryKeys.LOGOUT],
    queryFn: () => makeAuthRequest.logout(),
    retry: false,
    staleTime: Infinity,
    cacheTime: 0,
  });
};
