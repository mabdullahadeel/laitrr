import { TimeStamped } from "./common";
import { PublicUser } from "./user";

export type EventListResponseItem = {
  id: string;
  title: string;
  description: string | null;
  owner: PublicUser;
} & TimeStamped;
