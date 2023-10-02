import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./db.sqlite",
  },
  out: "./src/drizzle/",
} satisfies Config;
