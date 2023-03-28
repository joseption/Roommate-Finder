import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { GetSurveryInfo, SurveyOnComplete } from "../../../request/fetch";
import { CreateMatches, UpdateResponse } from "../../../request/mutate";
import { SurveyInfo } from "../../../types/survey.types";
import CircularProgress from "../../Feedback/CircularProgress";
import Button from "../../Inputs/Button";
import Card from "../Card";
import AnswerButtons from "./Answers";
import ProgessBar from "./progessBar";
interface Props {
  className?: string;
}
type response = {
  id: string;
  response: string;
  question_id: string;
};

export default function QuestionsCard({ className = "" }: Props) {
  //for answer selection
  const router = useRouter();
  const [selected, setSelected] = useState<response | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [SurveyData, setSurveyData] = useState<SurveyInfo[]>([]);
  const [userResponseIndex, setUserResponseIndex] = useState<number>(-1);
  const { mutate: GetSurveyData, isLoading: mainDataLoading } = useMutation({
    mutationFn: () => GetSurveryInfo(),
    onSuccess: (data) => {
      setSurveyData(data);
      // GetIndexOfUserResponse(data);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    GetSurveyData();
  }, []);

  useEffect(() => {
    GetIndexOfUserResponse(SurveyData, questionNumber);
  }, [SurveyData, questionNumber]);

  const { mutate: mutateUpdateResponse, isLoading: isUpdating } = useMutation({
    mutationFn: () => UpdateResponse(selected?.question_id, selected?.id),
    onSuccess: (data) => {
      GetSurveyData();
      if (questionNumber < SurveyData.length - 1)
        setQuestionNumber(questionNumber + 1);
    },
    onError: (err: Error) => {
      //console.log(err.message);
    },
  });

  const { mutate: mutateComplete, isLoading: isFinshing } = useMutation({
    mutationFn: () => SurveyOnComplete(),
    onSuccess: (data) => {
      mutateMatches();
      void router.push("/explore");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: mutateMatches, isLoading: isCreatingMatches } = useMutation({
    mutationFn: () => CreateMatches(),
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleOnClickNext = () => {
    //check if user has selected an answer
    mutateUpdateResponse();
  };
  const handleOnClickPrevious = () => {
    GetSurveyData();
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
  //get index of user response for current question
  const GetIndexOfUserResponse = (
    data: SurveyInfo[],
    currentQuestionNumber: number
  ) => {
    if (data[currentQuestionNumber]?.ResponsesOnUsers) {
      const index = data[currentQuestionNumber]?.response.findIndex(
        (response) =>
          response.id ===
          data[currentQuestionNumber]?.ResponsesOnUsers[0]?.responseId
      );
      if (index !== undefined) {
        setUserResponseIndex(index);
        const TobeSelected = data[questionNumber]?.response[index];
        if (TobeSelected) setSelected(TobeSelected);
      }
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-xl"}>Survey Q&A</h1>
        <Button
          onClick={() => {
            mutateComplete();
          }}
          loading={isFinshing}
          disabled={isFinshing}
        >
          Skip
        </Button>
      </div>
      {mainDataLoading ? (
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
            ResponsesOfUsers={userResponseIndex}
            onStateChange={handleStateChange}
          />

          <div className="mx-auto flex items-center gap-5 pt-10 lg:w-4/5">
            <div className="flex w-full justify-between">
              <Button
                onClick={handleOnClickPrevious}
                loading={false}
                disabled={questionNumber === 0 || isFinshing ? true : false}
              >
                Previous
              </Button>
              {questionNumber === SurveyData.length - 1 ? (
                <Button
                  onClick={handleOnFinish}
                  loading={
                    isFinshing || isUpdating || isCreatingMatches ? true : false
                  }
                  disabled={selected ? false : true}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  onClick={handleOnClickNext}
                  loading={isUpdating ? true : false}
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
