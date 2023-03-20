import { useQuery } from "@tanstack/react-query";
import React from "react";

import { GetCurrentUserInfo, GetUserListings } from "../../request/fetch";
import { ListingInfo } from "../../types/listings.types";
import ListingCard from "../ListingCard";
import NoListingsModal from "../noListingsModal";

function ListingContent() {
  const { data: userData, isLoading: userLoading } = useQuery(["UserInfo"], {
    queryFn: () => GetCurrentUserInfo(),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { data: myListings, isLoading: listingsLoading } = useQuery(
    ["UserListings", userData ? userData.id : ""],
    () => GetUserListings(userData ? userData.id : "")
  );

  return (
    <ul
      role="list"
      className="relative mx-auto grid h-full min-h-screen max-w-7xl grid-cols-1 bg-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {myListings && myListings.length === 0 ? (
        <NoListingsModal />
      ) : (
        myListings &&
        myListings.map((listing: ListingInfo) => {
          return (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          );
        })
      )}
    </ul>
  );
}

export default ListingContent;
