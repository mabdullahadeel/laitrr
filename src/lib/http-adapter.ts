import ky from "ky";
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";

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
      try {
        const r = await fetch(`${BASE_URL}/auth/get-user/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = (await r.json()) as StructuredResponse<AdapterUser | null>;
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async getUserByEmail(email) {
      const r = await fetch(
        `${BASE_URL}/auth/get-user-by-email/${encodeURIComponent(email)}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = (await r.json()) as StructuredResponse<AdapterUser | null>;
      return res.data;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const r = await fetch(
        `${BASE_URL}/auth/get-user-by-account/${encodeURIComponent(
          provider
        )}/${encodeURIComponent(providerAccountId)}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
        method: "PATCH",
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
      const r = await fetch(`${BASE_URL}/auth/delete-user/${userId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const r = await fetch(
        `${BASE_URL}/auth/unlink-account/${encodeURIComponent(
          provider
        )}/${encodeURIComponent(providerAccountId)}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = (await r.json()) as StructuredResponse<null>;
      return res.data === null ? undefined : res.data;
    },
    async createSession(session) {
      const r = await fetch(`${BASE_URL}/auth/create-session/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });
      const res = (await r.json()) as StructuredResponse<AdapterSession>;
      return res.data;
    },
    async getSessionAndUser(sessionToken) {
      const r = await fetch(`${BASE_URL}/auth/get-session/${sessionToken}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = (await r.json()) as StructuredResponse<{
        session: AdapterSession;
        user: AdapterUser;
      }>;
      return res.data;
    },
    async updateSession(session) {
      const r = await fetch(`${BASE_URL}/auth/update-session/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });
      const res = (await r.json()) as StructuredResponse<AdapterSession>;
      return res.data;
    },
    async deleteSession(sessionToken) {
      const r = await fetch(`${BASE_URL}/auth/delete-session/${sessionToken}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = (await r.json()) as StructuredResponse<null>;
      return res.data;
    },
    async createVerificationToken(verificationToken) {
      const r = await fetch(`${BASE_URL}/auth/create-verification-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationToken),
      });
      const res = (await r.json()) as StructuredResponse<VerificationToken>;
      return res.data;
    },
    async useVerificationToken(params) {
      const r = await fetch(`${BASE_URL}/auth/use-verification-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const res = (await r.json()) as StructuredResponse<null>;
      return res.data;
    },
  };
}
