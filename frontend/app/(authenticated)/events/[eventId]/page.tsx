"use client";

import { makeEventsRequest } from "@/api/events.request";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/constants/query-keys";

export default function Page({ params }: { params: { eventId: string } }) {
  const query = useQuery({
    queryKey: [queryKeys.EVENT_DETAILS, params.eventId],
    queryFn: () => makeEventsRequest.getEventDetails(params.eventId),
  });

  if (query.status === "loading") {
    return <div>Loading...</div>;
  }

  if (!query.data) {
    return <div>No data</div>;
  }

  if (query.status === "error") {
    return <div>Error</div>;
  }

  return (
    <div className="container w-full mt-4">
      <h1 className="text-2xl font-bold">{query.data.title}</h1>
      <p className="text-lg">{query.data.description}</p>
    </div>
  );
}
