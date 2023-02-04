import { AnimatePresence, motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { transitions } from "../../styles/motion-definitions";
import CircularProgress from "../Feedback/CircularProgress";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  loading?: boolean;
  variant?: "filled" | "text";
  className?: string;
  overRideStyle?: string | null;
  children: ReactNode;
}

/**
 * A button component that can be used to trigger actions.
 *
 * @param disabled - Whether the button is disabled or not.
 * @param loading - Whether the button is loading or not. If true, the button will be disabled.
 * @param variant - The variant can be either "contained" or "text".
 * @param className - Additional styles to apply to the button.
 * @param children - The content of the button.
 * @param rest - Additional props to pass to the button.
 */
export default function Button({
  disabled = false,
  loading = false,
  variant = "filled",
  overRideStyle = null,
  className = "",
  children,
  ...rest
}: Props) {
  //#region Derived Values

  const isDisabled = disabled || loading;

  //#endregion

  //#region Styles

  let baseStyle =
    "flex select-none items-center justify-center rounded-full gap-2 px-4 py-2 transition duration-200 ease-out" +
    " active:duration-300 focus-visible:ring-4 focus-visible:ring-yellow-300/90 ring-inset outline-none group" +
    " dark:focus-visible:ring-indigo-600/90";

  if (isDisabled) {
    // Disabled Style
    baseStyle +=
      "cursor-not-allowed text-white bg-yellow-500/90 dark:text-slate-900 dark:bg-indigo-100/80";
  } else if (variant === "text") {
    // Text Style
    baseStyle +=
      " hover:bg-slate-300 focus-visible:bg-slate-300 active:scale-[96%] dark:hover:bg-slate-700 dark:focus-visible:bg-slate-700";
  } else {
    // Contained Style
    baseStyle +=
      " text-white bg-yellow-500/90 hover:bg-yellow-600 focus-visible:bg-yellow-600 active:scale-[96%]" +
      " dark:text-slate-900 dark:bg-indigo-200 dark:hover:bg-indigo-400 dark:focus-visible:bg-indigo-400";
  }

  if (overRideStyle)
    baseStyle =
      "flex select-none items-center justify-center rounded-full gap-2 px-4 py-2 transition duration-200 " +
      "ease-out active:duration-300 focus-visible:ring-4 focus-visible:ring-indigo-300/90 ring-inset outline-none group " +
      "active:scale-[96%] " +
      overRideStyle;
  //#endregion
  return (
    <button
      className={`${baseStyle} ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      <AnimatePresence initial={false}>
        {loading && (
          <motion.div
            initial={{ opacity: 0, marginRight: "-1.75rem" }}
            animate={{
              marginRight: 0,
              opacity: 1,
            }}
            exit={{ opacity: 0, marginRight: "-1.75rem" }}
            transition={transitions.springStiff}
          >
            <CircularProgress />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </button>
  );
}
