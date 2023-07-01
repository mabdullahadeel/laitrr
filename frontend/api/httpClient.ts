import ky, { HTTPError } from "ky";

import { UserTokenResponse } from "@/types/api/auth.types";
import { DestructuredResponse } from "@/types/api/common.types";
import { queryKeys } from "@/lib/constants/query-keys";
import { queryClient } from "@/lib/query-client";

export const BASE_URL = "http://localhost:8000";

function redirectToLogin() {
  queryClient.clear();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export const httpClient = ky.extend({
  prefixUrl: BASE_URL,
  credentials: "include",
  retry: {
    limit: 0,
  },
});

export const privateHttpClient = ky.extend({
  prefixUrl: BASE_URL,
  credentials: "include",
  hooks: {
    beforeRequest: [
      async (request) => {
        const userToken = queryClient.getQueryData<
          DestructuredResponse<UserTokenResponse>
        >([queryKeys.USER_SESSION], {
          exact: true,
        });
        request.headers.set(
          "Authorization",
          `Bearer ${userToken?.access || ""}`
        );
      },
    ],
    beforeRetry: [
      async ({ request, error, retryCount }) => {
        if (error instanceof HTTPError && error.response.status === 401) {
          if (retryCount === 1) {
            try {
              await queryClient.refetchQueries(
                {
                  queryKey: [queryKeys.USER_SESSION],
                  exact: true,
                },
                {
                  throwOnError: true,
                }
              );
            } catch (error) {
              redirectToLogin();
              return ky.stop;
            }
            const freshSessionQuery = queryClient.getQueryData<
              DestructuredResponse<UserTokenResponse>
            >([queryKeys.USER_SESSION], {
              exact: true,
            });
            request.headers.set(
              "Authorization",
              "Bearer " + freshSessionQuery?.access
            );
          } else {
            redirectToLogin();
            return ky.stop;
          }
        }
      },
    ],
  },
  retry: {
    limit: 2,
    statusCodes: [401],
  },
});
