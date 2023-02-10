import { Box } from "@chakra-ui/react";
import React from "react";

import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import { SingleChat } from "./SingleChat";
interface Props {
  selectedChat: chat;
  setSelectedChat: (chat: chat | null) => void;
  selectedChatUser: user;
}

// className="my-1/2 mx-4 w-full" bg="white"
function ChatBox({ selectedChat, selectedChatUser, setSelectedChat }: Props) {
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
      />
    </Box>
  );
}

export default ChatBox;
