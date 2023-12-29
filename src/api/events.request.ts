import { EventAnnouncementFormValues, EventFormValues } from "@/schemas/event";

import type {
  PaginatedResponse,
  StructuredResponse,
  TPaginationParams,
} from "@/types/api/common";
import {
  EventAnnouncement,
  TEventDetailsResponse,
  TEventListResponseItem,
  TEventTypesResponse,
  TEventUpdateResponse,
} from "@/types/api/event";

import { privateHttpClient } from "./httpClient";

const basePath = "events";

export const makeEventsRequest = {
  getEventsFeed: async (
    { limit, offset }: TPaginationParams = { limit: 20, offset: 0 }
  ) => {
    const res = await privateHttpClient
      .get(`${basePath}/feed/`, { searchParams: { limit, offset } })
      .json<PaginatedResponse<TEventListResponseItem>>();
    return res.data;
  },
  getEventDetails: async (eventId: string) => {
    const res = await privateHttpClient
      .get(`${basePath}/details/${eventId}/`)
      .json<TEventDetailsResponse>();
    return res.data;
  },
  createEvent: async (event: EventFormValues) => {
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
      .delete(`${basePath}/follow/${eventId}/`)
      .json<StructuredResponse<{ event_id: string }>>();
    return res.data;
  },
  deleteEvent: async (eventId: string) => {
    const res = await privateHttpClient
      .delete(`${basePath}/delete/${eventId}/`)
      .json<void>();
    return null;
  },
  updateEvent: async <TPayload = any>(eventId: string, event: TPayload) => {
    try {
      const res = await privateHttpClient
        .put(`${basePath}/update/${eventId}/`, { json: event })
        .json<TEventUpdateResponse>();
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getEventAnnouncements: async (
    eventId: string,
    params: TPaginationParams = { limit: 20, offset: 0 }
  ) => {
    const res = await privateHttpClient
      .get(`${basePath}/event-announcements/${eventId}/`, {
        searchParams: params,
      })
      .json<PaginatedResponse<EventAnnouncement>>();
    return res.data;
  },
  getAnnouncementDetails: async (id: string) => {
    const res = await privateHttpClient
      .get(`${basePath}/announcements/${id}/`)
      .json<StructuredResponse<EventAnnouncement>>();
    return res.data;
  },
  createAnnouncement: async (
    eventId: string,
    announcement: EventAnnouncementFormValues
  ) => {
    const res = await privateHttpClient
      .post(`${basePath}/announcements/create/${eventId}/`, {
        json: announcement,
      })
      .json<StructuredResponse<EventAnnouncement>>();
    return res.data;
  },
  updateAnnouncement: async (
    announcementId: string,
    announcement: EventAnnouncementFormValues
  ) => {
    const res = await privateHttpClient
      .put(`${basePath}/announcements/update/${announcementId}/`, {
        json: announcement,
      })
      .json<StructuredResponse<EventAnnouncement>>();
    return res.data;
  },
  deleteAnnouncement: async (announcementId: string) => {
    await privateHttpClient
      .delete(`${basePath}/announcements/delete/${announcementId}/`)
      .json<void>();
    return null;
  },
  getUserEvents: async (
    username: string,
    params: TPaginationParams & { filter: "past" | "upcoming" }
  ) => {
    const res = await privateHttpClient
      .get(`${basePath}/user/${username}`, { searchParams: params })
      .json<PaginatedResponse<TEventListResponseItem>>();
    return res.data;
  },
};
