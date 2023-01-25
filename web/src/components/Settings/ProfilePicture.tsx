import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { MdAccountCircle } from "react-icons/md";

import { UpdateProfilePicture } from "../../request/mutate";
import ProfileImage from "../Surfaces/ProfileImage";
interface Props {
  Name: string;
  Value: string | null;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export default function ProfilePicture({
  Name,
  Value,
  onImageChange,
  isLoading,
}: Props) {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="text-sm font-medium text-gray-500">{Name}</dt>
      <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <span className="grow">
          <div className="h-10 w-10">
            <ProfileImage
              isSelf={true}
              image={Value}
              isLoading={false}
              onImageChange={onImageChange}
            />
          </div>
        </span>
        <span className="ml-4 flex shrink-0 items-start space-x-4">
          <button
            type="button"
            className="rounded-md bg-white font-medium text-black hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Remove
          </button>
        </span>
      </dd>
    </div>
  );
}
