import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

import Button from "../components/Inputs/Button";
import ListingCard from "../components/ListingCard";
import Sidebar from "../components/sidebar";
import { GetListings } from "../request/fetch";
import { ListingInfo } from "../types/listings.types";

export default function Listings() {
  const [price, setPrice] = useState<number>(100000);
  const [housingType, setHousingType] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [petsAllowed, setPetsAllowed] = useState<boolean | null | undefined>();
  const [distanceToUCF, setDistanceToUCF] = useState<number>(11);
  const { data, isLoading } = useQuery(["listings"], GetListings);
  const router = useRouter();

  return (
    <div className="">
      {isLoading || !data ? (
        <div>Loading...</div>
      ) : (
        <div className="flex">
          <Sidebar
            price={price}
            setPrice={setPrice}
            housingType={housingType}
            setHousingType={setHousingType}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            petsAllowed={petsAllowed}
            setPetsAllowed={setPetsAllowed}
            distanceToUCF={distanceToUCF}
            setDistanceToUCF={setDistanceToUCF}
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
