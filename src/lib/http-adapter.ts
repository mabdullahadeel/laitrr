import ky from "ky";
import { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";

const BASE_URL = "http://localhost:8000";

export const httpClient = ky.extend({
  prefixUrl: BASE_URL,
});

export function httpAdpater(): Adapter {
  return {
    async createUser(user) {
      return httpClient
        .post("api/auth/signup", {
          json: user,
        })
        .json();
    },
    async getUser(id) {
      return httpClient.get(`api/auth/user/${id}`).json();
    },
    async getUserByEmail(email) {
      return httpClient.get(`api/auth/user/email/${email}`).json();
    },
    getUserByAccount({ providerAccountId, provider }) {
      return httpClient
        .get(`api/auth/user/account/${provider}/${providerAccountId}`)
        .json();
    },
    async updateUser(user) {
      return httpClient
        .put(`api/auth/user/${user.id}`, {
          json: user,
        })
        .json();
    },
    async deleteUser(userId) {
      return httpClient.delete(`api/auth/user/${userId}`).json<null>();
    },
    async linkAccount(account) {
      return httpClient
        .post(`api/auth/account`, {
          json: account,
        })
        .json<null>();
    },
    async unlinkAccount({ provider, providerAccountId }) {
      return httpClient
        .delete(`api/auth/account/${provider}/${providerAccountId}`)
        .json<undefined>();
    },
    async createSession(session) {
      return httpClient
        .post(`api/auth/session`, {
          json: session,
        })
        .json();
    },
    async getSessionAndUser(sessionToken) {
      return httpClient
        .get(`api/auth/session/${sessionToken}`)
        .json<{ session: AdapterSession; user: AdapterUser } | null>();
    },
    async updateSession({ sessionToken }) {
      return httpClient
        .put(`api/auth/session/${sessionToken}`)
        .json<AdapterSession>();
    },
    async deleteSession(sessionToken) {
      return httpClient.delete(`api/auth/session/${sessionToken}`).json<null>();
    },
    async createVerificationToken({ expires, identifier, token }) {
      return httpClient
        .post(`api/auth/verification-request`, {
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
        .post(`api/auth/verify`, {
          json: params,
        })
        .json();
    },
  };
}
