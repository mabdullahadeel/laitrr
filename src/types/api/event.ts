import { StructuredResponse, TimeStamped } from "./common";
import { PublicUser } from "./user";

export type TEventListResponseItem = {
  id: string;
  title: string;
  description: string | null;
  owner: PublicUser;
} & TimeStamped;

export type TEventDetailsResponse = StructuredResponse<
  TEventListResponseItem & {
    user_following_enabled: boolean;
  } & TimeStamped
>;

export type TEventTypesResponse = StructuredResponse<
  ({
    id: string;
    heading: string;
  } & TimeStamped)[]
>;
