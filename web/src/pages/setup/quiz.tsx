import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";

import IconButton from "../../components/Inputs/IconButton";
import QuestionsCard from "../../components/Surfaces/Survey/QuestionsCard";
import { transitionVariants } from "../../styles/motion-definitions";

export default function Quiz() {
  return (
    <>
      <Head>
        <title>Quiz</title>
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
          <section
            className={"flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-6"}
          >
            <div
              className={"mx-auto flex flex-col content-center gap-4 sm:w-3/5"}
            >
              <QuestionsCard className={"bg-slate-50"} />
            </div>
          </section>
        </div>
      </motion.main>
    </>
  );
}
