import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { getTweets } from "@/server/core/twitter";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    return `Hello ${
      ctx.session.user.name || "Unknown"
    }  you can now see this secret message!`;
  }),

  fetchTweets: protectedProcedure.query(async () => {
    return await getTweets("abdadeel");
  }),
});
