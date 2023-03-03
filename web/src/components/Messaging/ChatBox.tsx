import { Box } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useState } from "react";

import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import { SingleChat } from "./SingleChat";
interface Props {
  userId: string;
  selectedChat?: chat | null;
  setSelectedChat: Dispatch<SetStateAction<chat | null>>;
  selectedChatUser?: user;
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
}

// className="my-1/2 mx-4 w-full" bg="white"
export default function ChatBox({
  selectedChat,
  selectedChatUser,
  setSelectedChat,
  userId,
  fetchAgain,
  setFetchAgain,
}: Props) {
  if (!selectedChat) {
    return null;
  }
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat
        selectedChat={selectedChat}
        selectedChatUser={selectedChatUser}
        setSelectedChat={setSelectedChat}
        userId={userId}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </Box>
  );
}
