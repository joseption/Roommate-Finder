import { Tab } from "@headlessui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

import { GetListing } from "../../request/fetch";
import { DeleteListing } from "../../request/mutate";
import { ListingInfo } from "../../types/listings.types";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const router = useRouter();
  const { id } = router.query;
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

  const { mutate: deleteListing } = useMutation({
    mutationFn: () => DeleteListing(id as string),
    onSuccess: () => {
      void router.push("/listings");
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
              <div className="flex">
                <Link
                  href={`../editListing?listingId=${
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    Array.isArray(id) ? id.join(",") : id
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
                dangerouslySetInnerHTML={{
                  __html: data?.description ? data.description : "Loading...",
                }}
              />
            </div>

            <div className="mt-10 flex sm:flex-col">
              <button className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-yellow-500 py-3 px-8 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full">
                Message Owner
              </button>
            </div>

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
                      {`Bedrooms: ${data?.rooms}`}
                    </span>
                  ) : (
                    <></>
                  )}
                  {data?.bathrooms ? (
                    <span className="mr-2 mb-2 inline-block rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
                      {`Bathrooms: ${data?.bathrooms}`}
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
