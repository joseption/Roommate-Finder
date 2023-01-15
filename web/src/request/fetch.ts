/**
 * Functions to Fetch data from the API
 */

import { getAuthSession } from "../utils/storage";
import doRequest from "./request";

export async function authenticateUser() {
  return await doRequest<{ message: string }>(
    `http://localhost:8080/auth/checkAuth`,
    {
      refreshToken: getAuthSession()?.refreshToken,
      accessToken: getAuthSession()?.accessToken,
    },
    "POST"
  );
}
