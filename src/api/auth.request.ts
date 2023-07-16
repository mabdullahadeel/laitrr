import { UserTokenResponse } from "@/types/api/auth";
import { DestructuredResponse } from "@/types/api/common";

import { httpClient, privateHttpClient } from "./httpClient";

const basePath = "auth";

export const makeAuthRequest = {
  getSession: async () => {
    const res = await httpClient
      .post(`${basePath}/refresh/`)
      .json<UserTokenResponse>();
    return res.data;
  },
  logout: async () => {
    const res = await privateHttpClient
      .post(`${basePath}/logout/`)
      .json<{ details: string }>();
    return res;
  },
  signInWithGoogle: async (code: string) => {
    const res = await httpClient
      .post(`${basePath}/google/`, { json: { code } })
      .json<DestructuredResponse<UserTokenResponse>>();
    return res;
  },
};
