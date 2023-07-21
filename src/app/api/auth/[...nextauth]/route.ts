import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

import { httpAdpater } from "@/lib/http-adapter";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      // clientId: process.env.GITHUB_ID!,
      // clientSecret: process.env.GITHUB_SECRET!,
      clientId: process.env.GOOGLE_OAUTH2_KEY!,
      clientSecret: process.env.GOOGLE_OAUTH2_SECRET!,
    }),
  ],
  adapter: httpAdpater(),
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
});

export { handler as GET, handler as POST };
