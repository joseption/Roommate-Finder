import { Box, Button, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import { LeftSideChatBox } from "./LeftSideChatBox";

interface Props {
  chats: chat[];
  userId: string;
  selectedChat: chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<chat | null>>;
  selectedChatUser: user;
  setSelectedChatUser: React.Dispatch<React.SetStateAction<user>>;
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

function MyChats({
  chats,
  userId,
  selectedChat,
  setSelectedChat,
  selectedChatUser,
  setSelectedChatUser,
  fetchAgain,
  setFetchAgain,
}: Props) {
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <VStack
        bg="F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        spacing={2}
        alignItems="stretch"
      >
        {chats ? (
          chats.map((chat) => {
            return (
              <LeftSideChatBox
                chat={chat}
                userId={userId}
                key={chat.id}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                selectedChatUser={selectedChatUser}
                setSelectedChatUser={setSelectedChatUser}
              />
            );
          })
        ) : (
          <Text>Loading...</Text>
        )}
      </VStack>
    </Box>
  );
}

export default MyChats;
