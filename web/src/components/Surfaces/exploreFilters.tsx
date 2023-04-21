import { FunnelIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useState } from "react";

import Button from "../Inputs/Button";
import CustomPopover from "../Inputs/CustomPopover";

interface props {
  matchPercent: boolean;
  setMatchPercent: (value: boolean) => void;
  gender: string;
  setGender: (value: string) => void;
  smokePreference: string;
  setSmokePreference: (value: string) => void;
  petPreference: string;
  setPetPreference: (value: string) => void;
}

export default function CustomExploreFilterPopover({
  matchPercent,
  setMatchPercent,
  gender,
  setGender,
  smokePreference,
  setSmokePreference,
  petPreference,
  setPetPreference,
}: props) {
  // const [matchPercent, setMatchPercent] = useState(false);
  // const [gender, setGender] = useState("all");
  // const [smokePreference, setSmokePreference] = useState("all");
  // const [petPreference, setPetPreference] = useState("all");

  const handleMatchPercentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMatchPercent(event.target.checked);
  };

  const handleGenderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value);
  };

  const handleSmokePreferenceChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSmokePreference(event.target.value);
  };

  const handlePetPreferenceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPetPreference(event.target.value);
  };

  const clearFilters = () => {
    setMatchPercent(false);
    setGender("");
    setSmokePreference("");
    setPetPreference("");
  };

  return (
    <div>
      <CustomPopover
        popoverPlacement={"bottom-end"}
        button={
          <Button>
            Filters
            <FunnelIcon className={"ml-2 h-6 w-6"} />
          </Button>
        }
      >
        {(open) => (
          <div className="space-y-4 rounded p-4">
            <div className="flex items-center">
              <input
                id="matchPercent"
                type="checkbox"
                className="text-primary focus:ring-primary rounded"
                checked={matchPercent}
                onChange={handleMatchPercentChange}
              />
              <label htmlFor="matchPercent" className="ml-2">
                Sort by Match Percentage
              </label>
            </div>
            <div>
              <label htmlFor="gender" className="block">
                Gender:
              </label>
              <select
                id="gender"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded border border-gray-300 bg-white text-black shadow-sm"
                value={gender}
                onChange={handleGenderChange}
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>
            <div>
              <label htmlFor="smokePreference" className="block">
                Smoking preference:
              </label>
              <select
                id="smokePreference"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded border border-gray-300 bg-white text-black shadow-sm"
                value={smokePreference}
                onChange={handleSmokePreferenceChange}
              >
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="smokePreference" className="block">
                Pet preference:
              </label>
              <select
                id="petPreference"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded border border-gray-300 bg-white text-black shadow-sm"
                value={petPreference}
                onChange={handlePetPreferenceChange}
              >
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <Button onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        )}
      </CustomPopover>
    </div>
  );
}
