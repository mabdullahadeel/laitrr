"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface UserAvatarProps {
  src: string;
  fallback: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, fallback }) => {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};
