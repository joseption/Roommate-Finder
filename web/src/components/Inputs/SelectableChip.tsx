import { AnimatePresence, motion } from "framer-motion";
import { MdAdd, MdCheck } from "react-icons/md";

import {
  transitions,
  transitionVariants,
} from "../../styles/motion-definitions";

interface Props {
  label: string;
  selected: boolean;
  onSelect: (style: string, selected: boolean) => void;
  className?: string;
  displayIcon?: boolean;
}

export default function SelectableChip({
  label,
  selected,
  onSelect,
  className = "",
  displayIcon = true,
}: Props) {
  //#region Handlers

  const handleClick = () => {
    onSelect(label, !selected);
  };

  //#endregion

  //#region Styles

  let styles =
    "flex gap-2 px-2 py-0.5 sm:px-4 sm:py-1 rounded-full transition duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 items-center";
  styles += selected
    ? " text-white text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 focus-visible:bg-yellow-700 focus-visible:ring-yellow-700"
    : " bg-slate-200 text-lg font-semibold text-slate-900 hover:bg-slate-300 focus-visible:bg-slate-300 focus-visible:ring-slate-300";

  if (!displayIcon)
    styles =
      "flex gap-2 px-2 py-0.5 sm:px-4 sm:py-1 rounded-full transition duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 items-center text-black bg-slate-100";

  //#endregion

  return (
    <button className={`${styles} ${className}`} onClick={handleClick}>
      {label}
      <AnimatePresence mode={"popLayout"} initial={false}>
        <motion.div
          key={selected ? "selected" : "unselected"}
          variants={transitionVariants}
          initial={"scaleOut"}
          animate={"scaleIn"}
          transition={transitions.spring}
        >
          {selected && displayIcon ? (
            <MdCheck className={"h-full w-5"} />
          ) : displayIcon ? (
            <MdAdd className={"h-full w-5"} />
          ) : (
            <></>
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
