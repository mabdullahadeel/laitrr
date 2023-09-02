"use client";

import { makeEventsRequest } from "@/api/events.request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

import { queryKeys } from "@/lib/constants/query-keys";
import { Button } from "@/components/ui/button";
import { CircularSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";

import { CreatorInfo } from "./_components/CreatorInfo";
import { EventAnnouncements } from "./_components/EventAnnouncements";
import { EventOptionsMenu } from "./_components/EventOptionsMenu";

export default function Page({ params }: { params: { eventId: string } }) {
  const query = useQuery({
    queryKey: [queryKeys.EVENT_DETAILS, params.eventId],
    queryFn: () => makeEventsRequest.getEventDetails(params.eventId),
    staleTime: 1000 * 60 * 1,
  });
  const followMutation = useMutation({
    mutationFn: () => makeEventsRequest.followEvent(params.eventId),
    onSuccess: () => {
      query.refetch();
    },
  });
  const unfollowMutation = useMutation({
    mutationFn: () => makeEventsRequest.unfollowEvent(params.eventId),
    onSuccess: () => {
      query.refetch();
    },
  });
  const { data: session } = useSession();

  const handleFollowUnfollow = () => {
    if (query.data?.user_following_event) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (query.status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <CircularSpinner size={30} />
      </div>
    );
  }

  if (!query.data) {
    return <div>No data</div>;
  }

  if (query.status === "error") {
    return <div className="text-center text-3xl font-bold">Error</div>;
  }

  return (
    <div className="md:container w-full mt-4">
      <h1 className="text-2xl font-bold">{query.data.title}</h1>
      <div className="flex justify-between">
        <h4 className="text-sm text-muted-foreground">
          Posted {formatDistanceToNow(new Date(query.data.created_at))} ago
        </h4>
        {session?.user?.id !== query.data.owner.id && (
          <Button
            onClick={handleFollowUnfollow}
            disabled={
              followMutation.isLoading ||
              unfollowMutation.isLoading ||
              query.isLoading
            }
          >
            {query.data.user_following_event ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
      <p className="text-lg">{query.data.description}</p>
      <Separator className="my-2" />
      <div className="flex justify-between">
        <CreatorInfo user={query.data.owner} />
        <EventOptionsMenu
          isOwner={session?.user?.id === query.data.owner.id}
          eventId={query.data.id}
        />
      </div>
      <Separator className="my-2" />
      <EventAnnouncements
        isOwner={session?.user.id === query.data.owner.id}
        eventId={query.data.id}
      />
    </div>
  );
}
