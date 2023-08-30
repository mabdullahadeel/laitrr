import React from "react";

import { PublicUser } from "@/types/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatorInfoProps {
  user: PublicUser;
}

export const CreatorInfo: React.FC<CreatorInfoProps> = ({ user }) => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarImage
          src={user.profile.profile_image || user.profile.oauth_profile_image}
        />
        <AvatarFallback>{user.name_initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="text-sm">{user.full_name || user.username}</div>
      </div>
    </div>
  );
};
