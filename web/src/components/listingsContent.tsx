import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { GetListings } from "../request/fetch";
import {
  staggerContainerVariants,
  staggerItemVariants,
  transitions,
  transitionVariants,
} from "../styles/motion-definitions";
import { ListingInfo } from "../types/listings.types";
import CircularProgress from "./Feedback/CircularProgress";
import ListingCard from "./ListingCard";

interface Props {
  price: number;
  numberRooms: string;
  numberBathrooms: string;
  petsAllowed: string;
  housingType: string;
  distanceToUcf: number;
  isFavorited: boolean;
}

function ListingContent({
  price,
  numberRooms,
  numberBathrooms,
  petsAllowed,
  housingType,
  distanceToUcf,
  isFavorited,
}: Props) {
  const { data, isLoading } = useQuery(
    [
      "listings",
      {
        price,
        numberRooms,
        numberBathrooms,
        petsAllowed,
        housingType,
        distanceToUcf,
        isFavorited,
      },
    ],
    () =>
      GetListings(
        price !== 100000 ? price : undefined,
        housingType !== "all" ? housingType : undefined,
        petsAllowed !== "all"
          ? petsAllowed === "yes"
            ? true
            : false
          : undefined,
        numberRooms !== "all" ? Number(numberRooms) : undefined,
        numberBathrooms !== "all" ? Number(numberBathrooms) : undefined,
        distanceToUcf !== 100000 ? distanceToUcf : undefined,
        isFavorited
      )
  );

  return (
    <AnimatePresence mode={"popLayout"}>
      <motion.ol
        variants={staggerContainerVariants}
        initial={"hidden"}
        animate={"show"}
        exit={"hidden"}
        transition={transitions.springStiff}
      >
        <ul
          role="list"
          className="relative mx-auto grid h-full min-h-screen max-w-7xl grid-cols-1 bg-white sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {isLoading ? (
            <motion.div
              key={"loadingPosts"}
              variants={transitionVariants}
              initial="fadeOut"
              animate="fadeIn"
              exit="fadeOut"
              className={
                "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center sm:text-xl"
              }
            >
              <motion.div
                variants={transitionVariants}
                initial={"fadeOut"}
                animate={"fadeIn"}
              >
                <CircularProgress className={"scale-[200%]"} />
              </motion.div>
            </motion.div>
          ) : (
            data &&
            data.map((listing: ListingInfo) => {
              return (
                <li key={listing.id}>
                  <ListingCard listing={listing} />
                </li>
              );
            })
          )}
        </ul>
      </motion.ol>
    </AnimatePresence>
  );
}

export default ListingContent;
