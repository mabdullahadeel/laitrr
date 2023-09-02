import React, { useState } from "react";
import { makeEventsRequest } from "@/api/events.request";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

import { queryKeys } from "@/lib/constants/query-keys";
import { time } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircularSpinner } from "@/components/ui/loading-spinner";
import { EventAnnouncementForm } from "@/components/forms/event-announcement-cu";

import { AnnouncementOptionsMenu } from "./AnnouncementOptionsMenu";

interface EventAnnouncementsProps {
  eventId: string;
  isOwner?: boolean;
}

export const EventAnnouncements: React.FC<EventAnnouncementsProps> = ({
  eventId,
  isOwner,
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState("");
  const [open, setOpen] = useState(!!selectedAnnouncement);

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
    <>
      <div className="md:container w-full mt-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Announcements</h2>
          {isOwner && (
            <Button variant="outline" onClick={() => setOpen(true)}>
              Create announcement
            </Button>
          )}
        </div>
        {data?.pages.map((page) =>
          page.results.map((announcement) => (
            <Card key={announcement.id} className="mt-2 pt-2 w-full">
              <CardContent className="p-2 px-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold">{announcement.title}</h2>
                  <div className="flex gap-2 items-center">
                    <p className="text-sm text-muted-foreground">
                      Last Updated{" "}
                      {formatDistanceToNow(new Date(announcement.created_at))}{" "}
                      ago
                    </p>
                    {isOwner && (
                      <AnnouncementOptionsMenu
                        eventId={eventId}
                        announcementId={announcement.id}
                        isOwner={isOwner}
                      />
                    )}
                  </div>
                </div>
                <p className="text-lg">{announcement.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Announcement</DialogTitle>
            <DialogDescription>
              <EventAnnouncementForm
                eventId={eventId}
                announcementId={selectedAnnouncement}
                onSuccess={() => setOpen(false)}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
