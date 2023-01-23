export interface user {
  id: string;
  email: string;
  is_verified: boolean;
  is_setup: boolean | null;
  setup_step: string | null;
  first_name: string;
  last_name: string;
  birthday: string | null;
  phone_number: string | null;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  gender: string | null;
  bio: string | null;
  image: string | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  user?: {
    first_name: string;
    image?: string;
  };
}
