import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import CircularProgress from "../../components/Feedback/CircularProgress";
import IconButton from "../../components/Inputs/IconButton";
import QuestionsCard from "../../components/Surfaces/Survey/QuestionsCard";
import { GetSurveryInfo } from "../../request/fetch";
import { transitionVariants } from "../../styles/motion-definitions";

export default function Quiz() {
  const { data, isLoading } = useQuery({
    queryKey: ["Survey"],
    queryFn: () => GetSurveryInfo(),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <Head>
        <title>Quiz — Prepost</title>
      </Head>
      <motion.main
        initial={"fadeOut"}
        animate={"fadeIn"}
        exit={"fadeOut"}
        variants={transitionVariants}
        className={"flex justify-center"}
      >
        <div
          className={
            "flex w-full max-w-7xl flex-col justify-center gap-4 p-4 sm:p-6 lg:p-8"
          }
        >
          <Link scroll={false} href={"/setup/profile"} className={"w-fit"}>
            <IconButton className={"group gap-1"}>
              <ChevronLeftIcon
                className={
                  "h-6 w-6 transition-transform group-hover:-translate-x-1"
                }
              />
              Go Back to Bio & Hobbies
            </IconButton>
          </Link>
          <section
            className={"flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-6"}
          >
            <div
              className={"mx-auto flex flex-col content-center gap-4 sm:w-3/5"}
            >
              {data ? (
                <QuestionsCard
                  isLoading={isLoading}
                  SurveyData={data}
                  className={"bg-slate-50"}
                />
              ) : (
                <CircularProgress className={"mx-auto my-12 scale-[200%]"} />
              )}
            </div>
          </section>
        </div>
      </motion.main>
    </>
  );
}
