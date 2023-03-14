import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import ProfileList from "../components/Layout/ProfileList";
import { GetAllUsers } from "../request/fetch";
import useInfiniteQueryUsers from "../request/useInfiniteQueryUsers";
import { transitionVariants } from "../styles/motion-definitions";
import { user } from "../types/auth.types";

interface Props {
  searchValue: string;
  feedSortValue: "featured" | "recent";
}

export default function Explore({ searchValue, feedSortValue }: Props) {
  // const { data, isLoading } = useQuery({
  //   queryKey: ["GetAllUsers"],
  //   queryFn: () => GetAllUsers(),
  //   onError: (err: Error) => {
  //     toast.error(err.message);
  //   },
  // });

  const { posts, isFetching, isFetchingNextPage } = useInfiniteQueryUsers({
    key: "feed_users",
    searchValue,
    // recentOnly: feedSortValue === "recent",
    queryOptions: {
      refetchOnMount: "always", // Refetch on mount regardless of staleness (e.g. if the user navigates back to the feed from another route)
      staleTime: Infinity, // Never stale. Prevents unexpected layout shifts when the post order changes while navigating the feed
    },
  });

  return (
    <>
      <Head>
        <title>Explore | RoomFin</title>
      </Head>
      <motion.main
        className={"min-h-screen bg-white"}
        initial={"fadeOut"}
        animate={"fadeIn"}
        exit={"fadeOut"}
        custom={0.4}
        variants={transitionVariants}
      >
        <ProfileList
          arePostsLoading={isFetching && !isFetchingNextPage}
          areMorePostsLoading={isFetchingNextPage}
          profiles={posts}
          className={"px-4 py-16 md:pb-8 lg:px-8"}
        />
      </motion.main>
    </>
  );
}
