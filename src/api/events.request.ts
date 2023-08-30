import { PaginatedResponse, StructuredResponse } from "@/types/api/common";
import {
  TEventDetailsResponse,
  TEventListResponseItem,
  TEventTypesResponse,
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
    } = { limit: 20, offset: 0 }
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
  createEvent: async <TPayload = any>(event: TPayload) => {
    const res = await privateHttpClient
      .post(`${basePath}/create/`, { json: event })
      .json<StructuredResponse<TEventListResponseItem>>();
    return res.data;
  },
  fetchEventTypes: async () => {
    const res = await privateHttpClient
      .get(`${basePath}/event-types/`)
      .json<TEventTypesResponse>();
    return res.data;
  },
  followEvent: async (eventId: string) => {
    const res = await privateHttpClient
      .post(`${basePath}/follow/`, { json: { event_id: eventId } })
      .json<StructuredResponse<{ event_id: string }>>();
    return res.data;
  },
  unfollowEvent: async (eventId: string) => {
    const res = await privateHttpClient
      .delete(`${basePath}/${eventId}/unfollow/`)
      .json<StructuredResponse<{ event_id: string }>>();
    return res.data;
  },
};
