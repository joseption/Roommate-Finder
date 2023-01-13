/*
 * Functions to mutate/change data on the API
 */
import type { AuthSession } from "../types/auth.types";
import { getAuthSession } from "../utils/storage";
import doRequest from "./request";

export async function login(email: string, password: string) {
  return await doRequest<AuthSession>(
    "http://localhost:8080/auth/login",
    {
      email,
      password,
    },
    "POST"
  );
}

export async function register(
  email: string,
  password: string,
  name: string,
  LastName: string
) {
  return await doRequest<AuthSession>(
    "http://localhost:8080/auth/register",
    {
      name,
      LastName,
      email,
      password,
    },
    "POST"
  );
}

export async function reset(email: string) {
  return await doRequest<AuthSession>(
    "http://localhost:8080/auth/resetPassword",
    {
      email,
    },
    "POST"
  );
}

export async function authenticateUser() {
  return await doRequest<AuthSession>(
    `http://localhost:8080/auth/checkAuth`,
    {
      refreshToken: getAuthSession().refreshToken,
      accessToken: getAuthSession().accessToken,
    },
    "POST"
  );
}
