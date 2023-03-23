import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";

import { GetCurrentUserInfo, GetUserListings } from "../../request/fetch";
import { ListingInfo } from "../../types/listings.types";
import ListingCard from "../ListingCard";
import NoListingsModal from "../noListingsModal";

function ListingContent() {
  const router = useRouter();
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
  if (listingsLoading) return <div>Loading...</div>;
  else if (myListings && myListings.length === 0)
    return (
      <>
        <div className="flex h-full min-h-screen flex-col items-center justify-center">
          <span
            className="mb-4 cursor-pointer text-4xl "
            onClick={() => {
              void router.push("/createListing");
            }}
          >
            👋
          </span>
          <p className="text-gray-500">Create a listing!</p>
        </div>
      </>
    );
  else
    return (
      <ul
        role="list"
        className="relative mx-auto grid h-full min-h-screen max-w-7xl grid-cols-1 bg-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {myListings?.map((listing: ListingInfo) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </ul>
    );
}

export default ListingContent;
