import { useAccessTokenQuery } from "@/queries/auth-queries";

export const useSession = () => {
  const query = useAccessTokenQuery({ enabled: false });
  return { session: query.data, query };
};
