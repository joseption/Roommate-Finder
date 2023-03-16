// show profile dialog on a slate background
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

import ProfileDialog from "../../components/Dialogs/ProfileDialog";
import CircularProgress from "../../components/Feedback/CircularProgress";
import { GetProfile } from "../../request/fetch";
import { Matches } from "../../types/auth.types";
import { Tags } from "../../types/tags.types";

export default function Myprofile() {
  const router = useRouter();
  const [isSelf, setIsSelf] = useState(false); // Tracks if the user is viewing their own profile
  const [notFound, setNotFound] = useState(false); // Tracks if the user was not found
  const {
    data,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["user_profile"],
    queryFn: () =>
      GetProfile({
        userId:
          (router.query.id as string) === "me"
            ? localStorage.getItem("userId") || ""
            : "",
      }),
    onSuccess: (user) => {
      console.log(data);
      setIsSelf(user.id === localStorage.getItem("userId"));
    },
    onError: (err) => {
      console.log(err);
      void router.back();
    },
    refetchOnMount: "always",
  });
  //while loading display loading screen or if not found display not found screen
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        {isProfileLoading ? (
          <CircularProgress className={"mx-auto my-12 scale-[200%]"} />
        ) : (
          <div>
            {data && (
              <ProfileDialog
                id={data.id}
                birthday={data.birthday}
                src={data.image}
                bio={data.bio ? data.bio : "No bio 🙃"}
                authorName={data.first_name}
                isOpen={true}
                tags={data.tags}
                onClose={() => void router.back()}
                matches={null}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
