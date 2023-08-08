import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

import { httpAdpater } from "@/lib/http-adapter";

function defaultSerializer(res: any) {
  return res.data;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH2_KEY!,
      clientSecret: process.env.GOOGLE_OAUTH2_SECRET!,
    }),
  ],
  adapter: httpAdpater({
    baseURL: "http://localhost:8000",
    headers: {
      Authorization: process.env.REMOTE_AUTH_RPC_TOKEN!,
    },
    adapterProcedures: {
      createUser: (user) => ({
        path: "auth/signup/",
        method: "POST",
        body: user,
        serialize: defaultSerializer,
      }),
      getUserById: (id) => ({
        path: `auth/get-user/${id}/`,
        serialize: defaultSerializer,
      }),
      getUserByEmail: (email) => ({
        path: `auth/get-user-by-email/${encodeURIComponent(email)}/`,
        serialize: defaultSerializer,
      }),
      getUserByAccount: ({ providerAccountId, provider }) => ({
        path: `auth/get-user-by-account/${encodeURIComponent(
          provider
        )}/${encodeURIComponent(providerAccountId)}/`,
        serialize: defaultSerializer,
      }),
      updateUser: (user) => ({
        path: "auth/update-user/",
        method: "PATCH",
        serialize: defaultSerializer,
      }),
      deleteUser: (id) => ({
        path: `auth/delete-user/${id}/`,
        method: "DELETE",
      }),
      linkAccount: (account) => ({
        path: "auth/link-account/",
        method: "POST",
        body: account,
        serialize: defaultSerializer,
      }),
      unlinkAccount: ({ provider, providerAccountId }) => ({
        path: `auth/unlink-account/${encodeURIComponent(
          provider
        )}/${encodeURIComponent(providerAccountId)}/`,
        method: "DELETE",
      }),
      createSession: (session) => ({
        path: "auth/create-session/",
        method: "POST",
        body: session,
        serialize: defaultSerializer,
      }),
      getSessionAndUser: (sessionToken) => ({
        path: `auth/get-session/${sessionToken}/`,
        serialize: defaultSerializer,
      }),
      updateSession: (session) => ({
        path: "auth/update-session/",
        method: "PATCH",
        body: session,
        serialize: defaultSerializer,
      }),
      deleteSession: (sessionToken) => ({
        path: `auth/delete-session/${sessionToken}/`,
        method: "DELETE",
      }),
      createVerificationToken: (verificationToken) => ({
        path: "auth/create-verification-token/",
        method: "POST",
        body: verificationToken,
        serialize: defaultSerializer,
      }),
      useVerificationToken: (params) => ({
        path: "auth/use-verification-token/",
        method: "POST",
        body: params,
        serialize: defaultSerializer,
      }),
    },
  }),
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET!,
    encode: async ({ secret, token, maxAge }) => {
      return jwt.sign(token!, secret, {
        algorithm: "HS256",
      });
    },
    decode: async ({ secret, token }) => {
      const decodeed = jwt.verify(token!, secret, {
        algorithms: ["HS256"],
      }) as JWT;
      return decodeed;
    },
  },
  callbacks: {
    signIn(params) {
      console.log("signIn", params.user.id);
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
