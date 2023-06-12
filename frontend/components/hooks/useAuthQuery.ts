import { axiosInstance } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useAccessTokenQuery = (payload?: any) => {
  const query = useQuery({
    queryKey: ["accessToken"],
    queryFn: async () => {
      const response = await axiosInstance.post("/auth/google/", payload);
      return response.data.access;
    },
    enabled: !!payload,
  });
  return query;
};
