import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { GetSurveryInfo, SurveyOnComplete } from "../../../request/fetch";
import { UpdateResponse } from "../../../request/mutate";
import { SurveyInfo } from "../../../types/survey.types";
import CircularProgress from "../../Feedback/CircularProgress";
import Button from "../../Inputs/Button";
import TextField from "../../Inputs/TextField";
import Card from "../Card";
import ProfileImage from "../ProfileImage";

interface Props {
  className?: string;
}

export default function SettingsCard({ className = "" }: Props) {
  const router = useRouter();
  const mainDataLoading = false;

  return (
    <Card className={`p-4 ${className}`}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"text-lg"}>Settings</h1>
      </div>
      {mainDataLoading ? (
        <CircularProgress className={"mx-auto my-12 scale-[200%]"} />
      ) : (
        <div className="w-full px-4 py-5">
          <div className="flex flex-col items-center pb-10 pt-5">
            <ProfileImage image={null} isSelf={true} isLoading={false} />
            @faiz
          </div>
          <div className="mx-auto py-2 lg:w-3/5">
            <TextField
              label="First Name"
              onChange={() => null}
              placeholder="First Name"
            />
          </div>
          <div className="mx-auto py-2 lg:w-3/5">
            <TextField
              label="Last Name"
              onChange={() => null}
              placeholder="First Name"
            />
          </div>
          <div className="mx-auto py-2 lg:w-3/5">
            <TextField
              label="Brithday"
              onChange={() => null}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="mx-auto py-2 lg:w-3/5">
            <TextField
              label="Phone Number"
              onChange={() => null}
              placeholder="123456789"
            />
          </div>
          <div className="mx-auto py-2 lg:w-3/5">
            <TextField
              label="Gender"
              onChange={() => null}
              placeholder="Select..."
            />
          </div>
          <div className="mx-auto py-2 lg:w-3/5">
            <TextField label="City" onChange={() => null} placeholder="City" />
          </div>
          <div className="mx-auto py-2 lg:w-3/5">
            <TextField
              label="State"
              onChange={() => null}
              placeholder="State"
            />
          </div>
          <div className="mx-auto py-2 lg:w-3/5">
            <TextField
              label="Zip-Code"
              onChange={() => null}
              placeholder="12345"
            />
          </div>
          <div className="mx-auto flex items-center gap-5 pt-10 lg:w-4/5">
            <div className="flex w-full justify-end">
              <Button onClick={() => null} loading={false} disabled={false}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
