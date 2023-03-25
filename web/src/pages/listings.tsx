import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Button from "../components/Inputs/Button";
import CustomListingFilterPopover from "../components/Listings/CustomListingsFilter";
import ListingContent from "../components/listingsContent";
import { transitionVariants } from "../styles/motion-definitions";

export interface Filters {
  price?: number;
  housingType?: string;
  bedrooms?: string;
  bathrooms?: string;
  petsAllowed?: string;
  distanceToUCF?: number;
  isFavorited?: boolean;
}

export default function Listings() {
  const queryClient = useQueryClient();
  const savedFilters: Filters =
    queryClient.getQueryData<Filters>(["filters"]) || {};

  const [price, setPrice] = useState<number>(savedFilters.price || 100000);
  const [housingType, setHousingType] = useState<string>(
    savedFilters.housingType || "all"
  );
  const [bedrooms, setBedrooms] = useState<string>(
    savedFilters.bedrooms || "all"
  );
  const [bathrooms, setBathrooms] = useState<string>(
    savedFilters.bathrooms || "all"
  );
  const [petsAllowed, setPetsAllowed] = useState<string>(
    savedFilters.petsAllowed || "all"
  );
  const [distanceToUCF, setDistanceToUCF] = useState<number>(
    savedFilters.distanceToUCF || 100000
  );
  const [isFavorited, setIsFavorited] = useState(
    savedFilters.isFavorited || false
  );
  const router = useRouter();

  const handleCreateListingClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push("/createListing");
  };
  return (
    <div className="">
      {
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
              <Button className="mx-4" onClick={handleCreateListingClick}>
                Create listing
              </Button>
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
                isFavorited={isFavorited}
                setIsFavorited={setIsFavorited}
                savedFilters={savedFilters}
                queryClient={queryClient}
              />
            </div>
            <ListingContent
              price={price}
              numberRooms={bedrooms}
              numberBathrooms={bathrooms}
              petsAllowed={petsAllowed}
              housingType={housingType}
              distanceToUcf={distanceToUCF}
              isFavorited={isFavorited}
            />
          </motion.main>
        </>
      }
    </div>
  );
}
