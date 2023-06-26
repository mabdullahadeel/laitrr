import axios from "axios";

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
    const accessToken = queryClient.getQueryData<any>(
      [queryKeys.AUTH_ACCESS_TOKEN],
      {
        exact: true,
      }
    );
    config.headers.Authorization = `Bearer ${accessToken || ""}`;
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
      const newToken = await axiosInstance.post("/auth/refresh/");
      queryClient.setQueryData([queryKeys.AUTH_ACCESS_TOKEN], () => {
        return newToken.data.access;
      });
      previousRequest.headers["Authorization"] =
        "Bearer " + newToken.data.access;
      previousRequest._retry = true;
      return axiosPrivateInstance(previousRequest);
    }
    return Promise.reject(error);
  }
);
