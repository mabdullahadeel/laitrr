import { PaginatedResponse } from "@/types/api/common";
import { EventListResponseItem } from "@/types/api/event";

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
      .json<PaginatedResponse<EventListResponseItem>>();
    return res.data;
  },
};
