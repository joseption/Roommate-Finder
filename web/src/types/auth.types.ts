export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
}
