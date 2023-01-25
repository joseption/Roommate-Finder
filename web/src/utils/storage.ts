import type { AuthSession } from "../types/auth.types";

export function storeAuthSession(session: AuthSession) {
  localStorage.setItem("accessToken", session.accessToken);
  localStorage.setItem("userId", session.userId);
  localStorage.setItem("first_name", session.user?.first_name ?? "");
  localStorage.setItem("image", session.user?.image ?? "");
  localStorage.setItem("refreshToken", session.refreshToken);
}

export function getAuthSession(): AuthSession {
  return {
    accessToken: localStorage.getItem("accessToken") ?? "",
    userId: localStorage.getItem("userId") ?? "",
    refreshToken: localStorage.getItem("refreshToken") ?? "",
  };
}

export function getUserImage(): string | null {
  return localStorage.getItem("image") ?? null;
}

export function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("first_name");
  localStorage.removeItem("image");
  localStorage.removeItem("refreshToken");
}
