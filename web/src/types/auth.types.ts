export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    is_verified: boolean;
    is_setup: boolean;
  };
}
