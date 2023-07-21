import ky from "ky";
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
} from "next-auth/adapters";
import { decode } from "next-auth/jwt";

import { StructuredResponse } from "@/types/api/common";

const BASE_URL = "http://localhost:8000";

export const httpClient = ky.create({
  prefixUrl: BASE_URL,
});

export function httpAdpater(): Adapter {
  return {
    async createUser(user) {
      const r = await fetch(`${BASE_URL}/auth/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          email_verified: user.emailVerified,
        }),
      });
      const res = (await r.json()) as StructuredResponse<AdapterUser & any>;
      console.log("resCreateUser", res);
      if (res.data === null) {
        return null;
      }

      return {
        email: res.data.email,
        id: res.data.id,
        emailVerified: res.data.email_verified,
      } as any;
    },
    async getUser(id) {
      const r = await fetch(`${BASE_URL}/auth/get-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const res = (await r.json()) as StructuredResponse<AdapterUser | null>;
      return res.data;
    },
    async getUserByEmail(email) {
      const r = await fetch(`${BASE_URL}/auth/get-user-by-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const res = (await r.json()) as StructuredResponse<AdapterUser | null>;
      return res.data;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const r = await fetch(`${BASE_URL}/auth/get-user-by-account/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider_account_id: providerAccountId,
          provider,
        }),
      });
      const res = (await r.json()) as StructuredResponse<
        (AdapterUser & any) | null
      >;
      if (res.data === null) {
        return null;
      }
      return {
        email: res.data.email,
        id: res.data.id,
        emailVerified: res.data.email_verified,
      };
    },
    async updateUser(user) {
      const r = await fetch(`${BASE_URL}/auth/update-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const res = (await r.json()) as StructuredResponse<
        (AdapterUser & { email_verified: boolean }) | null
      >;
      if (res.data === null) {
        return;
      }
      return {
        email: res.data.email,
        id: res.data.id,
        emailVerified: res.data.email_verified,
      } as any;
    },
    async deleteUser(userId) {
      const r = await fetch(`${BASE_URL}/auth/delete-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
        }),
      });
      const res = (await r.json()) as StructuredResponse<null>;
      return res.data;
    },
    async linkAccount(account) {
      console.log("linkAccountPayload", account);
      const r = await fetch(`${BASE_URL}/auth/link-account/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      });
      const res = (await r.json()) as StructuredResponse<AdapterAccount | null>;
      console.log("linkAccount", res);
      return res.data;
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
