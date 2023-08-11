import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { toZod } from "tozod";
import { z } from "zod";

const userAdapterSchema: toZod<AdapterUser> = z.object({
  id: z.string(),
  email: z.string().email(),
  emailVerified: z.date().nullable(),
  name: z.string().optional(),
  image: z.string().optional(),
});

type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : K]: T[K];
};

const adapterAccountSchema: toZod<
  Omit<RemoveIndexSignature<AdapterAccount>, "type"> & {
    // workaround as toZod is not able to handle union types
    type: string;
  }
> = z.object({
  userId: z.string(),
  providerAccountId: z.string(),
  provider: z.string(),
  type: z.string(),
  access_token: z.string().optional(),
  token_type: z.string().optional(),
  id_token: z.string().optional(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
  expires_at: z.number().optional(),
  session_state: z.string().optional(),
});

export const adapterSessionSchema: toZod<AdapterSession> = z.object({
  expires: z.date(),
  sessionToken: z.string(),
  userId: z.string(),
});

export const verificationTokenSchema: toZod<VerificationToken> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
});

export const createUserSchema: toZod<AdapterUser> = userAdapterSchema;

export const getUserSchema: toZod<AdapterUser | null> =
  userAdapterSchema.nullable();

export const getUserByEmailSchema: toZod<AdapterUser | null> =
  userAdapterSchema.nullable();

export const getUserByAccountSchema = adapterAccountSchema
  .extend({
    type: z.enum(["credentials", "email", "oauth"]),
  })
  .nullable();

export const updateUserSchema = userAdapterSchema;

export const deleteUserSchema = userAdapterSchema.nullable().optional();

export const linkAccountSchema = adapterAccountSchema.nullable().optional();

export const unlinkAccountSchema = adapterAccountSchema.nullable().optional();

export const createSessionSchema = adapterSessionSchema;

export const getSessionAndUserSchema = z
  .object({
    session: adapterSessionSchema,
    user: userAdapterSchema,
  })
  .nullable();

export const updateSessionSchema = adapterSessionSchema.nullable().optional();

export const deleteSessionSchema = adapterSessionSchema.nullable().optional();

export const createVerificationTokenSchema = verificationTokenSchema;

export const useVerificationRequestSchema = verificationTokenSchema.nullable();
