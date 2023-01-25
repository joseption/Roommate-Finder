import { RadioGroup } from "@headlessui/react";
import React, { useEffect, useState } from "react";

type response = {
  id: string;
  response: string;
  question_id: string;
};

interface Props {
  Responses: response[] | undefined;
  ResponsesOfUsers: number;
  onStateChange: (newState: response) => void;
}

export default function AnswerButtons({
  Responses,
  ResponsesOfUsers,
  onStateChange,
}: Props) {
  if (!Responses) return <div></div>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selected, setSelected] = useState(
    ResponsesOfUsers === -1 ? null : Responses[ResponsesOfUsers]
  );

  const onChange = (res: response) => {
    setSelected(res);
    onStateChange(res);
  };
  return (
    <div className="mx-auto w-full max-w-md">
      <RadioGroup value={selected} onChange={onChange}>
        <RadioGroup.Label className="sr-only">Answers</RadioGroup.Label>
        <div className="space-y-2">
          {Responses.map((Response) => (
            <RadioGroup.Option
              key={Response.id}
              value={Response}
              className={({ active, checked }) =>
                `${
                  active
                    ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                    : ""
                }
                  ${
                    checked
                      ? "bg-green-700 bg-opacity-75 text-white"
                      : "bg-slate-200"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium  ${
                            checked ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {Response.response}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className={`inline ${
                            checked ? "text-sky-100" : "text-gray-500"
                          }`}
                        ></RadioGroup.Description>
                      </div>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white">
                        {/* <CheckIcon className="h-6 w-6" /> */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-6 w-6"
                        >
                          <circle
                            cx={12}
                            cy={12}
                            r={12}
                            fill="#fff"
                            opacity="0.2"
                          />
                          <path
                            d="M7 13l3 3 7-7"
                            stroke="#fff"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
