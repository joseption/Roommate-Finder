import { Box, Button, Stack } from "@chakra-ui/react";
import React from "react";

import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";
import { LeftSideChatBox } from "./LeftSideChatBox";

interface Props {
  chats: chat[];
  userId: string;
  selectedChat: chat;
  setSelectedChat: React.Dispatch<React.SetStateAction<chat>>;
  selectedChatUser: user;
  setSelectedChatUser: React.Dispatch<React.SetStateAction<user>>;
}

function MyChats({
  chats,
  userId,
  selectedChat,
  setSelectedChat,
  selectedChatUser,
  setSelectedChatUser,
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
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Poppins"
        color="#e0b936"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="scroll"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
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
            })}
          </Stack>
        ) : (
          <div>Loading...</div>
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
