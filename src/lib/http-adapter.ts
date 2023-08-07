import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";

import { StructuredResponse } from "@/types/api/common";

import { HttpAdpaterManager, type AdapterManagerConfig } from "./manager";

const BASE_URL = "http://localhost:8000";

async function makeServerRequest<TRes>({
  url,
  method = "GET",
  body,
}: {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
}) {
  const r = await fetch(`${BASE_URL}/${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.REMOTE_AUTH_RPC_TOKEN!,
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    throw new Error("Server error");
  }
  const res = (await r.json()) as TRes;
  return res;
}

export function httpAdpater<WithVerificationToken = boolean>(
  opts: AdapterManagerConfig
): Adapter<WithVerificationToken> {
  const manager = new HttpAdpaterManager(opts);
  return {
    async createUser(user) {
      const res = await makeServerRequest<StructuredResponse<AdapterUser>>({
        url: "auth/signup/",
        method: "POST",
        body: user,
      });
      return res.data;
    },
    async getUser(id) {
      try {
        const res = await makeServerRequest<StructuredResponse<AdapterUser>>({
          url: `auth/get-user/${id}/`,
          method: "GET",
        });
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async getUserByEmail(email) {
      try {
        const res = await makeServerRequest<StructuredResponse<AdapterUser>>({
          url: `auth/get-user-by-email/${encodeURIComponent(email)}/`,
          method: "GET",
        });
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async getUserByAccount(payload) {
      try {
        // const res = await makeServerRequest<StructuredResponse<AdapterUser>>({
        //   url: `auth/get-user-by-account/${encodeURIComponent(
        //     provider
        //   )}/${encodeURIComponent(providerAccountId)}/`,
        //   method: "GET",
        // });
        // return res.data;
        return await manager.getUserByAccount(payload);
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async updateUser(user) {
      const res = await makeServerRequest<StructuredResponse<AdapterUser>>({
        url: `auth/update-user/`,
        method: "PATCH",
        body: user,
      });
      return res.data;
    },
    async deleteUser(userId) {
      try {
        const res = await makeServerRequest<StructuredResponse<null>>({
          url: `auth/delete-user/${userId}/`,
          method: "DELETE",
        });
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async linkAccount(account) {
      try {
        const res = await makeServerRequest<StructuredResponse<AdapterAccount>>(
          {
            url: `auth/link-account/`,
            method: "POST",
            body: account,
          }
        );
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await makeServerRequest<StructuredResponse<null>>({
        url: `auth/unlink-account/${encodeURIComponent(
          provider
        )}/${encodeURIComponent(providerAccountId)}/`,
        method: "DELETE",
      });
      return undefined;
    },
    async createSession(session) {
      const res = await makeServerRequest<StructuredResponse<AdapterSession>>({
        url: `auth/create-session/`,
        method: "POST",
        body: session,
      });
      return res.data;
    },
    async getSessionAndUser(sessionToken) {
      try {
        const res = await makeServerRequest<
          StructuredResponse<{
            session: AdapterSession;
            user: AdapterUser;
          }>
        >({
          url: `auth/get-session/${sessionToken}/`,
          method: "GET",
        });
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async updateSession(session) {
      try {
        const res = await makeServerRequest<StructuredResponse<AdapterSession>>(
          {
            url: `auth/update-session/`,
            method: "PATCH",
            body: session,
          }
        );
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async deleteSession(sessionToken) {
      await makeServerRequest<StructuredResponse<null>>({
        url: `auth/delete-session/${sessionToken}/`,
        method: "DELETE",
      });
      return null;
    },
    async createVerificationToken(verificationToken) {
      try {
        const res = await makeServerRequest<
          StructuredResponse<VerificationToken>
        >({
          url: `auth/create-verification-token/`,
          method: "POST",
          body: verificationToken,
        });
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
    async useVerificationToken(params) {
      try {
        const res = await makeServerRequest<StructuredResponse<null>>({
          url: `auth/use-verification-token/`,
          method: "POST",
          body: params,
        });
        return res.data;
      } catch (error) {
        console.log("error", error);
        return null;
      }
    },
  };
}
