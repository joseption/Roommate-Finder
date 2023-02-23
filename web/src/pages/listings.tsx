import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import Button from "../components/Inputs/Button";
import ListingCard from "../components/ListingCard";
import ListingContent from "../components/listingsContent";
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

  function handleRoomsRadioChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleBedroomsChange(Number(e.target.value));
  }

  function handleBathroomsRadioChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleBathroomsChange(Number(e.target.value));
  }

  function handleHousingTypeRadioChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    handleHousingTypeChange(e.target.value);
  }

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
          {/* <Sidebar
            handlePriceChange={handlePriceChange}
            handleHousingTypeChange={handleHousingTypeChange}
            handleBedroomsChange={handleBedroomsChange}
            handleBathroomsChange={handleBathroomsChange}
            handlePetsAllowedChange={handlePetsAllowedChange}
            handleDistanceToUCFChange={handleDistanceToUCFChange}
          /> */}
          <div className="sticky top-0 h-screen">
            <div
              id="dropdown"
              className="z-10 w-56 rounded-lg bg-white p-3 shadow dark:bg-gray-700"
            >
              <button
                className="my-4 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-yellow-500 py-3 px-8 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                onClick={() => void router.push("/createListing")}
              >
                Create Listing
              </button>
              <h6>Price</h6>
              <div className="flex items-center border-b border-gray-500 py-2">
                <span className="mr-2 font-bold text-gray-700">$</span>
                <input
                  type="number"
                  step="50.0"
                  min="400"
                  // onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 focus:outline-none"
                  placeholder="Enter a max price"
                />
              </div>
              <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                Housing Type
              </h6>
              <ul
                className="space-y-2 text-sm"
                aria-labelledby="dropdownDefault"
              >
                <li className="flex items-center">
                  <input
                    id="h_type_apartment"
                    type="radio"
                    value="Apartment"
                    name="h_type"
                    onChange={handleHousingTypeRadioChange}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
                  />

                  <label
                    htmlFor="h_type_apartment"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Apartment
                  </label>
                </li>

                <li className="flex items-center">
                  <input
                    id="h_type_house"
                    type="radio"
                    value="House"
                    name="h_type"
                    onChange={handleHousingTypeRadioChange}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
                  />

                  <label
                    htmlFor="h_type_house"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    House
                  </label>
                </li>

                <li className="flex items-center">
                  <input
                    id="condo"
                    type="radio"
                    value="Condo"
                    name="h_type"
                    onChange={handleHousingTypeRadioChange}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
                  />

                  <label
                    htmlFor="condo"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Condo
                  </label>
                </li>
              </ul>
              <h6 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                Pets Allowed
              </h6>

              <select
                className="space-y-2 rounded text-sm"
                onChange={(e) => {
                  handlePetsAllowedChange(
                    e.target.value === "Yes" ? true : false
                  );
                }}
              >
                <option value="Select">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <h6 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                Rooms
              </h6>
              <div className="flex flex-col space-y-2 text-sm">
                <label className="mt-3 inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                    name="rooms"
                    value={1}
                    onChange={handleRoomsRadioChange}
                  />
                  <span className="ml-2 text-gray-700">1</span>
                </label>
                <label className="mt-3 inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                    name="rooms"
                    value={2}
                    onChange={handleRoomsRadioChange}
                  />
                  <span className="ml-2 text-gray-700">2</span>
                </label>
                <label className="mt-3 inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                    name="rooms"
                    value={3}
                    onChange={handleRoomsRadioChange}
                  />
                  <span className="ml-2 text-gray-700">3</span>
                </label>
                <label className="mt-3 inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                    name="rooms"
                    value={4}
                    onChange={handleRoomsRadioChange}
                  />
                  <span className="ml-2 text-gray-700">4+</span>
                </label>
              </div>
              <h6 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                Bathrooms
              </h6>

              <div className="flex flex-col space-y-2 text-sm">
                <label className="mt-3 inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                    name="bathroom"
                    value={1}
                    onChange={handleBathroomsRadioChange}
                  />
                  <span className="ml-2 text-gray-700">1</span>
                </label>
                <label className="mt-3 inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                    name="bathroom"
                    value={2}
                    onChange={handleBathroomsRadioChange}
                  />
                  <span className="ml-2 text-gray-700">2</span>
                </label>
                <label className="mt-3 inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                    name="bathroom"
                    value={3}
                    onChange={handleBathroomsRadioChange}
                  />
                  <span className="ml-2 text-gray-700">3</span>
                </label>
                <label className="mt-3 inline-flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                    name="bathroom"
                    value={4}
                    onChange={handleBathroomsRadioChange}
                  />
                  <span className="ml-2 text-gray-700">4+</span>
                </label>
              </div>

              <h6 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                Distance to UCF
              </h6>
              <select
                className="space-y-2 rounded text-sm"
                onChange={(e) => {
                  // setMaxDistToUCF(Number(e.target.value));
                  handleDistanceToUCFChange(Number(e.target.value));
                }}
              >
                <option value="select">Select</option>
                <option value={3}>{"< 3 miles"}</option>
                <option value={6}>{"< 6 miles"}</option>
                <option value={10}>{"< 10 miles"}</option>
              </select>
            </div>
          </div>
          <ListingContent data={data} />
        </div>
      )}
    </div>
  );
}
