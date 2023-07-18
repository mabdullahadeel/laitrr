import NextAuth from "next-auth";
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
});

export { handler as GET, handler as POST };
