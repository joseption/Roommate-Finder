/*
 * Functions to mutate/change data on the API
 */
import type { AuthSession } from "../types/auth.types";
import { getAuthSession } from "../utils/storage";
import doRequest from "./request";

const backend_api = "https://api.roomfin.xyz";
export async function login(email: string, password: string) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/login`,
    {
      email,
      password,
    },
    "POST",
    false
  );
}

export async function register(
  email: string,
  password: string,
  name: string,
  LastName: string
) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/register`,
    {
      name,
      LastName,
      email,
      password,
    },
    "POST",
    false
  );
}

export async function reset(email: string) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/resetPassword`,
    {
      email,
    },
    "POST",
    false
  );
}

export async function authenticateUser() {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/checkAuth`,
    {
      refreshToken: getAuthSession().refreshToken,
      accessToken: getAuthSession().accessToken,
    },
    "POST",
    false
  );
}

export async function updatePassword(password: string, resetToken: string) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/updatePassword`,
    {
      password,
      resetToken,
    },
    "POST",
    false
  );
}
//confirmEmail, sendConfirmationEmail

export async function confirmEmail(emailToken: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/auth/confirmEmail`,
    {
      emailToken,
    },
    "POST",
    false
  );
}

export async function sendConfirmationEmail(email: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/auth/sendConfirmationEmail`,
    {
      email,
    },
    "POST",
    false
  );
}

export async function UpdateResponse(
  questionId: string | undefined,
  responseId: string | undefined
) {
  return await doRequest<{ message: string }>(
    `${backend_api}/survey/response`,
    {
      questionId,
      responseId,
    },
    "POST",
    true
  );
}

export async function UpdateBioAndTags(bio: string, tags: string[]) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/setupProfile`,
    {
      bio,
      tags,
    },
    "POST",
    true
  );
}
