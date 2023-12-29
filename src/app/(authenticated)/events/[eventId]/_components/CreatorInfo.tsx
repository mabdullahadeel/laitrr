import React from "react";
import Link from "next/link";

import { PublicUser } from "@/types/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatorInfoProps {
  user: PublicUser;
}

export const CreatorInfo: React.FC<CreatorInfoProps> = ({ user }) => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarImage src={user.profile.image || ""} />
        <AvatarFallback>{user.name_initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        {/* <div className="text-sm">{user.full_name || user.username}</div> */}
        <Link href={`/u/${user.username}`} className="hover:underline">
          {user.full_name || user.username}
        </Link>
      </div>
    </div>
  );
};
