import {
  type Placement,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";
import { Menu } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { Fragment, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { transitionVariants } from "../../styles/motion-definitions";

interface Props {
  button: JSX.Element;
  popoverPlacement?: Placement;
  openOnHover?: boolean;
  className?: string;
  children(props: { open: boolean; close: () => void }): ReactNode;
}

export default function CustomMenu({
  button,
  popoverPlacement = "bottom",
  openOnHover = false,
  className = "",
  children,
}: Props) {
  //#region Hooks

  const isTouchCapable = useMediaQuery("(hover: none)");

  const { x, y, refs, floating, strategy } = useFloating<HTMLDivElement>({
    strategy: "absolute",
    placement: popoverPlacement,
    middleware: [offset(16), shift(), flip()],
  });

  const [panelTimeout, setPanelTimeout] = useState<NodeJS.Timeout | null>(null);

  //#endregion

  //#region Handlers

  const handleHoverPanelOpen = (open: boolean) => {
    if (!openOnHover) return;
    if (panelTimeout) clearTimeout(panelTimeout);
    if (!open && !isTouchCapable) {
      // Only click if the device is not touch capable, prevents infinite state loop
      refs.reference.current?.click();
    }
  };

  const handleHoverPanelClose = (close: () => void) => {
    if (!openOnHover) return;
    if (panelTimeout) clearTimeout(panelTimeout);
    setPanelTimeout(
      setTimeout(() => {
        close();
      }, 300)
    );
  };

  //#endregion

  return (
    <Menu as="div" className={`relative z-10 ${className}`}>
      {({ open, close }) => (
        <>
          <Menu.Button as={Fragment}>
            <div
              ref={refs.reference}
              onMouseEnter={() => handleHoverPanelOpen(open)}
              onMouseLeave={() => handleHoverPanelClose(close)}
            >
              {button}
            </div>
          </Menu.Button>
          <AnimatePresence>
            {open && (
              <Menu.Items
                as={motion.div}
                static
                ref={floating}
                onMouseEnter={() => handleHoverPanelOpen(open)}
                onMouseLeave={() => handleHoverPanelClose(close)}
                initial={"growOut"}
                animate={"growIn"}
                exit={"growOut"}
                variants={transitionVariants}
                style={{
                  position: strategy,
                  top: y ?? 35,
                  left: x ?? -100,
                }}
                className={`z-50 w-max max-w-[90vw] rounded-xl bg-slate-50/90 p-2 shadow-lg ring-1 ring-black/5 
                backdrop-blur-md transition-colors duration-200 focus:outline-none`}
              >
                {children({ open, close })}
              </Menu.Items>
            )}
          </AnimatePresence>
        </>
      )}
    </Menu>
  );
}
