import ky, { HTTPError } from "ky";

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
    beforeRetry: [
      async ({ error, retryCount }) => {
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
          } else {
            redirectToLogin();
            return ky.stop;
          }
        }
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;
        const responseBodyFromReadableStream = response?.body;
        const jsonBody = await responseBodyFromReadableStream
          ?.getReader()
          .read();
        const responsePayload = new TextDecoder("utf-8").decode(
          jsonBody?.value
        );
        if (response && response.body && responsePayload) {
          error.message = JSON.parse(responsePayload);
        }

        return error;
      },
    ],
  },
  retry: {
    limit: 2,
    statusCodes: [401],
  },
});
