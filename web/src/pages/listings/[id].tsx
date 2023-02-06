import { Disclosure, Tab } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { GetListing } from "../../request/fetch";
import { ListingInfo } from "../../types/listings.types";

const product = {
  name: "Zip Tote Basket",
  price: "$140",
  rating: 4,
  images: [
    {
      id: 1,
      name: "Angled view",
      src: "https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg",
      alt: "Angled front view with bag zipped and handles upright.",
    },
    // More images...
  ],
  colors: [
    {
      name: "Washed Black",
      bgColor: "bg-gray-700",
      selectedColor: "ring-gray-700",
    },
    { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
    {
      name: "Washed Gray",
      bgColor: "bg-gray-500",
      selectedColor: "ring-gray-500",
    },
  ],
  description: `
      <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
    `,
  details: [
    {
      name: "More Details",
      items: [
        "Multiple strap configurations",
        "Spacious interior with top zip",
        "Leather handle and tabs",
        "Interior dividers",
        "Stainless strap loops",
        "Double stitched construction",
        "Water-resistant",
      ],
    },
    // More sections...
  ],
};

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
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className="bg-white">
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
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {data ? data.name : "Loading..."}
            </h1>

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

            <div className="sm:flex-col1 mt-10 flex">
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
