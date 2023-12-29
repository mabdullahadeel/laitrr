import { db } from "@/drizzle/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  adapter: DrizzleAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH2_KEY!,
      clientSecret: process.env.GOOGLE_OAUTH2_SECRET!,
    }),
  ],
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
    signIn: async (params) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL!}/users/signin/`,
          {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
              Authorization: process.env.REMOTE_AUTH_RPC_TOKEN!,
              "Content-Type": "application/json",
            },
          }
        );
        return res.ok;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
