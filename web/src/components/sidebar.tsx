import { useRouter } from "next/router";
import React, { useState } from "react";

import Button from "./Inputs/Button";

export default function Sidebar() {
  const router = useRouter();
  return (
    <div className="sticky top-0 h-screen">
      <div
        id="dropdown"
        className="z-10 w-56 rounded-lg bg-white p-3 shadow dark:bg-gray-700"
      >
        <Button
          onClick={() => void router.push("/createListing")}
          className="mx-auto mb-4"
        >
          Create Listing
        </Button>
        <h6>Price</h6>
        <div className="flex items-center border-b border-gray-500 py-2">
          <span className="mr-2 font-bold text-gray-700">$</span>
          <input
            type="number"
            step="50.0"
            min="400"
            className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 focus:outline-none"
            placeholder="Enter a max price"
          />
        </div>
        <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
          Housing Type
        </h6>
        <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
          <li className="flex items-center">
            <input
              id="h_type_apartment"
              type="checkbox"
              value=""
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
              type="checkbox"
              value=""
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
              type="checkbox"
              value=""
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

        <select className="space-y-2 rounded text-sm">
          <option value="select">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <h6 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
          Rooms
        </h6>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <input
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
            />

            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              1
            </label>
          </li>
          <li className="flex items-center">
            <input
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
            />

            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              2
            </label>
          </li>
          <li className="flex items-center">
            <input
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
            />

            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              3
            </label>
          </li>
          <li className="flex items-center">
            <input
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
            />

            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              4+
            </label>
          </li>
        </ul>
        <h6 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
          Bathrooms
        </h6>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <input
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
            />

            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              1
            </label>
          </li>
          <li className="flex items-center">
            <input
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
            />

            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              2
            </label>
          </li>
          <li className="flex items-center">
            <input
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
            />

            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              3
            </label>
          </li>
          <li className="flex items-center">
            <input
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
            />

            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              4+
            </label>
          </li>
        </ul>
        <h6 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
          Distance to UCF
        </h6>
        <select className="space-y-2 rounded text-sm">
          <option value="select">Select</option>
          <option value="3">{"< 3 miles"}</option>
          <option value="6">{"< 6 miles"}</option>
          <option value="10">{"< 10 miles"}</option>
        </select>
        <button className="mt-4 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-yellow-500 py-3 px-8 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full">
          Apply filters
        </button>
      </div>
    </div>
  );
}
