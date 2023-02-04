import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

import { imageStyles } from "../../data/styles";
import { GetBioAndTags } from "../../request/fetch";
import { UpdateBioAndTags } from "../../request/mutate";
import CircularProgress from "../Feedback/CircularProgress";
import Button from "../Inputs/Button";
import TextField from "../Inputs/TextField";
import StyleList from "../Layout/StyleList";
import Card from "./Card";

interface Props {
  isLoading?: boolean;
  className?: string;
}
type response = {
  id: string;
  response: string;
  question_id: string;
};

export default function QuestionsCard({ isLoading, className = "" }: Props) {
  //for answer selection
  const router = useRouter();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [bio, setBio] = useState<string>("");
  const [wordCount, setWordCount] = useState(0);
  const { data, isLoading: initalDataLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => GetBioAndTags(),
    refetchOnMount: true,
    cacheTime: 0,
    onSuccess: (data) => {
      console.log(data);
      if (data.tags && data.tags.length > 0) {
        const tags = data.tags.map((tagObj) => tagObj.tag);
        console.log(tags);
        setSelectedStyles(tags);
      }
      if (data.bio) {
        setBio(data.bio);
        setWordCount(data.bio.length);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
  console.log(wordCount);
  const { mutate: mutateUpdateBioAndTags, isLoading: isUpdating } = useMutation(
    {
      mutationFn: () => UpdateBioAndTags(bio, selectedStyles),
      onSuccess: (data) => {
        console.log(data);
        void router.push("/setup/quiz");
      },
      onError: (err: Error) => {
        toast.error(err.message);
      },
    }
  );

  const handleClick = () => {
    //check if selected styles is not greater than 5
    if (selectedStyles.length <= 5) mutateUpdateBioAndTags();
    else toast.error("You can only select up to 5 styles");
    if (wordCount > 175) toast.error("Bio can only be 175 characters long");
  };
  return (
    <Card className={`p-4 ${className}`}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-lg font-semibold"}>Setup your profile</h1>
      </div>
      {initalDataLoading ? (
        <CircularProgress className={"mx-auto my-12 scale-[200%]"} />
      ) : (
        <div className="w-full px-4 py-5">
          {/* <div className="">
            <p className=" mx-auto w-4/5 text-center text-xl font-normal">
              Tell us more about yourself
            </p>
          </div> */}

          <div className="mx-auto flex-row pt-5 lg:w-4/5">
            <div className="flex justify-between">
              <p className="">Bio</p>
              <p className="text-sm">{wordCount}/175</p>
            </div>
            <div className="flex w-full">
              <TextField
                value={bio}
                // label="Bio"
                placeholder="Tell us about yourself..."
                className="w-full"
                // inputClassName="h-20"
                onChange={(e) => {
                  setBio(e.target.value);
                  setWordCount(bio.length);
                }}
              />
            </div>
          </div>
          <div className="pt-10">
            <p className=" mx-auto w-4/5 text-center text-xl font-semibold">
              Select Life Interests and Activites
            </p>
          </div>
          <div className={"relative flex flex-col items-center pt-10"}>
            <StyleList
              styles={imageStyles}
              selectedStyles={selectedStyles}
              setSelectedStyles={setSelectedStyles}
            />
          </div>
          <div className="mx-auto flex items-center gap-5 pt-10">
            <div className="flex w-full justify-end">
              <Button
                onClick={handleClick}
                loading={isUpdating ? true : false}
                disabled={isUpdating ? true : false}
                className="w-24 text-lg font-semibold"
                // overRideStyle={
                //   "w-24 text-white text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 focus-visible:bg-yellow-700 focus-visible:ring-yellow-700"
                // }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
