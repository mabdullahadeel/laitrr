import { useRouter } from "next/navigation";
import { makeAuthRequest } from "@/api/auth.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeAuthRequest.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
};
