import { useQuery } from "@tanstack/react-query";
import React from "react";

import { GetListings } from "../request/fetch";
import { ListingInfo } from "../types/listings.types";
import ListingCard from "./ListingCard";

interface Props {
  price: number;
  numberRooms: string;
  numberBathrooms: string;
  petsAllowed: string;
  housingType: string;
  distanceToUcf: number;
}

function ListingContent({
  price,
  numberRooms,
  numberBathrooms,
  petsAllowed,
  housingType,
  distanceToUcf,
}: Props) {
  const { data, isLoading } = useQuery(
    [
      "listings",
      {
        price,
        numberRooms,
        numberBathrooms,
        petsAllowed,
        housingType,
        distanceToUcf,
      },
    ],
    () =>
      GetListings(
        price !== 100000 ? price : undefined,
        housingType !== "all" ? housingType : undefined,
        petsAllowed !== "all"
          ? petsAllowed === "yes"
            ? true
            : false
          : undefined,
        numberRooms !== "all" ? Number(numberRooms) : undefined,
        numberBathrooms !== "all" ? Number(numberBathrooms) : undefined,
        distanceToUcf !== 100000 ? distanceToUcf : undefined
      )
  );

  return (
    <ul
      role="list"
      className="relative mx-auto grid h-full min-h-screen max-w-7xl grid-cols-1 bg-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {data &&
        data.map((listing: ListingInfo) => {
          return (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          );
        })}
    </ul>
  );
}

export default ListingContent;
