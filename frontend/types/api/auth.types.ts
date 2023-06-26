import { StructuredResponse } from "./common.types";

export type RefreshTokenResponse = StructuredResponse<{
  access: string;
}>;
