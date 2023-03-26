import { Tab } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import Button from "../../components/Inputs/Button";
import {
  CheckFavorited,
  GetCurrentUserInfo,
  GetListing,
} from "../../request/fetch";
import {
  AccessChat,
  DeleteListing,
  FavoriteListing,
  UnfavoriteListing,
} from "../../request/mutate";
import { chat } from "../../types/chat.types";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function IndividualListingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isfavorited, setIsfavorited] = useState<boolean>(false);
  const [tempIsFavorite, setTempIsFavorite] = useState<boolean>();
  const debouncedFavorite = React.useRef(
    debounce((isFav: boolean) => {
      if (isFav) {
        unfavoriteListingMutation();
      } else {
        favoriteListingMutation();
      }
      setTempIsFavorite(!isFav);
    }, 500)
  ).current;

  const handleFavoriteChange = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    setTempIsFavorite(!tempIsFavorite);
    debouncedFavorite(isfavorited);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => GetListing(id as string),
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => GetCurrentUserInfo(),
    onSuccess: (data) => {},
    onError: (err) => {
      console.log(err);
    },
  });
  const {
    data: hasFavoritedData,
    isLoading: favoriteLoading,
    refetch: refetchSecondData,
  } = useQuery({
    queryKey: ["hasFavorited", userData?.id],
    queryFn: () => CheckFavorited(userData ? userData?.id : "", id as string),
    onSuccess: (data) => {
      setIsfavorited(data.isFavorited);
      setTempIsFavorite(data.isFavorited);
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteListing } = useMutation({
    mutationFn: () => DeleteListing(id as string),
    onSuccess: () => {
      void router.push("/mylistings");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
  function handleDelete() {
    if (confirm("Are you sure you want to delete this listing?")) {
      // delete listing
      deleteListing();
    }
  }

  const { mutate: favoriteListingMutation } = useMutation({
    mutationFn: () => FavoriteListing(id as string),
    onSuccess: () => {
      console.log("favorited");
      setIsfavorited(true);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: unfavoriteListingMutation } = useMutation({
    mutationFn: () => UnfavoriteListing(id as string),
    onSuccess: () => {
      console.log("unfavorited");
      setIsfavorited(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const sendMessage = useMutation({
    mutationFn: () => AccessChat(data?.userId as string),
    onSuccess: (data) => {
      void router.push(`/messages?chatId=${data.chat.id}`);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {data ? (
                  data.images.map((image) => (
                    <Tab
                      key={image}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only">{image}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-indigo-500" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))
                ) : (
                  <div>Loading...</div>
                )}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
              {data ? (
                data.images.map((image) => (
                  <Tab.Panel key={image}>
                    <img
                      src={image}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </Tab.Panel>
                ))
              ) : (
                <div>Loading...</div>
              )}
            </Tab.Panels>
          </Tab.Group>

          {/* Listing info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {data ? data.name : "Loading..."}
              </h1>
              <div
                // className="flex"
                style={
                  data?.userId === userData?.id
                    ? { display: "flex" }
                    : { display: "none" }
                }
              >
                <Link
                  href={`../editListing?listingId=${
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    Array.isArray(id) ? id.join(",") : id
                  }&numrooms=${data?.rooms ? data.rooms : 1}&numbathrooms=${
                    data?.bathrooms ? data.bathrooms : 1
                  }&housingType=${
                    data?.housing_type ? data.housing_type : "Apartment"
                  }`}
                >
                  <AiFillEdit className="" size={42} />
                </Link>
                <FaTrashAlt
                  size={36}
                  className="mx-4 self-center"
                  onClick={handleDelete}
                />
              </div>
            </div>

            <div className="mt-3">
              <h2 className="sr-only">Listing information</h2>
              <p className="text-3xl text-gray-900">{`$${
                data ? data.price : "Loading"
              }`}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                // dangerouslySetInnerHTML={{
                //   __html: data?.description ? data.description : "Loading...",
                // }}
              />
              <p className="whitespace-pre-wrap">
                {/* add loading bars here */}
                {data?.description ? data.description : "Loading..."}
              </p>
            </div>

            {data?.userId !== userData?.id && (
              <div className="mt-10 flex">
                <Button
                  onClick={() => void sendMessage.mutate()}
                  loading={sendMessage.isLoading}
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-yellow-400 py-3 px-8 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Message Owner
                </Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={tempIsFavorite ? "#F1BA43" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="my-auto ml-4 h-8 w-8 cursor-pointer"
                  onClick={(e) => handleFavoriteChange(e)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
            )}

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                <div className="px-6 pt-4 pb-2">
                  <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                    {data?.city}
                  </span>
                  <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                    {data?.housing_type}
                  </span>
                  <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                    {data?.petsAllowed ? "Pets Allowed" : "No Pets Allowed"}
                  </span>
                  {data?.rooms ? (
                    <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                      {`Bedrooms: ${data?.rooms > 3 ? "4+" : data?.rooms}`}
                    </span>
                  ) : (
                    <></>
                  )}
                  {data?.bathrooms ? (
                    <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                      {`Bathrooms: ${
                        data?.bathrooms > 3 ? "4+" : data?.bathrooms
                      }`}
                    </span>
                  ) : (
                    <></>
                  )}
                  {data?.size ? (
                    <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                      {`sq-ft: ${data?.size}`}
                    </span>
                  ) : (
                    <></>
                  )}
                  {data?.distanceToUcf ? (
                    <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                      {`Distance to UCF: ${data?.distanceToUcf} miles`}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
