import { StructuredResponse } from "./common.types";
import { PublicUser } from "./user.types";

export type UserTokenResponse = StructuredResponse<{
  access: string;
  user: PublicUser;
}>;
