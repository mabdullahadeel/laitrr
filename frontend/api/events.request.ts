import { PaginatedResponse } from "@/types/api/common";
import {
  TEventDetailsResponse,
  TEventListResponseItem,
} from "@/types/api/event";

import { privateHttpClient } from "./httpClient";

const basePath = "events";

export const makeEventsRequest = {
  getEventsFeed: async (
    {
      limit,
      offset,
    }: {
      limit: number;
      offset: number;
    } = { limit: 10, offset: 0 }
  ) => {
    const res = await privateHttpClient
      .get(`${basePath}/`, { searchParams: { limit, offset } })
      .json<PaginatedResponse<TEventListResponseItem>>();
    return res.data;
  },
  getEventDetails: async (eventId: string) => {
    const res = await privateHttpClient
      .get(`${basePath}/${eventId}/`)
      .json<TEventDetailsResponse>();
    return res.data;
  },
};
