"use client";

import React from "react";
import { makeEventsRequest } from "@/api/events.request";
import { useInfiniteQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";

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
    <div className="container">
      <h1 className="mb-5 text-center text-4xl font-bold text-slate-400">
        Events Feed
      </h1>
      <div className="w-full container">
        {data?.pages.map((page) =>
          page.results.map((event) => (
            <div key={event.id}>
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <p className="text-lg">{event.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IndexPage;
