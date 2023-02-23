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
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
