import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import ListingContent from "../components/listingsContent";
import Sidebar from "../components/sidebar";
import { GetListings } from "../request/fetch";
import { ListingRequest } from "../types/listings.types";

export default function Listings() {
  const router = useRouter();
  const [price, setPrice] = useState<number>(100000);
  const [housingType, setHousingType] = useState<string | undefined>();
  const [bedrooms, setBedrooms] = useState<number | undefined>();
  const [bathrooms, setBathrooms] = useState<number>();
  const [petsAllowed, setPetsAllowed] = useState<boolean | null | undefined>();
  const [distanceToUCF, setDistanceToUCF] = useState<number>();

  // const debouncedPrice = React.useRef(
  //   debounce((e: React.ChangeEvent<HTMLInputElement>) => {
  //     setPrice(Number(e.target.value));
  //   }, 500)
  // ).current;

  // const handlePriceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   debouncedPrice(e);
  //   await router.push({
  //     query: { ...router.query, p: Number(e.target.value) },
  //   });
  // };
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
    async (pA: boolean) => {
      setPetsAllowed(pA);
      await router.push({ query: { ...router.query, pA: pA } });
    },
    [router]
  );
  const handleDistanceToUCFChange = useCallback(
    async (d: number) => {
      setDistanceToUCF(d);
      await router.push({ query: { ...router.query, dtu: d } });
    },
    [router]
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
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            handlePetsAllowedChange={handlePetsAllowedChange}
            handleDistanceToUCFChange={handleDistanceToUCFChange}
          />
          <ListingContent data={data} />
        </div>
      )}
    </div>
  );
}
