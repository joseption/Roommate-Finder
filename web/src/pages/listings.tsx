import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Button from "../components/Inputs/Button";
import CustomListingFilterPopover from "../components/Listings/CustomListingsFilter";
import ListingContent from "../components/listingsContent";
import { transitionVariants } from "../styles/motion-definitions";

export default function Listings() {
  const [price, setPrice] = useState<number>(100000);
  const [housingType, setHousingType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("all");
  const [bathrooms, setBathrooms] = useState<string>("all");
  const [petsAllowed, setPetsAllowed] = useState<string>("all");
  const [distanceToUCF, setDistanceToUCF] = useState<number>(100000);
  const [isFavorited, setIsFavorited] = useState(false);
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
