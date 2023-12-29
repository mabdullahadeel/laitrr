import type { StructuredResponse } from "@/types/api/common";
import type { PublicUserInfoResponse } from "@/types/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserEvents } from "./_components/UserEvents";

export const revalidate = 0;

async function fetchUserPublicData(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL!}/users/get-public-profile/${username}`
  );
  const data = await res.json();
  return data as StructuredResponse<PublicUserInfoResponse>;
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const { data: user } = await fetchUserPublicData(username);

  return (
    <div className="flex items-center flex-col">
      <div className="flex flex-col items-center">
        <Avatar className="w-40 h-40 mt-4">
          <AvatarImage src={user.profile.image || ""} />
          <AvatarFallback>{user.name_initials}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{user.full_name}</p>
        <p className="text-gray-500">@{user.username}</p>
      </div>
      <UserEvents username={user.username} />
    </div>
  );
}
