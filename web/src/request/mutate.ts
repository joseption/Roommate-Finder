/*
 * Functions to mutate/change data on the API
 */
import type { AuthSession } from "../types/auth.types";
import { chat } from "../types/chat.types";
import { ListingInfo } from "../types/listings.types";
import { message } from "../types/message.types";
import { getAuthSession } from "../utils/storage";
import doRequest from "./request";

const backend_api = "https://api.roomfin.com";
// const backend_api = "http://localhost:8080";

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
  LastName: string,
  birthday: string
) {
  return await doRequest<AuthSession>(
    `${backend_api}/auth/register`,
    {
      name,
      LastName,
      email,
      password,
      birthday,
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

export async function UpdateFirstName(firstName: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updateFirstName`,
    {
      firstName,
    },
    "POST",
    true
  );
}

export async function UpdateLastName(lastName: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updateLastName`,
    {
      lastName,
    },
    "POST",
    true
  );
}

export async function UpdateGender(gender: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updateGender`,
    {
      gender,
    },
    "POST",
    true
  );
}

export async function UpdatePhone(phoneNumber: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updatePhoneNumber`,
    {
      phoneNumber,
    },
    "POST",
    true
  );
}

export async function UpdateCity(city: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updateCity`,
    {
      city,
    },
    "POST",
    true
  );
}

export async function UpdateState(state: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updateState`,
    {
      state,
    },
    "POST",
    true
  );
}

export async function UpdateZip(zip_code: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updateZip`,
    {
      zip_code,
    },
    "POST",
    true
  );
}

//update bday

export async function UpdateBirthday(bday: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updateBday`,
    {
      bday,
    },
    "POST",
    true
  );
}

export async function UpdateProfilePicture(profile_picture: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/users/updateProfilePicture`,
    {
      profile_picture,
    },
    "POST",
    true
  );
}

export async function CreateMatches() {
  return await doRequest<{ message: string }>(
    `${backend_api}/matches/create`,
    null,
    "POST",
    true
  );
}

export async function MakeListings(
  name: string,
  description: string,
  images: string[],
  price: number,
  city: string,
  housing_type: string,
  rooms: number,
  bathrooms: number,
  size: number,
  address: string,
  petsAllowed: boolean,
  zipcode: string
) {
  return await doRequest<ListingInfo>(
    `${backend_api}/listings`,
    {
      name,
      description,
      images,
      price,
      city,
      housing_type,
      rooms,
      bathrooms,
      size,
      address,
      petsAllowed,
      zipcode,
    },
    "POST",
    true
  );
}

export async function SendMessage(
  content: string,
  chatId: string,
  userId: string
) {
  return await doRequest<message>(
    `${backend_api}/messages/web`,
    { content, userId, chatId },
    "POST",
    true
  );
}

export async function UpdateListing(
  name: string,
  description: string,
  images: string[],
  price: number,
  city: string,
  housing_type: string,
  rooms: number | undefined,
  bathrooms: number | undefined,
  size: number | undefined,
  address: string | undefined,
  petsAllowed: boolean,
  listingId: string,
  zipcode: string
) {
  return await doRequest<ListingInfo>(
    `${backend_api}/listings/${listingId}`,
    {
      name,
      description,
      images,
      price,
      city,
      housing_type,
      rooms,
      bathrooms,
      size,
      address,
      petsAllowed,
      zipcode,
    },
    "PUT",
    true
  );
}

export async function DeleteListing(listingId: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/listings/${listingId}`,
    null,
    "DELETE",
    true
  );
}

export async function BlockChat(chatId: string, userId: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/chats/block`,
    { chatId, userId },
    "PUT",
    true
  );
}

export async function UnblockChat(chatId: string, userId: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/chats/unblock`,
    { chatId, userId },
    "PUT",
    true
  );
}

// if chat doesn't exist create one otherwise just show them it
export async function AccessChat(userIdTwo: string) {
  return await doRequest<{ chat: chat }>(
    `${backend_api}/chats`,
    { userIdTwo },
    "POST",
    true
  );
}

export async function SendSMSLink(phoneNumber: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/sms`,
    { phoneNumber },
    "POST",
    true
  );
}

export async function FavoriteListing(listingId: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/listings/favorite/${listingId}`,
    null,
    "POST",
    true
  );
}
export async function UnfavoriteListing(listingId: string) {
  return await doRequest<{ message: string }>(
    `${backend_api}/listings/unfavorite/${listingId}`,
    null,
    "POST",
    true
  );
}
