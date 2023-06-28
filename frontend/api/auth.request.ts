import { UserTokenResponse } from "@/types/api/auth.types";
import { DestructuredResponse } from "@/types/api/common.types";

import { axiosInstance } from "./axios";

const basePath = "/auth";

export const makeAuthRequest = {
  getSession: async () => {
    const res = await axiosInstance.post<UserTokenResponse>(
      `${basePath}/refresh/`
    );
    return res.data.data;
  },
  logout: async () => {
    await axiosInstance.post(`${basePath}/logout/`);
  },
  signInWithGoogle: async (code: string) => {
    const res = await axiosInstance.post<
      DestructuredResponse<UserTokenResponse>
    >(`${basePath}/google/`, { code });
    return res.data;
  },
};
