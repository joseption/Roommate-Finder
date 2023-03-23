import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdLibraryAdd } from "react-icons/md";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { AccessChat } from "../../request/mutate";
import { transitions } from "../../styles/motion-definitions";
import { Matches } from "../../types/auth.types";
import { Tags } from "../../types/tags.types";
import Button from "../Inputs/Button";
import ProfileTags from "../Layout/ProfileTags";
// import AddToCollectionPanel from "../Panels/AddToCollectionPanel";
import Card from "../Surfaces/Card";
import CustomImage from "../Surfaces/CustomImage";
import Author from "../Widgets/Author";
// import FloatingImageActions from "../Widgets/FloatingImageActions";
import StyledDialog from "./StyledDialog";
interface Props {
  id: string;
  src: string | null;
  birthday: string | null | undefined;
  bio: string;
  authorName: string;
  isOpen: boolean;
  tags?: Tags[] | null;
  matches?: Matches[] | null;
  onClose: () => void;
}

export default function ProfileDialog({
  id,
  src,
  bio,
  authorName,
  isOpen,
  tags,
  matches,
  birthday,
  onClose,
}: Props) {
  //#region Hooks
  const md = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const handleDialogClose = () => {
    onClose();
  };

  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  useEffect(() => {
    if (tags && tags.length > 0) {
      const SelectedTags = tags.map((tagObj) => tagObj.tag);
      setSelectedStyles(SelectedTags);
    }
  }, []);

  const sendMessage = useMutation({
    mutationFn: () => AccessChat(id),
    onSuccess: () => {
      void router.push("/messages");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return (
    <StyledDialog isOpen={isOpen} onClose={handleDialogClose}>
      <Card
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={
          "relative flex max-h-[90vh] w-full flex-col overflow-hidden bg-mintYellow text-white md:aspect-video md:flex-row"
        }
      >
        <div className={"group relative z-0 aspect-square h-full w-full"}>
          {/* <FloatingImageActions
            postId={id}
            downloadLink={downloadLink}
            className={`absolute left-1/2 top-2 z-10 -translate-x-1/2 opacity-0 transition-all delay-1000 duration-100 
            ease-out group-hover:opacity-100 group-hover:delay-200 group-focus:opacity-100 group-focus:delay-100`}
          /> */}
          <CustomImage
            src={src ? src : "/images/placeholder.png"}
            alt={bio}
            fill
            priority
            quality={100}
            sizes={"(max-width: 768px) 100vw, 50vw"}
            className={"object-contain"}
          />
        </div>

        <div
          className={
            " flex w-full flex-col justify-center gap-2 p-4 md:p-6 lg:gap-4"
          }
        >
          <div
            className={"mx-auto w-full items-center justify-center text-center"}
          >
            <div className="mx-auto flex w-full items-center justify-end  ">
              <Button
                overRideStyle={
                  "bg-white text-black hover:bg-slate-300 focus-visible:bg-indigo-700 "
                }
                onClick={() => void sendMessage.mutate()}
                loading={sendMessage.isLoading}
              >
                Message
              </Button>
            </div>
          </div>
          {/* <AnimatePresence>
            <motion.div
              variants={variants}
              initial={{ y: "100", opacity: 1 }}
              animate={slide === "Bio" ? "slide1" : "slide2"}
              className="flex flex-1 flex-col justify-center gap-2 p-4 md:p-6 lg:gap-4"
            > */}
          <div className="flex flex-1 flex-col justify-center gap-2 p-4 md:p-6 lg:gap-4">
            {matches && matches.length > 0 && (
              <p className="text-lg font-semibold">
                🔥 Match:{" "}
                {matches[0]?.matchPercentage !== undefined &&
                  Math.round(matches[0].matchPercentage)}
                %
              </p>
            )}

            <h1 className="px-1 text-left text-5xl font-bold">
              {authorName}
              {birthday && ", "}
              {birthday && getAge(birthday)}
            </h1>
            <p className="overflow-y-auto px-1 text-left text-lg line-clamp-6 sm:text-xl md:text-xl lg:text-2xl">
              {bio}
            </p>
            <h1 className="px-1 pt-5 text-left text-3xl font-semibold">
              My Interests & Hobbies
            </h1>
            {tags && (
              <ProfileTags
                styles={selectedStyles}
                selectedStyles={selectedStyles}
                className={"overflow-x-auto px-1"}
              />
            )}
          </div>
          {/* </motion.div>
          </AnimatePresence> */}
          <div
            className={"mx-auto w-full items-center justify-center text-center"}
          >
            {/* {slide === "Bio" && (
              <ArrowDownCircleIcon
                className="mx-auto h-10 w-10 justify-center text-center"
                onClick={goDown}
              />
            )} */}
          </div>
        </div>

        <AnimatePresence initial={true}>
          {/* {isAddToCollectionPanelOpen && (
            <motion.div
              initial={{
                opacity: 0,
                x: md ? "8%" : "0%",
                y: md ? "0%" : "8%",
              }}
              animate={{
                opacity: 1,
                x: md ? "4%" : "0%",
                y: md ? "0%" : "4%",
              }}
              exit={{
                opacity: 0,
                x: md ? "8%" : "0%",
                y: md ? "0%" : "8%",
              }}
              transition={transitions.springStiffer}
              className={"absolute right-0 bottom-0 h-full w-full shadow-2xl"}
            >
              <AddToCollectionPanel
                postId={id}
                onClose={() => setIsAddToCollectionPanelOpen(false)}
                className={"pb-[4%] md:pr-[4%] md:pb-0"}
              />
            </motion.div>
          )} */}
        </AnimatePresence>
      </Card>
    </StyledDialog>
  );
}

function getAge(birthdayString: string | null | undefined): number | null {
  if (!birthdayString) return null;

  const birthday = new Date(birthdayString);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDifference = today.getMonth() - birthday.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthday.getDate())
  ) {
    age--;
  }

  return age;
}
