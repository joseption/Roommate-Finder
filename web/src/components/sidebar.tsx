import { useRouter } from "next/router";
import React, { memo, useRef, useState } from "react";

interface Props {
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleHousingTypeChange: (housingType: string) => void;
  handleBedroomsChange: (bedrooms: number) => void;
  handleBathroomsChange: (bathrooms: number) => void;
  handlePetsAllowedChange: (pA: boolean) => Promise<void>;
  handleDistanceToUCFChange: (d: number) => Promise<void>;
}

const Sidebar = ({
  handlePriceChange,
  handleHousingTypeChange,
  handleBedroomsChange,
  handleBathroomsChange,
  handlePetsAllowedChange,
  handleDistanceToUCFChange,
}: Props) => {
  const router = useRouter();
  const { p, h_type, rms, brs, pA, dtu } = router.query;

  async function handleRoomsRadioChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    handleBedroomsChange(Number(e.target.value));
    await router.push({
      query: { ...router.query, rms: Number(e.target.value) },
    });
  }

  async function handleBathroomsRadioChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    handleBathroomsChange(Number(e.target.value));
    await router.push({
      query: { ...router.query, brs: Number(e.target.value) },
    });
  }

  async function handleHousingTypeRadioChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    handleHousingTypeChange(e.target.value);
    await router.push({
      query: { ...router.query, h_type: e.target.value },
    });
  }
  return (
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
            defaultValue={p ? p : 1000}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                await handlePriceChange(e);
              })(e);
            }}
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
              type="radio"
              value="Apartment"
              name="h_type"
              checked={h_type === "Apartment"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleHousingTypeRadioChange(e);
                })(e);
              }}
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
              checked={h_type === "House"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleHousingTypeRadioChange(e);
                })(e);
              }}
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
              checked={h_type === "Condo"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleHousingTypeRadioChange(e);
                })(e);
              }}
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
          defaultValue={pA ? (pA ? "Yes" : "No") : "Select"}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            void (async (e: React.ChangeEvent<HTMLSelectElement>) => {
              await handlePetsAllowedChange(
                e.target.value === "Yes" ? true : false
              );
            })(e);
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
              checked={rms ? Number(rms) === 1 : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleRoomsRadioChange(e);
                })(e);
              }}
            />
            <span className="ml-2 text-gray-700">1</span>
          </label>
          <label className="mt-3 inline-flex items-center">
            <input
              type="radio"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
              name="rooms"
              value={2}
              checked={rms ? Number(rms) === 2 : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleRoomsRadioChange(e);
                })(e);
              }}
            />
            <span className="ml-2 text-gray-700">2</span>
          </label>
          <label className="mt-3 inline-flex items-center">
            <input
              type="radio"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
              name="rooms"
              value={3}
              checked={rms ? Number(rms) === 3 : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleRoomsRadioChange(e);
                })(e);
              }}
            />
            <span className="ml-2 text-gray-700">3</span>
          </label>
          <label className="mt-3 inline-flex items-center">
            <input
              type="radio"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
              name="rooms"
              value={4}
              checked={rms ? Number(rms) === 4 : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleRoomsRadioChange(e);
                })(e);
              }}
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
              checked={brs ? Number(brs) === 1 : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleBathroomsRadioChange(e);
                })(e);
              }}
            />
            <span className="ml-2 text-gray-700">1</span>
          </label>
          <label className="mt-3 inline-flex items-center">
            <input
              type="radio"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
              name="bathroom"
              value={2}
              checked={brs ? Number(brs) === 2 : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleBathroomsRadioChange(e);
                })(e);
              }}
            />
            <span className="ml-2 text-gray-700">2</span>
          </label>
          <label className="mt-3 inline-flex items-center">
            <input
              type="radio"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
              name="bathroom"
              value={3}
              checked={brs ? Number(brs) === 3 : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleBathroomsRadioChange(e);
                })(e);
              }}
            />
            <span className="ml-2 text-gray-700">3</span>
          </label>
          <label className="mt-3 inline-flex items-center">
            <input
              type="radio"
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
              name="bathroom"
              value={4}
              checked={brs ? Number(brs) === 4 : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                void (async (e: React.ChangeEvent<HTMLInputElement>) => {
                  await handleBathroomsRadioChange(e);
                })(e);
              }}
            />
            <span className="ml-2 text-gray-700">4+</span>
          </label>
        </div>

        <h6 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
          Distance to UCF
        </h6>
        <select
          className="space-y-2 rounded text-sm"
          defaultValue={dtu ? dtu : "select"}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            void (async (e: React.ChangeEvent<HTMLSelectElement>) => {
              await handleDistanceToUCFChange(Number(e.target.value));
            })(e);
          }}
        >
          <option value="select">Select</option>
          <option value={3}>{"< 3 miles"}</option>
          <option value={6}>{"< 6 miles"}</option>
          <option value={10}>{"< 10 miles"}</option>
        </select>
        <button
          className="my-2 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-yellow-500 py-3 px-8 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
          onClick={() => (window.location.href = "/listings")}
        >
          Apply filters
        </button>
        <button
          className="my-2 flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-yellow-500 py-3 px-8 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
          onClick={() => (window.location.href = "/listings")}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
