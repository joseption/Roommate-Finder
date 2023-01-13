import type { AuthSession } from "../types/auth.types";

export function storeAuthSession(session: AuthSession) {
  localStorage.setItem("accessToken", session.accessToken);
  localStorage.setItem("userId", session.userId);
  localStorage.setItem("userName", session.userName ?? "");
  localStorage.setItem("userAvatar", session.userAvatar ?? "");
  localStorage.setItem("refreshToken", session.refreshToken);
}

export function getAuthSession(): AuthSession {
  return {
    accessToken: localStorage.getItem("accessToken") ?? "",
    userId: localStorage.getItem("userId") ?? "",
    userName: localStorage.getItem("userName") ?? "",
    userAvatar: localStorage.getItem("userAvatar"),
    refreshToken: localStorage.getItem("refreshToken") ?? "",
  };
}

export function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userAvatar");
  localStorage.removeItem("refreshToken");
}
