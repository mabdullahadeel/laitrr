import axios from "axios";

import { UserTokenResponse } from "@/types/api/auth.types";
import { DestructuredResponse } from "@/types/api/common.types";
import { queryKeys } from "@/lib/constants/query-keys";
import { queryClient } from "@/lib/query-client";

import { makeAuthRequest } from "./auth.request";

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
    >([queryKeys.AUTH_ACCESS_TOKEN], {
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
      const newSession = await makeAuthRequest.getSession();
      queryClient.setQueryData(
        [queryKeys.AUTH_ACCESS_TOKEN],
        () => {
          return newSession;
        },
        { updatedAt: Date.now() }
      );
      previousRequest.headers["Authorization"] = "Bearer " + newSession.access;
      previousRequest._retry = true;
      return axiosPrivateInstance(previousRequest);
    }
    return Promise.reject(error);
  }
);
