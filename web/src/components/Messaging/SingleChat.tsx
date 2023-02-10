import { ArrowBackIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { user } from "../../types/auth.types";
import { chat } from "../../types/chat.types";

interface Props {
  //   user: user;
  selectedChat: chat;
  setSelectedChat: (chat: chat | null) => void;
  selectedChatUser: user;
}

export const SingleChat = ({
  selectedChat,
  selectedChatUser,
  setSelectedChat,
}: Props) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const sendMessage = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && newMessage) {
      try {
      } catch (err) {
        console.log(err, "error");
      }
    }
  };
  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setNewMessage(e.target.value);
    // typiing indicator logic tbd
    console.log(e);
  };

  return (
    <>
      {selectedChat != undefined ? (
        <>
          <div className="flex">
            <IconButton
              aria-label="back button"
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              {selectedChatUser.email}
            </Text>
            <IconButton
              aria-label="block button"
              icon={<NotAllowedIcon />}
              //   onClick={}
            />
          </div>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="lightgray"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div>{/* Message */}</div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="E0E0E0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text className="font-sans text-3xl">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};
