import ky from "ky";
import { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";

const BASE_URL = "http://localhost:8000";

export const httpClient = ky.extend({
  prefixUrl: BASE_URL,
});

export function httpAdpater(): Adapter {
  return {
    async createUser(user) {
      console.log("user", user);
      return httpClient
        .post("api/auth/signup", {
          json: user,
        })
        .json();
    },
    async getUser(id) {
      return httpClient
        .post(`api/auth/get-user/`, {
          json: {
            id,
          },
        })
        .json<AdapterUser>();
    },
    async getUserByEmail(email) {
      return httpClient
        .post(`api/auth/get-user-by-email/`, {
          json: {
            email,
          },
        })
        .json<AdapterUser>();
    },
    getUserByAccount({ providerAccountId, provider }) {
      console.log("providerAccountId", providerAccountId);
      return httpClient
        .post(`auth/get-user-by-account/`, {
          json: {
            provider_account_id: providerAccountId,
            provider,
          },
        })
        .json<AdapterUser>();
    },
    async updateUser(user) {
      return httpClient
        .put(`auth/update-user/`, {
          json: user,
        })
        .json<AdapterUser>();
    },
    async deleteUser(userId) {
      return httpClient.delete(`auth/delete-user/${userId}`).json<null>();
    },
    async linkAccount(account) {
      return httpClient
        .post(`auth/account`, {
          json: account,
        })
        .json<null>();
    },
    async unlinkAccount({ provider, providerAccountId }) {
      return httpClient
        .delete(`auth/account/${provider}/${providerAccountId}`)
        .json<undefined>();
    },
    async createSession(session) {
      return httpClient
        .post(`auth/session`, {
          json: session,
        })
        .json();
    },
    async getSessionAndUser(sessionToken) {
      return httpClient
        .get(`auth/session/${sessionToken}`)
        .json<{ session: AdapterSession; user: AdapterUser } | null>();
    },
    async updateSession({ sessionToken }) {
      return httpClient
        .put(`auth/session/${sessionToken}`)
        .json<AdapterSession>();
    },
    async deleteSession(sessionToken) {
      return httpClient.delete(`auth/session/${sessionToken}`).json<null>();
    },
    async createVerificationToken({ expires, identifier, token }) {
      return httpClient
        .post(`auth/verification-request`, {
          json: {
            expires,
            identifier,
            token,
          },
        })
        .json();
    },
    async useVerificationToken(params) {
      return httpClient
        .post(`auth/verify`, {
          json: params,
        })
        .json();
    },
  };
}
