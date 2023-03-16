import { motion } from "framer-motion";
import Head from "next/head";
import { useState } from "react";

import CustomExploreFilterPopover from "../components/Surfaces/exploreFilters";
import ProfileListWithFilters from "../components/Surfaces/profileList";
import { transitionVariants } from "../styles/motion-definitions";

export default function Explore() {
  const [matchPercent, setMatchPercent] = useState(false);
  const [gender, setGender] = useState("");
  const [smokePreference, setSmokePreference] = useState("");
  const [petPreference, setPetPreference] = useState("");
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
        <div
          className={
            "relative mx-auto flex h-full  max-w-7xl items-center justify-end bg-white pr-8 pt-5"
          }
        >
          <CustomExploreFilterPopover
            gender={gender}
            petPreference={petPreference}
            smokePreference={smokePreference}
            matchPercent={matchPercent}
            setGender={setGender}
            setMatchPercent={setMatchPercent}
            setPetPreference={setPetPreference}
            setSmokePreference={setSmokePreference}
          />
        </div>
        <ProfileListWithFilters
          sortByMatchPercentage={matchPercent}
          genderType={gender}
          smokingPreference={smokePreference}
          petPreference={petPreference}
        />
      </motion.main>
    </>
  );
}
