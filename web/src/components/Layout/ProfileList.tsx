import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import {
  staggerContainerVariants,
  staggerItemVariants,
  transitions,
  transitionVariants,
} from "../../styles/motion-definitions";
import type { user } from "../../types/auth.types";
import CircularProgress from "../Feedback/CircularProgress";
import ProfileCard from "../Surfaces/ProfileCard";

interface Props {
  profiles: user[] | undefined;
  arePostsLoading: boolean;
  areMorePostsLoading?: boolean;
  noPostsMessage?: string;
  className?: string;
}

export default function ProfileList({
  profiles,
  arePostsLoading,
  areMorePostsLoading,
  noPostsMessage = "Nothing to show 😔",
  className = "",
}: Props) {
  return (
    <section
      className={`relative mx-auto h-full min-h-screen max-w-7xl bg-white`}
    >
      <AnimatePresence mode={"popLayout"}>
        {profiles?.length ? (
          <div key={"postList"}>
            <motion.ol
              variants={staggerContainerVariants}
              initial={"hidden"}
              animate={"show"}
              exit={"hidden"}
              transition={transitions.springStiff}
              className={`grid list-none grid-cols-fill-10 justify-items-center gap-2 sm:grid-cols-fill-20 md:gap-4 
            lg:grid-cols-fill-30 2xl:grid-cols-fill-40 ${className}`}
            >
              <AnimatePresence mode={"popLayout"}>
                {profiles
                  .filter((profile) => profile.image)
                  .map((profile, idx) => (
                    <motion.li
                      key={profile.id}
                      layout
                      variants={staggerItemVariants}
                      exit={{ opacity: 0 }}
                      transition={transitions.springDamp}
                      className={"h-full w-full"}
                    >
                      <ProfileCard
                        id={profile.id}
                        src={profile.image ? profile.image : "/placeholder.png"}
                        bio={profile.bio}
                        authorName={profile.first_name}
                        tags={profile.tags}
                        matches={profile.matches}
                      />
                    </motion.li>
                  ))}
              </AnimatePresence>
            </motion.ol>
            {areMorePostsLoading && (
              <motion.div
                variants={transitionVariants}
                initial={"fadeOut"}
                animate={"fadeIn"}
                className={"flex justify-center p-16"}
              >
                <CircularProgress className={"scale-[200%]"} />
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            key={"noPosts"}
            variants={transitionVariants}
            initial="fadeOut"
            animate="fadeIn"
            exit="fadeOut"
            className={
              "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center sm:text-xl"
            }
          >
            {arePostsLoading ? (
              <motion.div
                variants={transitionVariants}
                initial={"fadeOut"}
                animate={"fadeIn"}
              >
                <CircularProgress className={"scale-[200%]"} />
              </motion.div>
            ) : (
              <motion.p
                variants={transitionVariants}
                initial={"fadeOut"}
                animate={"fadeIn"}
              >
                {noPostsMessage}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
