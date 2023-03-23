import { Disclosure, Menu } from "@headlessui/react";
import {
  AcademicCapIcon,
  ArrowPathRoundedSquareIcon,
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  IdentificationIcon,
  ServerIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdAccountCircle } from "react-icons/md";

import { clearAuthSession, getUserImage } from "../utils/storage";
import LinearProgress from "./Feedback/LinearProgress";
import Button from "./Inputs/Button";
import CustomMenu from "./Inputs/CustomMenu";
import IconButton from "./Inputs/IconButton";
import CustomImage from "./Surfaces/CustomImage";
const navigation = [
  { name: "Explore", href: "/explore" },
  { name: "Listings", href: "/listings" },
  { name: "My Listings", href: "/mylistings" },
  { name: "Messaging", href: "/messages" },
];
const userNavigation = [
  {
    name: "Sign In",
    icon: <UserIcon className={"h-6 w-6"} />,
    href: "/profile/me",
  },
];

export default function LandingNav() {
  //#region Hooks
  //#endregion

  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const imageData = localStorage.getItem("image") ?? null;
    setUserAvatar(imageData);
  }, []);

  return (
    <div className="min-h-full">
      {/* <AnimatePresence>
        {sessionStatus === "loading" && (
          <LinearProgress className={"absolute top-0 left-0"} />
        )}
      </AnimatePresence> */}
      <Disclosure as="nav" className="border-b border-slate-200 bg-white">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="relative flex shrink-0 items-center">
                    <Link href="/">
                      <Image
                        className="block h-8 w-auto"
                        src="/RoomFin/Logo/SVG FIles/logo-01.svg"
                        width={50}
                        height={50}
                        alt="Roomfin Logo"
                      ></Image>
                    </Link>
                  </div>
                  <div className="flex sm:-my-px sm:ml-10 sm:space-x-8 ">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.name === "Sign out" ? "#" : item.href}
                        className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition duration-150 ease-in-out ${
                          router.pathname == item.href
                            ? "border-yellow-500 text-slate-900"
                            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                        }`}
                        aria-current={
                          router.pathname == item.href ? "page" : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div
                  className="ml-6 flex cursor-pointer items-center"
                  onClick={() => void router.push("/explore")}
                >
                  Sign in
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
