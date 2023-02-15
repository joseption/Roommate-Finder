import { Box } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";

import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import { SingleChat } from "./SingleChat";
interface Props {
  userId: string;
  selectedChat?: chat;
  setSelectedChat: Dispatch<SetStateAction<chat>>;
  selectedChatUser?: user;
}

// className="my-1/2 mx-4 w-full" bg="white"
function ChatBox({
  selectedChat,
  selectedChatUser,
  setSelectedChat,
  userId,
}: Props) {
  if (!selectedChat) return null;
  // console.log(selectedChat, "selected chat");
  // console.log(selectedChatUser, "selected chat user");
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
      />
    </Box>
  );
}

export default ChatBox;
