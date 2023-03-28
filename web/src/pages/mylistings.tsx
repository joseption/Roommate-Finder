import { motion } from "framer-motion";
import React from "react";

import ListingContent from "../components/Listings/myListingsContent";
import { transitionVariants } from "../styles/motion-definitions";

export default function Mylistings() {
  return (
    <motion.main
      className={"min-h-screen bg-white"}
      initial={"fadeOut"}
      animate={"fadeIn"}
      exit={"fadeOut"}
      custom={0.4}
      variants={transitionVariants}
    >
      <div>
        <ListingContent />
      </div>
    </motion.main>
  );
}
