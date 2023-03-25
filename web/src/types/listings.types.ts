export interface ListingInfo {
  id: string;
  name: string;
  images: string[];
  city: string;
  housing_type: string;
  price: number;
  petsAllowed: boolean;
  userId: string;
  address: string;
  bathrooms: number;
  rooms: number;
  size: number;
  description: string;
  distanceToUcf: number;
  zipcode: string;
}
export interface ListingRequest {
  housing_type: string | undefined;
  price: number | undefined;
  petsAllowed: boolean | undefined | null;
  rooms: number | undefined;
  bathrooms: number | undefined;
  distanceToUcf: number | undefined;
}

export interface ListingData {
  listing: ListingInfo;
}
