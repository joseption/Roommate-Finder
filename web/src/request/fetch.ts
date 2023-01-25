/**
 * Functions to Fetch data from the API
 */

import { user } from "../types/auth.types";
import { SurveyInfo } from "../types/survey.types";
import { BioAndTags } from "../types/tags.types";
import { getAuthSession } from "../utils/storage";
import doRequest from "./request";
// const backend_api = "https://api.roomfin.xyz";
const backend_api = "http://localhost:8080";
export async function GetCurrentUserInfo() {
  return await doRequest<user>(`${backend_api}/users/me`, null, "GET", true);
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

export async function GetBioAndTags() {
  return await doRequest<BioAndTags>(
    `${backend_api}/users/getBioAndTags`,
    null,
    "GET",
    true
  );
}

export async function GetAllUsers() {
  return await doRequest<user[]>(
    `${backend_api}/users/Allprofiles`,
    null,
    "GET",
    true
  );
}
