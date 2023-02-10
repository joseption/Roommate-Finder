import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { GetUserInfo } from "../../request/fetch";
import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import LeftSideChatBoxTitle from "./LeftSideChatBoxTitle";
interface Props {
  chat: chat;
  userId: string;
  selectedChat: chat;
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
        setSenderName(data.email);
        setSelectedChatUser(data);
        console.log("senderInfo", data, selectedChatUser);
      },
    }
  );

  function handleClick() {
    setSelectedChat(chat);
    if (!senderLoading && senderInfo) {
      setSelectedChatUser(senderInfo);
    }
  }
  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      bg={selectedChat === chat ? "#e0b936" : "E8E8E8"}
      color={selectedChat === chat ? "white" : "black"}
      px={3}
      py={2}
      borderRadius="lg"
      key={chat.id}
    >
      {/* <LeftSideChatBoxTitle
        userId={userId}
        chat={chat}
        setSelectedChatUser={setSelectedChatUser}
      /> */}
      <Text>{senderName}</Text>
    </Box>
  );
};
