import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { GetUserInfo } from "../../request/fetch";
import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import CustomImage from "../Surfaces/CustomImage";
interface Props {
  chat: chat;
  userId: string;
  selectedChat: chat | null;
  setSelectedChat: (chat: chat) => void;
  selectedChatUser: user;
  setSelectedChatUser: (user: user) => void;
}

export const LeftSideChatBox = ({
  chat,
  userId,
  selectedChat,
  setSelectedChat,
  selectedChatUser,
  setSelectedChatUser,
}: Props) => {
  const [senderName, setSenderName] = useState("");
  function getSenderId(userId: string, users: string[]) {
    return users[0] === userId ? users[1] : users[0];
  }
  const senderId = getSenderId(userId, chat.users);
  const { data: senderInfo, isLoading: senderLoading } = useQuery(
    ["SenderInfo", senderId],
    {
      queryFn: () => GetUserInfo(senderId as string),
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (data) => {
        const senderName =
          data?.first_name && data?.last_name
            ? `${data.first_name} ${data.last_name}`
            : data?.email;
        setSenderName(senderName);
      },
    }
  );

  function handleClick() {
    setSelectedChat(chat);
    setSelectedChatUser(senderInfo as user);
  }

  return (
    <div
      className={`cursor-pointer rounded-lg px-3 py-2
        ${selectedChat?.id !== chat.id ? "hover:bg-gray-200" : ""}
        ${selectedChat?.id === chat.id ? "text-white" : "text-black"}
        ${selectedChat?.id === chat.id ? "bg-mintYellow" : "bg-white"}
      `}
      onClick={handleClick}
      key={chat.id}
    >
      <div className="flex items-center">
        {senderInfo?.image && (
          <CustomImage
            src={senderInfo?.image}
            alt="User Avatar"
            fill
            priority
            sizes={"2.5rem"}
            draggable={false}
            containerClassName={"relative h-10 w-10 rounded-full"}
            className={"absolute h-full w-full rounded-full object-cover"}
            isAvatar={true}
          />
        )}
        <div className="ml-2 flex flex-col">
          <Text>{senderName}</Text>
        </div>
      </div>
    </div>
  );
};
