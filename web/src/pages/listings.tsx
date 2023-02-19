import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
// import { XIcon } from "@heroicons/react/outline";
// import { ChevronDownIcon, PlusSmIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";

import Button from "../components/Inputs/Button";
import ListingCard from "../components/ListingCard";
import Sidebar from "../components/sidebar";
import { GetListings } from "../request/fetch";
import { ListingInfo } from "../types/listings.types";
//This is a placeholder...
export default function Listings() {
  const { data, isLoading } = useQuery(["listings"], GetListings);
  const router = useRouter();

  return (
    <div className="">
      {isLoading || !data ? (
        <div>Loading...</div>
      ) : (
        <div className="flex">
          <Sidebar />
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
        </div>
      )}
    </div>
  );
}
