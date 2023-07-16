"use client";

import React from "react";
import Link from "next/link";
import { makeEventsRequest } from "@/api/events.request";
import { useInfiniteQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const IndexPage = () => {
  const { data, status } = useInfiniteQuery({
    queryKey: [queryKeys.EVENTS_FEED],
    queryFn: () => makeEventsRequest.getEventsFeed(),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) {
        return undefined;
      }
      const url = new URL(lastPage.next ?? "");
      const limit = url.searchParams.get("limit");
      const offset = url.searchParams.get("offset");
      return { limit, offset };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (status === "loading") {
    return <div>Loading...</div>;
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
        page.results.map((event) => (
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
        ))
      )}
    </div>
  );
};

export default IndexPage;
