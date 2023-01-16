/**
 * Functions to Fetch data from the API
 */

import { SurveyInfo } from "../types/survey.types";
import { getAuthSession } from "../utils/storage";
import doRequest from "./request";
const backend_api = "https://api.roomfin.xyz";

export async function authenticateUser() {
  return await doRequest<{ message: string }>(
    `http://localhost:8080/auth/checkAuth`,
    {
      refreshToken: getAuthSession()?.refreshToken,
      accessToken: getAuthSession()?.accessToken,
    },
    "POST",
    false
  );
}

export async function GetSurveryInfo() {
  return await doRequest<SurveyInfo[]>(
    `${backend_api}/survey/info`,
    null,
    "GET",
    true
  );
}

export async function SurveyOnComplete() {
  return await doRequest<{ message: string }>(
    `${backend_api}/survey/verify`,
    null,
    "GET",
    true
  );
}
