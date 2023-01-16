import { RadioGroup } from "@headlessui/react";
import { Bars4Icon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

import { SurveyOnComplete } from "../../../request/fetch";
import { UpdateResponse } from "../../../request/mutate";
import { SurveyInfo } from "../../../types/survey.types";
import CircularProgress from "../../Feedback/CircularProgress";
import Button from "../../Inputs/Button";
import Card from "../Card";
import AnswerButtons from "./Answers";
import ProgessBar from "./progessBar";
interface Props {
  SurveyData: SurveyInfo[];
  isLoading?: boolean;
  className?: string;
}
type response = {
  id: string;
  response: string;
  question_id: string;
};

export default function QuestionsCard({
  SurveyData,
  isLoading,
  className = "",
}: Props) {
  //for answer selection
  const router = useRouter();
  const [selected, setSelected] = useState<response | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);

  const { mutate: mutateUpdateResponse, isLoading: isUpdating } = useMutation({
    mutationFn: () => UpdateResponse(selected?.question_id, selected?.id),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err: Error) => {
      console.log(err.message);
    },
  });

  const { mutate: mutateComplete, isLoading: isFinshing } = useMutation({
    mutationFn: () => SurveyOnComplete(),
    onSuccess: (data) => {
      void router.push("/explore");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleOnClickNext = () => {
    if (questionNumber < SurveyData.length - 1)
      setQuestionNumber(questionNumber + 1);
    mutateUpdateResponse();
  };
  const handleOnClickPrevious = () => {
    if (questionNumber > 0) setQuestionNumber(questionNumber - 1);
  };
  const handleOnFinish = () => {
    //call api and change is_setup to true
    mutateUpdateResponse();
    mutateComplete();
  };
  const handleStateChange = (newState: response) => {
    setSelected(newState);
  };
  return (
    <Card className={`p-4 ${className}`}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-xl"}>Survey Q&A</h1>
      </div>
      {isLoading ? (
        <CircularProgress className={"mx-auto my-12 scale-[200%]"} />
      ) : (
        <div className="w-full px-4 py-5">
          <ProgessBar
            TotalnumberOfquestions={SurveyData.length - 1}
            QuestionsAnswered={questionNumber}
          />
          <div className="pb-10 pt-5">
            <p className="mx-auto w-4/5 text-center text-lg font-bold">
              {SurveyData[questionNumber]?.question_text}
            </p>
          </div>
          <AnswerButtons
            Responses={SurveyData[questionNumber]?.response}
            ResponsesOfUsers={-1}
            onStateChange={handleStateChange}
          />

          <div className="mx-auto flex items-center gap-5 pt-10 lg:w-4/5">
            <div className="flex w-full justify-between">
              <Button
                onClick={handleOnClickPrevious}
                loading={false}
                disabled={questionNumber === 0 ? true : false}
              >
                Previous
              </Button>
              {questionNumber === SurveyData.length - 1 ? (
                <Button
                  onClick={handleOnFinish}
                  loading={selected ? false : true}
                  disabled={isFinshing ? true : false}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  onClick={handleOnClickNext}
                  loading={false}
                  disabled={selected ? false : true}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
