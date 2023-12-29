export type PublicProfile = {
  image: string | null;
};

export type PublicUser = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  full_name: string;
  name_initials: string;
  profile: PublicProfile;
};

export type PublicUserInfoResponse = PublicUser & { is_following: boolean };
