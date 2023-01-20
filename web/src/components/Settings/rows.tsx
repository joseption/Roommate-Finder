import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
interface Props {
  Name: string;
  Value: string;
}

export default function SettingsSection({ Name, Value }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newValue, setNewValue] = useState(Value);

  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="text-sm font-medium text-gray-500">{Name}</dt>
      <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <span className="grow">{Value}</span>
        <span className="ml-4 shrink-0">
          <button
            type="button"
            className="rounded-md bg-white font-medium text-black hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            Update
          </button>
          {/* <AnimatePresence>
            {isPopoverOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="fixed top-0 left-0 z-40 w-48 rounded-md bg-white py-2 shadow-md"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <p className="text-sm text-gray-600">Enter new value:</p>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="rounded-md py-2 px-3"
                />
                <div className="py-2">
                  <button
                    className="text-xs text-purple-500"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      // code to update the value here
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="text-xs text-gray-500"
                    onClick={() => setIsPopoverOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}
        </span>
      </dd>
    </div>
  );
}
