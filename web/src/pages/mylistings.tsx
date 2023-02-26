import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useRef, useState } from "react";

import ListingContent from "../components/listingsContent";
import NoListingsModal from "../components/noListingsModal";
import { GetCurrentUserInfo, GetUserListings } from "../request/fetch";
export default function Mylistings() {
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
    <div className="">
      {listingsLoading || !myListings ? (
        <div>Loading...</div>
      ) : (
        <div className="flex">
          {myListings.length > 0 ? (
            <ListingContent data={myListings} />
          ) : (
            <NoListingsModal />
          )}
        </div>
      )}
    </div>
  );
}
