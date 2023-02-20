import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import Button from "../components/Inputs/Button";
import ListingCard from "../components/ListingCard";
import Sidebar from "../components/sidebar";
import { GetListings } from "../request/fetch";
import { ListingInfo, ListingRequest } from "../types/listings.types";

export default function Listings() {
  const [price, setPrice] = useState<number>(100000);
  const [housingType, setHousingType] = useState<string | undefined>();
  const [bedrooms, setBedrooms] = useState<number | undefined>();
  const [bathrooms, setBathrooms] = useState<number>();
  const [petsAllowed, setPetsAllowed] = useState<boolean | null | undefined>();
  const [distanceToUCF, setDistanceToUCF] = useState<number>();

  const handlePriceChange = useCallback(
    (p: number) => {
      setPrice(p);
    },
    [setPrice]
  );
  const handleHousingTypeChange = useCallback(
    (h: string) => {
      setHousingType(h);
    },
    [setHousingType]
  );
  const handleBedroomsChange = useCallback(
    (b: number) => {
      setBedrooms(b);
    },
    [setBedrooms]
  );
  const handleBathroomsChange = useCallback(
    (b: number) => {
      setBathrooms(b);
    },
    [setBathrooms]
  );
  const handlePetsAllowedChange = useCallback(
    (pA: boolean) => {
      setPetsAllowed(pA);
    },
    [setPetsAllowed]
  );
  const handleDistanceToUCFChange = useCallback(
    (d: number) => {
      setDistanceToUCF(d);
    },
    [setDistanceToUCF]
  );

  const listingReq: ListingRequest = {
    price: price,
    housing_type: housingType,
    rooms: bedrooms,
    bathrooms: bathrooms,
    petsAllowed: petsAllowed,
    distanceToUcf: distanceToUCF,
  };

  const { data, isLoading } = useQuery(["listings", listingReq], () =>
    GetListings(listingReq)
  );
  const router = useRouter();
  return (
    <div className="">
      {isLoading || !data ? (
        <div>Loading...</div>
      ) : (
        <div className="flex">
          <Sidebar
            handlePriceChange={handlePriceChange}
            handleHousingTypeChange={handleHousingTypeChange}
            handleBedroomsChange={handleBedroomsChange}
            handleBathroomsChange={handleBathroomsChange}
            handlePetsAllowedChange={handlePetsAllowedChange}
            handleDistanceToUCFChange={handleDistanceToUCFChange}
          />
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
