import Image from "next/image";
import Link from "next/link";
import React from "react";

import { ListingInfo } from "../types/listings.types";

interface Props {
  listing: ListingInfo;
}

const ListingCard = ({ listing }: Props) => {
  return (
    <div className="m-4 h-96 max-w-sm overflow-hidden rounded shadow-lg">
      <Link href={`/listings/${listing.id}`}>
        <div className="h-1/2">
          <img
            className="h-full w-full object-cover object-center"
            src={listing.images[0] as string}
            alt="listing image"
            width={120}
            height={120}
          />
        </div>
        <div className="h-1/2 px-6 py-4">
          <div className="mb-2 text-xl font-bold">{listing.name}</div>
          <div className="mb-2 flex flex-wrap">
            <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
              ${listing.price}
            </span>
            <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
              {listing.city}
            </span>
            <span className="mb-2 inline-block rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
              {listing.housing_type}
            </span>
          </div>
          <p className="text-base text-gray-700 line-clamp-2">
            {listing.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
