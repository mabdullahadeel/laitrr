import React from "react";
import { makeEventsRequest } from "@/api/events.request";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";
import { time } from "@/lib/time";
import { Card, CardContent } from "@/components/ui/card";
import { CircularSpinner } from "@/components/ui/loading-spinner";

interface EventAnnouncementsProps {
  eventId: string;
}

export const EventAnnouncements: React.FC<EventAnnouncementsProps> = ({
  eventId,
}) => {
  const { status, data } = useInfiniteQuery({
    queryKey: [queryKeys.LIST_EVENT_ANNOUNCEMENTS, eventId],
    queryFn: ({ pageParam }) =>
      makeEventsRequest.getEventAnnouncements(eventId, pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) {
        return undefined;
      }
      const url = new URL(lastPage.next ?? "");
      const limit = url.searchParams.get("limit");
      const offset = url.searchParams.get("offset");
      return { limit, offset };
    },
    staleTime: time.minuteToMillisecond(5),
  });

  if (status === "loading") {
    return (
      <div>
        <CircularSpinner />
      </div>
    );
  }

  if (!data) {
    return <div>No data</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <div className="md:container w-full mt-4">
      {data?.pages.map((page) =>
        page.results.map((announcement) => (
          <Card key={announcement.id} className="mt-2 pt-2 w-full">
            <CardContent className="p-2 px-4">
              <h2 className="text-2xl font-bold">{announcement.title}</h2>
              <p className="text-lg">{announcement.description}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
