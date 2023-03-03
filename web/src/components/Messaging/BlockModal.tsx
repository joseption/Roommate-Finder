/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
// import { ExclamationIcon } from "@heroicons/react/outline";
import { Fragment, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { BlockChat, UnblockChat } from "../../request/mutate";

interface Props {
  blocked: boolean;
  userId: string;
  chatId: string;
  showblockmodal: boolean;
  setShowblockmodal: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}
interface BlockRequest {
  chatId: string;
  userId: string;
}

export default function BlockModal({
  blocked,
  userId,
  chatId,
  showblockmodal,
  setShowblockmodal,
  socket,
}: Props) {
  //   const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);
  const router = useRouter();

  const { mutate: blockChatMutation } = useMutation({
    mutationFn: (blockRequest: BlockRequest) => {
      return BlockChat(blockRequest.chatId, blockRequest.userId);
    },
  });
  // const { mutate: unblockChatMutation } = useMutation({
  //   mutationFn: (blockRequest: BlockRequest) => {
  //     return UnblockChat(blockRequest.chatId, blockRequest.userId);
  //   },
  // });

  function handleClick() {
    // if (blocked) {
    //   unblockChatMutation({ chatId: chatId, userId: userId });
    // } else {
    // }
    blockChatMutation({ chatId: chatId, userId: userId });
    socket.emit("send block", { chatId: chatId });
    setShowblockmodal(false);
  }

  return (
    <Transition.Root show={showblockmodal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setShowblockmodal}
      >
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Are you sure you would like to block this chat?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Once you block a user you will not be able to unblock
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleClick}
                >
                  Block
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowblockmodal(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
