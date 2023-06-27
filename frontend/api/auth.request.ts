import { UserTokenResponse } from "@/types/api/auth.types";

import { axiosInstance } from "./axios";

const basePath = "/auth";

export const makeAuthRequest = {
  getSession: async () => {
    const res = await axiosInstance.post<UserTokenResponse>(
      `${basePath}/refresh/`
    );
    return res.data.data;
  },
};
