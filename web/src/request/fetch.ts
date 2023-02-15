/**
 * Functions to Fetch data from the API
 */

import { user } from "../types/auth.types";
import { chat } from "../types/chat.types";
import { ListingInfo } from "../types/listings.types";
import { message } from "../types/message.types";
import { SurveyInfo } from "../types/survey.types";
import { BioAndTags } from "../types/tags.types";
import { getAuthSession } from "../utils/storage";
import doRequest from "./request";
const backend_api = "https://api.roomfin.xyz";
// const backend_api = "http://localhost:8080";

export async function GetCurrentUserInfo() {
  return await doRequest<user>(`${backend_api}/users/me`, null, "GET", true);
}

export async function GetProfile({ userId = "" }) {
  const params = new URLSearchParams({
    userId,
  });
  return await doRequest<user>(
    `${backend_api}/users/profile?${params.toString()}`,
    null,
    "GET",
    true
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

export async function GetListings() {
  return await doRequest<ListingInfo[]>(
    `${backend_api}/listings/all`,
    null,
    "GET",
    true
  );
}

export async function GetListing(id: string) {
  return await doRequest<ListingInfo>(
    `${backend_api}/listings/${id}`,
    null,
    "GET",
    true
  );
}

export async function GetChats() {
  const endpoint = `${backend_api}/chats`;
  return await doRequest<chat[]>(endpoint, null, "GET", true);
}

export async function GetUserInfo(userId: string) {
  return await doRequest<user>(
    `${backend_api}/users/profile/${userId}`,
    null,
    "GET",
    true
  );
}

export async function GetMessages(chatId: string) {
  return await doRequest<message[]>(
    `${backend_api}/messages/asc/${chatId}`,
    null,
    "GET",
    true
  );
}
