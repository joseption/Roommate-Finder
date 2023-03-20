import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import CustomListingFilterPopover from "../components/Listings/CustomListingsFilter";
import ListingContent from "../components/listingsContent";
import Sidebar from "../components/sidebar";
import { GetListings } from "../request/fetch";
import { transitionVariants } from "../styles/motion-definitions";
import { ListingRequest } from "../types/listings.types";

export default function Listings() {
  const [price, setPrice] = useState<number>(100000);
  const [housingType, setHousingType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("all");
  const [bathrooms, setBathrooms] = useState<string>("all");
  const [petsAllowed, setPetsAllowed] = useState<string>("all");
  const [distanceToUCF, setDistanceToUCF] = useState<number>(100000);

  const { data, isLoading } = useQuery(["listings"], () => GetListings());
  return (
    <div className="">
      {isLoading || !data ? (
        <div>Loading...</div>
      ) : (
        <>
          <motion.main
            className={"min-h-screen bg-white"}
            initial={"fadeOut"}
            animate={"fadeIn"}
            exit={"fadeOut"}
            custom={0.4}
            variants={transitionVariants}
          >
            <div
              className={
                "relative mx-auto flex h-full  max-w-7xl items-center justify-end bg-white pr-8 pt-5"
              }
            >
              <CustomListingFilterPopover
                price={price}
                setPrice={setPrice}
                numberRooms={bedrooms}
                setNumberRooms={setBedrooms}
                numberBathrooms={bathrooms}
                setNumberBathrooms={setBathrooms}
                petsAllowed={petsAllowed}
                setPetsAllowed={setPetsAllowed}
                housingType={housingType}
                setHousingType={setHousingType}
                distanceToUcf={distanceToUCF}
                setDistanceToUcf={setDistanceToUCF}
              />
            </div>
            <ListingContent data={data} />
          </motion.main>
        </>
      )}
    </div>
  );
}
