import { RefreshTokenResponse } from "@/types/api/auth.types";

import { axiosInstance } from "./axios";

const basePath = "/auth";

export const makeAuthRequest = {
  getAccessToken: async () => {
    const res = await axiosInstance.post<RefreshTokenResponse>(
      `${basePath}/refresh/`
    );
    return res.data.data.access;
  },
};
