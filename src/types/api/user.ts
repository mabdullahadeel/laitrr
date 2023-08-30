export type PublicUser = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  full_name: string;
  name_initials: string;
  profile: {
    id: string;
    profile_image: string | null;
    oauth_profile_image: string | null;
  };
};
