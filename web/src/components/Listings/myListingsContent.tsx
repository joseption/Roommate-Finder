import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";

import { GetCurrentUserInfo, GetUserListings } from "../../request/fetch";
import {
  staggerContainerVariants,
  transitions,
  transitionVariants,
} from "../../styles/motion-definitions";
import { ListingInfo } from "../../types/listings.types";
import CircularProgress from "../Feedback/CircularProgress";
import ListingCard from "../ListingCard";

function ListingContent() {
  const router = useRouter();
  const { data: userData, isLoading: userLoading } = useQuery(["UserInfo"], {
    queryFn: () => GetCurrentUserInfo(),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const { data: myListings, isLoading: listingsLoading } = useQuery(
    ["UserListings", userData ? userData.id : ""],
    () => GetUserListings(userData ? userData.id : "")
  );
  // if (listingsLoading) return <div>Loading...</div>;
  // else if (myListings && myListings.length === 0)
  //   return (
  //     <>
  //       <div className="flex h-full min-h-screen flex-col items-center justify-center">
  //         <span
  //           className="mb-4 cursor-pointer text-4xl "
  //           onClick={() => {
  //             void router.push("/createListing");
  //           }}
  //         >
  //           👋
  //         </span>
  //         <p className="text-gray-500">Create a listing!</p>
  //       </div>
  //     </>
  //   );
  // else
  //   return (

  //   );
  if (myListings && myListings.length === 0) {
    return (
      <>
        <div className="flex h-full min-h-screen flex-col items-center justify-center">
          <span
            className="mb-4 cursor-pointer text-4xl "
            onClick={() => {
              void router.push("/createListing");
            }}
          >
            👋
          </span>
          <p className="text-gray-500">Create a listing!</p>
        </div>
      </>
    );
  }
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
          {listingsLoading ? (
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
            myListings?.map((listing: ListingInfo) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          )}
        </ul>
      </motion.ol>
    </AnimatePresence>
  );
}

export default ListingContent;
