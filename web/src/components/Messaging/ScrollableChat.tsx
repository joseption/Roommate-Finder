import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";

import { user } from "../../types/auth.types";
import { message } from "../../types/message.types";

interface Props {
  messages: message[];
  userId: string;
  selectedChatUser?: user;
}

export const ScrollableChat = ({
  messages,
  userId,
  selectedChatUser,
}: Props) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div className="flex items-start" key={i}>
              {isSameSender(messages, m, i, userId) ||
              isLastMessage(messages, i, userId) ? (
                <Tooltip
                  label={selectedChatUser?.email}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={selectedChatUser?.email}
                    src={selectedChatUser?.image ?? undefined}
                  />
                </Tooltip>
              ) : (
                <div className="w-9" />
              )}
              <div
                className={`mt-1 rounded-lg px-3 py-2
                  ${m.userId !== userId ? "bg-white" : "bg-mintYellow"}
                  ${m.userId !== userId ? "text-black" : "text-white"}
                  ${m.userId === userId ? "ml-auto" : ""}
                `}
                style={{
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

function isSameSender(
  messages: message[],
  m: message,
  i: number,
  userId: string
) {
  return (
    i < messages.length - 1 &&
    (messages[i + 1]?.userId !== m.userId ||
      messages[i + 1]?.userId === undefined) &&
    messages[i]?.userId !== userId
  );
}

function isLastMessage(messages: message[], i: number, userId: string) {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1]?.userId !== userId &&
    messages[messages.length - 1]?.userId
  );
}

function isSameSenderMargin(
  messages: message[],
  m: message,
  i: number,
  userId: string
) {
  if (
    i < messages.length - 1 &&
    messages[i + 1]?.userId === m.userId &&
    messages[i]?.userId !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1]?.userId !== m.userId &&
      messages[i]?.userId !== userId) ||
    (i === messages.length - 1 && messages[i]?.userId !== userId)
  )
    return 0;
  else return "auto";
}

function isSameUser(messages: message[], m: message, i: number) {
  return i > 0 && messages[i - 1]?.userId === m.userId;
}
