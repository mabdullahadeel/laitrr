import { useAccessTokenQuery } from "@/queries/auth-queries";

export const useSession = () => {
  const query = useAccessTokenQuery();
  return query.data;
};
