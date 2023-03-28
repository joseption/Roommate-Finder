/**
 * Functions to Fetch data from the API
 */

import { user } from "../types/auth.types";
import { chat } from "../types/chat.types";
import { ListingInfo, ListingRequest } from "../types/listings.types";
import { message } from "../types/message.types";
import { SurveyInfo } from "../types/survey.types";
import { BioAndTags } from "../types/tags.types";
import doRequest from "./request";
// const backend_api = "http://localhost:8080";
const backend_api = "https://api.roomfin.xyz";

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

export async function GetListings(
  price: number | undefined,
  housing_type: string | undefined,
  petsAllowed: boolean | undefined | null,
  rooms: number | undefined,
  bathrooms: number | undefined,
  distanceToUcf: number | undefined,
  isFavorited: boolean | undefined
) {
  return await doRequest<ListingInfo[]>(
    `${backend_api}/listings/all`,
    {
      price,
      housing_type,
      petsAllowed,
      rooms,
      bathrooms,
      distanceToUcf,
      isFavorited,
    },
    "POST",
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

export async function GetUserListings(userId: string) {
  console.log(userId, "userId fetch");
  return await doRequest<ListingInfo[]>(
    `${backend_api}/listings/all/${userId}`,
    null,
    "GET",
    true
  );
}

export async function ProfileSearch({
  search = "",
  limit = 16,
  cursorId = "",
  sortByMatchPercentage = false,
  genderType = "",
  smokingFilter = "",
  petFilter = "",
}) {
  const gender = genderType ? { genderType: genderType } : undefined;
  const smokingPreference = smokingFilter
    ? { smokingPreference: smokingFilter }
    : undefined;
  const petPreference = petFilter ? { petPreference: petFilter } : undefined;
  const params = new URLSearchParams({
    search,
    limit: limit.toString(),
    cursorId,
    sortByMatchPercentage: sortByMatchPercentage.toString(),
    ...smokingPreference,
    ...petPreference,
    ...gender,
  });
  console.log(params.toString(), "params fetch");
  return await doRequest<{ users: user[]; nextCursorId: string }>(
    `${backend_api}/users/profileSearchV2?${params.toString()}`,
    null,
    "GET",
    true
  );
}

export async function CheckFavorited(userId: string, listingId: string) {
  return await doRequest<{ isFavorited: boolean }>(
    `${backend_api}/listings/checkFavorited`,
    { userId, listingId },
    "POST",
    true
  );
}
