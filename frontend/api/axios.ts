import axios from "axios";

import { queryClient } from "@/lib/query-client";

const BASE_URL = "http://localhost:8000";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivateInstance = axios.create({
  baseURL: BASE_URL,
});

axiosPrivateInstance.interceptors.request.use(
  (config) => {
    const accessToken = queryClient.getQueryData<any>(["accessToken"], {
      exact: true,
    });
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
      const newToken = await axiosInstance.post("/test-auth/refresh/");
      queryClient.setQueryData(["accessToken"], () => {
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
