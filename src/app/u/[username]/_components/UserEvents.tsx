"use client";

import React from "react";
import Link from "next/link";
import { makeEventsRequest } from "@/api/events.request";
import { useQuery } from "@tanstack/react-query";

import { TEventListResponseItem } from "@/types/api/event";
import { queryKeys } from "@/lib/constants/query-keys";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircularSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserEventsProps {
  username: string;
}

const EventsList: React.FC<{ events: TEventListResponseItem[] }> = ({
  events,
}) => {
  if (!events.length) {
    return <div className="flex justify-center">No events</div>;
  }

  return (
    <div className="md:container w-full mt-4">
      {events.map((event) => (
        <Card key={event.id} className="mt-2 pt-2 w-full">
          <CardContent className="p-2 px-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <p className="text-lg">{event.description}</p>
            </div>
            <Link className={buttonVariants()} href={`/events/${event.id}`}>
              View
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const UserEvents: React.FC<UserEventsProps> = ({ username }) => {
  const [tab, setTab] = React.useState<"upcoming" | "past">("upcoming");
  const query = useQuery({
    queryKey: [queryKeys.GET_USER_EVENTS, username, tab] as const,
    queryFn: async ({ queryKey: qk }) => {
      const res = await makeEventsRequest.getUserEvents(qk[1], {
        limit: 50,
        offset: 0,
        filter: qk[2],
      });
      return res.results;
    },
  });

  return (
    <Tabs defaultValue="upcoming" className="mt-4 w-full">
      <TabsList>
        <TabsTrigger value="upcoming" onClick={() => setTab("upcoming")}>
          Upcoming
        </TabsTrigger>
        <TabsTrigger value="past" onClick={() => setTab("past")}>
          Past
        </TabsTrigger>
      </TabsList>
      {query.isLoading ? (
        <div className="flex justify-center">
          <CircularSpinner />
        </div>
      ) : (
        <>
          <TabsContent value="upcoming">
            <EventsList events={query.data ?? []} />
          </TabsContent>
          <TabsContent value="past">
            <EventsList events={query.data ?? []} />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
