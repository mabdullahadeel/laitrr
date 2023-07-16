import { StructuredResponse } from "./common";
import { PublicUser } from "./user";

export type UserTokenResponse = StructuredResponse<{
  access: string;
  user: PublicUser;
}>;
