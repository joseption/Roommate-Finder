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
  { name: "Messages", href: "/messages" },
];
const userNavigation = [
  {
    name: "My Profile",
    icon: <UserIcon className={"h-6 w-6"} />,
    href: "/profile/me",
  },
  {
    name: "Bio & Interests",
    icon: <IdentificationIcon className={"h-6 w-6"} />,
    href: "/setup/profile",
  },
  {
    name: "Quiz",
    icon: <AcademicCapIcon className={"h-6 w-6"} />,
    href: "/setup/quiz",
  },
  {
    name: "Settings",
    icon: <WrenchScrewdriverIcon className={"h-6 w-6"} />,
    href: "/settings/profile",
  },
  {
    name: "Sign out",
    icon: <ArrowRightOnRectangleIcon className={"h-6 w-6"} />,
    href: "/auth",
  },
];

export default function Nav() {
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
                    <Image
                      className="block h-8 w-auto"
                      src="/RoomFin/Logo/SVG FIles/logo-01.svg"
                      width={50}
                      height={50}
                      alt="Roomfin Logo"
                    ></Image>
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

                <div className="ml-6 flex items-center">
                  {/* Profile dropdown */}
                  <CustomMenu
                    popoverPlacement={"bottom-end"}
                    button={
                      userAvatar ? (
                        <CustomImage
                          src={userAvatar}
                          alt="User Avatar"
                          fill
                          priority
                          sizes={"2.5rem"}
                          draggable={false}
                          containerClassName={"relative h-10 w-10 rounded-full"}
                          className={
                            "absolute h-full w-full rounded-full object-cover hover:brightness-125"
                          }
                          isAvatar={true}
                        />
                      ) : (
                        <MdAccountCircle className={"h-full w-10"} />
                      )
                    }
                  >
                    {({ open }) =>
                      userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link href={item.href}>
                              <Button
                                variant={"text"}
                                className={"w-full !justify-start"}
                                onClick={
                                  item.name === "Sign out"
                                    ? () => {
                                        close();
                                        clearAuthSession();
                                        void router.replace("/auth");
                                      }
                                    : () => null
                                }
                              >
                                {item.icon}
                                {item.name}
                              </Button>
                            </Link>
                          )}
                        </Menu.Item>
                      ))
                    }
                  </CustomMenu>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
