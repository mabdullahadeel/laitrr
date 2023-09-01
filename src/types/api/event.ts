import type { StructuredResponse, TimeStamped } from "./common";
import type { PublicUser } from "./user";

export type TEventListResponseItem = {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  resource_url: string;
  owner: PublicUser;
} & TimeStamped;

export type TEventUpdateResponse = StructuredResponse<
  Omit<TEventListResponseItem, "owner">
>;

export type TEventType = {
  id: string;
  heading: string;
} & TimeStamped;

export type TEventDetailsResponse = StructuredResponse<
  TEventListResponseItem & {
    user_following_event: boolean;
    type: TEventType;
  } & TimeStamped
>;

export type TEventTypesResponse = StructuredResponse<
  ({
    id: string;
    heading: string;
  } & TimeStamped)[]
>;

export type EventAnnouncement = {
  id: string;
  title: string;
  description: string;
} & TimeStamped;
