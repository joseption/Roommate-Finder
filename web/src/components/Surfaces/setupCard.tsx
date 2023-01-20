import { RadioGroup } from "@headlessui/react";
import { Bars4Icon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

import { imageStyles } from "../../data/styles";
import { GetBioAndTags, SurveyOnComplete } from "../../request/fetch";
import { UpdateBioAndTags, UpdateResponse } from "../../request/mutate";
import { SurveyInfo } from "../../types/survey.types";
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
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

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
    mutateUpdateBioAndTags();
  };
  return (
    <Card className={`p-4 ${className}`}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-lg"}>Setup your profile</h1>
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

          <div className="mx-auto flex items-center gap-5 pt-5 lg:w-4/5">
            <div className="flex w-full justify-between">
              <TextField
                value={bio}
                label="Bio"
                placeholder="Tell us about yourself..."
                className="w-full"
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-10">
            <p className=" mx-auto w-4/5 text-center text-xl font-normal">
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
          <div className="mx-auto flex items-center gap-5 pt-10 lg:w-4/5">
            <div className="flex w-full justify-end">
              <Button
                onClick={handleClick}
                loading={isUpdating ? true : false}
                disabled={isUpdating ? true : false}
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
