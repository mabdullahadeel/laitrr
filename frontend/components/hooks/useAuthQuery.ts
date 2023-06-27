import { axiosInstance } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";

export const useAccessTokenQuery = (payload?: any) => {
  const query = useQuery({
    queryKey: [queryKeys.AUTH_ACCESS_TOKEN],
    queryFn: async () => {
      const response = await axiosInstance.post("/auth/google/", payload);
      return response.data;
    },
    enabled: !!payload && !!payload.code,
  });
  return query;
};
