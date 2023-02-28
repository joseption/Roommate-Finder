import React from "react";

import { ListingInfo } from "../types/listings.types";
import ListingCard from "./ListingCard";

interface Props {
  data: ListingInfo[];
}
function ListingContent({ data }: Props) {
  return (
    <ul
      role="list"
      className="relative mx-auto grid h-full min-h-screen max-w-7xl grid-cols-1 bg-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {data.map((listing: ListingInfo) => {
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
