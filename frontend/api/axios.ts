import axios from "axios";

import { UserTokenResponse } from "@/types/api/auth.types";
import { DestructuredResponse } from "@/types/api/common.types";
import { queryKeys } from "@/lib/constants/query-keys";
import { queryClient } from "@/lib/query-client";

const BASE_URL = "http://localhost:8000";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivateInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosPrivateInstance.interceptors.request.use(
  (config) => {
    const userToken = queryClient.getQueryData<
      DestructuredResponse<UserTokenResponse>
    >([queryKeys.USER_SESSION], {
      exact: true,
    });
    config.headers.Authorization = `Bearer ${userToken?.access || ""}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const previousRequest = error.config;
    if (error.response.status === 401 && !previousRequest._retry) {
      await queryClient.refetchQueries({
        queryKey: [queryKeys.USER_SESSION],
        exact: true,
      });
      const freshSessionQuery = queryClient.getQueryData<
        DestructuredResponse<UserTokenResponse>
      >([queryKeys.USER_SESSION], {
        exact: true,
      });
      previousRequest.headers["Authorization"] =
        "Bearer " + freshSessionQuery?.access;
      previousRequest._retry = true;
      return axiosPrivateInstance(previousRequest);
    }
    return Promise.reject(error);
  }
);
