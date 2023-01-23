import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import TextField from "../Inputs/TextField";
interface Props {
  Name: string;
  Value: string | null;
  OnSet: (value: string) => void;
}

export default function SettingsSection({ Name, Value, OnSet }: Props) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [value, setValue] = useState(Value ? Value : "");

  const onSet = () => {
    setIsUpdate(!isUpdate);
    OnSet(value);
  };

  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="text-sm font-medium text-gray-500">{Name}</dt>
      <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {isUpdate ? (
          <div className="grow">
            <TextField
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-1/2"
            />
          </div>
        ) : (
          <span className="grow">{value}</span>
        )}

        {isUpdate ? (
          <span className="ml-4 shrink-0">
            <button
              type="button"
              className="rounded-md bg-white font-medium text-black hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={onSet}
            >
              Set
            </button>
          </span>
        ) : (
          <span className="ml-4 shrink-0">
            <button
              type="button"
              className="rounded-md bg-white font-medium text-black hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={() => setIsUpdate(!isUpdate)}
            >
              Update
            </button>
          </span>
        )}
      </dd>
    </div>
  );
}
