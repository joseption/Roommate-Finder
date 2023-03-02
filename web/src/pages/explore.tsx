import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import ProfileList from "../components/Layout/ProfileList";
import { GetAllUsers } from "../request/fetch";
import { transitionVariants } from "../styles/motion-definitions";
import { user } from "../types/auth.types";

export default function Explore() {
  const { data, isLoading } = useQuery({
    queryKey: ["GetAllUsers"],
    queryFn: () => GetAllUsers(),
    onError: (err: Error) => {
      toast.error(err.message);
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
          arePostsLoading={isLoading}
          areMorePostsLoading={false}
          profiles={data}
          className={"px-4 py-16 md:pb-8 lg:px-8"}
        />
      </motion.main>
    </>
  );
}
